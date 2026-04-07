import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck, DollarSign, Eye, Star, TrendingUp, ArrowUpRight,
  Plus, UserPlus, FileText, MessageSquare, Send, Calendar,
  Activity, Clock, User, Building2, Shield, Settings,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from "recharts";

const stats = [
  { label: "Total Bookings", value: "1,284", change: "+12%", icon: CalendarCheck, gradient: "from-accent/20 to-accent/5" },
  { label: "Revenue", value: "$86,420", change: "+8.5%", icon: DollarSign, gradient: "from-primary/20 to-primary/5" },
  { label: "Page Views", value: "23,891", change: "+22%", icon: Eye, gradient: "from-accent/15 to-accent/5" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star, gradient: "from-primary/15 to-primary/5" },
];

const recentBookings = [
  { id: "BK-001", guest: "Alice Martin", hotel: "Grand Hotel Paris", checkIn: "2026-03-05", status: "Confirmed", amount: "$540" },
  { id: "BK-002", guest: "Robert Chen", hotel: "Grand Hotel Paris", checkIn: "2026-03-10", status: "Pending", amount: "$980" },
  { id: "BK-003", guest: "Sarah Johnson", hotel: "Seaside Resort", checkIn: "2026-03-12", status: "Confirmed", amount: "$720" },
];

const overviewProperties = [
  { name: "Grand Hotel Paris", location: "Paris, France", rooms: 120, rating: 4.8, bookings: 342, status: "Active", occupancy: 87 },
  { name: "Seaside Resort", location: "Nice, France", rooms: 85, rating: 4.6, bookings: 218, status: "Active", occupancy: 74 },
  { name: "Mountain Lodge", location: "Chamonix, France", rooms: 45, rating: 4.9, bookings: 156, status: "Active", occupancy: 92 },
];

const bookingsByStatus = [
  { name: "Confirmed", value: 542, color: "hsl(38 90% 55%)" },
  { name: "Pending", value: 128, color: "hsl(220 10% 50%)" },
  { name: "Completed", value: 480, color: "hsl(220 45% 20%)" },
  { name: "Cancelled", value: 134, color: "hsl(0 72% 51%)" },
];

const monthlyRevenue = [
  { month: "Oct", revenue: 12400, bookings: 142 },
  { month: "Nov", revenue: 15200, bookings: 178 },
  { month: "Dec", revenue: 18900, bookings: 210 },
  { month: "Jan", revenue: 14100, bookings: 156 },
  { month: "Feb", revenue: 16800, bookings: 189 },
  { month: "Mar", revenue: 19500, bookings: 215 },
];

const quickActions = [
  { label: "New Booking", icon: Plus, color: "bg-accent/10 text-accent hover:bg-accent/20" },
  { label: "Add Property", icon: FileText, color: "bg-primary/10 text-primary hover:bg-primary/20" },
  { label: "Invite Member", icon: UserPlus, color: "bg-accent/10 text-accent hover:bg-accent/20" },
  { label: "Send Message", icon: Send, color: "bg-primary/10 text-primary hover:bg-primary/20" },
  { label: "View Reports", icon: MessageSquare, color: "bg-accent/10 text-accent hover:bg-accent/20" },
];

