import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const openings = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "London, UK", type: "Full-time" },
  { title: "Data Analyst", dept: "Analytics", location: "New York, USA", type: "Full-time" },
  { title: "Hotel Partnerships Manager", dept: "Business Dev", location: "Dubai, UAE", type: "Full-time" },
  { title: "Customer Support Lead", dept: "Support", location: "Remote", type: "Full-time" },
  { title: "Content Marketing Specialist", dept: "Marketing", location: "Paris, France", type: "Contract" },
];

const perks = [
  "🌍 Remote-first culture", "✈️ Annual travel credit ($2,000)", "🏥 Premium health insurance",
  "📚 Learning & development budget", "🏖️ Unlimited PTO", "💰 Competitive equity package",
];

const Careers = () => {
  const section = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Join <span className="text-gradient-gold">Our Team</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Help us redefine how the world experiences travel. We're hiring passionate people across the globe.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">Why StayVista?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {perks.map((p, i) => (
              <div key={i} className="bg-card rounded-xl p-4 text-center shadow-card text-sm font-medium text-foreground">{p}</div>
            ))}
          </div>
        </section>

        {/* Openings */}
        <section ref={section.ref} className={`bg-muted/50 py-16 transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-card hover-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" style={{ transitionDelay: `${i * 80}ms`, opacity: section.isVisible ? 1 : 0, transform: section.isVisible ? "translateY(0)" : "translateY(15px)", transition: "opacity 0.4s ease-out, transform 0.4s ease-out" }}>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    Apply <ArrowRight size={14} className="ml-1" />
                  </Button>
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

export default Careers;
