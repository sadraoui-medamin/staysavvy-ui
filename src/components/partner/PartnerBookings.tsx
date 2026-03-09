import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Download, CalendarCheck, DollarSign, Clock, CheckCircle,
  XCircle, MapPin, Calendar, Eye, User, MoreHorizontal, ArrowUpDown,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PartnerBooking {
  id: string;
  guest: string;
  guestEmail: string;
  hotel: string;
  location: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  amount: number;
  paymentMethod: string;
}

const initialBookings: PartnerBooking[] = [
  { id: "BK-001", guest: "Alice Martin", guestEmail: "alice@email.com", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-03-05", checkOut: "2026-03-08", rooms: 1, guests: 2, status: "Confirmed", amount: 540, paymentMethod: "Visa •••• 4242" },
  { id: "BK-002", guest: "Robert Chen", guestEmail: "robert@email.com", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-03-10", checkOut: "2026-03-14", rooms: 2, guests: 4, status: "Pending", amount: 980, paymentMethod: "Mastercard •••• 8888" },
  { id: "BK-003", guest: "Sarah Johnson", guestEmail: "sarah@email.com", hotel: "Seaside Resort", location: "Nice, France", checkIn: "2026-03-12", checkOut: "2026-03-15", rooms: 1, guests: 2, status: "Confirmed", amount: 720, paymentMethod: "Visa •••• 1234" },
  { id: "BK-004", guest: "James Wilson", guestEmail: "james@email.com", hotel: "Mountain Lodge", location: "Chamonix, France", checkIn: "2026-02-20", checkOut: "2026-02-23", rooms: 1, guests: 3, status: "Completed", amount: 450, paymentMethod: "PayPal" },
  { id: "BK-005", guest: "Emma Davis", guestEmail: "emma@email.com", hotel: "Grand Hotel Paris", location: "Paris, France", checkIn: "2026-02-15", checkOut: "2026-02-18", rooms: 1, guests: 2, status: "Cancelled", amount: 660, paymentMethod: "Amex •••• 3456" },
  { id: "BK-006", guest: "Liam Brown", guestEmail: "liam@email.com", hotel: "Seaside Resort", location: "Nice, France", checkIn: "2026-04-01", checkOut: "2026-04-05", rooms: 2, guests: 4, status: "Confirmed", amount: 1200, paymentMethod: "Visa •••• 9090" },
  { id: "BK-007", guest: "Sophia Lee", guestEmail: "sophia@email.com", hotel: "Mountain Lodge", location: "Chamonix, France", checkIn: "2026-01-10", checkOut: "2026-01-13", rooms: 1, guests: 2, status: "Completed", amount: 390, paymentMethod: "Mastercard •••• 5555" },
];

const statusFilters = ["All", "Confirmed", "Pending", "Completed", "Cancelled"] as const;
const sortOptions = [
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
  { label: "Amount: High→Low", value: "amount-desc" },
  { label: "Amount: Low→High", value: "amount-asc" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Confirmed": return "bg-accent/10 text-accent border border-accent/20";
    case "Pending": return "bg-muted text-muted-foreground border border-border";
    case "Completed": return "bg-primary/10 text-primary border border-primary/20";
    case "Cancelled": return "bg-destructive/10 text-destructive border border-destructive/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

const PartnerBookings = () => {
  const [bookings] = useState<PartnerBooking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("date-desc");
  const [viewBooking, setViewBooking] = useState<PartnerBooking | null>(null);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === "Confirmed").length;
    const pending = bookings.filter(b => b.status === "Pending").length;
    const revenue = bookings.filter(b => b.status !== "Cancelled").reduce((s, b) => s + b.amount, 0);
    return { total, confirmed, pending, revenue };
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

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bookings Report", 14, 22);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 29);
    autoTable(doc, {
      startY: 36,
      head: [["ID", "Guest", "Hotel", "Check-in", "Check-out", "Status", "Amount"]],
      body: bookings.map(b => [b.id, b.guest, b.hotel, b.checkIn, b.checkOut, b.status, `$${b.amount}`]),
      theme: "striped",
      headStyles: { fillColor: [41, 37, 36] },
    });
    doc.save("bookings-report.pdf");
    toast({ title: "PDF Exported", description: "Bookings report downloaded." });
  };

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: CalendarCheck, color: "text-primary" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-accent" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-muted-foreground" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground text-sm">View and manage all guest reservations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by guest, hotel, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button variant="outline" onClick={exportPDF} className="gap-2 rounded-xl">
            <Download size={16} /> Export
          </Button>
        </div>
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
          filtered.map(b => (
            <div key={b.id} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/20 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColor(b.status)}`}>{b.status}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base">{b.guest}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {b.hotel}</span>
                    <span className="flex items-center gap-1"><Calendar size={13} /> {b.checkIn} → {b.checkOut}</span>
                    <span>{b.guests} guests · {b.rooms} room{b.rooms > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">${b.amount}</p>
                    <p className="text-xs text-muted-foreground">total</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg gap-1.5" onClick={() => setViewBooking(b)}>
                    <Eye size={14} /> View
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Booking Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Booking Details — {viewBooking?.id}</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground text-xs mb-1">Guest</p><p className="font-medium text-foreground">{viewBooking.guest}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Email</p><p className="font-medium text-foreground">{viewBooking.guestEmail}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Hotel</p><p className="font-medium text-foreground">{viewBooking.hotel}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Location</p><p className="font-medium text-foreground">{viewBooking.location}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Check-in</p><p className="font-medium text-foreground">{viewBooking.checkIn}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Check-out</p><p className="font-medium text-foreground">{viewBooking.checkOut}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Guests / Rooms</p><p className="font-medium text-foreground">{viewBooking.guests} guests · {viewBooking.rooms} room{viewBooking.rooms > 1 ? "s" : ""}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Payment</p><p className="font-medium text-foreground">{viewBooking.paymentMethod}</p></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusColor(viewBooking.status)}`}>{viewBooking.status}</span>
                <p className="text-2xl font-bold text-foreground">${viewBooking.amount}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerBookings;