const calendarEvents = [
  { date: 5, type: "checkin", label: "3 check-ins" },
  { date: 8, type: "checkout", label: "2 check-outs" },
  { date: 10, type: "checkin", label: "4 check-ins" },
  { date: 12, type: "checkin", label: "2 check-ins" },
  { date: 14, type: "maintenance", label: "Maintenance" },
  { date: 15, type: "checkout", label: "3 check-outs" },
  { date: 18, type: "checkin", label: "5 check-ins" },
  { date: 22, type: "checkout", label: "4 check-outs" },
  { date: 25, type: "checkin", label: "2 check-ins" },
  { date: 28, type: "maintenance", label: "Staff meeting" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Confirmed": return "bg-accent/10 text-accent border border-accent/20";
    case "Pending": return "bg-muted text-muted-foreground border border-border";
    case "Active": return "bg-accent/10 text-accent border border-accent/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

// Recent activity logs for super admin
const recentLogs = [
  { id: 1, action: "Booking confirmed", actor: "Alice Martin (Guest)", target: "BK-001 · Grand Hotel Paris", time: "2 min ago", icon: CalendarCheck, color: "text-accent" },
  { id: 2, action: "Room status updated", actor: "Marie Dupont (Housekeeping)", target: "Room 304 → Clean", time: "8 min ago", icon: Activity, color: "text-blue-500" },
  { id: 3, action: "Rate changed", actor: "Jean Moreau (Revenue Mgr)", target: "Deluxe Suite +15%", time: "15 min ago", icon: DollarSign, color: "text-emerald-500" },
  { id: 4, action: "New team member added", actor: "Admin", target: "Sophie Laurent (Receptionist)", time: "32 min ago", icon: UserPlus, color: "text-purple-500" },
  { id: 5, action: "Maintenance ticket closed", actor: "Paul Renard (Maintenance)", target: "Ticket #MT-042 resolved", time: "1h ago", icon: Settings, color: "text-muted-foreground" },
  { id: 6, action: "Guest checked in", actor: "Front Desk", target: "Robert Chen · Room 512", time: "1h 20min ago", icon: User, color: "text-cyan-500" },
  { id: 7, action: "Property settings updated", actor: "Admin", target: "Seaside Resort – WiFi policy", time: "2h ago", icon: Building2, color: "text-amber-500" },
  { id: 8, action: "Security incident reported", actor: "Marc Bernard (Security)", target: "Lobby – unauthorized access attempt", time: "3h ago", icon: Shield, color: "text-red-500" },
];

interface PartnerOverviewProps {
  onNavigate: (tab: string) => void;
}

const PartnerOverview = ({ onNavigate }: PartnerOverviewProps) => {
  const [calendarMonth] = useState(2);
  const currentYear = 2026;
  const daysInMonth = new Date(currentYear, calendarMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, calendarMonth, 1).getDay();
  const monthName = new Date(currentYear, calendarMonth).toLocaleString("default", { month: "long" });

  const getDayEvents = (day: number) => calendarEvents.filter(e => e.date === day);
  const eventDotColor = (type: string) => {
    if (type === "checkin") return "bg-accent";
    if (type === "checkout") return "bg-primary";
    return "bg-destructive";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground font-medium">Welcome back,</p>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        </div>
        <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">Last updated: Mar 14, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} border border-border/50 p-5 group hover:shadow-card-hover transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <s.icon size={18} className="text-foreground" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                <TrendingUp size={10} /> {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
        <h2 className="font-display font-bold text-foreground text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${a.color}`}
            >
              <a.icon size={16} />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
          <h2 className="font-display font-bold text-foreground text-lg mb-4">Monthly Revenue & Bookings</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(220 15% 90%)", borderRadius: "12px", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="revenue" fill="hsl(38 90% 55%)" radius={[6, 6, 0, 0]} name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="bookings" fill="hsl(220 45% 20%)" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
          <h2 className="font-display font-bold text-foreground text-lg mb-4">Bookings by Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {bookingsByStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12, border: "1px solid hsl(220 15% 90%)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {bookingsByStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-semibold text-foreground ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Logs (Super Admin) */}
      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
            <Activity size={18} className="text-accent" /> Recent Activity
          </h2>
          <Button variant="ghost" size="sm" className="text-accent gap-1 hover:bg-accent/10 rounded-lg" onClick={() => onNavigate("reports")}>
            View All Logs <ArrowUpRight size={14} />
          </Button>
        </div>
        <div className="divide-y divide-border/40">
          {recentLogs.slice(0, 5).map(log => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 ${log.color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.actor} · {log.target}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock size={10} /> {log.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mini Calendar */}
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground text-lg flex items-center gap-2">
              <Calendar size={18} className="text-accent" /> {monthName} {currentYear}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} className="text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getDayEvents(day);
              const isToday = day === 14;
              return (
                <div
                  key={day}
                  className={`relative py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    isToday
                      ? "bg-accent text-accent-foreground font-bold"
                      : events.length > 0
                      ? "bg-muted/60 text-foreground hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted/40"
                  }`}
                  title={events.map(e => e.label).join(", ")}
                >
                  {day}
                  {events.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {events.map((e, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${eventDotColor(e.type)}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
            {calendarEvents.filter(e => e.date >= 14).slice(0, 3).map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${eventDotColor(e.type)}`} />
                <span className="text-muted-foreground">Mar {e.date}</span>
                <span className="text-foreground font-medium">{e.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/60">
            <h2 className="font-display font-bold text-foreground text-lg">Recent Bookings</h2>
            <Button variant="ghost" size="sm" className="text-accent gap-1 hover:bg-accent/10 rounded-lg" onClick={() => onNavigate("bookings")}>
              View All <ArrowUpRight size={14} />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Guest</th>
                  <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Hotel</th>
                  <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Check-in</th>
                  <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{b.guest}</td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{b.hotel}</td>
                    <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{b.checkIn}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span></td>
                    <td className="px-5 py-4 text-right font-semibold text-foreground">{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <h2 className="font-display font-bold text-foreground text-lg">Your Properties</h2>
          <Button variant="ghost" size="sm" className="text-accent gap-1 hover:bg-accent/10 rounded-lg" onClick={() => onNavigate("properties")}>
            Manage <ArrowUpRight size={14} />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          {overviewProperties.map((p) => (
            <div key={p.name} className="rounded-xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.location}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <div className="mt-3 mb-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-semibold text-foreground">{p.occupancy}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-gold-light rounded-full transition-all duration-500" style={{ width: `${p.occupancy}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40">
                <span>{p.rooms} rooms</span>
                <span className="flex items-center gap-0.5"><Star size={11} className="text-accent" />{p.rating}</span>
                <span>{p.bookings} bookings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerOverview;
