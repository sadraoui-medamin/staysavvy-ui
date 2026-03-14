import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings, Globe, Shield, Clock, Bell, BellOff, FileText,
  CreditCard, ChevronRight, Check, User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PartnerBilling from "./PartnerBilling";

type SettingsTab = "general" | "notifications" | "licensing" | "billing";

const tabs = [
  { key: "general" as const, label: "General Settings", icon: Settings },
  { key: "notifications" as const, label: "Notification Settings", icon: Bell },
  { key: "licensing" as const, label: "Licensing", icon: FileText },
  { key: "billing" as const, label: "Billing", icon: CreditCard },
];

const languages = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Arabic", "Japanese", "Chinese"];
const timezones = ["UTC", "UTC+1 (CET)", "UTC+2 (EET)", "UTC-5 (EST)", "UTC-8 (PST)", "UTC+9 (JST)", "UTC+5:30 (IST)"];

const PartnerSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const { toast } = useToast();

  // General settings state
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC+1 (CET)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("EUR");
  const [twoFactor, setTwoFactor] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("Public");

  // Notification settings state
  const [emailBooking, setEmailBooking] = useState(true);
  const [emailPayment, setEmailPayment] = useState(true);
  const [emailReview, setEmailReview] = useState(true);
  const [emailTeam, setEmailTeam] = useState(false);
  const [pushBooking, setPushBooking] = useState(true);
  const [pushPayment, setPushPayment] = useState(true);
  const [pushReview, setPushReview] = useState(false);
  const [pushTeam, setPushTeam] = useState(false);
  const [digestFrequency, setDigestFrequency] = useState("daily");

  const saveSettings = () => {
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences and configurations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === t.key
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Globe size={18} className="text-accent" /> Language & Region
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Time Zone</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
                  {timezones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Date Format</label>
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Shield size={18} className="text-accent" /> Privacy & Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-11 h-6 rounded-full transition-all duration-200 ${twoFactor ? "bg-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform duration-200 ${twoFactor ? "translate-x-5.5 ml-[22px]" : "translate-x-0.5 ml-[2px]"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Visibility</p>
                  <p className="text-xs text-muted-foreground">Who can see your partner profile</p>
                </div>
                <select value={profileVisibility} onChange={e => setProfileVisibility(e.target.value)} className="h-9 px-3 rounded-lg border border-border bg-card text-foreground text-sm">
                  <option value="Public">Public</option>
                  <option value="Partners Only">Partners Only</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Data Export</p>
                  <p className="text-xs text-muted-foreground">Download all your account data</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Export Data</Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSettings} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl px-6">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Email Notifications</h2>
            {[
              { label: "Booking Updates", desc: "New bookings, cancellations, and modifications", value: emailBooking, set: setEmailBooking },
              { label: "Payment Alerts", desc: "Payment received, payout processed", value: emailPayment, set: setEmailPayment },
              { label: "Guest Reviews", desc: "New reviews and rating changes", value: emailReview, set: setEmailReview },
              { label: "Team Activity", desc: "Member invites and role changes", value: emailTeam, set: setEmailTeam },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button
                  onClick={() => n.set(!n.value)}
                  className={`w-11 h-6 rounded-full transition-all duration-200 ${n.value ? "bg-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform duration-200 ${n.value ? "ml-[22px]" : "ml-[2px]"}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Push Notifications</h2>
            {[
              { label: "Booking Updates", value: pushBooking, set: setPushBooking },
              { label: "Payment Alerts", value: pushPayment, set: setPushPayment },
              { label: "Guest Reviews", value: pushReview, set: setPushReview },
              { label: "Team Activity", value: pushTeam, set: setPushTeam },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <button
                  onClick={() => n.set(!n.value)}
                  className={`w-11 h-6 rounded-full transition-all duration-200 ${n.value ? "bg-accent" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-card shadow-sm transition-transform duration-200 ${n.value ? "ml-[22px]" : "ml-[2px]"}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Email Digest</h2>
            <div className="flex gap-3">
              {["realtime", "daily", "weekly", "never"].map(f => (
                <button
                  key={f}
                  onClick={() => setDigestFrequency(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    digestFrequency === f ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "realtime" ? "Real-time" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSettings} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl px-6">
              Save Notification Settings
            </Button>
          </div>
        </div>
      )}

      {/* Licensing */}
      {activeTab === "licensing" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <FileText size={18} className="text-accent" /> Current License
            </h2>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-2xl font-bold text-foreground">Professional</p>
                </div>
                <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full border border-accent/20">Active</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-accent/20">
                <div><p className="text-xs text-muted-foreground">Properties</p><p className="font-bold text-foreground">Up to 10</p></div>
                <div><p className="text-xs text-muted-foreground">Team Members</p><p className="font-bold text-foreground">Up to 25</p></div>
                <div><p className="text-xs text-muted-foreground">API Access</p><p className="font-bold text-foreground">Full</p></div>
                <div><p className="text-xs text-muted-foreground">Support</p><p className="font-bold text-foreground">Priority</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">License Key</h2>
            <div className="flex gap-3">
              <Input value="SVPRO-XXXX-XXXX-XXXX-1234" readOnly className="h-10 bg-muted/30 rounded-xl font-mono text-sm flex-1" />
              <Button variant="outline" className="rounded-xl" onClick={() => {
                navigator.clipboard.writeText("SVPRO-XXXX-XXXX-XXXX-1234");
                toast({ title: "Copied", description: "License key copied to clipboard." });
              }}>Copy</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">License History</h2>
            <div className="space-y-3">
              {[
                { date: "Mar 1, 2026", action: "License renewed", plan: "Professional" },
                { date: "Mar 1, 2025", action: "Upgraded from Starter", plan: "Professional" },
                { date: "Jun 15, 2024", action: "Initial activation", plan: "Starter" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Check size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.action}</p>
                      <p className="text-xs text-muted-foreground">{h.date}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-md text-muted-foreground font-medium">{h.plan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === "billing" && <PartnerBilling />}
    </div>
  );
};

export default PartnerSettings;
