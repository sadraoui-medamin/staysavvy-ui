import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Users, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { hotels } from "@/data/hotels";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-24">
          <h1 className="text-2xl font-display text-foreground">Hotel not found</h1>
          <Button className="mt-4" onClick={() => navigate("/search")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const chosen = hotel.rooms.find((r) => r.id === selectedRoom) || hotel.rooms[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Image Gallery */}
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={hotel.images[currentImage]} alt={hotel.name} decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
          {hotel.images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage((p) => (p - 1 + hotel.images.length) % hotel.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors">
                <ChevronLeft size={20} className="text-foreground" />
              </button>
              <button onClick={() => setCurrentImage((p) => (p + 1) % hotel.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors">
                <ChevronRight size={20} className="text-foreground" />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {hotel.images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? "bg-accent w-6" : "bg-card/60"}`} />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 bg-accent/10 text-accent rounded-lg px-2.5 py-1">
                    <Star className="fill-accent text-accent" size={14} />
                    <span className="font-semibold text-sm">{hotel.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{hotel.reviews.toLocaleString()} reviews</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{hotel.name}</h1>
                <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{hotel.location}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-foreground">
                      <Check size={16} className="text-accent shrink-0" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">Available Rooms</h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedRoom === room.id || (!selectedRoom && room.id === hotel.rooms[0].id) ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{room.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} guests</span>
                            <span>·</span>
                            <span>{room.beds}</span>
                            <span>·</span>
                            <span>{room.size}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {room.amenities.map((a) => (
                              <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">{a}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-foreground">${room.price}</div>
                          <div className="text-sm text-muted-foreground">per night</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">Guest Reviews</h2>
                <div className="space-y-4">
                  {hotel.reviewsList.map((r) => (
                    <div key={r.id} className="bg-card rounded-xl p-5 shadow-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">{r.avatar}</div>
                        <div>
                          <div className="font-medium text-foreground">{r.author}</div>
                          <div className="text-sm text-muted-foreground">{r.date}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="fill-accent text-accent" size={14} />
                          <span className="font-semibold text-foreground text-sm">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Panel */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24 space-y-5">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">${chosen.price}</div>
                  <div className="text-muted-foreground text-sm">per night</div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Check-in</div>
                      <div className="text-sm font-medium text-foreground">Mar 15, 2026</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Check-out</div>
                      <div className="text-sm font-medium text-foreground">Mar 20, 2026</div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Guests</div>
                    <div className="text-sm font-medium text-foreground">2 Adults</div>
                  </div>
                </div>
                <hr className="border-border" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>${chosen.price} × 5 nights</span>
                    <span>${chosen.price * 5}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>${Math.round(chosen.price * 5 * 0.12)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold text-foreground text-base">
                    <span>Total</span>
                    <span>${chosen.price * 5 + Math.round(chosen.price * 5 * 0.12)}</span>
                  </div>
                </div>
                <Button
                  className="w-full h-12 bg-accent text-accent-foreground hover:bg-gold-light font-semibold text-base"
                  onClick={() => navigate(`/booking/${hotel.id}`)}
                >
                  Reserve Now
                </Button>
                <p className="text-center text-xs text-muted-foreground">No payment charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
