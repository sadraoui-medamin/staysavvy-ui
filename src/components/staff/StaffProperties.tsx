import { useEffect, useMemo, useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, Flag, Eye, Download, Pencil, Trash2, Building2, Clock, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { mockProperties, analyticsSeries, type StaffProperty } from "@/lib/staffMockData";
import { useStaffAuth } from "@/lib/staffRoles";
import { useStaffStore } from "@/lib/staffSupport";
import StatCard from "@/components/staff/StatCard";
import { ExportReportDialog, type ExportField } from "@/components/staff/ExportReportDialog";
import { toast } from "sonner";



const statusStyles: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  flagged: "bg-orange-500/10 text-orange-600 border-orange-500/30",
};

export default function StaffProperties() {
  const { can } = useStaffAuth();
  const canModerate = can("properties.moderate");
  const pushNotification = useStaffStore((s) => s.pushNotification);
  const focusRef = useStaffStore((s) => s.focusRef);
  const setFocusRef = useStaffStore((s) => s.setFocusRef);
  const [items, setItems] = useState<StaffProperty[]>(mockProperties);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StaffProperty["status"]>("all");
  const [viewing, setViewing] = useState<StaffProperty | null>(null);
  const [editing, setEditing] = useState<StaffProperty | null>(null);
  const [draft, setDraft] = useState<StaffProperty | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StaffProperty | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Deep-link from notification center: open the corresponding record.
  useEffect(() => {
    if (!focusRef) return;
    const match = items.find((p) => p.id === focusRef);
    if (match) {
      setViewing(match);
      setSearch(focusRef);
    }
    setFocusRef(null);
  }, [focusRef, items, setFocusRef]);

  const filtered = useMemo(() => items.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !`${p.name} ${p.partner} ${p.city} ${p.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter]);

  const setStatus = (id: string, status: StaffProperty["status"]) => {
    const prop = items.find((x) => x.id === id);
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Property ${id} ${status}`);
    if (prop) {
      const kind = status === "approved" ? "approval" : status === "rejected" ? "rejection" : "property";
      pushNotification({
        kind,
        title: `Property ${status}`,
        description: `${prop.name} (${id})`,
        targetTab: "properties",
        recordId: id,
        severity: status === "rejected" ? "warning" : status === "flagged" ? "warning" : "info",
      });
    }
  };

  const startEdit = (p: StaffProperty) => { setEditing(p); setDraft({ ...p }); };
  const saveEdit = () => {
    if (!draft || !editing) return;
    setItems((arr) => arr.map((x) => (x.id === editing.id ? draft : x)));
    setEditing(null); setDraft(null);
    toast.success("Property updated");
  };

  const removeProperty = () => {
    if (!confirmDelete) return;
    setItems((p) => p.filter((x) => x.id !== confirmDelete.id));
    toast.success(`${confirmDelete.id} removed`);
    setConfirmDelete(null);
  };

  const exportFields: ExportField[] = [
    { key: "id", label: "ID", default: true },
    { key: "name", label: "Property", default: true },
    { key: "partner", label: "Partner", default: true },
    { key: "city", label: "City", default: true },
    { key: "country", label: "Country", default: true },
    { key: "rooms", label: "Rooms", default: true },
    { key: "rating", label: "Rating" },
    { key: "status", label: "Status", default: true },
    { key: "submittedAt", label: "Submitted" },
  ];


  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Properties Moderation</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Review submissions, flag issues, and curate the catalog.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setExportOpen(true)}><Download size={14} className="mr-1.5" /> Export</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search property, partner or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 bg-card" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter size={14} className="mr-1.5" /> {statusFilter === "all" ? "All status" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="flagged">Flagged</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rejected">Rejected</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate"><span className="font-mono">{p.id}</span> · {p.city}, {p.country}</div>
              </div>
              <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[p.status]} shrink-0`}>{p.status}</Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
              <div>Partner: <span className="text-foreground font-medium">{p.partner}</span></div>
              <div>Rooms: {p.rooms} {p.rating && <>· Rating: {p.rating} ★</>}</div>
              <div>Submitted: {p.submittedAt}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8" onClick={() => setViewing(p)}>
                <Eye size={12} className="mr-1" /> View
              </Button>
              {canModerate && (
                <Button size="sm" variant="outline" className="h-8" onClick={() => startEdit(p)}>
                  <Pencil size={12} className="mr-1" /> Edit
                </Button>
              )}
              {canModerate && p.status !== "approved" && (
                <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-500/90 text-white" onClick={() => setStatus(p.id, "approved")}>
                  <CheckCircle2 size={12} className="mr-1" /> Approve
                </Button>
              )}
              {canModerate && p.status !== "flagged" && (
                <Button size="sm" variant="outline" className="h-8 text-orange-600 border-orange-500/40" onClick={() => setStatus(p.id, "flagged")}>
                  <Flag size={12} className="mr-1" /> Flag
                </Button>
              )}
              {canModerate && p.status !== "rejected" && (
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40" onClick={() => setStatus(p.id, "rejected")}>
                  <XCircle size={12} className="mr-1" /> Reject
                </Button>
              )}
              {canModerate && (
                <Button size="sm" variant="ghost" className="h-8 text-destructive ml-auto" onClick={() => setConfirmDelete(p)}>
                  <Trash2 size={12} />
                </Button>
              )}
              {!canModerate && <span className="text-[11px] text-muted-foreground italic self-center">Read-only</span>}
            </div>
          </div>
        ))}
      </div>

      {/* View */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{viewing?.name}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <Row label="ID" value={<span className="font-mono">{viewing.id}</span>} />
              <Row label="Status" value={<Badge variant="outline" className={`capitalize ${statusStyles[viewing.status]}`}>{viewing.status}</Badge>} />
              <Row label="Partner" value={viewing.partner} />
              <Row label="Location" value={`${viewing.city}, ${viewing.country}`} />
              <Row label="Rooms" value={viewing.rooms} />
              <Row label="Rating" value={viewing.rating ? `${viewing.rating} ★` : "—"} />
              <Row label="Submitted" value={viewing.submittedAt} />
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewing(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setDraft(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit property</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-3">
              <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              <Field label="Partner"><Input value={draft.partner} onChange={(e) => setDraft({ ...draft, partner: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></Field>
                <Field label="Country"><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rooms"><Input type="number" value={draft.rooms} onChange={(e) => setDraft({ ...draft, rooms: Number(e.target.value) })} /></Field>
                <Field label="Rating"><Input type="number" step="0.1" value={draft.rating ?? ""} onChange={(e) => setDraft({ ...draft, rating: e.target.value ? Number(e.target.value) : undefined })} /></Field>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setDraft(null); }}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove property?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove <strong className="text-foreground">{confirmDelete?.name}</strong> from the catalog.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={removeProperty}><Trash2 size={14} className="mr-1.5" /> Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExportReportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Export properties report"
        fileBase="properties"
        fields={exportFields}
        data={filtered as unknown as Record<string, unknown>[]}
        dateKey="submittedAt"
        groupOptions={[
          { key: "status",  label: "Status" },
          { key: "country", label: "Country" },
          { key: "partner", label: "Partner" },
        ]}
        templates={[
          { key: "summary",  label: "Summary",  fields: ["id", "name", "status", "partner"] },
          { key: "detailed", label: "Detailed", fields: exportFields.map((f) => f.key) },
        ]}
      />
    </div>

  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><Label className="text-xs">{label}</Label>{children}</div>;
}
