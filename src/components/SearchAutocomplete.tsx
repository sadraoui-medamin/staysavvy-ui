import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Tag, Clock, Star, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { hotels } from "@/data/hotels";

interface Suggestion {
  type: "hotel" | "place" | "category" | "trending";
  label: string;
  sublabel?: string;
  query: string;
  rating?: number;
  price?: number;
}

const categories = [
  { name: "Luxury Resort", icon: "🏨" },
  { name: "Beach Resort", icon: "🏖️" },
  { name: "City Hotel", icon: "🏙️" },
  { name: "Mountain Lodge", icon: "⛰️" },
  { name: "Boutique Hotel", icon: "✨" },
  { name: "Spa & Wellness", icon: "💆" },
];

const trendingSearches = [
  "Maldives beach resort",
  "Paris luxury hotel",
  "Bali wellness retreat",
  "Swiss mountain lodge",
];

const typeIcon = {
  hotel: Building2,
  place: MapPin,
  category: Tag,
  trending: TrendingUp,
};

const typeLabel = {
  hotel: "Hotel",
  place: "Destination",
  category: "Category",
  trending: "Trending",
};

interface Props {
  variant?: "hero" | "page";
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export function SearchAutocomplete({ variant = "hero", onSearch, defaultValue = "" }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      // Show trending when empty and focused
      return trendingSearches.map((t) => ({
        type: "trending" as const,
        label: t,
        query: t,
      }));
    }
    const q = query.toLowerCase();
    const results: Suggestion[] = [];

    hotels.forEach((h) => {
      if (h.name.toLowerCase().includes(q)) {
        results.push({ type: "hotel", label: h.name, sublabel: h.location, query: h.name, rating: h.rating, price: h.price });
      }
    });

    const places = [...new Set(hotels.map((h) => h.location))];
    places.forEach((loc) => {
      if (loc.toLowerCase().includes(q)) {
        const count = hotels.filter((h) => h.location === loc).length;
        const avgPrice = Math.round(hotels.filter((h) => h.location === loc).reduce((s, h) => s + h.price, 0) / count);
        results.push({ type: "place", label: loc, sublabel: `${count} hotel${count > 1 ? "s" : ""} · from $${avgPrice}`, query: loc });
      }
    });

    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        const count = hotels.filter((h) => h.category === c.name).length;
        results.push({ type: "category", label: `${c.icon} ${c.name}`, sublabel: `${count} properties`, query: c.name });
      }
    });

    return results.slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (s: Suggestion) => {
    const cleanLabel = s.label.replace(/^[^\w]+ /, "");
    setQuery(cleanLabel);
    setOpen(false);
    if (onSearch) {
      onSearch(s.query);
    } else {
      navigate(`/search?q=${encodeURIComponent(s.query)}`);
    }
  };

  const handleSubmit = () => {
    setOpen(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isPage = variant === "page";

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={isPage ? 18 : 17} />
      <Input
        ref={inputRef}
        placeholder="Search hotels, destinations, categories..."
        className={`pl-10 ${isPage ? "h-11 pr-9" : "h-13"} bg-muted/50 border-0 text-foreground rounded-xl text-sm`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {isPage && query && (
        <button
          onClick={() => { setQuery(""); onSearch?.(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
        >
          <X size={14} />
        </button>
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden z-50 animate-fade-in max-h-[400px] overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/30">
              Trending Searches
            </div>
          )}
          {suggestions.map((s, i) => {
            const Icon = typeIcon[s.type];
            return (
              <button
                key={`${s.type}-${s.label}-${i}`}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === activeIndex ? "bg-accent/10" : "hover:bg-muted/50"
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(s)}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.label}</p>
                  {s.sublabel && <p className="text-xs text-muted-foreground">{s.sublabel}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.rating && (
                    <span className="flex items-center gap-0.5 text-xs text-accent">
                      <Star size={10} className="fill-accent" /> {s.rating}
                    </span>
                  )}
                  {s.price && (
                    <span className="text-xs font-medium text-foreground">${s.price}</span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {typeLabel[s.type]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
