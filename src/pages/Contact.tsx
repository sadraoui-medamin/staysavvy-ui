import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const section = useScrollAnimation(0.1);
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Have a question? We'd love to hear from you.
            </p>
          </div>
        </section>

        <section ref={section.ref} className={`container mx-auto px-4 py-16 transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Mail size={18} className="text-accent" /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">support@stayvista.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Phone size={18} className="text-accent" /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (800) 555-0199</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><MapPin size={18} className="text-accent" /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Office</h3>
                  <p className="text-sm text-muted-foreground">123 Travel Lane, London, UK</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Clock size={18} className="text-accent" /></div>
                <div>
                  <h3 className="font-semibold text-foreground">Hours</h3>
                  <p className="text-sm text-muted-foreground">24/7 Customer Support</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="bg-card rounded-2xl p-12 text-center shadow-card">
                  <MessageSquare className="mx-auto mb-4 text-accent" size={48} />
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">Thank You!</h2>
                  <p className="text-muted-foreground">We've received your message and will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-foreground mb-1 block">Name</label><Input placeholder="Your name" required /></div>
                    <div><label className="text-sm font-medium text-foreground mb-1 block">Email</label><Input type="email" placeholder="you@example.com" required /></div>
                  </div>
                  <div><label className="text-sm font-medium text-foreground mb-1 block">Subject</label><Input placeholder="How can we help?" required /></div>
                  <div><label className="text-sm font-medium text-foreground mb-1 block">Message</label><Textarea placeholder="Tell us more..." rows={5} required /></div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
