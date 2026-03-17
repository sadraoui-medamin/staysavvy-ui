import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, Lock, Eye, EyeOff, Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PartnerProfile = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"profile" | "password">("profile");

  // Profile state
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john@hotel.com");
  const [phone, setPhone] = useState("+33 6 12 34 56 78");
  const [company, setCompany] = useState("StayVista Hotels");
  const [jobTitle, setJobTitle] = useState("Hotel Manager");
  const [bio, setBio] = useState("Experienced hotel manager with 10+ years in the hospitality industry.");
  const [website, setWebsite] = useState("https://stayvista.com");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const saveProfile = () => {
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const changePassword = () => {
    if (!currentPassword) {
      toast({ title: "Error", description: "Please enter your current password.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const sections = [
    { key: "profile" as const, label: "Profile Info", icon: User },
    { key: "password" as const, label: "Password & Security", icon: Lock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your personal information and security</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeSection === s.key
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <s.icon size={16} />
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "profile" && (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-gold-light flex items-center justify-center text-accent-foreground font-bold text-2xl">
                  JD
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-sm hover:bg-foreground/90 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Upload a new photo</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs">Upload</Button>
                  <Button variant="ghost" size="sm" className="rounded-lg text-xs text-destructive">Remove</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">First Name</label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Last Name</label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Email</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Company</label>
                <Input value={company} onChange={e => setCompany(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Job Title</label>
                <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Website</label>
                <Input value={website} onChange={e => setWebsite(e.target.value)} className="h-10 bg-muted/30 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveProfile} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl px-6 gap-2">
              <Save size={16} /> Save Profile
            </Button>
          </div>
        </div>
      )}

      {activeSection === "password" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Lock size={18} className="text-accent" /> Change Password
            </h2>
            <div className="max-w-md space-y-5">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="h-10 bg-muted/30 rounded-xl pr-10"
                  />
                  <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="h-10 bg-muted/30 rounded-xl pr-10"
                  />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    {[
                      { label: "At least 8 characters", met: newPassword.length >= 8 },
                      { label: "Contains uppercase", met: /[A-Z]/.test(newPassword) },
                      { label: "Contains number", met: /[0-9]/.test(newPassword) },
                      { label: "Contains special character", met: /[^A-Za-z0-9]/.test(newPassword) },
                    ].map(r => (
                      <p key={r.label} className={`text-xs flex items-center gap-1.5 ${r.met ? "text-accent" : "text-muted-foreground"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.met ? "bg-accent" : "bg-muted-foreground"}`} />
                        {r.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="h-10 bg-muted/30 rounded-xl pr-10"
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                )}
              </div>
              <Button onClick={changePassword} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl px-6 gap-2">
                <Lock size={16} /> Update Password
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5 flex items-center gap-2">
              <Shield size={18} className="text-accent" /> Security Sessions
            </h2>
            <div className="space-y-3">
              {[
                { device: "Chrome on Windows", location: "Paris, France", time: "Active now", current: true },
                { device: "Safari on iPhone", location: "Nice, France", time: "2 hours ago", current: false },
                { device: "Firefox on macOS", location: "Lyon, France", time: "3 days ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.device}</p>
                    <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                  </div>
                  {s.current ? (
                    <span className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20 font-medium">Current</span>
                  ) : (
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs text-destructive hover:text-destructive">Revoke</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerProfile;
