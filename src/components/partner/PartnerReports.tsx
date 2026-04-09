import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area,
} from "recharts";
import { DollarSign, CalendarCheck, Users, Building2, Download, Calendar, TrendingUp, TrendingDown, Activity, Clock, User, UserPlus, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

const allRevenueData = [
  { month: "Jan 2025", revenue: 38000, expenses: 25000, profit: 13000 },
  { month: "Feb 2025", revenue: 42000, expenses: 27000, profit: 15000 },
  { month: "Mar 2025", revenue: 45000, expenses: 26000, profit: 19000 },
  { month: "Apr 2025", revenue: 50000, expenses: 29000, profit: 21000 },
  { month: "May 2025", revenue: 55000, expenses: 30000, profit: 25000 },
  { month: "Jun 2025", revenue: 60000, expenses: 33000, profit: 27000 },
  { month: "Jul 2025", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Aug 2025", revenue: 58000, expenses: 32000, profit: 26000 },
  { month: "Sep 2025", revenue: 51000, expenses: 30000, profit: 21000 },
  { month: "Oct 2025", revenue: 63000, expenses: 35000, profit: 28000 },
  { month: "Nov 2025", revenue: 72000, expenses: 38000, profit: 34000 },
  { month: "Dec 2025", revenue: 89000, expenses: 42000, profit: 47000 },
  { month: "Jan 2026", revenue: 54000, expenses: 31000, profit: 23000 },
  { month: "Feb 2026", revenue: 68000, expenses: 36000, profit: 32000 },
  { month: "Mar 2026", revenue: 86000, expenses: 40000, profit: 46000 },
];

const bookingAnalytics = [
  { week: "W1 Jan", directBookings: 45, ota: 32, corporate: 18, walkIn: 8, date: "2026-01-06" },
  { week: "W2 Jan", directBookings: 52, ota: 28, corporate: 22, walkIn: 12, date: "2026-01-13" },
  { week: "W3 Jan", directBookings: 38, ota: 35, corporate: 15, walkIn: 6, date: "2026-01-20" },
  { week: "W4 Feb", directBookings: 61, ota: 30, corporate: 25, walkIn: 10, date: "2026-02-03" },
  { week: "W1 Feb", directBookings: 55, ota: 27, corporate: 20, walkIn: 14, date: "2026-02-10" },
  { week: "W2 Feb", directBookings: 48, ota: 33, corporate: 19, walkIn: 9, date: "2026-02-17" },
  { week: "W3 Mar", directBookings: 67, ota: 25, corporate: 28, walkIn: 11, date: "2026-03-02" },
  { week: "W4 Mar", directBookings: 58, ota: 31, corporate: 24, walkIn: 7, date: "2026-03-09" },
];

const guestDemographics = [
  { name: "Business", value: 35, color: "hsl(var(--primary))" },
  { name: "Leisure", value: 28, color: "hsl(var(--accent))" },
  { name: "Family", value: 20, color: "hsl(220 35% 35%)" },
  { name: "Couples", value: 12, color: "hsl(38 80% 70%)" },
  { name: "Solo", value: 5, color: "hsl(220 10% 60%)" },
];

const occupancyByProperty = [
  { month: "Oct 2025", grandHotel: 82, seaside: 68, mountain: 88, cityCenter: 42 },
  { month: "Nov 2025", grandHotel: 85, seaside: 72, mountain: 91, cityCenter: 48 },
  { month: "Dec 2025", grandHotel: 92, seaside: 78, mountain: 95, cityCenter: 55 },
  { month: "Jan 2026", grandHotel: 78, seaside: 60, mountain: 85, cityCenter: 40 },
  { month: "Feb 2026", grandHotel: 84, seaside: 70, mountain: 90, cityCenter: 46 },
  { month: "Mar 2026", grandHotel: 87, seaside: 74, mountain: 92, cityCenter: 45 },
];

// Full activity logs data
const allLogs = [
  { id: 1, action: "Booking confirmed", actor: "Alice Martin (Guest)", target: "BK-001 · Grand Hotel Paris", time: "2 min ago", icon: CalendarCheck, color: "text-accent", category: "booking" },
  { id: 2, action: "Room status updated", actor: "Marie Dupont (Housekeeping)", target: "Room 304 → Clean", time: "8 min ago", icon: Activity, color: "text-blue-500", category: "operations" },
  { id: 3, action: "Rate changed", actor: "Jean Moreau (Revenue Mgr)", target: "Deluxe Suite +15%", time: "15 min ago", icon: DollarSign, color: "text-emerald-500", category: "revenue" },
  { id: 4, action: "New team member added", actor: "Admin", target: "Sophie Laurent (Receptionist)", time: "32 min ago", icon: UserPlus, color: "text-purple-500", category: "team" },
  { id: 5, action: "Maintenance ticket closed", actor: "Paul Renard (Maintenance)", target: "Ticket #MT-042 resolved", time: "1h ago", icon: Settings, color: "text-muted-foreground", category: "operations" },
  { id: 6, action: "Guest checked in", actor: "Front Desk", target: "Robert Chen · Room 512", time: "1h 20min ago", icon: User, color: "text-cyan-500", category: "booking" },
  { id: 7, action: "Property settings updated", actor: "Admin", target: "Seaside Resort – WiFi policy", time: "2h ago", icon: Building2, color: "text-amber-500", category: "operations" },
  { id: 8, action: "Security incident reported", actor: "Marc Bernard (Security)", target: "Lobby – unauthorized access attempt", time: "3h ago", icon: Shield, color: "text-red-500", category: "security" },
  { id: 9, action: "Booking cancelled", actor: "System", target: "BK-089 · Mountain Lodge", time: "3h 15min ago", icon: CalendarCheck, color: "text-destructive", category: "booking" },
  { id: 10, action: "Guest checked out", actor: "Front Desk", target: "Emily Davis · Room 201", time: "4h ago", icon: User, color: "text-cyan-500", category: "booking" },
  { id: 11, action: "Inventory restocked", actor: "Housekeeping Lead", target: "Towels +200, Amenities +150", time: "4h 30min ago", icon: Activity, color: "text-blue-500", category: "operations" },
  { id: 12, action: "Revenue report generated", actor: "System", target: "Monthly report – Feb 2026", time: "5h ago", icon: DollarSign, color: "text-emerald-500", category: "revenue" },
  { id: 13, action: "Room service order", actor: "Guest Relations", target: "Room 412 – Dinner for 2", time: "5h 45min ago", icon: User, color: "text-amber-500", category: "operations" },
  { id: 14, action: "Team role changed", actor: "Admin", target: "Marc → Security Lead", time: "6h ago", icon: UserPlus, color: "text-purple-500", category: "team" },
  { id: 15, action: "Fire alarm test", actor: "Security Officer", target: "Building A – All clear", time: "8h ago", icon: Shield, color: "text-red-500", category: "security" },
];

const logCategories = [
  { key: "all", label: "All Logs" },
  { key: "booking", label: "Bookings" },
  { key: "operations", label: "Operations" },
  { key: "revenue", label: "Revenue" },
  { key: "team", label: "Team" },
  { key: "security", label: "Security" },
];

const datePresets = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last year", value: "1y" },
  { label: "All time", value: "all" },
];

const tabs = [
  { key: "revenue", label: "Revenue Trends", icon: DollarSign },
  { key: "bookings", label: "Booking Analytics", icon: CalendarCheck },
  { key: "demographics", label: "Guest Demographics", icon: Users },
  { key: "occupancy", label: "Occupancy Rates", icon: Building2 },
  { key: "logs", label: "Activity Logs", icon: Activity },
] as const;

type ReportTab = (typeof tabs)[number]["key"];

const PartnerReports = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");
  const [datePreset, setDatePreset] = useState("6m");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [logCategory, setLogCategory] = useState("all");
  const [logSearch, setLogSearch] = useState("");
  const { toast } = useToast();

  const filteredRevenue = useMemo(() => {
    if (datePreset === "all") return allRevenueData;
    const months: Record<string, number> = { "7d": 1, "30d": 1, "3m": 3, "6m": 6, "1y": 12 };
    const count = months[datePreset] || 6;
    return allRevenueData.slice(-count);
  }, [datePreset]);

  const revenueStats = useMemo(() => {
    const totalRev = filteredRevenue.reduce((s, d) => s + d.revenue, 0);
    const totalExp = filteredRevenue.reduce((s, d) => s + d.expenses, 0);
    const totalProfit = filteredRevenue.reduce((s, d) => s + d.profit, 0);
    const avgRevPerMonth = Math.round(totalRev / filteredRevenue.length);
    const lastMonth = filteredRevenue[filteredRevenue.length - 1];
    const prevMonth = filteredRevenue[filteredRevenue.length - 2];
    const revChange = prevMonth ? Math.round(((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100) : 0;
    return { totalRev, totalExp, totalProfit, avgRevPerMonth, revChange };
  }, [filteredRevenue]);

  const filteredLogs = useMemo(() => {
    let logs = [...allLogs];
    if (logCategory !== "all") logs = logs.filter(l => l.category === logCategory);
    if (logSearch) {
      const q = logSearch.toLowerCase();
      logs = logs.filter(l => l.action.toLowerCase().includes(q) || l.actor.toLowerCase().includes(q) || l.target.toLowerCase().includes(q));
    }
    return logs;
  }, [logCategory, logSearch]);

  const exportReport = (type: "pdf" | "csv") => {
    if (type === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("StayVista Partner Report", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report Type: ${tabs.find(t => t.key === activeTab)?.label}`, 14, 30);
      doc.text(`Date Range: ${datePreset === "all" ? "All Time" : datePresets.find(d => d.value === datePreset)?.label}`, 14, 36);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

      if (activeTab === "revenue") {
        autoTable(doc, {
          startY: 50,
          head: [["Month", "Revenue", "Expenses", "Profit", "Margin"]],
          body: filteredRevenue.map(d => [
            d.month, `$${d.revenue.toLocaleString()}`, `$${d.expenses.toLocaleString()}`,
            `$${d.profit.toLocaleString()}`, `${Math.round((d.profit / d.revenue) * 100)}%`
          ]),
          theme: "striped",
          headStyles: { fillColor: [41, 37, 36] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || 100;
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Total Revenue: $${revenueStats.totalRev.toLocaleString()}`, 14, finalY + 12);
        doc.text(`Total Expenses: $${revenueStats.totalExp.toLocaleString()}`, 14, finalY + 20);
        doc.text(`Net Profit: $${revenueStats.totalProfit.toLocaleString()}`, 14, finalY + 28);
      } else if (activeTab === "bookings") {
        autoTable(doc, {
          startY: 50,
          head: [["Week", "Direct", "OTA", "Corporate", "Walk-in", "Total"]],
          body: bookingAnalytics.map(d => [
            d.week, d.directBookings, d.ota, d.corporate, d.walkIn,
            d.directBookings + d.ota + d.corporate + d.walkIn
          ]),
          theme: "striped",
          headStyles: { fillColor: [41, 37, 36] },
        });
      } else if (activeTab === "demographics") {
        autoTable(doc, {
          startY: 50,
          head: [["Guest Type", "Percentage"]],
          body: guestDemographics.map(d => [d.name, `${d.value}%`]),
          theme: "striped",
          headStyles: { fillColor: [41, 37, 36] },
        });
      } else if (activeTab === "occupancy") {
        autoTable(doc, {
          startY: 50,
          head: [["Month", "Grand Hotel", "Seaside", "Mountain", "City Center"]],
          body: occupancyByProperty.map(d => [
            d.month, `${d.grandHotel}%`, `${d.seaside}%`, `${d.mountain}%`, `${d.cityCenter}%`
          ]),
          theme: "striped",
          headStyles: { fillColor: [41, 37, 36] },
        });
      } else if (activeTab === "logs") {
        autoTable(doc, {
          startY: 50,
          head: [["#", "Action", "Actor", "Target", "Time", "Category"]],
          body: filteredLogs.map(l => [l.id, l.action, l.actor, l.target, l.time, l.category]),
          theme: "striped",
          headStyles: { fillColor: [41, 37, 36] },
        });
      }

      doc.save(`stayvista-${activeTab}-report.pdf`);
      toast({ title: "PDF Exported", description: `${tabs.find(t => t.key === activeTab)?.label} report downloaded.` });
    } else {
      let csv = "";
      if (activeTab === "revenue") {
        csv = "Month,Revenue,Expenses,Profit,Margin\n" +
          filteredRevenue.map(d => `${d.month},${d.revenue},${d.expenses},${d.profit},${Math.round((d.profit / d.revenue) * 100)}%`).join("\n");
      } else if (activeTab === "bookings") {
        csv = "Week,Direct,OTA,Corporate,Walk-in,Total\n" +
          bookingAnalytics.map(d => `${d.week},${d.directBookings},${d.ota},${d.corporate},${d.walkIn},${d.directBookings + d.ota + d.corporate + d.walkIn}`).join("\n");
      } else if (activeTab === "demographics") {
        csv = "Type,Percentage\n" + guestDemographics.map(d => `${d.name},${d.value}%`).join("\n");
      } else if (activeTab === "occupancy") {
        csv = "Month,Grand Hotel,Seaside,Mountain,City Center\n" +
          occupancyByProperty.map(d => `${d.month},${d.grandHotel}%,${d.seaside}%,${d.mountain}%,${d.cityCenter}%`).join("\n");
      } else if (activeTab === "logs") {
        csv = "ID,Action,Actor,Target,Time,Category\n" +
          filteredLogs.map(l => `${l.id},"${l.action}","${l.actor}","${l.target}","${l.time}",${l.category}`).join("\n");
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stayvista-${activeTab}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "CSV Exported", description: `${tabs.find(t => t.key === activeTab)?.label} report downloaded.` });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm">Analyze your performance metrics with detailed insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("csv")} className="gap-2 rounded-xl">
            <Download size={16} /> CSV
          </Button>
          <Button onClick={() => exportReport("pdf")} className="gap-2 rounded-xl bg-accent text-accent-foreground hover:bg-gold-light">
            <Download size={16} /> PDF
          </Button>
        </div>
      </div>

      {/* Date Range Controls */}
      <div className="bg-card rounded-2xl border border-border/50 p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span className="font-medium">Date Range:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {datePresets.map(d => (
              <button
                key={d.value}
                onClick={() => { setDatePreset(d.value); setDateFrom(""); setDateTo(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  datePreset === d.value && !dateFrom
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setDatePreset(""); }}
              className="h-9 text-xs bg-muted/30 rounded-lg"
            />
            <span className="text-xs text-muted-foreground text-center">to</span>
            <Input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setDatePreset(""); }}
              className="h-9 text-xs bg-muted/30 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
              activeTab === t.key
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <t.icon size={16} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Revenue Trends */}
      {activeTab === "revenue" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Revenue", value: `$${revenueStats.totalRev.toLocaleString()}`, icon: DollarSign, change: null },
              { label: "Total Expenses", value: `$${revenueStats.totalExp.toLocaleString()}`, icon: TrendingDown, change: null },
              { label: "Net Profit", value: `$${revenueStats.totalProfit.toLocaleString()}`, icon: TrendingUp, change: null },
              { label: "Avg/Month", value: `$${revenueStats.avgRevPerMonth.toLocaleString()}`, icon: CalendarCheck, change: null },
              { label: "MoM Change", value: `${revenueStats.revChange > 0 ? "+" : ""}${revenueStats.revChange}%`, icon: revenueStats.revChange >= 0 ? TrendingUp : TrendingDown, change: revenueStats.revChange },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <s.icon size={16} />
                  </div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
                <p className={`text-xl font-bold ${s.change !== null ? (s.change >= 0 ? "text-accent" : "text-destructive") : "text-foreground"}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-foreground text-lg">Revenue vs Expenses vs Profit</h2>
              <span className="text-xs text-muted-foreground">{filteredRevenue.length} months</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(var(--muted-foreground))" radius={[6, 6, 0, 0]} name="Expenses" />
                <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Profit Margin Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredRevenue.map(d => ({ ...d, margin: Math.round((d.profit / d.revenue) * 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v}%`, undefined]} />
                <Line type="monotone" dataKey="margin" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} name="Profit Margin" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Booking Analytics */}
      {activeTab === "bookings" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Direct Bookings", value: "424", pct: "41%", trend: "+12%" },
              { label: "OTA Bookings", value: "241", pct: "23%", trend: "-3%" },
              { label: "Corporate", value: "171", pct: "17%", trend: "+8%" },
              { label: "Walk-ins", value: "77", pct: "7%", trend: "+5%" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{s.pct} of total</span>
                  <span className={`text-xs font-semibold ${s.trend.startsWith("+") ? "text-accent" : "text-destructive"}`}>{s.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Bookings by Source Over Time</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={bookingAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="directBookings" stackId="1" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" fillOpacity={0.6} name="Direct" />
                <Area type="monotone" dataKey="ota" stackId="1" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" fillOpacity={0.6} name="OTA" />
                <Area type="monotone" dataKey="corporate" stackId="1" fill="hsl(220 35% 35%)" stroke="hsl(220 35% 35%)" fillOpacity={0.6} name="Corporate" />
                <Area type="monotone" dataKey="walkIn" stackId="1" fill="hsl(38 80% 70%)" stroke="hsl(38 80% 70%)" fillOpacity={0.6} name="Walk-in" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Booking Conversion Funnel</h2>
            <div className="space-y-3">
              {[
                { stage: "Page Views", count: 12450, pct: 100 },
                { stage: "Search Initiated", count: 8200, pct: 66 },
                { stage: "Room Selected", count: 4100, pct: 33 },
                { stage: "Booking Started", count: 1850, pct: 15 },
                { stage: "Booking Completed", count: 913, pct: 7.3 },
              ].map((f) => (
                <div key={f.stage} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-36 shrink-0">{f.stage}</span>
                  <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-accent to-gold-light transition-all duration-700"
                      style={{ width: `${f.pct}%` }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground">
                      {f.count.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground w-12 text-right">{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guest Demographics */}
      {activeTab === "demographics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Guest Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={guestDemographics} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {guestDemographics.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Breakdown</h2>
            <div className="space-y-4">
              {guestDemographics.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm font-medium text-foreground">{d.name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Occupancy Rates */}
      {activeTab === "occupancy" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Grand Hotel Paris", value: "87%", trend: "+3%", color: "text-accent" },
              { label: "Seaside Resort", value: "74%", trend: "+6%", color: "text-primary" },
              { label: "Mountain Lodge", value: "92%", trend: "+2%", color: "text-accent" },
              { label: "City Center Inn", value: "45%", trend: "-1%", color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                <span className={`text-xs font-semibold ${s.trend.startsWith("+") ? "text-accent" : "text-destructive"}`}>{s.trend} vs last month</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Occupancy Rate by Property</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={occupancyByProperty}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [`${v}%`, undefined]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="grandHotel" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 4 }} name="Grand Hotel" />
                <Line type="monotone" dataKey="seaside" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} name="Seaside Resort" />
                <Line type="monotone" dataKey="mountain" stroke="hsl(220 35% 35%)" strokeWidth={2.5} dot={{ r: 4 }} name="Mountain Lodge" />
                <Line type="monotone" dataKey="cityCenter" stroke="hsl(38 80% 70%)" strokeWidth={2.5} dot={{ r: 4 }} name="City Center Inn" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      {activeTab === "logs" && (
        <div className="space-y-5">
          {/* Log filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Activity size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="pl-9 h-10 bg-card rounded-xl"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {logCategories.map(c => (
                <button
                  key={c.key}
                  onClick={() => setLogCategory(c.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    logCategory === c.key ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Log stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {logCategories.filter(c => c.key !== "all").map(c => {
              const count = allLogs.filter(l => l.category === c.key).length;
              return (
                <div key={c.key} className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{c.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Log list */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="divide-y divide-border/40">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Activity size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">No logs match your filters</p>
                </div>
              ) : (
                filteredLogs.map(log => {
                  const Icon = log.icon;
                  return (
                    <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                      <div className={`w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 ${log.color}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.actor} · {log.target}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground capitalize">{log.category}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock size={10} /> {log.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerReports;
