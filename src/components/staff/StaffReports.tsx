import { useMemo, useState } from "react";
import { Search, Filter, Download, ShieldAlert, TrendingUp, Users, CalendarDays, RefreshCcw, MessageSquare, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockLogs, revenueSeries, staffKPIs, analyticsSeries, feedbackBreakdown } from "@/lib/staffMockData";
import StatCard from "@/components/staff/StatCard";
import { ExportReportDialog, type ExportField } from "@/components/staff/ExportReportDialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";


const severityStyles: Record<string, string> = {
  info: "bg-muted text-foreground/70 border-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

const chartTooltip = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function StaffReports() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<"all" | "info" | "warning" | "critical">("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportKind, setExportKind] = useState<"analytics" | "logs">("analytics");

  const filtered = useMemo(() => mockLogs.filter((l) => {
    if (severity !== "all" && l.severity !== severity) return false;
    if (search && !`${l.actor} ${l.action} ${l.target} ${l.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, severity]);

  const latest = analyticsSeries[analyticsSeries.length - 1];
  const prev = analyticsSeries[analyticsSeries.length - 2];
  const delta = (a: number, b: number) => ((a - b) / b) * 100;

  const openExport = (kind: "analytics" | "logs") => { setExportKind(kind); setExportOpen(true); };

  const analyticsFields: ExportField[] = [
    { key: "month", label: "Month", default: true },
    { key: "users", label: "Users", default: true },
    { key: "partners", label: "Partners", default: true },
    { key: "properties", label: "Properties", default: true },
    { key: "bookings", label: "Bookings", default: true },
    { key: "refunds", label: "Refunds", default: true },
    { key: "disputes", label: "Disputes" },
    { key: "logs", label: "Log events" },
    { key: "feedback", label: "Feedback" },
  ];
  const logFields: ExportField[] = [
    { key: "id", label: "ID", default: true },
    { key: "timestamp", label: "Timestamp", default: true },
    { key: "actor", label: "Actor", default: true },
    { key: "action", label: "Action", default: true },
    { key: "target", label: "Target", default: true },
    { key: "severity", label: "Severity", default: true },
    { key: "ip", label: "IP" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Reports & Logs</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Platform-wide analytics, feedback, disputes and full audit trail.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => openExport("analytics")}>
          <Download size={14} className="mr-1.5" /> Export report
        </Button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Users" value={latest.users.toLocaleString()} delta={delta(latest.users, prev.users)} icon={Users} tone="accent" series={analyticsSeries.map((a) => ({ v: a.users }))} />
        <StatCard label="Bookings" value={latest.bookings} delta={delta(latest.bookings, prev.bookings)} icon={CalendarDays} tone="success" series={analyticsSeries.map((a) => ({ v: a.bookings }))} />
        <StatCard label="Refunds" value={latest.refunds} delta={delta(latest.refunds, prev.refunds)} icon={RefreshCcw} tone="warning" series={analyticsSeries.map((a) => ({ v: a.refunds }))} />
        <StatCard label="Disputes" value={latest.disputes} delta={delta(latest.disputes, prev.disputes)} icon={AlertTriangle} tone="danger" series={analyticsSeries.map((a) => ({ v: a.disputes }))} />
      </div>

      {/* Combined analytics chart */}
      <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-display font-semibold">Platform activity</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} className="text-emerald-500" /> Users vs bookings · +{staffKPIs.growth}% MoM
            </p>
          </div>
        </div>
        <div className="h-56 sm:h-72 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="users"    stroke="hsl(var(--accent))"     strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bookings" stroke="hsl(142 71% 45%)"       strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="properties" stroke="hsl(217 91% 60%)"     strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split: refunds/disputes + feedback breakdown */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-display font-semibold">Refunds & disputes</h2>
            <Badge variant="outline" className="text-[10px]">last 6 mo.</Badge>
          </div>
          <div className="h-48 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="refunds"  fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disputes" fill="hsl(0 84% 60%)"  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={15} className="text-accent" />
              <h2 className="text-sm sm:text-base font-display font-semibold">Guest feedback</h2>
            </div>
            <Badge variant="outline" className="text-[10px]">{feedbackBreakdown.reduce((s, f) => s + f.value, 0)} reviews</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feedbackBreakdown} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {feedbackBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log volume + revenue */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
          <h2 className="text-sm sm:text-base font-display font-semibold mb-3">Audit log volume</h2>
          <div className="h-40 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="logsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartTooltip} />
                <Area type="monotone" dataKey="logs" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#logsG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
          <h2 className="text-sm sm:text-base font-display font-semibold mb-3">Bookings by month</h2>
          <div className="h-40 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
            <Button variant="outline" size="sm" className="h-9" onClick={() => openExport("logs")}>
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

      <ExportReportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={exportKind === "analytics" ? "Export analytics report" : "Export audit logs"}
        fileBase={exportKind === "analytics" ? "analytics" : "audit-logs"}
        fields={exportKind === "analytics" ? analyticsFields : logFields}
        data={(exportKind === "analytics" ? analyticsSeries : filtered) as unknown as Record<string, unknown>[]}
        dateKey={exportKind === "logs" ? "timestamp" : undefined}
        groupOptions={exportKind === "logs" ? [
          { key: "severity", label: "Severity" },
          { key: "actor",    label: "Actor" },
        ] : undefined}
        templates={exportKind === "analytics" ? [
          { key: "summary",  label: "Summary",  fields: ["month", "users", "bookings", "refunds"] },
          { key: "detailed", label: "Detailed", fields: analyticsFields.map((f) => f.key) },
        ] : [
          { key: "summary",  label: "Summary",  fields: ["id", "timestamp", "action", "severity"] },
          { key: "detailed", label: "Detailed", fields: logFields.map((f) => f.key) },
        ]}
      />
    </div>
  );
}
