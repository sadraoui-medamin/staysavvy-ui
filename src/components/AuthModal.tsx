import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
  mode: "login" | "signup" | null;
  onClose: () => void;
  onSwitch: (mode: "login" | "signup") => void;
}

export function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!mode) return null;

  const isLogin = mode === "login";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-xl shadow-elevated w-full max-w-md p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {isLogin ? "Sign in to access your bookings" : "Join StayVista for exclusive deals"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Full Name" className="pl-10 h-12 bg-muted/50 border-border" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input type="email" placeholder="Email Address" className="pl-10 h-12 bg-muted/50 border-border" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 h-12 bg-muted/50 border-border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button className="text-sm text-accent hover:underline">Forgot password?</button>
            </div>
          )}

          <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-base">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-accent font-semibold hover:underline"
            onClick={() => onSwitch(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
