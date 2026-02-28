import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Globe, TrendingUp, BadgeCheck, Star, BarChart3, Headphones,
  ShieldCheck, Zap, ChevronRight, CheckCircle2,
} from "lucide-react";

const benefits = [
  { icon: Globe, title: "Global Exposure", desc: "Reach millions of travelers from 190+ countries searching for their next stay." },
  { icon: TrendingUp, title: "Revenue Growth", desc: "Smart pricing tools and featured placements help boost bookings by up to 40%." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track views, bookings, revenue, and guest demographics from a powerful dashboard." },
  { icon: BadgeCheck, title: "Verified Partner Badge", desc: "Build instant credibility with a verified trust badge on your listing." },
  { icon: Star, title: "Premium Listings", desc: "Get priority placement in search results, deals pages, and curated collections." },
  { icon: Headphones, title: "24/7 Dedicated Support", desc: "A dedicated account manager and round-the-clock support for all your needs." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Fast, reliable payouts with fraud protection and transparent fee structure." },
  { icon: Zap, title: "Easy Onboarding", desc: "Go live in under 24 hours with our streamlined listing and verification process." },
];

const plans = [
  { name: "Starter", price: "Free", features: ["Basic listing", "Standard search placement", "Monthly analytics report", "Email support"], highlight: false },
  { name: "Professional", price: "$49/mo", features: ["Verified badge", "Priority search placement", "Real-time analytics dashboard", "Dedicated account manager", "Promotional deals integration"], highlight: true },
  { name: "Enterprise", price: "Custom", features: ["Everything in Professional", "Featured homepage placement", "Custom API integrations", "Multi-property management", "Revenue optimization consulting"], highlight: false },
];

const PartnerProgram = () => {
  const navigate = useNavigate();
  const heroSection = useScrollAnimation(0.1);
  const benefitsSection = useScrollAnimation(0.1);
  const pricingSection = useScrollAnimation(0.1);
  const faqSection = useScrollAnimation(0.1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4">
            Partner With Us & <span className="text-gradient-gold">Grow Your Business</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg mb-8">
            Join 12,000+ hotels and resorts already thriving on our platform. List your property, reach global travelers, and maximize your revenue.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12 px-10 gap-2" onClick={() => navigate("/partner-register")}>
            Apply Now <ChevronRight size={16} />
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section
        ref={benefitsSection.ref}
        className={`container mx-auto px-4 py-20 transition-all duration-700 ease-out ${benefitsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-4">Why Hotels Choose Us</h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">Everything you need to succeed, all in one platform.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <div
              key={b.title}
              className="p-6 rounded-xl bg-card shadow-card hover-lift"
              style={{
                transitionDelay: benefitsSection.isVisible ? `${idx * 80}ms` : "0ms",
                opacity: benefitsSection.isVisible ? 1 : 0,
                transform: benefitsSection.isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <b.icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        ref={pricingSection.ref}
        className={`bg-muted/50 py-20 transition-all duration-700 ease-out ${pricingSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">Choose the plan that fits your business. Upgrade anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col ${plan.highlight ? "bg-primary text-primary-foreground shadow-elevated ring-2 ring-accent scale-105" : "bg-card shadow-card"}`}
              >
                <h3 className="text-xl font-display font-bold mb-1">{plan.name}</h3>
                <p className={`text-3xl font-bold mb-6 ${plan.highlight ? "text-accent" : "text-foreground"}`}>{plan.price}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? "text-accent" : "text-accent"}`} />
                      <span className={plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-11 font-semibold ${plan.highlight ? "bg-accent text-accent-foreground hover:bg-gold-light" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => navigate("/partner-register")}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        ref={faqSection.ref}
        className={`container mx-auto px-4 py-20 max-w-3xl transition-all duration-700 ease-out ${faqSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-3xl font-display font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How long does it take to get listed?", a: "Most properties go live within 24 hours after completing the verification process." },
            { q: "What commission do you charge?", a: "Our Starter plan is free with a small booking commission. Professional and Enterprise plans offer reduced or custom commission rates." },
            { q: "Can I manage multiple properties?", a: "Yes! Our Professional and Enterprise plans support multi-property management from a single dashboard." },
            { q: "How do payouts work?", a: "Payouts are processed bi-weekly via bank transfer. You can track all transactions in your partner dashboard." },
          ].map((item) => (
            <div key={item.q} className="bg-card rounded-xl p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">Join our growing network of partners and start reaching millions of travelers today.</p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12 px-10 gap-2" onClick={() => navigate("/partner-register")}>
            Apply Now <ChevronRight size={16} />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProgram;
