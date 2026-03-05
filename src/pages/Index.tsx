import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CalendarDays, Users, MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DestinationsSection } from "@/components/landing/DestinationsSection";
import { FeaturedHotelsSection } from "@/components/landing/FeaturedHotelsSection";
import { TrustSection, CtaSection } from "@/components/landing/CtaSections";
import { PartnerSection } from "@/components/landing/PartnerSection";
import heroImg from "@/assets/hero-hotel.jpg";
import hotel1 from "@/assets/hotel-1.jpg";
import dest1 from "@/assets/dest-1.jpg";
import dest3 from "@/assets/dest-3.jpg";
import hotel2 from "@/assets/hotel-2.jpg";

const heroImages = [heroImg, dest1, hotel1, dest3, hotel2];

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [currentHero, setCurrentHero] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  const nextSlide = useCallback(() => {
    setFadeClass("opacity-0");
    setTimeout(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
      setFadeClass("opacity-100");
    }, 600);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Luxury destination ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              i === currentHero ? fadeClass : "opacity-0"
            }`}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/20 to-foreground/80" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 mb-8 animate-fade-in">
            <Play size={12} className="text-accent fill-accent" />
            <span className="text-sm text-primary-foreground/80 font-medium">Over 12,000 luxury properties worldwide</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-primary-foreground mb-5 animate-fade-in leading-[1.1]">
            Find Your Perfect
            <br />
            <span className="text-gradient-gold">Getaway</span>
          </h1>
          <p
            className="text-base md:text-xl text-primary-foreground/70 mb-12 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Discover handpicked luxury hotels & resorts at the best prices
          </p>

          {/* Search bar */}
          <div
            className="animate-slide-in-bottom bg-card/90 backdrop-blur-xl rounded-2xl p-3 md:p-5 max-w-4xl mx-auto shadow-elevated border border-border/30"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
                <Input
                  placeholder="Where are you going?"
                  className="pl-10 h-13 bg-muted/50 border-0 text-foreground rounded-xl text-sm"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
                <Input
                  type="text"
                  placeholder="Check-in — Check-out"
                  className="pl-10 h-13 bg-muted/50 border-0 rounded-xl text-sm"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
                <Input
                  type="text"
                  placeholder="2 Guests, 1 Room"
                  className="pl-10 h-13 bg-muted/50 border-0 rounded-xl text-sm"
                />
              </div>
              <Button
                className="h-13 px-8 bg-accent text-accent-foreground hover:bg-gold-light font-semibold rounded-xl text-sm"
                onClick={handleSearch}
              >
                <Search size={17} className="mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setFadeClass("opacity-0");
                  setTimeout(() => {
                    setCurrentHero(i);
                    setFadeClass("opacity-100");
                  }, 400);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentHero
                    ? "bg-accent w-8"
                    : "bg-primary-foreground/30 w-1.5 hover:bg-primary-foreground/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom gradient fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── Trust / Why Us ─── */}
      <TrustSection />

      {/* ─── Destinations ─── */}
      <DestinationsSection />

      {/* ─── Featured Hotels ─── */}
      <FeaturedHotelsSection />

      {/* ─── CTA ─── */}
      <CtaSection />

      {/* ─── Partner ─── */}
      <PartnerSection />

      <Footer />
    </div>
  );
};

export default Index;
