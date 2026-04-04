import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Download, CalendarCheck, DollarSign, Clock, CheckCircle,
  XCircle, MapPin, Calendar, Eye, User, Phone, Mail,
  Check, X, LogIn, LogOut, MessageSquare,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PartnerBooking {
  id: string;
  guest: string;
  guestEmail: string;
  guestPhone: string;
  hotel: string;
  location: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  status: "Confirmed" | "Pending" | "CheckedIn" | "CheckedOut" | "Completed" | "Cancelled" | "Rejected";
  amount: number;
  paymentMethod: string;
  specialRequests: string;
  roomType: string;
  notes: string[];
}

const initialBookings: PartnerBooking[] = [
  { id: "BK-001", guest: "Alice Martin", guestEmail: "alice@email.com", guestPhone: "+33 6 12 34 56", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-03-05", checkOut: "2026-03-08", rooms: 1, guests: 2, status: "Confirmed", amount: 540, paymentMethod: "Visa •••• 4242", specialRequests: "Late check-in, extra pillows", roomType: "Deluxe Double", notes: [] },
  { id: "BK-002", guest: "Robert Chen", guestEmail: "robert@email.com", guestPhone: "+33 6 98 76 54", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-03-10", checkOut: "2026-03-14", rooms: 2, guests: 4, status: "Pending", amount: 980, paymentMethod: "Mastercard •••• 8888", specialRequests: "Adjoining rooms", roomType: "Superior Twin", notes: [] },
  { id: "BK-003", guest: "Sarah Johnson", guestEmail: "sarah@email.com", guestPhone: "+44 7 123 456", hotel: "Seaside Resort", location: "Nice, France", checkIn: "2026-03-12", checkOut: "2026-03-15", rooms: 1, guests: 2, status: "Confirmed", amount: 720, paymentMethod: "Visa •••• 1234", specialRequests: "Sea view room", roomType: "Suite", notes: [] },
  { id: "BK-004", guest: "James Wilson", guestEmail: "james@email.com", guestPhone: "+1 555 123 456", hotel: "Mountain Lodge", location: "Chamonix, France", checkIn: "2026-02-20", checkOut: "2026-02-23", rooms: 1, guests: 3, status: "CheckedIn", amount: 450, paymentMethod: "PayPal", specialRequests: "Ski storage access", roomType: "Mountain View", notes: ["Guest arrived early"] },
  { id: "BK-005", guest: "Emma Davis", guestEmail: "emma@email.com", guestPhone: "+1 555 789 012", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-02-15", checkOut: "2026-02-18", rooms: 1, guests: 2, status: "Cancelled", amount: 660, paymentMethod: "Amex •••• 3456", specialRequests: "", roomType: "Standard Double", notes: ["Cancelled by guest"] },
  { id: "BK-006", guest: "Liam Brown", guestEmail: "liam@email.com", guestPhone: "+44 7 987 654", hotel: "Seaside Resort", location: "Nice, France", checkIn: "2026-04-01", checkOut: "2026-04-05", rooms: 2, guests: 4, status: "Pending", amount: 1200, paymentMethod: "Visa •••• 9090", specialRequests: "Airport transfer", roomType: "Family Suite", notes: [] },
  { id: "BK-007", guest: "Sophia Lee", guestEmail: "sophia@email.com", guestPhone: "+82 10 1234 5678", hotel: "Mountain Lodge", location: "Chamonix, France", checkIn: "2026-01-10", checkOut: "2026-01-13", rooms: 1, guests: 2, status: "Completed", amount: 390, paymentMethod: "Mastercard •••• 5555", specialRequests: "", roomType: "Cozy Cabin", notes: ["Left positive review"] },
];

const statusFilters = ["All", "Pending", "Confirmed", "CheckedIn", "CheckedOut", "Completed", "Cancelled", "Rejected"] as const;
const sortOptions = [
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
  { label: "Amount: High→Low", value: "amount-desc" },
  { label: "Amount: Low→High", value: "amount-asc" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Confirmed": return "bg-accent/10 text-accent border border-accent/20";
    case "Pending": return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
    case "CheckedIn": return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
    case "CheckedOut": return "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20";
    case "Completed": return "bg-primary/10 text-primary border border-primary/20";
    case "Cancelled": return "bg-destructive/10 text-destructive border border-destructive/20";
    case "Rejected": return "bg-destructive/10 text-destructive border border-destructive/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

const statusLabel = (s: string) => {
  if (s === "CheckedIn") return "Checked In";
  if (s === "CheckedOut") return "Checked Out";
  return s;
};

const PartnerBookings = () => {
  const [bookings, setBookings] = useState<PartnerBooking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("date-desc");
  const [viewBooking, setViewBooking] = useState<PartnerBooking | null>(null);
  const [noteText, setNoteText] = useState("");
  const [rejectConfirm, setRejectConfirm] = useState<PartnerBooking | null>(null);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === "Confirmed").length;
    const pending = bookings.filter(b => b.status === "Pending").length;
    const checkedIn = bookings.filter(b => b.status === "CheckedIn").length;
    const revenue = bookings.filter(b => !["Cancelled", "Rejected"].includes(b.status)).reduce((s, b) => s + b.amount, 0);
    return { total, confirmed, pending, checkedIn, revenue };
  }, [bookings]);

  const filtered = useMemo(() => {
    let result = [...bookings];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.guest.toLowerCase().includes(q) || b.hotel.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") result = result.filter(b => b.status === statusFilter);
    if (sort === "date-desc") result.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    else if (sort === "date-asc") result.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    else if (sort === "amount-desc") result.sort((a, b) => b.amount - a.amount);
    else if (sort === "amount-asc") result.sort((a, b) => a.amount - b.amount);
    return result;
  }, [bookings, search, statusFilter, sort]);

  const updateStatus = (id: string, newStatus: PartnerBooking["status"]) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    setViewBooking(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
    toast({ title: "Status Updated", description: `Booking ${id} is now ${statusLabel(newStatus)}.` });
  };

  const addNote = (id: string) => {
    if (!noteText.trim()) return;
    const note = `[${new Date().toLocaleString()}] ${noteText}`;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, notes: [...b.notes, note] } : b));
    setViewBooking(prev => prev && prev.id === id ? { ...prev, notes: [...prev.notes, note] } : prev);
    setNoteText("");
    toast({ title: "Note Added" });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bookings Report", 14, 22);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | ${filtered.length} bookings`, 14, 29);
    autoTable(doc, {
      startY: 36,
      head: [["ID", "Guest", "Hotel", "Room", "Check-in", "Check-out", "Status", "Amount"]],
      body: filtered.map(b => [b.id, b.guest, b.hotel, b.roomType, b.checkIn, b.checkOut, statusLabel(b.status), `$${b.amount}`]),
      theme: "striped",
      headStyles: { fillColor: [41, 37, 36] },
    });
    doc.save("bookings-report.pdf");
    toast({ title: "PDF Exported", description: "Bookings report downloaded." });
  };

  // Automatic status engine: updates statuses based on dates
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setBookings(prev => prev.map(b => {
      // Auto-confirm pending bookings (simulate availability check passed)
      if (b.status === "Pending" && b.checkIn > today) {
        return { ...b, status: "Confirmed" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto-confirmed: availability verified`] };
      }
      // Auto check-in on check-in date
      if (b.status === "Confirmed" && b.checkIn <= today && b.checkOut > today) {
        return { ...b, status: "CheckedIn" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto checked-in on arrival date`] };
      }
      // Auto check-out on check-out date
      if (b.status === "CheckedIn" && b.checkOut <= today) {
        return { ...b, status: "CheckedOut" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto checked-out on departure date`] };
      }
      // Auto complete after checkout
      if (b.status === "CheckedOut") {
        return { ...b, status: "Completed" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto-completed after checkout`] };
      }
      return b;
    }));
  }, []); // runs once on mount

  const getStatusInfo = (b: PartnerBooking) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (b.status === "Confirmed" && b.checkIn > today) return "Awaiting guest arrival";
    if (b.status === "CheckedIn") return "Guest currently staying";
    if (b.status === "Completed") return "Stay completed";
    return null;
  };

  const getActions = (b: PartnerBooking) => {
    // All status transitions are automatic; only manual override for viewing
    const actions: { label: string; icon: typeof Check; onClick: () => void; variant: string }[] = [];
    // Allow manual reject for pending (edge case where system hasn't auto-confirmed yet)
    if (b.status === "Pending") {
      actions.push({ label: "Reject", icon: X, onClick: () => setRejectConfirm(b), variant: "text-destructive" });
    }
    return actions;
  };

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: CalendarCheck, color: "text-primary" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-accent" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
    { label: "Checked In", value: stats.checkedIn, icon: LogIn, color: "text-blue-600" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm">Manage reservations: accept, check-in, and track guests</p>
        </div>
        <Button variant="outline" onClick={exportPDF} className="gap-2 rounded-xl">
          <Download size={16} /> Export PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 hover:shadow-card-hover transition-all">
            <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by guest, hotel, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${statusFilter === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {s === "CheckedIn" ? "Checked In" : s === "CheckedOut" ? "Checked Out" : s}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm w-full sm:w-auto">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
            <CalendarCheck size={40} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No bookings found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map(b => {
            const actions = getActions(b);
            return (
              <div key={b.id} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/20 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColor(b.status)}`}>{statusLabel(b.status)}</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{b.roomType}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-base">{b.guest}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin size={13} /> {b.hotel}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> {b.checkIn} → {b.checkOut}</span>
                      <span>{b.guests} guests · {b.rooms} room{b.rooms > 1 ? "s" : ""}</span>
                    </div>
                    {getStatusInfo(b) && (
                      <p className="text-xs text-accent mt-1 flex items-center gap-1"><Clock size={12} /> {getStatusInfo(b)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">${b.amount}</p>
                      <p className="text-xs text-muted-foreground">total</p>
                    </div>
                    <div className="flex gap-1.5">
                      {actions.map(a => (
                        <Button key={a.label} size="sm" variant="outline" className={`rounded-lg gap-1 ${a.variant}`} onClick={a.onClick}>
                          <a.icon size={14} /> {a.label}
                        </Button>
                      ))}
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => { setViewBooking(b); setNoteText(""); }}>
                        <Eye size={14} /> View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Booking Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Booking Details — {viewBooking?.id}</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-5 text-sm">
              {/* Status & Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColor(viewBooking.status)}`}>{statusLabel(viewBooking.status)}</span>
                {getActions(viewBooking).map(a => (
                  <Button key={a.label} size="sm" variant="outline" className={`rounded-lg gap-1.5 ${a.variant}`} onClick={a.onClick}>
                    <a.icon size={14} /> {a.label}
                  </Button>
                ))}
              </div>

              {/* Guest Info */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Guest Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2"><User size={14} className="text-muted-foreground" /><span className="font-medium text-foreground">{viewBooking.guest}</span></div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-muted-foreground" /><span className="text-foreground">{viewBooking.guestEmail}</span></div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /><span className="text-foreground">{viewBooking.guestPhone}</span></div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-muted-foreground text-xs mb-1">Hotel</p><p className="font-medium text-foreground">{viewBooking.hotel}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Room Type</p><p className="font-medium text-foreground">{viewBooking.roomType}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Check-in</p><p className="font-medium text-foreground">{viewBooking.checkIn}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Check-out</p><p className="font-medium text-foreground">{viewBooking.checkOut}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Guests / Rooms</p><p className="font-medium text-foreground">{viewBooking.guests} guests · {viewBooking.rooms} room{viewBooking.rooms > 1 ? "s" : ""}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Payment</p><p className="font-medium text-foreground">{viewBooking.paymentMethod}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Amount</p><p className="text-2xl font-bold text-foreground">${viewBooking.amount}</p></div>
              </div>

              {viewBooking.specialRequests && (
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Special Requests</h3>
                  <p className="text-foreground">{viewBooking.specialRequests}</p>
                </div>
              )}

              {/* Notes / Communication Log */}
              <div className="border border-border/50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare size={14} /> Notes & Activity
                </h3>
                {viewBooking.notes.length > 0 ? (
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {viewBooking.notes.map((n, i) => (
                      <div key={i} className="text-xs bg-muted/40 rounded-lg px-3 py-2 text-foreground">{n}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">No notes yet.</p>
                )}
                <div className="flex gap-2">
                  <Input
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="h-9 text-sm bg-muted/30 rounded-lg flex-1"
                    onKeyDown={e => e.key === "Enter" && addNote(viewBooking.id)}
                  />
                  <Button size="sm" onClick={() => addNote(viewBooking.id)} className="rounded-lg bg-accent text-accent-foreground hover:bg-gold-light">Add</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <Dialog open={!!rejectConfirm} onOpenChange={() => setRejectConfirm(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive flex items-center gap-2"><XCircle size={20} /> Reject Booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to reject booking <strong className="text-foreground">{rejectConfirm?.id}</strong> from <strong className="text-foreground">{rejectConfirm?.guest}</strong>? The guest will be notified.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectConfirm(null)} className="rounded-lg">Cancel</Button>
            <Button onClick={() => { if (rejectConfirm) { updateStatus(rejectConfirm.id, "Rejected"); setRejectConfirm(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg gap-1.5">
              <X size={14} /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerBookings;
