import { useState } from "react";
import { useAutoHideHeader } from "@/hooks/useAutoHideHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Building2, BarChart3, Users,
  Settings, User, LogOut, ChevronDown, Moon, Sun,
  DollarSign, DoorOpen, Heart, Bed, Sparkles, Wrench,
  UtensilsCrossed, Receipt, Shield, UserCog, Menu, X,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose,
} from "@/components/ui/sheet";
import { ROLES, ALL_ROLES, type RoleKey } from "@/lib/roles";

import PartnerOverview from "@/components/partner/PartnerOverview";
import PartnerBookings from "@/components/partner/PartnerBookings";
import PartnerProperties from "@/components/partner/PartnerProperties";
import PartnerTeam from "@/components/partner/PartnerTeam";
import PartnerSettings from "@/components/partner/PartnerSettings";
import PartnerNotifications from "@/components/partner/PartnerNotifications";
import PartnerHelpDropdown from "@/components/partner/PartnerHelpDropdown";
import PartnerReports from "@/components/partner/PartnerReports";
import PartnerProfile from "@/components/partner/PartnerProfile";
import PartnerHelp from "@/components/partner/PartnerHelp";

import RevenueManager from "@/components/partner/roles/RevenueManager";
import Receptionist from "@/components/partner/roles/Receptionist";
import GuestRelations from "@/components/partner/roles/GuestRelations";
import HousekeepingLead from "@/components/partner/roles/HousekeepingLead";
import RoomAttendant from "@/components/partner/roles/RoomAttendant";
import MaintenanceTechnician from "@/components/partner/roles/MaintenanceTechnician";
import FBManager from "@/components/partner/roles/FBManager";
import Accountant from "@/components/partner/roles/Accountant";
import SecurityOfficer from "@/components/partner/roles/SecurityOfficer";

const iconMap: Record<string, React.ElementType> = {
  overview: LayoutDashboard, bookings: CalendarCheck, properties: Building2,
  reports: BarChart3, team: Users, settings: Settings,
  revenue: DollarSign, frontdesk: DoorOpen, guests: Heart,
  housekeeping: Bed, cleaning: Sparkles, maintenance: Wrench,
  fnb: UtensilsCrossed, finance: Receipt, security: Shield,
};

const labelMap: Record<string, string> = {
  overview: "Overview", bookings: "Bookings", properties: "Properties",
  reports: "Reports", team: "Team", settings: "Settings",
  revenue: "Revenue", frontdesk: "Front Desk", guests: "Guests",
  housekeeping: "Housekeeping", cleaning: "My Tasks", maintenance: "Maintenance",
  fnb: "F&B", finance: "Finance", security: "Security",
};

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<RoleKey>("super_admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [roleDialog, setRoleDialog] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerVisible = useAutoHideHeader();

  const role = ROLES[currentRole];
  const navItems = role.navItems.map((key) => ({ key, label: labelMap[key] || key, icon: iconMap[key] || LayoutDashboard }));

  const switchRole = (key: RoleKey) => {
    setCurrentRole(key);
    setActiveTab(ROLES[key].navItems[0]);
    setRoleDialog(false);
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <PartnerOverview onNavigate={setActiveTab} />;
      case "bookings": return <PartnerBookings />;
      case "properties": return <PartnerProperties />;
      case "reports": return <PartnerReports />;
      case "team": return <PartnerTeam />;
      case "settings": return <PartnerSettings />;
      case "profile": return <PartnerProfile />;
      case "help": return <PartnerHelp />;
      case "revenue": return <RevenueManager />;
      case "frontdesk": return <Receptionist />;
      case "guests": return <GuestRelations />;
      case "housekeeping": return <HousekeepingLead />;
      case "cleaning": return <RoomAttendant />;
      case "maintenance": return <MaintenanceTechnician />;
      case "fnb": return <FBManager />;
      case "finance": return <Accountant />;
      case "security": return <SecurityOfficer />;
      default: return <PartnerOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileNavOpen(true)}>
              <Menu size={22} />
            </button>
            <button onClick={() => navigate("/")} className="font-display text-xl font-bold tracking-tight text-foreground">
              Stay<span className="text-gradient-gold">Vista</span>
            </button>
            {/* Role Badge */}
            <button onClick={() => setRoleDialog(true)} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/50 hover:bg-muted transition-colors">
              <UserCog size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{role.shortLabel}</span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>
          </div>

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

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground rounded-xl h-9 w-9" onClick={() => setRoleDialog(true)}>
              <UserCog size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground rounded-xl h-9 w-9" onClick={toggleTheme}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <div className="hidden sm:block">
              <PartnerNotifications currentRole={currentRole} />
            </div>
            <div className="hidden sm:block">
              <PartnerHelpDropdown onNavigateHelp={() => setActiveTab("help")} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 sm:gap-2.5 ml-1 sm:ml-2 px-1.5 sm:px-2.5 py-1.5 rounded-xl hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-border">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white font-bold text-[10px] sm:text-xs`}>{role.initials}</div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground leading-none">John Doe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{role.shortLabel}</p>
                  </div>
                  <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
                <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white font-bold text-sm`}>{role.initials}</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">{role.label}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Mobile-only items */}
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 sm:hidden" onClick={toggleTheme}>
                  {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5" onClick={() => setActiveTab("profile")}><User size={16} /> Profile</DropdownMenuItem>
                {role.navItems.includes("settings") && (
                  <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5" onClick={() => setActiveTab("settings")}><Settings size={16} /> Account Settings</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5" onClick={() => setRoleDialog(true)}><UserCog size={16} /> Switch Role</DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2.5 text-destructive focus:text-destructive"><LogOut size={16} /> Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col [&>button]:hidden">
          <SheetHeader className="flex flex-row items-center justify-between border-b border-border/50 px-5 py-4">
            <SheetTitle className="font-display text-lg font-bold">
              Stay<span className="text-gradient-gold">Vista</span>
            </SheetTitle>
            <SheetClose asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </SheetClose>
          </SheetHeader>

          {/* Role indicator */}
          <div className="px-4 py-3 border-b border-border/30">
            <button
              onClick={() => { setRoleDialog(true); setMobileNavOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                {role.initials}
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{role.shortLabel}</p>
                <p className="text-xs text-muted-foreground">Switch role</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </div>

          {/* Nav items */}
          <div className="flex flex-col gap-0.5 px-3 py-3 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setMobileNavOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === item.key
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="border-t border-border/50 p-4 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => { setActiveTab("profile"); setMobileNavOpen(false); }}
            >
              <User size={16} /> Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={() => navigate("/")}
            >
              <LogOut size={16} /> Log Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        {renderContent()}
      </main>

      {/* Role Switcher Dialog */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent className="rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserCog size={20} /> Switch Role</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {ALL_ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => switchRole(r.key)}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                  currentRole === r.key
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/50 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {r.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
                  {currentRole === r.key && <Badge className="mt-1.5 text-[10px]">Active</Badge>}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerDashboard;
