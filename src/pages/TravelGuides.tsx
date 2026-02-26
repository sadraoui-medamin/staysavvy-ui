import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import dest1 from "@/assets/dest-1.jpg";
import dest2 from "@/assets/dest-2.jpg";
import dest3 from "@/assets/dest-3.jpg";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel5 from "@/assets/hotel-5.jpg";

const guides = [
  { title: "Top 10 Hidden Beaches in Greece", category: "Beach", readTime: "8 min", image: dest1, excerpt: "Escape the crowds and discover crystal-clear coves that most travelers never find." },
  { title: "A Food Lover's Guide to Paris", category: "Culinary", readTime: "12 min", image: dest2, excerpt: "From neighborhood bistros to Michelin stars — where to eat in the City of Light." },
  { title: "Ultimate Dubai Shopping Guide", category: "Shopping", readTime: "6 min", image: dest3, excerpt: "Navigate the souks and malls like a local with our insider tips." },
  { title: "Swiss Alps: Best Ski Resorts 2026", category: "Adventure", readTime: "10 min", image: hotel5, excerpt: "Compare the best slopes, après-ski, and family-friendly lodges in Switzerland." },
  { title: "How to Travel Sustainably", category: "Eco Travel", readTime: "7 min", image: hotel1, excerpt: "Practical tips for reducing your carbon footprint without sacrificing comfort." },
];

const TravelGuides = () => {
  const navigate = useNavigate();
  const section = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Travel <span className="text-gradient-gold">Guides</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Expert tips, insider knowledge, and inspiration for your next trip.
            </p>
          </div>
        </section>

        <section ref={section.ref} className={`container mx-auto px-4 py-16 transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Featured guide */}
          <div className="relative rounded-2xl overflow-hidden mb-12 group cursor-pointer hover-lift">
            <img src={guides[0].image} alt={guides[0].title} className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">{guides[0].category}</span>
              <h2 className="text-3xl font-display font-bold text-primary-foreground mb-2">{guides[0].title}</h2>
              <p className="text-primary-foreground/70 max-w-xl">{guides[0].excerpt}</p>
              <span className="text-primary-foreground/50 text-sm mt-2 inline-block">📖 {guides[0].readTime} read</span>
            </div>
          </div>

          {/* Guide grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.slice(1).map((guide, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden shadow-card hover-lift group cursor-pointer flex flex-col sm:flex-row" style={{ transitionDelay: `${i * 100}ms`, opacity: section.isVisible ? 1 : 0, transform: section.isVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease-out, transform 0.5s ease-out" }}>
                <img src={guide.image} alt={guide.title} loading="lazy" decoding="async" className="w-full sm:w-40 h-40 sm:h-auto object-cover" />
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium">{guide.category}</span>
                    <span className="text-xs text-muted-foreground">{guide.readTime} read</span>
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TravelGuides;
