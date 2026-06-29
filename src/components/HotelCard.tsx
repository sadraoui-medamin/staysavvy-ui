import { Link } from "react-router-dom";
import { Star, MapPin, Crown } from "lucide-react";
import type { Hotel } from "@/data/hotels";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const isPro = hotel.subscriptionTier === "pro";
  const isEnterprise = hotel.subscriptionTier === "enterprise";
  return (
    <Link to={`/hotel/${hotel.id}`} className="group block">
      <div className={`bg-card rounded-xl overflow-hidden shadow-card hover-lift ${isPro ? "ring-1 ring-accent/40" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {(isPro || isEnterprise) && (
            <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              isEnterprise ? "bg-foreground/90 text-background" : "bg-accent text-accent-foreground"
            }`}>
              <Crown size={10} /> {isEnterprise ? "Enterprise" : "Pro"}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
            <Star className="fill-accent text-accent" size={14} />
            <span className="text-sm font-semibold text-foreground">{hotel.rating}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
            <MapPin size={14} />
            <span className="text-sm">{hotel.location}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>{hotel.reviews.toLocaleString()} reviews</span>
            <span>·</span>
            <span>{hotel.amenities.slice(0, 3).join(" · ")}</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">${hotel.price}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

