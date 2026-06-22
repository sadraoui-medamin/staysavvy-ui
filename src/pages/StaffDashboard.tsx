import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2, CalendarCheck, BarChart3,
  LogOut, Menu, X, Moon, Sun, Shield, ChevronDown,
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

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "users", label: "Users & Partners", icon: Users },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "bookings", label: "Bookings & Refunds", icon: CalendarCheck },
  { key: "reports", label: "Reports & Logs", icon: BarChart3 },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const headerVisible = useAutoHideHeader();

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
      case "overview": return <StaffOverview onNavigate={setActiveTab} />;
      case "users": return <StaffUsers />;
      case "properties": return <StaffProperties />;
      case "bookings": return <StaffBookings />;
      case "reports": return <StaffReports />;
      default: return null;
    }
  };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
          <Shield size={16} className="text-accent-foreground" />
        </div>
        <div>
          <div className="font-display text-base font-bold leading-tight">
            Stay<span className="text-gradient-gold">Vista</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Staff Console</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-3 flex-1">
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => go(n.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === n.key
                ? "bg-accent/10 text-accent"
                : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <n.icon size={16} />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-border/50 p-3">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => navigate("/")}>
          <LogOut size={14} className="mr-2" /> Exit console
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col sticky top-0 h-screen">
        {SidebarContent}
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
            {SidebarContent}
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
              <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)}>
                <Menu size={22} />
              </button>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-[10px] uppercase">
                Super Admin
              </Badge>
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline truncate">
                / {NAV.find((n) => n.key === activeTab)?.label}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 px-2 h-9">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground text-xs font-bold">
                      SA
                    </div>
                    <ChevronDown size={14} className="hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold">Alex Reyes</div>
                    <div className="text-xs text-muted-foreground font-normal">admin@stayvista.com</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">Visit landing site</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/partner-dashboard">Partner dashboard</Link>
                  </DropdownMenuItem>
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
  );
};

export default StaffDashboard;
