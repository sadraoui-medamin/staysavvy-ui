import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  { q: "How do I make a reservation?", a: "Simply search for your destination, select your dates and guests, choose a hotel, pick your room, and complete the booking form. You'll receive a confirmation email instantly." },
  { q: "Can I cancel or modify my booking?", a: "Yes! Most bookings can be cancelled or modified up to 48 hours before check-in at no charge. Some properties have specific policies — check the cancellation terms on your booking confirmation." },
  { q: "How do I contact a hotel directly?", a: "You can find hotel contact details on the hotel's detail page. Alternatively, our support team can relay messages to the property on your behalf." },
  { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption and never store your full card details. All transactions are processed through PCI-compliant payment providers." },
  { q: "Do you offer group or corporate bookings?", a: "Yes! For groups of 10+ rooms or corporate travel needs, contact our business team at business@stayvista.com for special rates and dedicated support." },
  { q: "How do I leave a review?", a: "After your stay, you'll receive an email invitation to review the property. You can also leave reviews from the 'My Bookings' section of your dashboard." },
];

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const section = useScrollAnimation(0.1);

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Help <span className="text-gradient-gold">Center</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg mb-8">
              Find answers to common questions or reach out to our support team.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Search for help..." className="pl-12 h-12 bg-card text-foreground border-0" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </section>

        <section ref={section.ref} className={`container mx-auto px-4 py-16 max-w-3xl transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <div key={i} className="bg-card rounded-xl shadow-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-foreground">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Still Need Help?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" className="gap-2"><MessageCircle size={16} /> Live Chat</Button>
              <Button variant="outline" className="gap-2"><Mail size={16} /> Email Support</Button>
              <Button variant="outline" className="gap-2"><Phone size={16} /> Call Us</Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
