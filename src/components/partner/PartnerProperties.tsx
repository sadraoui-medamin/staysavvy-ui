import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, Building2, Star, Eye, Pencil, Trash2, MapPin,
  BedDouble, Users, XCircle, AlertTriangle, CheckCircle, Clock,
  ImagePlus, X as XIcon, LayoutGrid, List,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface Property {
  id: string;
  name: string;
  location: string;
  rooms: number;
  rating: number;
  bookings: number;
  status: "Active" | "Inactive" | "PendingDeletion";
  occupancy: number;
  description: string;
  amenities: string;
  images: string[];
  deleteRequestedAt?: number;
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
];

const initialProperties: Property[] = [
  { id: "p1", name: "Grand Hotel Paris", location: "Paris, France", rooms: 120, rating: 4.8, bookings: 342, status: "Active", occupancy: 87, description: "Luxury hotel in central Paris", amenities: "WiFi, Pool, Spa, Restaurant", images: [placeholderImages[0], placeholderImages[1]] },
  { id: "p2", name: "Seaside Resort", location: "Nice, France", rooms: 85, rating: 4.6, bookings: 218, status: "Active", occupancy: 74, description: "Beachfront resort on the Riviera", amenities: "WiFi, Beach, Pool, Bar", images: [placeholderImages[2]] },
  { id: "p3", name: "Mountain Lodge", location: "Chamonix, France", rooms: 45, rating: 4.9, bookings: 156, status: "Active", occupancy: 92, description: "Cozy alpine lodge near ski slopes", amenities: "WiFi, Fireplace, Ski Storage, Sauna", images: [placeholderImages[1], placeholderImages[0]] },
  { id: "p4", name: "City Center Inn", location: "Lyon, France", rooms: 60, rating: 4.3, bookings: 98, status: "Inactive", occupancy: 45, description: "Budget-friendly city hotel", amenities: "WiFi, Parking, Breakfast", images: [] },
];

