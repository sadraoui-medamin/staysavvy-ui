import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Building2, BarChart3, Users,
  Settings, User, LogOut, ChevronDown, Moon, Sun, ArrowUpRight,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PartnerOverview from "@/components/partner/PartnerOverview";
import PartnerBookings from "@/components/partner/PartnerBookings";
import PartnerProperties from "@/components/partner/PartnerProperties";
import PartnerTeam from "@/components/partner/PartnerTeam";
import PartnerSettings from "@/components/partner/PartnerSettings";
import PartnerNotifications from "@/components/partner/PartnerNotifications";
import PartnerHelpDropdown from "@/components/partner/PartnerHelpDropdown";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "team", label: "Team", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

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
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <button onClick={() => navigate("/")} className="font-display text-xl font-bold tracking-tight text-foreground">
            Stay<span className="text-gradient-gold">Vista</span>
          </button>
          <nav className="hidden lg:flex items-center bg-muted/50 rounded-xl p-1 gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl" onClick={toggleTheme}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <PartnerNotifications />
            <PartnerHelpDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 ml-2 px-2.5 py-1.5 rounded-xl hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-border">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-xs">JD</div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground leading-none">John Doe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Partner</p>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
                <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-sm">JD</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@hotel.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5"><User size={16} /> Profile</DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5" onClick={() => setActiveTab("settings")}><Settings size={16} /> Account Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5"><Building2 size={16} /> Switch Account</DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 text-destructive focus:text-destructive"><LogOut size={16} /> Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="lg:hidden flex overflow-x-auto px-4 pb-2.5 gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === item.key ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted/60"
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
        {activeTab === "overview" && <PartnerOverview onNavigate={setActiveTab} />}
        {activeTab === "bookings" && <PartnerBookings />}
        {activeTab === "properties" && <PartnerProperties />}
        {activeTab === "team" && <PartnerTeam />}
        {activeTab === "settings" && <PartnerSettings />}

        {/* Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6 animate-fade-in">
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
      </main>
    </div>
  );
};

export default PartnerDashboard;
