import { useNavigate } from "react-router-dom";
import { Shield, Headphones, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const perks = [
  { icon: Shield, title: "Best Price Guarantee", desc: "Find a lower price? We'll match it instantly." },
  { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock help wherever you are." },
  { icon: CreditCard, title: "Flexible Booking", desc: "Free cancellation on most stays." },
  { icon: Sparkles, title: "Verified Properties", desc: "Every hotel is personally inspected." },
];

export function TrustSection() {
  const section = useScrollAnimation(0.1);

  return (
    <section
      ref={section.ref}
      className={`container mx-auto px-4 py-24 transition-all duration-700 ease-out ${
        section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((perk, idx) => (
          <div
            key={perk.title}
            className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-card-hover"
            style={{
              transitionDelay: section.isVisible ? `${idx * 80}ms` : "0ms",
              opacity: section.isVisible ? 1 : 0,
              transform: section.isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out, border-color 0.3s, box-shadow 0.3s",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <perk.icon size={22} className="text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg mb-1.5">{perk.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaSection() {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.15);

  return (
    <section
      ref={section.ref}
      className={`container mx-auto px-4 py-12 transition-all duration-700 ease-out ${
        section.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="relative rounded-3xl overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 40%, hsl(38 90% 55%), transparent 50%), radial-gradient(circle at 75% 60%, hsl(38 80% 70%), transparent 50%)",
          }}
        />
        <div className="relative z-10 py-16 md:py-24 px-8 md:px-16 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-5 leading-tight">
            Ready for Your Next
            <br />
            <span className="text-gradient-gold">Adventure?</span>
          </h2>
          <p className="text-primary-foreground/70 mb-10 max-w-xl mx-auto text-lg">
            Sign up today and unlock exclusive member-only deals, saving up to 40% on luxury stays worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold px-10 h-13 text-base"
              onClick={() => navigate("/search")}
            >
              Get Started — It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-10 h-13"
              onClick={() => navigate("/deals")}
            >
              Browse Deals
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
