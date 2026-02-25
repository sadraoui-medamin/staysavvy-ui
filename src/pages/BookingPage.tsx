import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { hotels } from "@/data/hotels";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id === id);
  const [confirmed, setConfirmed] = useState(false);

  if (!hotel) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Navbar /><p className="pt-24 text-foreground">Hotel not found</p></div>;
  }

  const room = hotel.rooms[0];
  const nights = 5;
  const subtotal = room.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-accent" size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-2">Your reservation at <strong className="text-foreground">{hotel.name}</strong> has been confirmed.</p>
            <p className="text-muted-foreground mb-8">Confirmation #SV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/dashboard")} className="bg-accent text-accent-foreground hover:bg-gold-light">View My Bookings</Button>
              <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Complete Your Booking</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Guest Info */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-semibold text-foreground mb-5">Guest Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">First Name</label>
                    <Input className="h-11 bg-muted/50" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Last Name</label>
                    <Input className="h-11 bg-muted/50" placeholder="Doe" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                    <Input className="h-11 bg-muted/50" placeholder="john@email.com" type="email" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
                    <Input className="h-11 bg-muted/50" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-muted-foreground mb-1.5 block">Special Requests</label>
                  <textarea className="w-full h-24 rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Any special requests for your stay..." />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={20} className="text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock size={12} /> Secure
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Card Number</label>
                    <Input className="h-11 bg-muted/50" placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Expiry Date</label>
                      <Input className="h-11 bg-muted/50" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">CVC</label>
                      <Input className="h-11 bg-muted/50" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Cardholder Name</label>
                    <Input className="h-11 bg-muted/50" placeholder="John Doe" />
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-gold-light font-semibold text-base"
                onClick={() => setConfirmed(true)}
              >
                Confirm & Pay ${total}
              </Button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl overflow-hidden shadow-card sticky top-24">
                <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground">{hotel.location}</p>
                  </div>
                  <hr className="border-border" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="text-foreground">{room.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="text-foreground">Mar 15, 2026</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="text-foreground">Mar 20, 2026</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="text-foreground">2 Adults</span></div>
                  </div>
                  <hr className="border-border" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>${room.price} × {nights} nights</span><span>${subtotal}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Taxes & fees</span><span>${taxes}</span></div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-semibold text-foreground text-base"><span>Total</span><span>${total}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
