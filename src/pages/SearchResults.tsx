import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelCard } from "@/components/HotelCard";
import { hotels } from "@/data/hotels";

const allAmenities = ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Parking", "Room Service"];
const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((h) => {
      if (query && !h.name.toLowerCase().includes(query.toLowerCase()) && !h.location.toLowerCase().includes(query.toLowerCase())) return false;
      if (h.price < priceRange[0] || h.price > priceRange[1]) return false;
      if (h.rating < minRating) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => h.amenities.includes(a))) return false;
      return true;
    });
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [query, priceRange, minRating, selectedAmenities, sort]);

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Price */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="flex gap-3">
          <input
            type="range"
            min={0}
            max={1500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-accent"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>$0</span>
          <span className="font-medium text-foreground">Up to ${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Minimum Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${minRating === r ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {r === 0 ? "All" : <span className="flex items-center gap-1"><Star size={12} className="fill-current" />{r}+</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {allAmenities.map((a) => (
            <button
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedAmenities.includes(a) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                {query ? `Hotels in "${query}"` : "All Hotels"}
              </h1>
              <p className="text-muted-foreground mt-1">{filteredHotels.length} properties found</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={16} className="mr-2" /> Filters
              </Button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop filters */}
            <aside className="hidden md:block w-72 shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <h2 className="font-semibold text-foreground mb-6">Filters</h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile filters */}
            {showFilters && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-auto animate-slide-in-bottom">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-foreground text-lg">Filters</h2>
                    <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                  </div>
                  <FilterPanel />
                  <Button className="w-full mt-6 bg-accent text-accent-foreground" onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              {filteredHotels.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-display text-foreground mb-2">No hotels found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
