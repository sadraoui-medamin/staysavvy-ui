import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { destinations } from "@/data/hotels";

export function DestinationsSection() {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.1);

  return (
    <section
      ref={section.ref}
      className={`container mx-auto px-4 py-24 transition-all duration-700 ease-out ${
        section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="text-center mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest mb-4">
          Top Picks
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
          Popular Destinations
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Explore trending locations loved by travelers around the globe
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {destinations.map((dest, idx) => (
          <button
            key={dest.id}
            onClick={() => navigate(`/search?q=${encodeURIComponent(dest.name)}`)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
              transitionDelay: section.isVisible ? `${idx * 100}ms` : "0ms",
              opacity: section.isVisible ? 1 : 0,
              transform: section.isVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <img
              src={dest.image}
              alt={dest.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center gap-1.5 text-accent mb-1">
                <MapPin size={13} />
                <span className="text-xs font-medium uppercase tracking-wider">{dest.country}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-primary-foreground">{dest.name}</h3>
              <p className="text-primary-foreground/60 text-sm mt-0.5">{dest.hotels} hotels</p>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ))}
      </div>
    </section>
  );
}