const statusFilters = ["All", "Active", "Inactive", "PendingDeletion"] as const;
const sortOptions = [
  { label: "Name A-Z", value: "name-asc" },
  { label: "Name Z-A", value: "name-desc" },
  { label: "Rating: High→Low", value: "rating-desc" },
  { label: "Most Reserved", value: "bookings-desc" },
  { label: "Occupancy: High→Low", value: "occ-desc" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-accent/10 text-accent border border-accent/20";
    case "Inactive": return "bg-muted text-muted-foreground border border-border";
    case "PendingDeletion": return "bg-destructive/10 text-destructive border border-destructive/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

const statusLabel = (status: string) => {
  if (status === "PendingDeletion") return "Deleting in 3 days";
  return status;
};

interface FormData {
  name: string;
  location: string;
  rooms: number;
  rating: number;
  bookings: number;
  status: "Active" | "Inactive";
  occupancy: number;
  description: string;
  amenities: string;
  images: string[];
}

const emptyForm: FormData = {
  name: "", location: "", rooms: 0, rating: 0, bookings: 0,
  status: "Active", occupancy: 0, description: "", amenities: "", images: [],
};

const PartnerProperties = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Property | null>(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter(p => p.status === "Active").length;
    const totalRooms = properties.reduce((s, p) => s + p.rooms, 0);
    const avgOcc = properties.length ? Math.round(properties.reduce((s, p) => s + p.occupancy, 0) / properties.length) : 0;
    return { total, active, totalRooms, avgOcc };
  }, [properties]);

  const filtered = useMemo(() => {
    let result = [...properties];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") result = result.filter(p => p.status === statusFilter);
    if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "rating-desc") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "bookings-desc") result.sort((a, b) => b.bookings - a.bookings);
    else if (sort === "occ-desc") result.sort((a, b) => b.occupancy - a.occupancy);
    return result;
  }, [properties, search, statusFilter, sort]);

  const openCreate = () => {
    setFormData(emptyForm);
    setIsCreating(true);
  };

  const openEdit = (p: Property) => {
    setFormData({ name: p.name, location: p.location, rooms: p.rooms, rating: p.rating, bookings: p.bookings, status: p.status === "PendingDeletion" ? "Active" : p.status, occupancy: p.occupancy, description: p.description, amenities: p.amenities, images: [...p.images] });
    setEditProperty(p);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setFormData(f => ({ ...f, images: [...f.images, result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setFormData(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const saveProperty = () => {
    if (!formData.name || !formData.location) {
      toast({ title: "Error", description: "Name and location are required.", variant: "destructive" });
      return;
    }
    if (isCreating) {
      const newProp: Property = { ...formData, id: `p${Date.now()}`, rating: 0, bookings: 0, occupancy: 0, status: "Active" };
      setProperties(prev => [...prev, newProp]);
      toast({ title: "Property Created", description: `${formData.name} has been added.` });
      setIsCreating(false);
    } else if (editProperty) {
      setProperties(prev => prev.map(p => p.id === editProperty.id ? { ...p, ...formData } : p));
      toast({ title: "Property Updated", description: `${formData.name} has been updated.` });
      setEditProperty(null);
    }
  };

  const requestDelete = (p: Property) => { setDeleteConfirm(p); };
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setProperties(prev => prev.map(p => p.id === deleteConfirm.id ? { ...p, status: "PendingDeletion" as const, deleteRequestedAt: Date.now() } : p));
    toast({ title: "Deletion Scheduled", description: `${deleteConfirm.name} will be deleted in 3 days.` });
    setDeleteConfirm(null);
  };
  const cancelDelete = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: "Active" as const, deleteRequestedAt: undefined } : p));
    toast({ title: "Deletion Cancelled" });
  };
  const toggleStatus = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: p.status === "Active" ? "Inactive" as const : "Active" as const };
    }));
    toast({ title: "Status Updated" });
  };

  const getDaysRemaining = (p: Property) => {
    if (!p.deleteRequestedAt) return 3;
    const elapsed = (Date.now() - p.deleteRequestedAt) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(3 - elapsed));
  };

  const statCards = [
    { label: "Total Properties", value: stats.total, icon: Building2, color: "text-primary" },
    { label: "Active", value: stats.active, icon: CheckCircle, color: "text-accent" },
    { label: "Total Rooms", value: stats.totalRooms, icon: BedDouble, color: "text-muted-foreground" },
    { label: "Avg Occupancy", value: `${stats.avgOcc}%`, icon: Users, color: "text-accent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground text-sm">Manage your listed hotels and properties</p>
        </div>
        <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm">
          <Plus size={16} /> Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 hover:shadow-card-hover transition-all">
            <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${s.color}`}><s.icon size={20} /></div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {s === "PendingDeletion" ? "Pending Delete" : s}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex border border-border rounded-xl overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className={`px-3 py-2 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border/50">
            <Building2 size={40} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No properties found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className={`bg-card rounded-2xl border overflow-hidden hover:shadow-card-hover transition-all duration-300 group ${p.status === "PendingDeletion" ? "border-destructive/30 bg-destructive/5" : "border-border/50 hover:border-accent/30"}`}>
              {/* Image */}
              {p.images.length > 0 && (
                <div className="relative h-40 overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md text-foreground">
                      +{p.images.length - 1} more
                    </span>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-foreground text-lg group-hover:text-accent transition-colors truncate">{p.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={13} /> {p.location}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${statusColor(p.status)}`}>
                    {statusLabel(p.status)}
                  </span>
                </div>

                {p.status === "PendingDeletion" && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle size={14} className="text-destructive shrink-0" />
                    <p className="text-xs text-destructive">{getDaysRemaining(p)} day{getDaysRemaining(p) !== 1 ? "s" : ""} until permanent deletion</p>
                    <button onClick={() => cancelDelete(p.id)} className="ml-auto text-xs font-medium text-destructive underline underline-offset-2 hover:no-underline">Cancel</button>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-semibold text-foreground">{p.occupancy}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-gold-light rounded-full transition-all duration-500" style={{ width: `${p.occupancy}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{p.rooms}</p>
                    <p className="text-xs text-muted-foreground">Rooms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground flex items-center justify-center gap-0.5"><Star size={13} className="text-accent" />{p.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{p.bookings}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-5 flex-wrap">
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-1" onClick={() => { setViewProperty(p); setViewImageIndex(0); }}>
                    <Eye size={14} /> View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-lg gap-1" onClick={() => openEdit(p)}>
                    <Pencil size={14} /> Edit
                  </Button>
                  {p.status !== "PendingDeletion" && (
                    <Button variant="outline" size="sm" className="rounded-lg gap-1 text-primary border-primary/30 hover:bg-primary/5" onClick={() => toggleStatus(p.id)}>
                      {p.status === "Active" ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      {p.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                  {p.status !== "PendingDeletion" && (
                    <Button variant="outline" size="sm" className="rounded-lg gap-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => requestDelete(p)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Property Dialog */}
      <Dialog open={!!viewProperty} onOpenChange={() => setViewProperty(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{viewProperty?.name}</DialogTitle>
          </DialogHeader>
          {viewProperty && (
            <div className="space-y-4 text-sm">
              {/* Image Gallery */}
              {viewProperty.images.length > 0 && (
                <div>
                  <div className="rounded-xl overflow-hidden h-64 mb-2">
                    <img src={viewProperty.images[viewImageIndex]} alt={viewProperty.name} className="w-full h-full object-cover" />
                  </div>
                  {viewProperty.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {viewProperty.images.map((img, i) => (
                        <button key={i} onClick={() => setViewImageIndex(i)} className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === viewImageIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground text-xs mb-1">Location</p><p className="font-medium text-foreground">{viewProperty.location}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Status</p><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(viewProperty.status)}`}>{statusLabel(viewProperty.status)}</span></div>
                <div><p className="text-muted-foreground text-xs mb-1">Rooms</p><p className="font-medium text-foreground">{viewProperty.rooms}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Rating</p><p className="font-medium text-foreground flex items-center gap-1"><Star size={13} className="text-accent" /> {viewProperty.rating}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Bookings</p><p className="font-medium text-foreground">{viewProperty.bookings}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Occupancy</p><p className="font-medium text-foreground">{viewProperty.occupancy}%</p></div>
              </div>
              <div><p className="text-muted-foreground text-xs mb-1">Description</p><p className="font-medium text-foreground">{viewProperty.description}</p></div>
              <div><p className="text-muted-foreground text-xs mb-1">Amenities</p><div className="flex flex-wrap gap-1.5 mt-1">{viewProperty.amenities.split(",").map((a, i) => <span key={i} className="px-2.5 py-1 bg-muted rounded-lg text-xs font-medium text-foreground">{a.trim()}</span>)}</div></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isCreating || !!editProperty} onOpenChange={() => { setIsCreating(false); setEditProperty(null); }}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{isCreating ? "Add New Property" : "Edit Property"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Property Name *</label>
                <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Location *</label>
                <Input value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Number of Rooms</label>
                <Input type="number" value={formData.rooms} onChange={e => setFormData(f => ({ ...f, rooms: +e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                <select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as "Active" | "Inactive" }))} className="w-full h-10 px-3 rounded-lg border border-border bg-muted/30 text-foreground text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
              <Input value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Amenities (comma-separated)</label>
              <Input value={formData.amenities} onChange={e => setFormData(f => ({ ...f, amenities: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Property Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-border group/img">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <XIcon size={10} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-16 rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-accent transition-colors"
                >
                  <ImagePlus size={16} />
                  <span className="text-[10px]">Add</span>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <p className="text-[10px] text-muted-foreground">Upload JPG, PNG or WebP images</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditProperty(null); }} className="rounded-lg">Cancel</Button>
            <Button onClick={saveProperty} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-lg">{isCreating ? "Create" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-destructive">
              <AlertTriangle size={20} /> Schedule Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            <p><strong className="text-foreground">{deleteConfirm?.name}</strong> will be permanently deleted in <strong className="text-foreground">3 days</strong>.</p>
            <p className="mt-2">You can cancel this action anytime within the 3-day period.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-lg">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg gap-1.5">
              <Trash2 size={14} /> Schedule Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerProperties;
