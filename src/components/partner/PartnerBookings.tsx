import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Download, CalendarCheck, DollarSign, Clock, CheckCircle,
  XCircle, MapPin, Calendar, Eye, User, Phone, Mail,
  Check, X, LogIn, LogOut, MessageSquare, Filter, SortAsc,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setBookings(prev => prev.map(b => {
      if (b.status === "Pending" && b.checkIn > today) {
        return { ...b, status: "Confirmed" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto-confirmed: availability verified`] };
      }
      if (b.status === "Confirmed" && b.checkIn <= today && b.checkOut > today) {
        return { ...b, status: "CheckedIn" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto checked-in on arrival date`] };
      }
      if (b.status === "CheckedIn" && b.checkOut <= today) {
        return { ...b, status: "CheckedOut" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto checked-out on departure date`] };
      }
      if (b.status === "CheckedOut") {
        return { ...b, status: "Completed" as const, notes: [...b.notes, `[${now.toLocaleString()}] Auto-completed after checkout`] };
      }
      return b;
    }));
  }, []);

  const getStatusInfo = (b: PartnerBooking) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (b.status === "Confirmed" && b.checkIn > today) return "Awaiting guest arrival";
    if (b.status === "CheckedIn") return "Guest currently staying";
    if (b.status === "Completed") return "Stay completed";
    return null;
  };

  const getActions = (b: PartnerBooking) => {
    const actions: { label: string; icon: typeof Check; onClick: () => void; variant: string }[] = [];
    if (b.status === "Pending") {
      actions.push({ label: "Reject", icon: X, onClick: () => setRejectConfirm(b), variant: "text-destructive" });
    }
    return actions;
  };

  const statCards = [
    { label: "Total", value: stats.total, icon: CalendarCheck, color: "text-primary" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-accent" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
    { label: "Checked In", value: stats.checkedIn, icon: LogIn, color: "text-blue-600" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  const activeFilterCount = (statusFilter !== "All" ? 1 : 0) + (sort !== "date-desc" ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-display font-bold text-foreground truncate">Bookings</h1>
          <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">Manage reservations and track guests</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1.5 rounded-xl shrink-0 text-xs sm:text-sm">
          <Download size={14} /> <span className="hidden sm:inline">Export</span> PDF
        </Button>
      </div>

      {/* Stats - scrollable on mobile */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 sm:grid sm:grid-cols-5 sm:gap-3 sm:mx-0 sm:px-0">
        {statCards.map(s => (
          <div key={s.label} className="flex-shrink-0 w-[130px] sm:w-auto bg-card rounded-xl border border-border/50 p-3 sm:p-4 flex items-center gap-3 hover:shadow-card-hover transition-all">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
              <s.icon size={16} className="sm:hidden" />
              <s.icon size={18} className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{s.label}</p>
              <p className="text-base sm:text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter/Sort */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search guest, hotel, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 sm:h-10 bg-card rounded-xl text-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9 sm:h-10 px-3 shrink-0 relative">
              <Filter size={14} />
              <span className="hidden sm:inline text-sm">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>
            {statusFilters.map(s => (
              <DropdownMenuItem
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-sm rounded-lg cursor-pointer ${statusFilter === s ? "bg-accent/10 text-accent font-medium" : ""}`}
              >
                {statusFilter === s && <Check size={14} className="mr-2 shrink-0" />}
                <span className={statusFilter !== s ? "pl-[22px]" : ""}>{s === "CheckedIn" ? "Checked In" : s === "CheckedOut" ? "Checked Out" : s}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1"><SortAsc size={12} /> Sort By</DropdownMenuLabel>
            {sortOptions.map(o => (
              <DropdownMenuItem
                key={o.value}
                onClick={() => setSort(o.value)}
                className={`text-sm rounded-lg cursor-pointer ${sort === o.value ? "bg-accent/10 text-accent font-medium" : ""}`}
              >
                {sort === o.value && <Check size={14} className="mr-2 shrink-0" />}
                <span className={sort !== o.value ? "pl-[22px]" : ""}>{o.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filter chips */}
      {(statusFilter !== "All" || sort !== "date-desc") && (
        <div className="flex flex-wrap gap-1.5">
          {statusFilter !== "All" && (
            <button
              onClick={() => setStatusFilter("All")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
            >
              {statusLabel(statusFilter)} <X size={12} />
            </button>
          )}
          {sort !== "date-desc" && (
            <button
              onClick={() => setSort("date-desc")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
            >
              {sortOptions.find(o => o.value === sort)?.label} <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Booking Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-card rounded-xl border border-border/50">
            <CalendarCheck size={32} className="mx-auto text-muted-foreground mb-2" />
            <h3 className="text-base font-semibold text-foreground mb-1">No bookings found</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map(b => {
            const actions = getActions(b);
            const info = getStatusInfo(b);
            return (
              <div key={b.id} className="bg-card rounded-xl border border-border/50 p-3 sm:p-4 hover:shadow-card-hover hover:border-accent/20 transition-all duration-200">
                {/* Top row: ID + status + amount */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-mono text-[11px] text-muted-foreground">{b.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${statusColor(b.status)}`}>
                      {statusLabel(b.status)}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-foreground shrink-0">${b.amount}</span>
                </div>

                {/* Guest name + room type */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{b.guest}</h3>
                  <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded shrink-0">{b.roomType}</span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={11} className="shrink-0" /> <span className="truncate">{b.hotel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="shrink-0" />
                    <span>{b.checkIn} → {b.checkOut}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span>{b.guests}g · {b.rooms}r</span>
                  </div>
                </div>

                {/* Status info + actions */}
                <div className="flex items-center justify-between gap-2">
                  {info ? (
                    <p className="text-[11px] text-accent flex items-center gap-1"><Clock size={11} /> {info}</p>
                  ) : <span />}
                  <div className="flex gap-1.5 shrink-0">
                    {actions.map(a => (
                      <Button key={a.label} size="sm" variant="outline" className={`rounded-lg gap-1 h-7 px-2 text-xs ${a.variant}`} onClick={a.onClick}>
                        <a.icon size={12} /> {a.label}
                      </Button>
                    ))}
                    <Button size="sm" variant="outline" className="rounded-lg gap-1 h-7 px-2 text-xs" onClick={() => { setViewBooking(b); setNoteText(""); }}>
                      <Eye size={12} /> View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Booking Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent className="rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-base sm:text-lg">Booking {viewBooking?.id}</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColor(viewBooking.status)}`}>{statusLabel(viewBooking.status)}</span>
                {getActions(viewBooking).map(a => (
                  <Button key={a.label} size="sm" variant="outline" className={`rounded-lg gap-1 h-7 text-xs ${a.variant}`} onClick={a.onClick}>
                    <a.icon size={12} /> {a.label}
                  </Button>
                ))}
              </div>

              <div className="bg-muted/30 rounded-xl p-3 sm:p-4">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Guest</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2"><User size={13} className="text-muted-foreground shrink-0" /><span className="font-medium text-foreground truncate">{viewBooking.guest}</span></div>
                  <div className="flex items-center gap-2"><Mail size={13} className="text-muted-foreground shrink-0" /><span className="text-foreground truncate">{viewBooking.guestEmail}</span></div>
                  <div className="flex items-center gap-2"><Phone size={13} className="text-muted-foreground shrink-0" /><span className="text-foreground">{viewBooking.guestPhone}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Hotel</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.hotel}</p></div>
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Room</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.roomType}</p></div>
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Check-in</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.checkIn}</p></div>
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Check-out</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.checkOut}</p></div>
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Guests / Rooms</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.guests} guests · {viewBooking.rooms} room{viewBooking.rooms > 1 ? "s" : ""}</p></div>
                <div><p className="text-muted-foreground text-[11px] mb-0.5">Payment</p><p className="font-medium text-foreground text-xs sm:text-sm">{viewBooking.paymentMethod}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-[11px] mb-0.5">Total Amount</p><p className="text-xl font-bold text-foreground">${viewBooking.amount}</p></div>
              </div>

              {viewBooking.specialRequests && (
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-3">
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Special Requests</h3>
                  <p className="text-foreground text-xs sm:text-sm">{viewBooking.specialRequests}</p>
                </div>
              )}

              <div className="border border-border/50 rounded-xl p-3">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} /> Notes
                </h3>
                {viewBooking.notes.length > 0 ? (
                  <div className="space-y-1.5 mb-2.5 max-h-32 overflow-y-auto">
                    {viewBooking.notes.map((n, i) => (
                      <div key={i} className="text-[11px] bg-muted/40 rounded-lg px-2.5 py-1.5 text-foreground">{n}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground mb-2.5">No notes yet.</p>
                )}
                <div className="flex gap-2">
                  <Input
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="h-8 text-xs bg-muted/30 rounded-lg flex-1"
                    onKeyDown={e => e.key === "Enter" && addNote(viewBooking.id)}
                  />
                  <Button size="sm" onClick={() => addNote(viewBooking.id)} className="rounded-lg bg-accent text-accent-foreground hover:bg-gold-light h-8 text-xs px-3">Add</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <Dialog open={!!rejectConfirm} onOpenChange={() => setRejectConfirm(null)}>
        <DialogContent className="rounded-xl max-w-sm p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive flex items-center gap-2 text-base"><XCircle size={18} /> Reject Booking</DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Reject booking <strong className="text-foreground">{rejectConfirm?.id}</strong> from <strong className="text-foreground">{rejectConfirm?.guest}</strong>?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setRejectConfirm(null)} className="rounded-lg">Cancel</Button>
            <Button size="sm" onClick={() => { if (rejectConfirm) { updateStatus(rejectConfirm.id, "Rejected"); setRejectConfirm(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg gap-1">
              <X size={12} /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerBookings;
