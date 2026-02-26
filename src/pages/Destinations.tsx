import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinations, hotels } from "@/data/hotels";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Destinations = () => {
  const navigate = useNavigate();
  const heroSection = useScrollAnimation(0.1);
  const gridSection = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Explore <span className="text-gradient-gold">Destinations</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              From sun-kissed islands to vibrant cities, find the perfect destination for your next escape.
            </p>
          </div>
        </section>

        {/* Featured Destinations */}
        <section ref={heroSection.ref} className={`container mx-auto px-4 py-16 transition-all duration-700 ${heroSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <button
                key={dest.id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(dest.name)}`)}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] hover-lift text-left"
                style={{ transitionDelay: `${i * 100}ms`, opacity: heroSection.isVisible ? 1 : 0, transform: heroSection.isVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}
              >
                <img src={dest.image} alt={dest.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-display font-bold text-primary-foreground">{dest.name}</h3>
                  <p className="text-primary-foreground/70 text-sm">{dest.country} · {dest.hotels} hotels</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* All Hotels by Destination */}
        <section ref={gridSection.ref} className={`bg-muted/50 py-16 transition-all duration-700 ${gridSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">All Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Bali, Indonesia", "Tokyo, Japan", "New York, USA", "Barcelona, Spain", "Cape Town, South Africa", "Kyoto, Japan"].map((place, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-card hover-lift cursor-pointer" onClick={() => navigate(`/search?q=${encodeURIComponent(place.split(",")[0])}`)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <MapPin size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{place}</h3>
                      <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 500 + 100)} hotels</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting from <span className="font-semibold text-foreground">${Math.floor(Math.random() * 200 + 80)}/night</span></span>
                    <ArrowRight size={16} className="text-accent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
