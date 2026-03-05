import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Users, Check, ChevronLeft, ChevronRight, Wifi, UtensilsCrossed, Dumbbell, Car, Heart, Share2, Grid3X3, ArrowLeft } from "lucide-react";
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
  const [showAllImages, setShowAllImages] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display text-foreground mb-2">Hotel not found</h1>
            <p className="text-muted-foreground mb-6">The hotel you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/search")} className="bg-accent text-accent-foreground hover:bg-accent/90">Back to Search</Button>
          </div>
        </div>
      </div>
    );
  }

  const chosen = hotel.rooms.find((r) => r.id === selectedRoom) || hotel.rooms[0];
  const nights = 5;
  const subtotal = chosen.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mosaic Gallery */}
      <div className="pt-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back + Actions Bar */}
        <div className="flex items-center justify-between py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2.5 rounded-full border border-border hover:bg-muted/50 transition-colors ${liked ? "text-red-500" : "text-muted-foreground"}`}>
              <Heart size={18} className={liked ? "fill-current" : ""} />
            </button>
            <button className="p-2.5 rounded-full border border-border text-muted-foreground hover:bg-muted/50 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Image Mosaic Grid */}
        <div className="relative rounded-2xl overflow-hidden">
          {showAllImages ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hotel.images.map((img, i) => (
                <img key={i} src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => { setCurrentImage(i); setShowAllImages(false); }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[420px]">
              <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => setCurrentImage(0)}>
                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
              </div>
              {hotel.images.slice(1, 3).map((img, i) => (
                <div key={i} className="hidden md:block relative group cursor-pointer" onClick={() => setCurrentImage(i + 1)}>
                  <img src={img} alt={`${hotel.name} ${i + 2}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </div>
              ))}
              {hotel.images[3] && (
                <div className="hidden md:block relative group cursor-pointer" onClick={() => setCurrentImage(3)}>
                  <img src={hotel.images[3]} alt={`${hotel.name} 4`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </div>
              )}
              {/* Mobile: show nav arrows on main image */}
              <div className="absolute inset-0 md:hidden">
                <img src={hotel.images[currentImage]} alt={hotel.name} className="w-full h-full object-cover" />
                {hotel.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p - 1 + hotel.images.length) % hotel.images.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2">
                      <ChevronLeft size={18} className="text-foreground" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p + 1) % hotel.images.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2">
                      <ChevronRight size={18} className="text-foreground" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {hotel.images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }} className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-accent w-5" : "bg-card/60"}`} />
                  ))}
                </div>
              </div>
              {/* Show all button */}
              <button onClick={() => setShowAllImages(true)} className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors flex items-center gap-2 shadow-card">
                <Grid3X3 size={16} />
                Show all photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent rounded-full px-3 py-1">
                  <Star className="fill-accent text-accent" size={14} />
                  <span className="font-semibold text-sm">{hotel.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="text-muted-foreground text-sm">{hotel.reviews.toLocaleString()} reviews</span>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin size={14} /> {hotel.location}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">{hotel.name}</h1>
            </div>

            {/* Divider */}
            <hr className="border-border" />

            {/* About */}
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-5">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Rooms */}
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-5">Choose your room</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isActive = selectedRoom === room.id || (!selectedRoom && room.id === hotel.rooms[0].id);
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`group relative p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "border-accent bg-accent/5 shadow-card"
                          : "border-border hover:border-accent/40 hover:shadow-card"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                          Selected
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} guests</span>
                            <span className="text-border">|</span>
                            <span>{room.beds}</span>
                            <span className="text-border">|</span>
                            <span>{room.size}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {room.amenities.map((a) => (
                              <span key={a} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg font-medium">{a}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold text-foreground">${room.price}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">per night</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="border-border" />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-display font-semibold text-foreground">Guest Reviews</h2>
                <div className="flex items-center gap-2 bg-accent/10 rounded-full px-3 py-1.5">
                  <Star className="fill-accent text-accent" size={16} />
                  <span className="font-bold text-foreground">{hotel.rating}</span>
                  <span className="text-muted-foreground text-sm">/ 5</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.reviewsList.map((r) => (
                  <div key={r.id} className="bg-card rounded-2xl p-5 border border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">{r.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="fill-accent text-accent" size={12} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-0">
              <div className="bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden">
                {/* Price header */}
                <div className="bg-primary p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-foreground">${chosen.price}</span>
                    <span className="text-primary-foreground/70 text-sm">/ night</span>
                  </div>
                  <p className="text-primary-foreground/60 text-xs mt-1">{chosen.name}</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Date inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border p-3 hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Check-in</div>
                      <div className="text-sm font-medium text-foreground">Mar 15, 2026</div>
                    </div>
                    <div className="rounded-xl border border-border p-3 hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Check-out</div>
                      <div className="text-sm font-medium text-foreground">Mar 20, 2026</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border p-3 hover:border-accent/50 transition-colors cursor-pointer">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Guests</div>
                    <div className="text-sm font-medium text-foreground">2 Adults</div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">${chosen.price} × {nights} nights</span>
                      <span className="text-foreground">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes & fees</span>
                      <span className="text-foreground">${taxes}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">${total}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base rounded-xl shadow-card hover:shadow-card-hover transition-all"
                    onClick={() => navigate(`/booking/${hotel.id}`)}
                  >
                    Reserve Now
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>
                </div>
              </div>

              {/* Quick info card */}
              <div className="mt-4 bg-card rounded-2xl border border-border/50 p-5 shadow-card">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Free cancellation</p>
                    <p className="text-xs text-muted-foreground">Cancel up to 48h before check-in</p>
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
