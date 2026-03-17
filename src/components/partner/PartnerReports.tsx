import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area,
} from "recharts";
import { DollarSign, CalendarCheck, Users, Building2 } from "lucide-react";

const revenueData = [
  { month: "Jul", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Aug", revenue: 58000, expenses: 32000, profit: 26000 },
  { month: "Sep", revenue: 51000, expenses: 30000, profit: 21000 },
  { month: "Oct", revenue: 63000, expenses: 35000, profit: 28000 },
  { month: "Nov", revenue: 72000, expenses: 38000, profit: 34000 },
  { month: "Dec", revenue: 89000, expenses: 42000, profit: 47000 },
  { month: "Jan", revenue: 54000, expenses: 31000, profit: 23000 },
  { month: "Feb", revenue: 68000, expenses: 36000, profit: 32000 },
  { month: "Mar", revenue: 86000, expenses: 40000, profit: 46000 },
];

const bookingAnalytics = [
  { week: "W1", directBookings: 45, ota: 32, corporate: 18, walkIn: 8 },
  { week: "W2", directBookings: 52, ota: 28, corporate: 22, walkIn: 12 },
  { week: "W3", directBookings: 38, ota: 35, corporate: 15, walkIn: 6 },
  { week: "W4", directBookings: 61, ota: 30, corporate: 25, walkIn: 10 },
  { week: "W5", directBookings: 55, ota: 27, corporate: 20, walkIn: 14 },
  { week: "W6", directBookings: 48, ota: 33, corporate: 19, walkIn: 9 },
  { week: "W7", directBookings: 67, ota: 25, corporate: 28, walkIn: 11 },
  { week: "W8", directBookings: 58, ota: 31, corporate: 24, walkIn: 7 },
];

const guestDemographics = [
  { name: "Business", value: 35, color: "hsl(var(--primary))" },
  { name: "Leisure", value: 28, color: "hsl(var(--accent))" },
  { name: "Family", value: 20, color: "hsl(220 35% 35%)" },
  { name: "Couples", value: 12, color: "hsl(38 80% 70%)" },
  { name: "Solo", value: 5, color: "hsl(220 10% 60%)" },
];

const occupancyByProperty = [
  { month: "Oct", grandHotel: 82, seaside: 68, mountain: 88, cityCenter: 42 },
  { month: "Nov", grandHotel: 85, seaside: 72, mountain: 91, cityCenter: 48 },
  { month: "Dec", grandHotel: 92, seaside: 78, mountain: 95, cityCenter: 55 },
  { month: "Jan", grandHotel: 78, seaside: 60, mountain: 85, cityCenter: 40 },
  { month: "Feb", grandHotel: 84, seaside: 70, mountain: 90, cityCenter: 46 },
  { month: "Mar", grandHotel: 87, seaside: 74, mountain: 92, cityCenter: 45 },
];

const tabs = [
  { key: "revenue", label: "Revenue Trends", icon: DollarSign },
  { key: "bookings", label: "Booking Analytics", icon: CalendarCheck },
  { key: "demographics", label: "Guest Demographics", icon: Users },
  { key: "occupancy", label: "Occupancy Rates", icon: Building2 },
] as const;

type ReportTab = (typeof tabs)[number]["key"];

const PartnerReports = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm">Analyze your performance metrics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === t.key
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Revenue Trends */}
      {activeTab === "revenue" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", value: "$583,000", change: "+18%" },
              { label: "Total Expenses", value: "$312,000", change: "+8%" },
              { label: "Net Profit", value: "$271,000", change: "+32%" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <span className="text-xs font-semibold text-accent">{s.change} vs last period</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Revenue vs Expenses vs Profit</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
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
        </div>
      )}

      {/* Booking Analytics */}
      {activeTab === "bookings" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Direct Bookings", value: "424", pct: "41%" },
              { label: "OTA Bookings", value: "241", pct: "23%" },
              { label: "Corporate", value: "171", pct: "17%" },
              { label: "Walk-ins", value: "77", pct: "7%" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <span className="text-xs text-muted-foreground">{s.pct} of total</span>
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
              { label: "Grand Hotel Paris", value: "87%", color: "text-accent" },
              { label: "Seaside Resort", value: "74%", color: "text-primary" },
              { label: "Mountain Lodge", value: "92%", color: "text-accent" },
              { label: "City Center Inn", value: "45%", color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                <span className="text-xs text-muted-foreground">Current</span>
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
    </div>
  );
};

export default PartnerReports;
