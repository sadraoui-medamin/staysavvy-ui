import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HotelCard } from "@/components/HotelCard";
import { hotels } from "@/data/hotels";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FeaturedHotelsSection() {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.1);

  return (
    <section
      ref={section.ref}
      className={`py-24 bg-muted/40 transition-all duration-700 ease-out ${
        section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
              Curated Stays
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Featured Hotels
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Handpicked luxury stays for an unforgettable experience
            </p>
          </div>
          <Button
            variant="outline"
            className="self-start md:self-auto gap-2 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={() => navigate("/search")}
          >
            View All Hotels <ArrowRight size={15} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.slice(0, 3).map((hotel, idx) => (
            <div
              key={hotel.id}
              style={{
                transitionDelay: section.isVisible ? `${idx * 120}ms` : "0ms",
                opacity: section.isVisible ? 1 : 0,
                transform: section.isVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
            >
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
