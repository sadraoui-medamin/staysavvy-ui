import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Clock, AlertCircle, CheckCircle } from "lucide-react";

const policies = [
  { icon: CheckCircle, title: "Free Cancellation", desc: "Most bookings can be cancelled free of charge up to 48 hours before your scheduled check-in date. The full amount will be refunded to your original payment method within 5-10 business days.", color: "text-green-600" },
  { icon: Clock, title: "Late Cancellation", desc: "Cancellations made less than 48 hours before check-in are subject to a charge equivalent to the first night's stay. The remainder of your booking will be refunded.", color: "text-accent" },
  { icon: AlertCircle, title: "No-Show Policy", desc: "If you do not arrive at the property without prior cancellation, the full booking amount will be charged. We recommend contacting the hotel directly if you expect a late arrival.", color: "text-destructive" },
  { icon: ShieldCheck, title: "Non-Refundable Rates", desc: "Some properties offer discounted non-refundable rates. These bookings cannot be cancelled or modified once confirmed. Please review the rate conditions carefully before booking.", color: "text-muted-foreground" },
];

const CancellationPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20">
      <section className="bg-primary py-16 text-center">
        <h1 className="text-4xl font-display font-bold text-primary-foreground">Cancellation Policy</h1>
        <p className="text-primary-foreground/60 mt-2">Transparent policies for peace of mind</p>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-6">
          {policies.map((p, i) => (
            <div key={i} className="bg-card rounded-xl p-6 shadow-card flex items-start gap-4">
              <div className={`shrink-0 mt-1 ${p.color}`}><p.icon size={24} /></div>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground mb-2">{p.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-muted/50 rounded-xl p-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">How to Cancel a Booking</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>Log in to your StayVista account and go to "My Bookings"</li>
            <li className="flex items-start gap-3"><span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>Find the booking you wish to cancel and click "Manage Booking"</li>
            <li className="flex items-start gap-3"><span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>Select "Cancel Booking" and confirm. You'll receive a cancellation confirmation via email.</li>
          </ol>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Questions about cancellations? Contact us at <a href="mailto:support@stayvista.com" className="text-accent hover:underline">support@stayvista.com</a></p>
        </div>
      </section>
    </div>
    <Footer />
  </div>
);

export default CancellationPolicy;
