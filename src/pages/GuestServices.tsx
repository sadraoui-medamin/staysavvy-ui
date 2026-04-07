import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  UtensilsCrossed, Wrench, Sparkles, ShieldCheck, Phone,
  Plus, Clock, CheckCircle, AlertCircle, Loader2, Search,
  KeyRound, LogOut,
} from "lucide-react";

type ServiceCategory = "food" | "maintenance" | "housekeeping" | "concierge" | "other";
type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

interface ServiceRequest {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  room: string;
  priority: "low" | "medium" | "high";
}

const categoryInfo: Record<ServiceCategory, { label: string; icon: React.ElementType; color: string }> = {
  food: { label: "Food & Beverage", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "bg-blue-100 text-blue-600" },
  housekeeping: { label: "Housekeeping", icon: Sparkles, color: "bg-purple-100 text-purple-600" },
  concierge: { label: "Concierge", icon: ShieldCheck, color: "bg-emerald-100 text-emerald-600" },
  other: { label: "Other", icon: Phone, color: "bg-gray-100 text-gray-600" },
};

const statusInfo: Record<RequestStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "bg-amber-100 text-amber-700" },
  in_progress: { label: "In Progress", icon: Loader2, color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", icon: AlertCircle, color: "bg-red-100 text-red-700" },
};

const mockRequests: ServiceRequest[] = [
  { id: "SR-001", category: "food", title: "Room Service - Dinner", description: "Caesar salad and grilled salmon, 2 sparkling waters", status: "completed", createdAt: "2026-04-06 19:30", room: "412", priority: "medium" },
  { id: "SR-002", category: "maintenance", title: "AC not cooling properly", description: "The air conditioning in the room is blowing warm air since 3 PM", status: "in_progress", createdAt: "2026-04-07 08:15", room: "412", priority: "high" },
  { id: "SR-003", category: "housekeeping", title: "Extra towels & pillows", description: "Need 2 extra bath towels and 1 extra pillow", status: "pending", createdAt: "2026-04-07 10:00", room: "412", priority: "low" },
  { id: "SR-004", category: "concierge", title: "Restaurant reservation", description: "Table for 2 at Le Petit Bistro tonight at 8 PM", status: "completed", createdAt: "2026-04-06 14:00", room: "412", priority: "medium" },
];

const GuestServices = () => {
  // Simulate guest check-in status
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [roomKey, setRoomKey] = useState("");
  const [keyError, setKeyError] = useState("");

  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newCategory, setNewCategory] = useState<ServiceCategory>("food");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

  // Simulate key validation
  const handleKeySubmit = () => {
    // Accept any key that looks like "ROOM-XXX" or just non-empty for demo
    if (roomKey.trim().length >= 3) {
      setIsCheckedIn(true);
      setKeyError("");
    } else {
      setKeyError("Invalid room key. Please enter a valid key (min 3 characters).");
    }
  };

  const handleCheckout = () => {
    setIsCheckedIn(false);
    setRoomKey("");
  };

  const filtered = useMemo(() => {
    let r = [...requests];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(req => req.title.toLowerCase().includes(q) || req.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") r = r.filter(req => req.status === statusFilter);
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, search, statusFilter]);

  const handleSubmit = () => {
    if (!newTitle.trim()) return;
    const req: ServiceRequest = {
      id: `SR-${String(requests.length + 1).padStart(3, "0")}`,
      category: newCategory,
      title: newTitle,
      description: newDescription,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      room: "412",
      priority: newPriority,
    };
    setRequests(prev => [req, ...prev]);
    setShowNewDialog(false);
    setNewTitle("");
    setNewDescription("");
    setNewCategory("food");
    setNewPriority("medium");
  };

  const statCounts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    in_progress: requests.filter(r => r.status === "in_progress").length,
    completed: requests.filter(r => r.status === "completed").length,
  }), [requests]);

  // ── Gate: not checked in ──
  if (!isCheckedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[80vh]">
          <div className="max-w-md w-full mx-4">
            <div className="bg-card rounded-2xl border border-border/60 p-8 text-center shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <KeyRound size={28} className="text-accent" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">Room Service Portal</h1>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your room key code to access hotel services. This portal is only available for checked-in guests.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Enter your room key code (e.g. ROOM-412)"
                  value={roomKey}
                  onChange={e => { setRoomKey(e.target.value); setKeyError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleKeySubmit()}
                  className="h-12 text-center text-lg tracking-wider"
                />
                {keyError && <p className="text-xs text-destructive">{keyError}</p>}
                <Button onClick={handleKeySubmit} className="w-full h-12 bg-accent text-accent-foreground hover:bg-gold-light font-semibold text-base">
                  Access Services
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Your key code was provided at check-in. Contact the front desk if you need assistance.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Checked in: full service page ──
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Room 412 · Checked In</p>
              <h1 className="text-3xl font-display font-bold text-foreground">Hotel Services</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowNewDialog(true)} className="gap-2 bg-accent text-accent-foreground hover:bg-gold-light rounded-xl">
                <Plus size={16} /> New Request
              </Button>
              <Button variant="outline" onClick={handleCheckout} className="gap-2 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5">
                <LogOut size={16} /> Check Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Requests", value: statCounts.total, icon: Phone, color: "text-foreground" },
              { label: "Pending", value: statCounts.pending, icon: Clock, color: "text-amber-600" },
              { label: "In Progress", value: statCounts.in_progress, icon: Loader2, color: "text-blue-600" },
              { label: "Completed", value: statCounts.completed, icon: CheckCircle, color: "text-green-600" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl border border-border/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={16} className={s.color} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "pending", "in_progress", "completed", "cancelled"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s === "all" ? "All" : statusInfo[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border/50">
                <Phone size={40} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No requests found</h3>
                <p className="text-muted-foreground text-sm">Create a new service request to get started</p>
              </div>
            ) : (
              filtered.map(req => {
                const cat = categoryInfo[req.category];
                const stat = statusInfo[req.status];
                const CatIcon = cat.icon;
                const StatIcon = stat.icon;
                return (
                  <div key={req.id} className="bg-card rounded-xl border border-border/50 p-4 sm:p-5 hover:shadow-card-hover transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                        <CatIcon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-foreground text-sm">{req.title}</h3>
                          <Badge variant="outline" className="text-[10px]">{req.id}</Badge>
                          {req.priority === "high" && <Badge className="bg-destructive/10 text-destructive text-[10px]">High</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${stat.color}`}>
                          <StatIcon size={12} /> {stat.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{req.createdAt}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* New Request Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>New Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(categoryInfo) as ServiceCategory[]).map(cat => {
                  const c = categoryInfo[cat];
                  const Icon = c.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        newCategory === cat ? "border-accent bg-accent/5 text-accent" : "border-border/50 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <Icon size={14} /> {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Brief description of your request" className="h-11" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Details</label>
              <textarea
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Provide any additional details..."
                className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Priority</label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewPriority(p)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                      newPriority === p ? "border-accent bg-accent/5 text-accent" : "border-border/50 text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={!newTitle.trim()} className="w-full h-11 bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default GuestServices;
