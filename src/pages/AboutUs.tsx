import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, Globe, Users, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import hotel1 from "@/assets/hotel-1.jpg";

const stats = [
  { label: "Hotels Worldwide", value: "12,000+", icon: Globe },
  { label: "Happy Travelers", value: "2M+", icon: Heart },
  { label: "Team Members", value: "350+", icon: Users },
  { label: "Awards Won", value: "28", icon: Award },
];

const team = [
  { name: "Elena Rossi", role: "CEO & Founder", initials: "ER" },
  { name: "James Chen", role: "CTO", initials: "JC" },
  { name: "Amara Obi", role: "VP of Design", initials: "AO" },
  { name: "Liam Walker", role: "Head of Partnerships", initials: "LW" },
];

const AboutUs = () => {
  const storySection = useScrollAnimation(0.1);
  const teamSection = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="relative h-[50vh] min-h-[350px] overflow-hidden flex items-center justify-center">
          <img src={hotel1} alt="StayVista team" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">About <span className="text-gradient-gold">StayVista</span></h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">We believe every journey deserves an extraordinary stay.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-card rounded-xl p-6 text-center shadow-elevated">
                <s.icon className="mx-auto mb-2 text-accent" size={28} />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section ref={storySection.ref} className={`container mx-auto px-4 py-20 transition-all duration-700 ${storySection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2020, StayVista started with a simple idea: luxury travel should be accessible, transparent, and delightful. What began as a curated list of boutique hotels has grown into a global platform connecting millions of travelers with extraordinary accommodations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We partner directly with over 12,000 properties worldwide, from cliff-side villas in Santorini to urban retreats in Tokyo. Our team of travel experts personally vets every listing to ensure it meets our standards for quality, service, and authenticity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to make every stay unforgettable — not just the destination, but the entire experience from search to checkout to the moment you walk through the door.
            </p>
          </div>
        </section>

        {/* Team */}
        <section ref={teamSection.ref} className={`bg-muted/50 py-20 transition-all duration-700 ${teamSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {team.map((t, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold text-lg">{t.initials}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
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

export default AboutUs;
