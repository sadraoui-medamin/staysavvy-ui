// Reusable export dialog with field selection, date range, grouping and CSV/PDF output.
import { useMemo, useState } from "react";
import { Download, FileText, FileSpreadsheet, CalendarDays } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { downloadCSV } from "@/lib/staffExport";
import { toast } from "sonner";

export type ExportField = { key: string; label: string; default?: boolean };
export type ExportTemplate = "summary" | "detailed" | "custom";

type Props<T extends Record<string, unknown>> = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  fileBase: string;          // base file name (no extension)
  fields: ExportField[];
  data: T[];
  dateKey?: keyof T;         // ISO date string field used for date filter / grouping
  groupOptions?: { key: string; label: string }[];   // groupable field keys
  templates?: { key: ExportTemplate; label: string; fields: string[] }[];
};

const toDate = (v: unknown): Date | null => {
  if (!v) return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d;
};

const groupKey = (rec: Record<string, unknown>, groupBy: string, dateKey?: string) => {
  if (groupBy === "none") return "All records";
  if (groupBy === "__day" && dateKey) return toDate(rec[dateKey])?.toISOString().slice(0, 10) ?? "—";
  if (groupBy === "__month" && dateKey) return toDate(rec[dateKey])?.toISOString().slice(0, 7) ?? "—";
  return String(rec[groupBy] ?? "—");
};

