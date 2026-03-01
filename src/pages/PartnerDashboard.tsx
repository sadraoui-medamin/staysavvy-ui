import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Building2, BarChart3, Users, Bell,
  HelpCircle, Settings, User, LogOut, ChevronDown, TrendingUp,
  DollarSign, Eye, Star, Plus, Search, Filter, Moon, Sun, ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "team", label: "Team", icon: Users },
];

const stats = [
  { label: "Total Bookings", value: "1,284", change: "+12%", icon: CalendarCheck, gradient: "from-accent/20 to-accent/5" },
  { label: "Revenue", value: "$86,420", change: "+8.5%", icon: DollarSign, gradient: "from-primary/20 to-primary/5" },
  { label: "Page Views", value: "23,891", change: "+22%", icon: Eye, gradient: "from-accent/15 to-accent/5" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star, gradient: "from-primary/15 to-primary/5" },
];

const bookings = [
  { id: "BK-001", guest: "Alice Martin", hotel: "Grand Hotel Paris", checkIn: "2026-03-05", checkOut: "2026-03-08", status: "Confirmed", amount: "$540" },
  { id: "BK-002", guest: "Robert Chen", hotel: "Grand Hotel Paris", checkIn: "2026-03-10", checkOut: "2026-03-14", status: "Pending", amount: "$980" },
  { id: "BK-003", guest: "Sarah Johnson", hotel: "Seaside Resort", checkIn: "2026-03-12", checkOut: "2026-03-15", status: "Confirmed", amount: "$720" },
  { id: "BK-004", guest: "James Wilson", hotel: "Mountain Lodge", checkIn: "2026-02-20", checkOut: "2026-02-23", status: "Completed", amount: "$450" },
  { id: "BK-005", guest: "Emma Davis", hotel: "Grand Hotel Paris", checkIn: "2026-02-15", checkOut: "2026-02-18", status: "Cancelled", amount: "$660" },
];

const properties = [
  { name: "Grand Hotel Paris", location: "Paris, France", rooms: 120, rating: 4.8, bookings: 342, status: "Active", occupancy: 87 },
  { name: "Seaside Resort", location: "Nice, France", rooms: 85, rating: 4.6, bookings: 218, status: "Active", occupancy: 74 },
  { name: "Mountain Lodge", location: "Chamonix, France", rooms: 45, rating: 4.9, bookings: 156, status: "Active", occupancy: 92 },
];

const teamMembers = [
  { name: "Marie Dupont", email: "marie@hotel.com", role: "Manager", status: "Active", avatar: "MD" },
  { name: "Pierre Laurent", email: "pierre@hotel.com", role: "Receptionist", status: "Active", avatar: "PL" },
  { name: "Sophie Bernard", email: "sophie@hotel.com", role: "Revenue Manager", status: "Active", avatar: "SB" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Confirmed": return "bg-accent/10 text-accent border border-accent/20";
    case "Pending": return "bg-muted text-muted-foreground border border-border";
    case "Completed": return "bg-primary/10 text-primary border border-primary/20";
    case "Cancelled": return "bg-destructive/10 text-destructive border border-destructive/20";
    case "Active": return "bg-accent/10 text-accent border border-accent/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Top Navbar — glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="font-display text-xl font-bold tracking-tight text-foreground">
            Stay<span className="text-gradient-gold">Vista</span>
          </button>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center bg-muted/50 rounded-xl p-1 gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-xl"
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-card" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
              <HelpCircle size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
              <Settings size={18} />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 ml-2 px-2.5 py-1.5 rounded-xl hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-border">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-xs">
                    JD
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground leading-none">John Doe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Partner</p>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
                <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@hotel.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5">
                  <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5">
                  <Settings size={16} /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5">
                  <Building2 size={16} /> Switch Account
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 text-destructive focus:text-destructive">
                  <LogOut size={16} /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex overflow-x-auto px-4 pb-2.5 gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Welcome back,</p>
                <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">Last updated: Mar 1, 2026</p>
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

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <h2 className="font-display font-bold text-foreground text-lg">Recent Bookings</h2>
                <Button variant="ghost" size="sm" className="text-accent gap-1 hover:bg-accent/10 rounded-lg" onClick={() => setActiveTab("bookings")}>
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
                    {bookings.slice(0, 3).map((b) => (
                      <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                        <td className="px-5 py-4 font-medium text-foreground">{b.guest}</td>
                        <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{b.hotel}</td>
                        <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{b.checkIn}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-foreground">{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Properties */}
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <h2 className="font-display font-bold text-foreground text-lg">Your Properties</h2>
                <Button variant="ghost" size="sm" className="text-accent gap-1 hover:bg-accent/10 rounded-lg" onClick={() => setActiveTab("properties")}>
                  Manage <ArrowUpRight size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
                {properties.map((p) => (
                  <div key={p.name} className="rounded-xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
                    </div>
                    {/* Occupancy bar */}
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
        )}

        {/* Manage Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
                <p className="text-muted-foreground text-sm">View and manage all guest reservations</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input className="pl-9 w-56 rounded-xl bg-muted/30 border-border/50" placeholder="Search bookings..." />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl border-border/50"><Filter size={16} /></Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Guest</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Check-in</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Check-out</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                      <td className="px-5 py-4 font-medium text-foreground">{b.guest}</td>
                      <td className="px-5 py-4 text-muted-foreground">{b.hotel}</td>
                      <td className="px-5 py-4 text-muted-foreground">{b.checkIn}</td>
                      <td className="px-5 py-4 text-muted-foreground">{b.checkOut}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-foreground">{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotels & Properties */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Properties</h1>
                <p className="text-muted-foreground text-sm">Manage your listed properties</p>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm">
                <Plus size={16} /> Add Property
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((p) => (
                <div key={p.name} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg group-hover:text-accent transition-colors">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.location}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
                  </div>
                  {/* Occupancy bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-semibold text-foreground">{p.occupancy}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-gold-light rounded-full transition-all duration-500" style={{ width: `${p.occupancy}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{p.rooms}</p>
                      <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground flex items-center justify-center gap-0.5">
                        <Star size={13} className="text-accent" />{p.rating}
                      </p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{p.bookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg">Edit</Button>
                    <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-gold-light rounded-lg">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground text-sm">Analyze your performance metrics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Revenue Report", desc: "Monthly and yearly revenue breakdown", icon: DollarSign },
                { title: "Booking Analytics", desc: "Booking trends, sources, and conversion rates", icon: BarChart3 },
                { title: "Guest Demographics", desc: "Understand your guest profiles and preferences", icon: Users },
                { title: "Occupancy Rates", desc: "Room occupancy by property and time period", icon: Building2 },
              ].map((r) => (
                <div key={r.title} className="bg-card rounded-2xl border border-border/50 p-6 flex items-start gap-5 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shrink-0 group-hover:from-accent/30 transition-all">
                    <r.icon size={22} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors mt-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Team */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Team</h1>
                <p className="text-muted-foreground text-sm">Invite and manage team members</p>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm">
                <Plus size={16} /> Invite Member
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamMembers.map((m) => (
                <div key={m.email} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-sm text-foreground">
                      {m.avatar}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="rounded-lg">Edit Role</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.email}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">{m.role}</span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PartnerDashboard;
