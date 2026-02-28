import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CalendarDays, Users, MapPin, Star, ArrowRight, Building2, BadgeCheck, TrendingUp, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelCard } from "@/components/HotelCard";
import { hotels, destinations } from "@/data/hotels";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImg from "@/assets/hero-hotel.jpg";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import dest1 from "@/assets/dest-1.jpg";
import dest3 from "@/assets/dest-3.jpg";

const heroImages = [heroImg, dest1, hotel1, dest3, hotel2];

const Index = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [currentHero, setCurrentHero] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  // Scroll animation refs
  const destSection = useScrollAnimation(0.1);
  const featuredSection = useScrollAnimation(0.1);
  const ctaSection = useScrollAnimation(0.15);
  const partnerSection = useScrollAnimation(0.1);

  // Hero carousel auto-rotate
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

      {/* Hero with image carousel */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Carousel images */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-foreground/70" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-4 animate-fade-in leading-tight">
            Find Your Perfect
            <br />
            <span className="text-gradient-gold">Getaway</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Discover handpicked luxury hotels & resorts worldwide
          </p>

          {/* Search bar */}
          <div className="animate-slide-in-bottom bg-card/95 backdrop-blur-md rounded-2xl p-3 md:p-4 max-w-4xl mx-auto shadow-elevated" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Where are you going?"
                  className="pl-10 h-12 bg-muted/50 border-0 text-foreground"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input type="text" placeholder="Check-in — Check-out" className="pl-10 h-12 bg-muted/50 border-0" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input type="text" placeholder="2 Guests, 1 Room" className="pl-10 h-12 bg-muted/50 border-0" />
              </div>
              <Button className="h-12 px-8 bg-accent text-accent-foreground hover:bg-gold-light font-semibold" onClick={handleSearch}>
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentHero
                    ? "bg-accent w-6"
                    : "bg-primary-foreground/40 hover:bg-primary-foreground/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations — scroll animated */}
      <section
        ref={destSection.ref}
        className={`container mx-auto px-4 py-20 transition-all duration-700 ease-out ${
          destSection.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Popular Destinations</h2>
            <p className="text-muted-foreground mt-2">Explore trending locations loved by travelers</p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-accent hover:text-accent" onClick={() => navigate("/search")}>
            View All <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <button
              key={dest.id}
              onClick={() => navigate(`/search?q=${encodeURIComponent(dest.name)}`)}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] hover-lift text-left"
              style={{
                transitionDelay: destSection.isVisible ? `${idx * 100}ms` : "0ms",
                opacity: destSection.isVisible ? 1 : 0,
                transform: destSection.isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
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

      {/* Featured Hotels — scroll animated */}
      <section
        ref={featuredSection.ref}
        className={`bg-muted/50 py-20 transition-all duration-700 ease-out ${
          featuredSection.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Featured Hotels</h2>
              <p className="text-muted-foreground mt-2">Handpicked stays for an unforgettable experience</p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-accent hover:text-accent" onClick={() => navigate("/search")}>
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.slice(0, 3).map((hotel, idx) => (
              <div
                key={hotel.id}
                style={{
                  transitionDelay: featuredSection.isVisible ? `${idx * 120}ms` : "0ms",
                  opacity: featuredSection.isVisible ? 1 : 0,
                  transform: featuredSection.isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                }}
              >
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — scroll animated */}
      <section
        ref={ctaSection.ref}
        className={`container mx-auto px-4 py-20 transition-all duration-700 ease-out ${
          ctaSection.isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-primary rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(38 90% 55%), transparent 50%), radial-gradient(circle at 80% 50%, hsl(38 80% 70%), transparent 50%)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Sign up today and get exclusive access to member-only deals, saving up to 40% on luxury stays.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold px-10 h-12">
              Get Started — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Hotel Partner / Agent Section */}
      <section
        ref={partnerSection.ref}
        className={`py-20 bg-muted/30 transition-all duration-700 ease-out ${
          partnerSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-5">
                <Building2 size={14} /> For Hotel Partners
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                List Your Property &<br />
                <span className="text-gradient-gold">Grow Your Business</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                Join thousands of hotel owners and agents who trust our platform to reach millions of travelers worldwide. Get premium visibility, powerful analytics, and dedicated support.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Globe, title: "Global Reach", desc: "Access millions of travelers from 190+ countries" },
                  { icon: TrendingUp, title: "Boost Revenue", desc: "Increase bookings by up to 40% with smart pricing" },
                  { icon: BadgeCheck, title: "Verified Badge", desc: "Build trust with our verified partner program" },
                  { icon: Star, title: "Premium Listing", desc: "Featured placement in search results & deals" },
                ].map((perk) => (
                  <div
                    key={perk.title}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-card"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <perk.icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{perk.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12 px-8 gap-2">
                  Join as a Partner <ChevronRight size={16} />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-elevated p-8 space-y-6">
                <h3 className="text-lg font-display font-semibold text-foreground">Why Partners Love Us</h3>
                <div className="space-y-5">
                  {[
                    { stat: "12,000+", label: "Hotels & resorts listed" },
                    { stat: "5M+", label: "Monthly active travelers" },
                    { stat: "98%", label: "Partner satisfaction rate" },
                    { stat: "24/7", label: "Dedicated partner support" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-accent min-w-[80px]">{item.stat}</span>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-border" />
                <blockquote className="text-sm text-muted-foreground italic">
                  "Since joining the platform, our bookings increased by 35%. The dashboard analytics and support are outstanding."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">MR</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Marco Rossi</p>
                    <p className="text-xs text-muted-foreground">GM, Grand Villa Positano</p>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -z-10 top-6 left-6 right-6 bottom-0 rounded-2xl bg-accent/5 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
