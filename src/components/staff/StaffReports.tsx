import { useMemo, useState } from "react";
import { Search, Filter, Download, ShieldAlert, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockLogs, revenueSeries, staffKPIs } from "@/lib/staffMockData";
import { downloadCSV } from "@/lib/staffExport";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

const severityStyles: Record<string, string> = {
  info: "bg-muted text-foreground/70 border-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function StaffReports() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<"all" | "info" | "warning" | "critical">("all");

  const filtered = useMemo(() => mockLogs.filter((l) => {
    if (severity !== "all" && l.severity !== severity) return false;
    if (search && !`${l.actor} ${l.action} ${l.target} ${l.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, severity]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Reports & Logs</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Platform analytics and full audit trail.</p>
      </div>

      {/* Bookings chart */}
      <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-display font-semibold">Bookings by month</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} className="text-emerald-500" /> +{staffKPIs.growth}% MoM
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => { downloadCSV("bookings-by-month.csv", revenueSeries); toast.success("Report exported"); }}>
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        </div>
        <div className="h-48 sm:h-64 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-card border border-border rounded-xl shadow-soft">
        <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-accent" />
            <h2 className="text-sm sm:text-base font-display font-semibold">Audit Logs</h2>
            <Badge variant="outline" className="text-[10px]">{filtered.length}</Badge>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9 h-9 text-sm" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter size={14} className="mr-1.5" /> {severity === "all" ? "All" : severity}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Severity</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={severity} onValueChange={(v) => setSeverity(v as typeof severity)}>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="info">Info</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="warning">Warning</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="critical">Critical</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-9" onClick={() => { downloadCSV("audit-logs.csv", filtered); toast.success(`Exported ${filtered.length} logs`); }}>
              <Download size={14} className="mr-1.5" /> Export
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filtered.map((log) => (
            <div key={log.id} className="p-3 sm:p-4 flex items-start gap-3">
              <Badge variant="outline" className={`text-[10px] uppercase shrink-0 ${severityStyles[log.severity]}`}>
                {log.severity}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{log.action}</div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  {log.target} · by <span className="font-mono">{log.actor}</span>
                  {log.ip && <> · IP <span className="font-mono">{log.ip}</span></>}
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0 text-right">
                <div className="font-mono">{log.id}</div>
                <div>{new Date(log.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
