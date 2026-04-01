import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Tag, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { hotels } from "@/data/hotels";

interface Suggestion {
  type: "hotel" | "place" | "category";
  label: string;
  sublabel?: string;
  query: string;
}

const categories = [
  { name: "Luxury Resort", icon: "🏨" },
  { name: "Beach Resort", icon: "🏖️" },
  { name: "City Hotel", icon: "🏙️" },
  { name: "Mountain Lodge", icon: "⛰️" },
  { name: "Boutique Hotel", icon: "✨" },
  { name: "Spa & Wellness", icon: "💆" },
];

const typeIcon = {
  hotel: Building2,
  place: MapPin,
  category: Tag,
};

const typeLabel = {
  hotel: "Hotel",
  place: "Destination",
  category: "Category",
};

export function SearchAutocomplete() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: Suggestion[] = [];

    // Hotels by name
    hotels.forEach((h) => {
      if (h.name.toLowerCase().includes(q)) {
        results.push({ type: "hotel", label: h.name, sublabel: h.location, query: h.name });
      }
    });

    // Places (unique locations)
    const places = [...new Set(hotels.map((h) => h.location))];
    places.forEach((loc) => {
      if (loc.toLowerCase().includes(q)) {
        const count = hotels.filter((h) => h.location === loc).length;
        results.push({ type: "place", label: loc, sublabel: `${count} hotel${count > 1 ? "s" : ""}`, query: loc });
      }
    });

    // Categories
    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        results.push({ type: "category", label: `${c.icon} ${c.name}`, query: c.name });
      }
    });

    return results.slice(0, 8);
  }, [query]);

  // Close on outside click
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
    setQuery(s.label.replace(/^[^\w]+ /, ""));
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(s.query)}`);
  };

  const handleSubmit = () => {
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
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

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={17} />
      <Input
        ref={inputRef}
        placeholder="Search hotels, destinations, categories..."
        className="pl-10 h-13 bg-muted/50 border-0 text-foreground rounded-xl text-sm"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-elevated overflow-hidden z-50 animate-fade-in">
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
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                  {typeLabel[s.type]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