export function ExportReportDialog<T extends Record<string, unknown>>({
  open, onOpenChange, title, fileBase, fields, data, dateKey, groupOptions, templates,
}: Props<T>) {
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [groupBy, setGroupBy] = useState<string>("none");
  const [selected, setSelected] = useState<Set<string>>(() =>
    new Set(fields.filter((f) => f.default !== false).map((f) => f.key)),
  );
  const [template, setTemplate] = useState<ExportTemplate>("custom");

  const dateFieldKey = dateKey ? String(dateKey) : undefined;

  const filtered = useMemo(() => {
    if (!dateFieldKey) return data;
    const f = from ? new Date(from) : null;
    const t = to ? new Date(to + "T23:59:59") : null;
    return data.filter((r) => {
      const d = toDate(r[dateFieldKey as keyof T]);
      if (!d) return true;
      if (f && d < f) return false;
      if (t && d > t) return false;
      return true;
    });
  }, [data, from, to, dateFieldKey]);

  const applyTemplate = (k: ExportTemplate) => {
    setTemplate(k);
    const t = templates?.find((x) => x.key === k);
    if (t) setSelected(new Set(t.fields));
  };

  const toggleField = (key: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setTemplate("custom");
  };

  const buildRows = () => {
    const cols = fields.filter((f) => selected.has(f.key));
    return filtered.map((r) => {
      const o: Record<string, unknown> = {};
      cols.forEach((c) => { o[c.label] = r[c.key as keyof T]; });
      return o;
    });
  };

  const handleExport = () => {
    if (selected.size === 0) {
      toast.error("Select at least one field");
      return;
    }
    const cols = fields.filter((f) => selected.has(f.key));
    const groups = new Map<string, T[]>();
    filtered.forEach((r) => {
      const k = groupKey(r as Record<string, unknown>, groupBy, dateFieldKey);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(r);
    });

    const stamp = new Date().toISOString().slice(0, 10);
    const fileName = `${fileBase}_${groupBy === "none" ? "report" : groupBy.replace("__", "")}_${stamp}`;

    if (format === "csv") {
      const rows: Record<string, unknown>[] = [];
      groups.forEach((arr, gk) => {
        arr.forEach((r) => {
          const o: Record<string, unknown> = groupBy === "none" ? {} : { Group: gk };
          cols.forEach((c) => { o[c.label] = r[c.key as keyof T]; });
          rows.push(o);
        });
      });
      downloadCSV(`${fileName}.csv`, rows);
    } else {
      const doc = new jsPDF({ orientation: cols.length > 5 ? "landscape" : "portrait" });
      doc.setFontSize(14);
      doc.text(title, 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(100);
      const meta = [
        `Generated ${new Date().toLocaleString()}`,
        from || to ? `Range: ${from || "…"} → ${to || "…"}` : "Range: All time",
        `Records: ${filtered.length}`,
        groupBy !== "none" ? `Grouped by: ${groupBy.replace("__", "")}` : "",
      ].filter(Boolean).join("  ·  ");
      doc.text(meta, 14, 22);

      let y = 28;
      groups.forEach((arr, gk) => {
        if (groupBy !== "none") {
          doc.setFontSize(11);
          doc.setTextColor(30);
          doc.text(`${gk}  (${arr.length})`, 14, y);
          y += 4;
        }
        autoTable(doc, {
          startY: y,
          head: [cols.map((c) => c.label)],
          body: arr.map((r) => cols.map((c) => String(r[c.key as keyof T] ?? ""))),
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [30, 41, 59], textColor: 255 },
          margin: { left: 14, right: 14 },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y = ((doc as any).lastAutoTable?.finalY ?? y) + 8;
      });

      doc.save(`${fileName}.pdf`);
    }
    toast.success(`Exported ${filtered.length} record${filtered.length === 1 ? "" : "s"} as ${format.toUpperCase()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Download size={16} /> {title}</DialogTitle>
          <DialogDescription>Pick a template, fields, range and grouping.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format */}
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Format</Label>
            <Tabs value={format} onValueChange={(v) => setFormat(v as typeof format)} className="mt-1.5">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="csv" className="gap-1.5"><FileSpreadsheet size={13} /> CSV</TabsTrigger>
                <TabsTrigger value="pdf" className="gap-1.5"><FileText size={13} /> PDF</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Templates */}
          {templates && templates.length > 0 && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Template</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {templates.map((t) => (
                  <Button
                    key={t.key}
                    size="sm" variant={template === t.key ? "default" : "outline"}
                    className="h-8 text-xs"
                    onClick={() => applyTemplate(t.key)}
                  >
                    {t.label}
                  </Button>
                ))}
                <Button
                  size="sm" variant={template === "custom" ? "default" : "outline"}
                  className="h-8 text-xs" onClick={() => setTemplate("custom")}
                >
                  Custom
                </Button>
              </div>
            </div>
          )}

          {/* Date range */}
          {dateFieldKey && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CalendarDays size={12} /> Date range
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 text-sm" />
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
          )}

          {/* Group by */}
          {(groupOptions || dateFieldKey) && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Group by</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="h-9 mt-1.5 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {dateFieldKey && <SelectItem value="__day">Day</SelectItem>}
                  {dateFieldKey && <SelectItem value="__month">Month</SelectItem>}
                  {groupOptions?.map((g) => (
                    <SelectItem key={g.key} value={g.key}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fields ({selected.size}/{fields.length})</Label>
              <div className="flex gap-2">
                <button type="button" className="text-[11px] text-accent hover:underline" onClick={() => { setSelected(new Set(fields.map((f) => f.key))); setTemplate("custom"); }}>All</button>
                <button type="button" className="text-[11px] text-muted-foreground hover:underline" onClick={() => { setSelected(new Set()); setTemplate("custom"); }}>None</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2 max-h-44 overflow-y-auto border border-border rounded-lg p-3 bg-muted/20">
              {fields.map((f) => (
                <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={selected.has(f.key)} onCheckedChange={() => toggleField(f.key)} />
                  <span className="truncate">{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
            Preview: <span className="text-foreground font-medium">{filtered.length}</span> record{filtered.length === 1 ? "" : "s"}{groupBy !== "none" && <> grouped by <span className="text-foreground font-medium">{groupBy.replace("__", "")}</span></>}.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleExport} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
            <Download size={14} /> Export {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper to derive a default field list from a sample record.
export function fieldsFromSample<T extends Record<string, unknown>>(sample: T, labelMap: Partial<Record<keyof T, string>> = {}): ExportField[] {
  return Object.keys(sample).map((k) => ({
    key: k,
    label: (labelMap as Record<string, string>)[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    default: true,
  }));
}

// Re-export for convenience (data preview helper not exposed today).
void buildRowsTypeFix;
function buildRowsTypeFix() { /* placeholder to keep lint quiet */ }
