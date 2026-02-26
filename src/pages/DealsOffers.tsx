import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Tag, Clock, Percent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import dest1 from "@/assets/dest-1.jpg";

const deals = [
  { title: "Early Bird Summer 2026", discount: "30% OFF", desc: "Book before March 31 for summer stays. Valid for 3+ night bookings.", image: dest1, tag: "Limited Time", expire: "Mar 31, 2026" },
  { title: "Weekend Escape Package", discount: "25% OFF", desc: "Friday-Sunday stays at select luxury resorts. Includes breakfast.", image: hotel1, tag: "Popular", expire: "Ongoing" },
  { title: "Honeymoon Special", discount: "40% OFF", desc: "Romantic suite upgrades, couples spa, and candlelit dinner included.", image: hotel2, tag: "Exclusive", expire: "Jun 30, 2026" },
  { title: "Business Traveler Deal", discount: "20% OFF", desc: "Mid-week rates with complimentary workspace and express check-in.", image: hotel3, tag: "New", expire: "Ongoing" },
];

const DealsOffers = () => {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(38 90% 55%), transparent 50%)" }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} /> Hot Deals
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Deals & <span className="text-gradient-gold">Offers</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Unlock exclusive savings on handpicked luxury stays worldwide.
            </p>
          </div>
        </section>

        <section ref={section.ref} className={`container mx-auto px-4 py-16 transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deals.map((deal, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card hover-lift group" style={{ transitionDelay: `${i * 100}ms`, opacity: section.isVisible ? 1 : 0, transform: section.isVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={deal.image} alt={deal.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">{deal.discount}</div>
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">{deal.tag}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">{deal.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{deal.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={14} /> Expires: {deal.expire}</span>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold" onClick={() => navigate("/search")}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-primary rounded-2xl p-10 text-center">
            <Percent className="mx-auto mb-4 text-accent" size={40} />
            <h2 className="text-2xl font-display font-bold text-primary-foreground mb-3">Member-Only Deals</h2>
            <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto">Sign up for free and unlock exclusive member rates with savings up to 40% on luxury stays.</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold px-10">Join Free</Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DealsOffers;
