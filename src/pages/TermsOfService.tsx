import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20">
      <section className="bg-primary py-16 text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Terms of Service</h1>
        <p className="text-primary-foreground/60 mt-2">Last updated: February 1, 2026</p>
      </section>
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-sm">
        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using StayVista, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. These terms apply to all visitors, users, and others who access our services." },
          { title: "2. Use of Service", body: "You must be at least 18 years old to use StayVista. You are responsible for maintaining the confidentiality of your account credentials. You agree not to use the platform for any unlawful purpose or to violate any regulations." },
          { title: "3. Bookings & Payments", body: "All bookings are subject to availability and confirmation by the property. Prices displayed include taxes unless stated otherwise. Payment is processed at the time of booking. Currency conversion fees may apply for international transactions." },
          { title: "4. User Content", body: "By submitting reviews, photos, or other content, you grant StayVista a non-exclusive, worldwide license to use, display, and distribute such content. You represent that your content is accurate and does not infringe on third-party rights." },
          { title: "5. Intellectual Property", body: "All content on StayVista — including text, graphics, logos, and software — is the property of StayVista or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent." },
          { title: "6. Limitation of Liability", body: "StayVista acts as an intermediary between travelers and accommodation providers. We are not liable for the quality, safety, or legality of listed properties. Our liability is limited to the fees paid to StayVista for the booking in question." },
          { title: "7. Modifications", body: "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify registered users of material changes via email." },
          { title: "8. Governing Law", body: "These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of London, UK." },
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

export default TermsOfService;
