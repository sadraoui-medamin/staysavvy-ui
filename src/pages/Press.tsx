import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Newspaper, ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pressReleases = [
  { date: "Feb 15, 2026", title: "StayVista Reaches 2 Million Users Worldwide", source: "TechCrunch" },
  { date: "Jan 22, 2026", title: "StayVista Launches AI-Powered Travel Recommendations", source: "The Verge" },
  { date: "Dec 10, 2025", title: "Series B Funding: StayVista Raises $45M", source: "Bloomberg" },
  { date: "Nov 5, 2025", title: "StayVista Named 'Best Travel Platform' at Global Travel Awards", source: "Travel + Leisure" },
  { date: "Sep 18, 2025", title: "Expanding Into Asia: 3,000 New Properties Added", source: "Reuters" },
  { date: "Jul 1, 2025", title: "StayVista Partners with Leading Sustainability Initiative", source: "Forbes" },
];

const mediaLogos = ["TechCrunch", "Forbes", "Bloomberg", "The Verge", "Travel + Leisure", "Reuters"];

const Press = () => {
  const section = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <section className="bg-primary py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Press & <span className="text-gradient-gold">Media</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              The latest news and announcements from StayVista.
            </p>
          </div>
        </section>

        {/* Featured In */}
        <section className="container mx-auto px-4 py-12">
          <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">Featured In</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {mediaLogos.map((name, i) => (
              <span key={i} className="text-muted-foreground/50 font-display font-bold text-xl">{name}</span>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section ref={section.ref} className={`bg-muted/50 py-16 transition-all duration-700 ${section.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((pr, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-card hover-lift flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" style={{ transitionDelay: `${i * 80}ms`, opacity: section.isVisible ? 1 : 0, transform: section.isVisible ? "translateY(0)" : "translateY(15px)", transition: "opacity 0.4s ease-out, transform 0.4s ease-out" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                      <Newspaper size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{pr.title}</h3>
                      <p className="text-sm text-muted-foreground">{pr.date} · {pr.source}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">Media Inquiries</h2>
          <p className="text-muted-foreground mb-2">For press inquiries, interviews, or media kit requests:</p>
          <a href="mailto:press@stayvista.com" className="text-accent font-semibold hover:underline">press@stayvista.com</a>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Press;
