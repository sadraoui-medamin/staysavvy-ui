import { useNavigate } from "react-router-dom";
import { Building2, Globe, TrendingUp, BadgeCheck, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const perks = [
  { icon: Globe, title: "Global Reach", desc: "Access millions of travelers from 190+ countries" },
  { icon: TrendingUp, title: "Boost Revenue", desc: "Increase bookings by up to 40% with smart pricing" },
  { icon: BadgeCheck, title: "Verified Badge", desc: "Build trust with our verified partner program" },
  { icon: Star, title: "Premium Listing", desc: "Featured placement in search results & deals" },
];

const stats = [
  { stat: "12,000+", label: "Hotels & resorts listed" },
  { stat: "5M+", label: "Monthly active travelers" },
  { stat: "98%", label: "Partner satisfaction rate" },
  { stat: "24/7", label: "Dedicated partner support" },
];

export function PartnerSection() {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.1);

  return (
    <section
      ref={section.ref}
      className={`py-24 bg-muted/30 transition-all duration-700 ease-out ${
        section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest mb-5">
              <Building2 size={13} /> For Hotel Partners
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-5 leading-tight">
              List Your Property &<br />
              <span className="text-gradient-gold">Grow Your Business</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg text-base leading-relaxed">
              Join thousands of hotel owners who trust our platform to reach millions of travelers worldwide with premium visibility and powerful analytics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-accent/20 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <perk.icon size={17} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{perk.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12 px-8 gap-2"
                onClick={() => navigate("/partner-register")}
              >
                Join as a Partner <ChevronRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8"
                onClick={() => navigate("/partner-program")}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8 space-y-6">
              <h3 className="text-lg font-display font-semibold text-foreground">Why Partners Love Us</h3>
              <div className="space-y-5">
                {stats.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-accent min-w-[80px]">{item.stat}</span>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border" />
              <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
                "Since joining the platform, our bookings increased by 35%. The dashboard analytics and support are outstanding."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm font-bold">
                  MR
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Marco Rossi</p>
                  <p className="text-xs text-muted-foreground">GM, Grand Villa Positano</p>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 top-6 left-6 right-6 bottom-0 rounded-2xl bg-accent/5 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
