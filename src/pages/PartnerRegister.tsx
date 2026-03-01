import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Building2, MapPin, Mail, Phone, User, Globe, ChevronRight, CheckCircle2,
  Check, X, Sparkles,
} from "lucide-react";

const plans = [
  { name: "Starter", price: "Free", period: "", desc: "Get started with the basics", highlight: false },
  { name: "Professional", price: "$49", period: "/mo", desc: "Best for growing properties", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For large hotel groups", highlight: false },
];

const features = [
  { label: "Basic property listing", starter: true, pro: true, enterprise: true },
  { label: "Standard search placement", starter: true, pro: true, enterprise: true },
  { label: "Monthly analytics report", starter: true, pro: true, enterprise: true },
  { label: "Email support", starter: true, pro: true, enterprise: true },
  { label: "Verified partner badge", starter: false, pro: true, enterprise: true },
  { label: "Priority search placement", starter: false, pro: true, enterprise: true },
  { label: "Real-time analytics dashboard", starter: false, pro: true, enterprise: true },
  { label: "Dedicated account manager", starter: false, pro: true, enterprise: true },
  { label: "Promotional deals integration", starter: false, pro: true, enterprise: true },
  { label: "Featured homepage placement", starter: false, pro: false, enterprise: true },
  { label: "Custom API integrations", starter: false, pro: false, enterprise: true },
  { label: "Multi-property management", starter: false, pro: false, enterprise: true },
  { label: "Revenue optimization consulting", starter: false, pro: false, enterprise: true },
];

const stepLabels = ["Contact", "Property", "Details", "Plan"];

const PartnerRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("Professional");
  const [form, setForm] = useState({
    contactName: "", email: "", phone: "", role: "",
    propertyName: "", propertyType: "", location: "", rooms: "", website: "",
    description: "", amenities: "", agreeTerms: false,
  });

  const update = (field: string, value: string | boolean) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    if (!form.agreeTerms) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }
    toast({ title: "Application Submitted!", description: "Our team will review your application and contact you within 48 hours." });
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-light opacity-90" />
        <div className="relative container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent text-sm font-medium mb-4">
            <Sparkles size={14} /> Partner Application
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-3">
            Join Our Network
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">List your property and start reaching millions of travelers worldwide</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const isActive = step === s;
            const isDone = step > s;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone ? "bg-accent text-accent-foreground shadow-sm" :
                    isActive ? "bg-foreground text-background shadow-md" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle2 size={18} /> : s}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {s < 4 && (
                  <div className={`w-16 h-0.5 mx-2 mb-5 rounded-full transition-colors duration-300 ${isDone ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Success State */}
        {step === 5 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={36} className="text-accent" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Application Received!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Thank you for applying with the <strong className="text-foreground">{selectedPlan}</strong> plan. Our partnership team will review your application and reach out within 48 hours.</p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl" onClick={() => navigate("/")}>Back to Home</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => navigate("/partner-dashboard")}>Go to Dashboard</Button>
            </div>
          </div>
        ) : (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/60 p-8 shadow-card">
            {/* Step 1: Contact Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Contact Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about yourself</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Full Name *</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" placeholder="John Doe" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email *</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" type="email" placeholder="john@hotel.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Phone</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" placeholder="+1 234 567 890" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Your Role</Label>
                    <Select value={form.role} onValueChange={(v) => update("role", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl bg-muted/30 border-border/50"><SelectValue placeholder="Select your role" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="owner">Property Owner</SelectItem>
                        <SelectItem value="manager">General Manager</SelectItem>
                        <SelectItem value="agent">Travel Agent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Property Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about your property</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Property Name *</Label>
                    <div className="relative mt-1.5">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" placeholder="Grand Hotel & Spa" value={form.propertyName} onChange={(e) => update("propertyName", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Property Type *</Label>
                      <Select value={form.propertyType} onValueChange={(v) => update("propertyType", v)}>
                        <SelectTrigger className="mt-1.5 rounded-xl bg-muted/30 border-border/50"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="boutique">Boutique Hotel</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Number of Rooms</Label>
                      <Input className="mt-1.5 rounded-xl bg-muted/30 border-border/50" type="number" placeholder="50" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Location *</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" placeholder="Paris, France" value={form.location} onChange={(e) => update("location", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Website</Label>
                    <div className="relative mt-1.5">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10 rounded-xl bg-muted/30 border-border/50" placeholder="https://www.yourhotel.com" value={form.website} onChange={(e) => update("website", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Additional Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">Help us understand your property better</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Property Description</Label>
                    <Textarea className="mt-1.5 min-h-[100px] rounded-xl bg-muted/30 border-border/50" placeholder="Describe what makes your property special..." value={form.description} onChange={(e) => update("description", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Key Amenities</Label>
                    <Textarea className="mt-1.5 rounded-xl bg-muted/30 border-border/50" placeholder="Pool, Spa, Restaurant, Gym, Free WiFi..." value={form.amenities} onChange={(e) => update("amenities", e.target.value)} />
                  </div>
                  <div className="flex items-start gap-3 pt-3 p-4 rounded-xl bg-muted/20 border border-border/40">
                    <Checkbox checked={form.agreeTerms} onCheckedChange={(v) => update("agreeTerms", !!v)} id="terms" className="mt-0.5" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                      I agree to the <span className="text-accent underline font-medium">Partner Terms of Service</span> and <span className="text-accent underline font-medium">Privacy Policy</span>.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Choose Plan & Compare */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Choose Your Plan</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select the plan that best fits your needs</p>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.name;
                    return (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`relative rounded-2xl p-6 text-left transition-all duration-300 border-2 ${
                          isSelected
                            ? "border-accent bg-accent/5 shadow-card-hover scale-[1.02]"
                            : "border-border/50 bg-card hover:border-accent/40 hover:shadow-card"
                        }`}
                      >
                        {plan.highlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                            Popular
                          </span>
                        )}
                        <p className="font-display font-bold text-foreground text-lg">{plan.name}</p>
                        <div className="mt-2 flex items-baseline gap-0.5">
                          <span className="text-3xl font-bold text-accent">{plan.price}</span>
                          {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{plan.desc}</p>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 size={22} className="text-accent" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Compare features table */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-muted-foreground">Compare Features</h3>
                  <div className="rounded-2xl border border-border/50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/40">
                          <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Feature</th>
                          <th className="text-center px-3 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Starter</th>
                          <th className="text-center px-3 py-3.5 font-bold text-accent text-xs uppercase tracking-wider">Pro</th>
                          <th className="text-center px-3 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {features.map((f, idx) => (
                          <tr key={f.label} className={`border-b border-border/20 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                            <td className="px-5 py-3 text-foreground">{f.label}</td>
                            <td className="text-center px-3 py-3">
                              {f.starter ? <Check size={16} className="inline text-accent" /> : <X size={16} className="inline text-muted-foreground/30" />}
                            </td>
                            <td className="text-center px-3 py-3 bg-accent/[0.03]">
                              {f.pro ? <Check size={16} className="inline text-accent" /> : <X size={16} className="inline text-muted-foreground/30" />}
                            </td>
                            <td className="text-center px-3 py-3">
                              {f.enterprise ? <Check size={16} className="inline text-accent" /> : <X size={16} className="inline text-muted-foreground/30" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/40">
              {step > 1 ? (
                <Button variant="outline" className="rounded-xl" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}
              {step < 4 ? (
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm" onClick={() => setStep(step + 1)}>
                  Continue <ChevronRight size={16} />
                </Button>
              ) : (
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm" onClick={handleSubmit}>
                  Submit Application <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PartnerRegister;
