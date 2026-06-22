import { Users, Building2, CalendarCheck, DollarSign, AlertTriangle, RefreshCcw, TrendingUp, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staffKPIs, mockLogs, revenueSeries } from "@/lib/staffMockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Props = { onNavigate: (tab: string) => void };

const severityStyles: Record<string, string> = {
  info: "bg-muted text-foreground/70 border-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function StaffOverview({ onNavigate }: Props) {
  const recentLogs = mockLogs.slice(0, 5);

  const cards = [
    { label: "Total Users", value: staffKPIs.totalUsers.toLocaleString(), icon: Users, accent: "text-accent" },
    { label: "Partners", value: staffKPIs.totalPartners.toString(), icon: Building2, accent: "text-emerald-500" },
    { label: "Active Bookings", value: staffKPIs.activeBookings.toLocaleString(), icon: CalendarCheck, accent: "text-blue-500" },
    { label: "Monthly Revenue", value: `€${(staffKPIs.monthlyRevenue / 1000).toFixed(1)}k`, icon: DollarSign, accent: "text-accent" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">Platform Overview</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Real-time view of StayVista's operations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-3 sm:p-4 shadow-soft">
            <div className="flex items-start justify-between">
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">{c.label}</span>
              <c.icon size={16} className={c.accent} />
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-display font-bold text-foreground">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts row */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate("properties")}
          className="text-left bg-card border border-amber-500/30 rounded-xl p-4 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{staffKPIs.pendingApprovals} Properties pending review</div>
              <div className="text-xs text-muted-foreground">Tap to moderate listings</div>
            </div>
          </div>
        </button>
        <button
          onClick={() => onNavigate("bookings")}
          className="text-left bg-card border border-destructive/30 rounded-xl p-4 hover:shadow-elevated transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <RefreshCcw size={16} className="text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{staffKPIs.openRefunds} Refunds awaiting action</div>
              <div className="text-xs text-muted-foreground">Review and process payouts</div>
            </div>
          </div>
        </button>
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-display font-semibold">Revenue (6 months)</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} className="text-emerald-500" /> +{staffKPIs.growth}% vs last period
            </p>
          </div>
        </div>
        <div className="h-48 sm:h-64 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent logs */}
      <div className="bg-card border border-border rounded-xl shadow-soft">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-accent" />
            <h2 className="text-sm sm:text-base font-display font-semibold">Recent Activity Logs</h2>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate("reports")}>
            View all logs
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 sm:p-4">
              <Badge variant="outline" className={`${severityStyles[log.severity]} text-[10px] uppercase shrink-0`}>
                {log.severity}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{log.action}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {log.target} · by <span className="font-mono">{log.actor}</span>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0 hidden sm:block">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
