import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20">
      <section className="bg-primary py-16 text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Privacy Policy</h1>
        <p className="text-primary-foreground/60 mt-2">Last updated: February 1, 2026</p>
      </section>
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-sm">
        {[
          { title: "1. Information We Collect", body: "We collect information you provide directly (name, email, payment details when booking), usage data (pages visited, search queries), and device information (browser type, IP address). We may also collect location data with your consent to provide relevant hotel recommendations." },
          { title: "2. How We Use Your Information", body: "Your data is used to process bookings, personalize recommendations, improve our services, send booking confirmations and updates, and — with your consent — marketing communications. We never sell your personal data to third parties." },
          { title: "3. Data Sharing", body: "We share necessary booking information with hotels to fulfill your reservation. We use trusted payment processors (PCI-DSS compliant) for transactions. We may share anonymized, aggregated data for analytics purposes." },
          { title: "4. Cookies & Tracking", body: "We use essential cookies for site functionality, analytics cookies to understand usage patterns, and optional marketing cookies. You can manage cookie preferences through your browser settings or our cookie banner." },
          { title: "5. Data Security", body: "We implement industry-standard security measures including SSL encryption, secure data centers, access controls, and regular security audits. Payment information is tokenized and never stored on our servers." },
          { title: "6. Your Rights", body: "You have the right to access, correct, or delete your personal data. You can opt out of marketing emails at any time. EU/UK residents have additional rights under GDPR. To exercise your rights, contact privacy@stayvista.com." },
          { title: "7. Data Retention", body: "We retain your account data as long as your account is active. Booking records are kept for 7 years for legal compliance. You may request deletion at any time, subject to legal obligations." },
          { title: "8. Contact Us", body: "For privacy-related inquiries: privacy@stayvista.com or write to: StayVista Privacy Team, 123 Travel Lane, London, UK." },
        ].map((s, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-lg font-display font-bold text-foreground mb-3">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
      </article>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
