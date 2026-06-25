import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, CalendarCheck, BarChart3, Wallet, ShieldCheck,
  LogOut, Menu, X, Moon, Sun, Shield, ChevronDown, Sparkles, ArrowLeftRight,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutoHideHeader } from "@/hooks/useAutoHideHeader";
import StaffOverview from "@/components/staff/StaffOverview";
import StaffUsers from "@/components/staff/StaffUsers";
import StaffProperties from "@/components/staff/StaffProperties";
import StaffBookings from "@/components/staff/StaffBookings";
import StaffReports from "@/components/staff/StaffReports";
import StaffFinance from "@/components/staff/StaffFinance";
import StaffTeam from "@/components/staff/StaffTeam";
import StaffSupport from "@/components/staff/StaffSupport";
import StaffNotificationBell from "@/components/staff/StaffNotificationBell";
import {
  ROLES, ROLE_LIST, STAFF_DIRECTORY, StaffAuthContext, loadIdentity, saveIdentity,
  type Permission, type StaffIdentity,
} from "@/lib/staffRoles";

type NavItem = { key: string; label: string; icon: typeof LayoutDashboard; perm: Permission };

const NAV: NavItem[] = [
  { key: "overview",   label: "Overview",          icon: LayoutDashboard, perm: "overview.view" },
  { key: "users",      label: "Users & Partners",  icon: Users,            perm: "users.view" },
  { key: "properties", label: "Properties",        icon: Building2,        perm: "properties.view" },
  { key: "bookings",   label: "Bookings & Refunds",icon: CalendarCheck,    perm: "bookings.view" },
  { key: "finance",    label: "Finance & Payouts", icon: Wallet,           perm: "finance.view" },
  { key: "support",    label: "Support & Disputes",icon: LifeBuoy,         perm: "support.view" },
  { key: "reports",    label: "Reports & Logs",    icon: BarChart3,        perm: "reports.view" },
  { key: "team",       label: "Staff & Roles",     icon: ShieldCheck,      perm: "team.view" },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [identity, setIdentityState] = useState<StaffIdentity>(() => loadIdentity());
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const headerVisible = useAutoHideHeader();

  const role = ROLES[identity.role];
  const can = (p: Permission) => role.permissions.includes(p);

  const visibleNav = useMemo(() => NAV.filter((n) => can(n.perm)), [role]);


  const setIdentity = (id: StaffIdentity) => {
    saveIdentity(id);
    setIdentityState(id);
    setActiveTab("overview");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const go = (k: string) => {
    setActiveTab(k);
    setMobileOpen(false);
  };

  const render = () => {
    switch (activeTab) {
      case "overview":   return <StaffOverview onNavigate={setActiveTab} />;
      case "users":      return can("users.view")      ? <StaffUsers />      : null;
      case "properties": return can("properties.view") ? <StaffProperties /> : null;
      case "bookings":   return can("bookings.view")   ? <StaffBookings />   : null;
      case "finance":    return can("finance.view")    ? <StaffFinance />    : null;
      case "reports":    return can("reports.view")    ? <StaffReports />    : null;
      case "team":       return can("team.view")       ? <StaffTeam />       : null;
      default: return null;
    }
  };

  const SidebarBody = (
    <>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent via-accent/80 to-accent/40 flex items-center justify-center shadow-sm">
          <Shield size={17} className="text-accent-foreground" />
        </div>
        <div>
          <div className="font-display text-base font-bold leading-tight tracking-tight">
            Stay<span className="text-gradient-gold">Vista</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Staff Console</div>
        </div>
      </div>

      {/* Active role pill */}
      <div className="px-3 pt-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-transparent p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={12} className="text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Signed in as</span>
          </div>
          <div className="text-sm font-semibold truncate">{identity.name}</div>
          <Badge variant="outline" className={`mt-1.5 text-[10px] uppercase ${role.color}`}>{role.label}</Badge>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1">
        {visibleNav.map((n) => {
          const active = activeTab === n.key;
          return (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-accent/10 text-accent shadow-sm ring-1 ring-accent/20"
                  : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <n.icon size={16} className={active ? "text-accent" : ""} />
              <span className="truncate">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">
          {role.permissions.length} permissions
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => navigate("/")}>
          <LogOut size={14} className="mr-2" /> Exit console
        </Button>
      </div>
    </>
  );

  return (
    <StaffAuthContext.Provider value={{ identity, role, setIdentity, can }}>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/40 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 bg-card/70 backdrop-blur border-r border-border flex-col sticky top-0 h-screen">
          {SidebarBody}
        </aside>

        {/* Mobile drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0 flex flex-col [&>button]:hidden">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-end px-4 pt-3">
                <SheetClose asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </SheetClose>
              </div>
              {SidebarBody}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header
            className={`sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border transition-transform duration-300 ${
              headerVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex items-center justify-between px-3 sm:px-6 h-14">
              <div className="flex items-center gap-2 min-w-0">
                <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                  <Menu size={22} />
                </button>
                <Badge variant="outline" className={`text-[10px] uppercase ${role.color}`}>
                  {role.label}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline truncate">
                  / {visibleNav.find((n) => n.key === activeTab)?.label}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {/* Role switcher (demo) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 gap-1.5 hidden sm:inline-flex">
                      <ArrowLeftRight size={14} />
                      <span className="text-xs">Switch role</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>Demo: sign in as</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {STAFF_DIRECTORY.map((id) => {
                      const r = ROLES[id.role];
                      return (
                        <DropdownMenuItem key={id.email} onClick={() => setIdentity(id)} className="flex items-start gap-2 py-2">
                          <Badge variant="outline" className={`text-[9px] uppercase shrink-0 mt-0.5 ${r.color}`}>{r.label}</Badge>
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{id.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{id.email}</div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme} aria-label="Toggle theme">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 px-2 h-9">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground text-[11px] font-bold">
                        {role.initials}
                      </div>
                      <ChevronDown size={14} className="hidden sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>
                      <div className="text-sm font-semibold">{identity.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{identity.email}</div>
                      <Badge variant="outline" className={`mt-1.5 text-[10px] uppercase ${role.color}`}>{role.label}</Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="sm:hidden text-[10px] uppercase text-muted-foreground">Switch role</DropdownMenuLabel>
                    <div className="sm:hidden">
                      {ROLE_LIST.map((r) => {
                        const target = STAFF_DIRECTORY.find((s) => s.role === r.key)!;
                        return (
                          <DropdownMenuItem key={r.key} onClick={() => setIdentity(target)}>
                            <span className="flex-1">{r.label}</span>
                            {r.key === role.key && <Badge variant="outline" className="text-[9px]">Active</Badge>}
                          </DropdownMenuItem>
                        );
                      })}
                      <DropdownMenuSeparator />
                    </div>
                    <DropdownMenuItem asChild><Link to="/">Visit landing site</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/partner-dashboard">Partner dashboard</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => navigate("/")}>
                      <LogOut size={14} className="mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto">
            {render()}
          </main>
        </div>
      </div>
    </StaffAuthContext.Provider>
  );
};

export default StaffDashboard;
