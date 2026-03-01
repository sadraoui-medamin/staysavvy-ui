import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Building2, BarChart3, Users, Bell,
  HelpCircle, Settings, User, LogOut, ChevronDown, TrendingUp,
  DollarSign, Eye, Star, Plus, Search, Filter,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Manage Bookings", icon: CalendarCheck },
  { key: "properties", label: "Hotels & Properties", icon: Building2 },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "team", label: "Manage Team", icon: Users },
];

const stats = [
  { label: "Total Bookings", value: "1,284", change: "+12%", icon: CalendarCheck, color: "bg-accent/10 text-accent" },
  { label: "Revenue", value: "$86,420", change: "+8.5%", icon: DollarSign, color: "bg-accent/10 text-accent" },
  { label: "Page Views", value: "23,891", change: "+22%", icon: Eye, color: "bg-accent/10 text-accent" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star, color: "bg-accent/10 text-accent" },
];

const bookings = [
  { id: "BK-001", guest: "Alice Martin", hotel: "Grand Hotel Paris", checkIn: "2026-03-05", checkOut: "2026-03-08", status: "Confirmed", amount: "$540" },
  { id: "BK-002", guest: "Robert Chen", hotel: "Grand Hotel Paris", checkIn: "2026-03-10", checkOut: "2026-03-14", status: "Pending", amount: "$980" },
  { id: "BK-003", guest: "Sarah Johnson", hotel: "Seaside Resort", checkIn: "2026-03-12", checkOut: "2026-03-15", status: "Confirmed", amount: "$720" },
  { id: "BK-004", guest: "James Wilson", hotel: "Mountain Lodge", checkIn: "2026-02-20", checkOut: "2026-02-23", status: "Completed", amount: "$450" },
  { id: "BK-005", guest: "Emma Davis", hotel: "Grand Hotel Paris", checkIn: "2026-02-15", checkOut: "2026-02-18", status: "Cancelled", amount: "$660" },
];

const properties = [
  { name: "Grand Hotel Paris", location: "Paris, France", rooms: 120, rating: 4.8, bookings: 342, status: "Active" },
  { name: "Seaside Resort", location: "Nice, France", rooms: 85, rating: 4.6, bookings: 218, status: "Active" },
  { name: "Mountain Lodge", location: "Chamonix, France", rooms: 45, rating: 4.9, bookings: 156, status: "Active" },
];

const teamMembers = [
  { name: "Marie Dupont", email: "marie@hotel.com", role: "Manager", status: "Active" },
  { name: "Pierre Laurent", email: "pierre@hotel.com", role: "Receptionist", status: "Active" },
  { name: "Sophie Bernard", email: "sophie@hotel.com", role: "Revenue Manager", status: "Active" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Confirmed": return "bg-accent/10 text-accent";
    case "Pending": return "bg-muted text-muted-foreground";
    case "Completed": return "bg-primary/10 text-primary";
    case "Cancelled": return "bg-destructive/10 text-destructive";
    case "Active": return "bg-accent/10 text-accent";
    default: return "bg-muted text-muted-foreground";
  }
};

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="font-display text-xl font-bold tracking-tight text-primary-foreground">
            Stay<span className="text-accent">Find</span>
          </button>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.key
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <HelpCircle size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Settings size={18} />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 ml-2 px-2 py-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-sm">
                    U
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-primary-foreground leading-none">User</p>
                    <p className="text-xs text-primary-foreground/50">user@example.com</p>
                  </div>
                  <ChevronDown size={14} className="text-primary-foreground/50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold">
                    U
                  </div>
                  <div>
                    <p className="font-medium text-foreground">User</p>
                    <p className="text-xs text-muted-foreground">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings size={16} /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Building2 size={16} /> Switch Account
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut size={16} /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === item.key
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/10"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground text-sm">Welcome back! Here's your property performance summary.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card rounded-xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-accent">
                      <TrendingUp size={12} /> {s.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings Preview */}
            <div className="bg-card rounded-xl shadow-card">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display font-bold text-foreground">Recent Bookings</h2>
                <Button variant="ghost" size="sm" className="text-accent" onClick={() => setActiveTab("bookings")}>View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Guest</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Hotel</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Check-in</th>
                      <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-right px-5 py-3 font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 3).map((b) => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground">{b.id}</td>
                        <td className="px-5 py-3 text-foreground">{b.guest}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{b.hotel}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{b.checkIn}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-foreground">{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Properties Quick View */}
            <div className="bg-card rounded-xl shadow-card">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-display font-bold text-foreground">Your Properties</h2>
                <Button variant="ghost" size="sm" className="text-accent" onClick={() => setActiveTab("properties")}>Manage</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
                {properties.map((p) => (
                  <div key={p.name} className="rounded-xl border border-border p-4 hover:shadow-card-hover transition-shadow">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{p.location}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{p.rooms} rooms</span>
                      <span className="flex items-center gap-0.5"><Star size={12} className="text-accent" />{p.rating}</span>
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
                <h1 className="text-2xl font-display font-bold text-foreground">Manage Bookings</h1>
                <p className="text-muted-foreground text-sm">View and manage all guest reservations</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input className="pl-9 w-52" placeholder="Search bookings..." />
                </div>
                <Button variant="outline" size="icon"><Filter size={16} /></Button>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Guest</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Hotel</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Check-in</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Check-out</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{b.id}</td>
                      <td className="px-5 py-3 text-foreground">{b.guest}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.hotel}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.checkIn}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.checkOut}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-foreground">{b.amount}</td>
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
                <h1 className="text-2xl font-display font-bold text-foreground">Hotels & Properties</h1>
                <p className="text-muted-foreground text-sm">Manage your listed properties</p>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1">
                <Plus size={16} /> Add Property
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((p) => (
                <div key={p.name} className="bg-card rounded-xl shadow-card p-6 hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.location}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{p.rooms}</p>
                      <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground flex items-center justify-center gap-0.5">
                        <Star size={14} className="text-accent" />{p.rating}
                      </p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{p.bookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button size="sm" className="flex-1 bg-accent text-accent-foreground hover:bg-gold-light">View</Button>
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
              <h1 className="text-2xl font-display font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground text-sm">Analyze your performance metrics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Revenue Report", desc: "Monthly and yearly revenue breakdown", icon: DollarSign },
                { title: "Booking Analytics", desc: "Booking trends, sources, and conversion rates", icon: BarChart3 },
                { title: "Guest Demographics", desc: "Understand your guest profiles and preferences", icon: Users },
                { title: "Occupancy Rates", desc: "Room occupancy by property and time period", icon: Building2 },
              ].map((r) => (
                <div key={r.title} className="bg-card rounded-xl shadow-card p-6 flex items-start gap-4 hover-lift cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <r.icon size={22} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
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
                <h1 className="text-2xl font-display font-bold text-foreground">Manage Team</h1>
                <p className="text-muted-foreground text-sm">Invite and manage team members</p>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1">
                <Plus size={16} /> Invite Member
              </Button>
            </div>
            <div className="bg-card rounded-xl shadow-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.email} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{m.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                      <td className="px-5 py-3 text-foreground">{m.role}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PartnerDashboard;
