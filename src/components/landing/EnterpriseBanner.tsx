import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { hotels } from "@/data/hotels";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

export function EnterpriseBanner() {
  const enterprise = hotels.filter((h) => h.subscriptionTier === "enterprise");
  const section = useScrollAnimation(0.1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (enterprise.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % enterprise.length), 6000);
    return () => clearInterval(t);
  }, [enterprise.length]);

  if (enterprise.length === 0) return null;
  const current = enterprise[active];

  return (
    <section
      ref={section.ref}
      className={`relative py-14 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden transition-all duration-700 ${
        section.isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, hsl(38 90% 55%), transparent 55%)" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-3">
              <Crown size={12} className="text-accent" />
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-accent">Enterprise Spotlight</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground">
              Premier <span className="text-gradient-gold">Sponsored</span> Properties
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-2 max-w-lg">
              Enterprise partners get top placement on the StayVista homepage.
            </p>
          </div>
          {enterprise.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline" size="icon"
                className="h-9 w-9 rounded-full border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setActive((i) => (i - 1 + enterprise.length) % enterprise.length)}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline" size="icon"
                className="h-9 w-9 rounded-full border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setActive((i) => (i + 1) % enterprise.length)}
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>

        <Link to={`/hotel/${current.id}`} className="group block">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 rounded-2xl overflow-hidden shadow-elevated bg-card/95 backdrop-blur">
            <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                key={current.id}
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-fade-in"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-foreground/90 text-background px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                <Crown size={11} /> Enterprise
              </div>
            </div>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                <MapPin size={12} /> {current.location}
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
                {current.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{current.description}</p>
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="font-semibold text-sm">{current.rating}</span>
                  <span className="text-xs text-muted-foreground">({current.reviews.toLocaleString()})</span>
                </div>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{current.category}</span>
              </div>
              <div className="flex items-end justify-between mt-6 pt-5 border-t border-border/60">
                <div>
                  <span className="text-3xl font-bold text-foreground">${current.price}</span>
                  <span className="text-sm text-muted-foreground"> / night</span>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold gap-2">
                  View stay <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </Link>

        {enterprise.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {enterprise.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "bg-accent w-8" : "bg-primary-foreground/30 w-1.5 hover:bg-primary-foreground/60"}`}
                aria-label={`Show enterprise hotel ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
