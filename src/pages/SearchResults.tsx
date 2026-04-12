import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Star, X, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HotelCard } from "@/components/HotelCard";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { hotels } from "@/data/hotels";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const allAmenities = ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Parking", "Room Service", "Private Beach", "Water Sports", "Sauna", "Business Center"];
const allCategories = ["Luxury Resort", "Beach Resort", "City Hotel", "Mountain Lodge", "Boutique Hotel", "Spa & Wellness"];
const starOptions = [3, 4, 5];
const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = (minRating > 0 ? 1 : 0) + (priceRange[1] < 1500 ? 1 : 0) + selectedAmenities.length + selectedCategories.length + selectedStars.length;

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((h) => {
      if (query && !h.name.toLowerCase().includes(query.toLowerCase()) && !h.location.toLowerCase().includes(query.toLowerCase()) && !h.category.toLowerCase().includes(query.toLowerCase())) return false;
      if (h.price < priceRange[0] || h.price > priceRange[1]) return false;
      if (h.rating < minRating) return false;
      if (selectedAmenities.length && !selectedAmenities.every((a) => h.amenities.includes(a))) return false;
      if (selectedCategories.length && !selectedCategories.includes(h.category)) return false;
      if (selectedStars.length && !selectedStars.includes(h.starRating)) return false;
      return true;
    });
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") result.sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [query, priceRange, minRating, selectedAmenities, selectedCategories, selectedStars, sort]);

  const toggleAmenity = (a: string) => setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const toggleCategory = (c: string) => setSelectedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  const toggleStar = (s: number) => setSelectedStars((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const clearAllFilters = () => {
    setPriceRange([0, 1500]);
    setMinRating(0);
    setSelectedAmenities([]);
    setSelectedCategories([]);
    setSelectedStars([]);
    setSort("recommended");
  };

  const handleSearch = (q: string) => {
    setSearchParams(q ? { q } : {});
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Price Range</h3>
        <input type="range" min={0} max={1500} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-accent" />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>$0</span>
          <span className="font-medium text-foreground">Up to ${priceRange[1]}</span>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Star Rating</h3>
        <div className="flex gap-2">
          {starOptions.map((s) => (
            <button key={s} onClick={() => toggleStar(s)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedStars.includes(s) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s} <Star size={11} className="fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Guest Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${minRating === r ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {r === 0 ? "All" : <span className="flex items-center gap-1"><Star size={11} className="fill-current" />{r}+</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Property Type</h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((c) => (
            <button key={c} onClick={() => toggleCategory(c)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategories.includes(c) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 text-sm">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {allAmenities.map((a) => (
            <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedAmenities.includes(a) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="w-full text-destructive" onClick={clearAllFilters}>
          <X size={14} className="mr-1" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Search Bar on Search Page */}
          <div className="max-w-2xl mb-8">
            <SearchAutocomplete variant="page" onSearch={handleSearch} defaultValue={query} />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {query ? `Results for "${query}"` : "All Hotels"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{filteredHotels.length} properties found</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Button variant="outline" size="sm" className="md:hidden relative" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={14} className="mr-1.5" /> Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ArrowUpDown size={14} />
                    <span className="hidden sm:inline">Sort</span>
                    <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                    {sortOptions.map((o) => (
                      <DropdownMenuRadioItem key={o.value} value={o.value}>{o.label}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {priceRange[1] < 1500 && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setPriceRange([0, 1500])}>
                  Up to ${priceRange[1]} <X size={12} />
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setMinRating(0)}>
                  {minRating}+ rating <X size={12} />
                </Badge>
              )}
              {selectedStars.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleStar(s)}>
                  {s}-star <X size={12} />
                </Badge>
              ))}
              {selectedCategories.map((c) => (
                <Badge key={c} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleCategory(c)}>
                  {c} <X size={12} />
                </Badge>
              ))}
              {selectedAmenities.map((a) => (
                <Badge key={a} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleAmenity(a)}>
                  {a} <X size={12} />
                </Badge>
              ))}
              <button onClick={clearAllFilters} className="text-xs text-destructive hover:underline font-medium">Clear all</button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop filters */}
            <aside className="hidden md:block w-72 shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-foreground">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="text-[10px]">{activeFilterCount} active</Badge>
                  )}
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile filters */}
            {showFilters && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[85vh] overflow-auto animate-slide-in-bottom">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-foreground text-lg">Filters</h2>
                    <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                  </div>
                  <FilterPanel />
                  <Button className="w-full mt-6 bg-accent text-accent-foreground" onClick={() => setShowFilters(false)}>
                    Show {filteredHotels.length} Results
                  </Button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              {filteredHotels.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="text-xl font-display text-foreground mb-2">No hotels found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={clearAllFilters}>Clear Filters</Button>
                  )}
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
