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
import { Building2, MapPin, Mail, Phone, User, Globe, Star, ChevronRight, CheckCircle2 } from "lucide-react";

const PartnerRegister = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
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
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">Partner Application</h1>
          <p className="text-primary-foreground/70">List your property and start reaching millions of travelers</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > s ? "bg-accent text-accent-foreground" : step === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-accent" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === 4 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Application Received!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Thank you for applying. Our partnership team will review your application and reach out within 48 hours.</p>
            <Button className="bg-accent text-accent-foreground hover:bg-gold-light" onClick={() => window.location.href = "/"}>Back to Home</Button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-card p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-display font-bold text-foreground mb-1">Contact Information</h2>
                <p className="text-sm text-muted-foreground mb-4">Tell us about yourself</p>
                <div className="space-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10" placeholder="John Doe" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Email *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-10" type="email" placeholder="john@hotel.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-10" placeholder="+1 234 567 890" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Your Role</Label>
                    <Select value={form.role} onValueChange={(v) => update("role", v)}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select your role" /></SelectTrigger>
                      <SelectContent>
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

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-display font-bold text-foreground mb-1">Property Details</h2>
                <p className="text-sm text-muted-foreground mb-4">Tell us about your property</p>
                <div className="space-y-4">
                  <div>
                    <Label>Property Name *</Label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10" placeholder="Grand Hotel & Spa" value={form.propertyName} onChange={(e) => update("propertyName", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Property Type *</Label>
                      <Select value={form.propertyType} onValueChange={(v) => update("propertyType", v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                          <SelectItem value="boutique">Boutique Hotel</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Number of Rooms</Label>
                      <Input className="mt-1" type="number" placeholder="50" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10" placeholder="Paris, France" value={form.location} onChange={(e) => update("location", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Website</Label>
                    <div className="relative mt-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input className="pl-10" placeholder="https://www.yourhotel.com" value={form.website} onChange={(e) => update("website", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-display font-bold text-foreground mb-1">Additional Information</h2>
                <p className="text-sm text-muted-foreground mb-4">Help us understand your property better</p>
                <div className="space-y-4">
                  <div>
                    <Label>Property Description</Label>
                    <Textarea className="mt-1 min-h-[100px]" placeholder="Describe what makes your property special..." value={form.description} onChange={(e) => update("description", e.target.value)} />
                  </div>
                  <div>
                    <Label>Key Amenities</Label>
                    <Textarea className="mt-1" placeholder="Pool, Spa, Restaurant, Gym, Free WiFi..." value={form.amenities} onChange={(e) => update("amenities", e.target.value)} />
                  </div>
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox checked={form.agreeTerms} onCheckedChange={(v) => update("agreeTerms", !!v)} id="terms" />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the <span className="text-accent underline">Partner Terms of Service</span> and <span className="text-accent underline">Privacy Policy</span>.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}
              {step < 3 ? (
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1" onClick={() => setStep(step + 1)}>
                  Continue <ChevronRight size={16} />
                </Button>
              ) : (
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light gap-1" onClick={handleSubmit}>
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
