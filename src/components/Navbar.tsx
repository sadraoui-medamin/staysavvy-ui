import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose,
} from "@/components/ui/drawer";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Explore" },
  { to: "/dashboard", label: "My Trips" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMobile = useIsMobile();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-primary/80 backdrop-blur-md" : "bg-primary shadow-elevated"}`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary-foreground tracking-tight">
              Stay<span className="text-gold">Vista</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">{l.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setAuthModal("login")}>
              Log In
            </Button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold" onClick={() => setAuthModal("signup")}>
              Sign Up
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-primary-foreground" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="right">
        <DrawerContent className="h-full w-[280px] ml-auto rounded-none rounded-l-2xl fixed right-0 top-0 bottom-0 inset-x-auto">
          <DrawerHeader className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <DrawerTitle className="font-display text-lg font-bold">
              Stay<span className="text-gradient-gold">Vista</span>
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto border-t border-border/50 p-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-center" onClick={() => { setAuthModal("login"); setMobileOpen(false); }}>
              Log In
            </Button>
            <Button className="w-full justify-center bg-accent text-accent-foreground hover:bg-gold-light" onClick={() => { setAuthModal("signup"); setMobileOpen(false); }}>
              Sign Up
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={(m) => setAuthModal(m)} />
    </>
  );
}
