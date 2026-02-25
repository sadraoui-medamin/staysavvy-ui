import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
            <Link to="/" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link>
            <Link to="/search" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Explore</Link>
            <Link to="/dashboard" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">My Trips</Link>
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
          <button className="md:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-primary border-t border-primary-foreground/10 animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/" className="text-primary-foreground py-2" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/search" className="text-primary-foreground py-2" onClick={() => setMobileOpen(false)}>Explore</Link>
              <Link to="/dashboard" className="text-primary-foreground py-2" onClick={() => setMobileOpen(false)}>My Trips</Link>
              <hr className="border-primary-foreground/10" />
              <Button variant="ghost" className="text-primary-foreground justify-start hover:bg-primary-foreground/10" onClick={() => { setAuthModal("login"); setMobileOpen(false); }}>Log In</Button>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light" onClick={() => { setAuthModal("signup"); setMobileOpen(false); }}>Sign Up</Button>
            </div>
          </div>
        )}
      </nav>

      <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={(m) => setAuthModal(m)} />
    </>
  );
}
