import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Building2, BarChart3, Users,
  Settings, User, LogOut, ChevronDown, Moon, Sun, MessageSquare,
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
import PartnerReports from "@/components/partner/PartnerReports";
import PartnerProfile from "@/components/partner/PartnerProfile";
import PartnerChat from "@/components/partner/PartnerChat";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "team", label: "Team", icon: Users },
  { key: "chat", label: "Chat", icon: MessageSquare },
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
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5" onClick={() => setActiveTab("profile")}><User size={16} /> Profile</DropdownMenuItem>
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
        {activeTab === "reports" && <PartnerReports />}
        {activeTab === "team" && <PartnerTeam />}
        {activeTab === "chat" && <PartnerChat />}
        {activeTab === "settings" && <PartnerSettings />}
        {activeTab === "profile" && <PartnerProfile />}
      </main>
    </div>
  );
};

export default PartnerDashboard;
