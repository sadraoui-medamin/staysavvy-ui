import { useState, useMemo } from "react";
import { Calendar, MapPin, User, Settings, LogOut, Star, Search, SlidersHorizontal, ArrowUpDown, Eye, XCircle, Download, Hotel, DollarSign, CheckCircle, Clock, AlertTriangle, RotateCcw, CreditCard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { myBookings, Booking } from "@/data/hotels";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const tabs = ["My Bookings", "Profile", "Settings"] as const;
type Tab = typeof tabs[number];

const statusColors: Record<string, string> = {
  confirmed: "bg-accent/10 text-accent",
  upcoming: "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusFilters = ["all", "upcoming", "confirmed", "completed", "cancelled"] as const;
const sortOptions = [
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
];

type CancelStep = "confirm" | "reason" | "refund" | "done";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("My Bookings");
  const [bookings, setBookings] = useState<Booking[]>(myBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState("date-desc");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cancel & Refund state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelStep, setCancelStep] = useState<CancelStep>("confirm");
  const [cancelReason, setCancelReason] = useState("");
  const [refundProcessing, setRefundProcessing] = useState(false);

  const cancelTarget = bookings.find((b) => b.id === cancelBookingId);

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalSpent = bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0);
    return { total, upcoming, completed, totalSpent };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.hotelName.toLowerCase().includes(q) || b.location.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }
    if (sort === "date-desc") result.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    else if (sort === "date-asc") result.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    else if (sort === "price-desc") result.sort((a, b) => b.total - a.total);
    else if (sort === "price-asc") result.sort((a, b) => a.total - b.total);
    return result;
  }, [bookings, searchQuery, statusFilter, sort]);

  // Cancellation policy logic
  const getRefundAmount = (booking: Booking): { amount: number; percentage: number; policy: string } => {
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const daysUntil = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil > 14) return { amount: booking.total, percentage: 100, policy: "Full refund — cancelled more than 14 days before check-in" };
    if (daysUntil > 7) return { amount: Math.round(booking.total * 0.75), percentage: 75, policy: "75% refund — cancelled 7-14 days before check-in" };
    if (daysUntil > 2) return { amount: Math.round(booking.total * 0.5), percentage: 50, policy: "50% refund — cancelled 2-7 days before check-in" };
    return { amount: 0, percentage: 0, policy: "No refund — cancelled less than 48 hours before check-in" };
  };

  const openCancelDialog = (id: string) => {
    setCancelBookingId(id);
    setCancelStep("confirm");
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const proceedToReason = () => setCancelStep("reason");
  const proceedToRefund = () => setCancelStep("refund");

  const processRefund = () => {
    if (!cancelTarget) return;
    setRefundProcessing(true);
    const refund = getRefundAmount(cancelTarget);

    setTimeout(() => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelBookingId
            ? {
                ...b,
                status: "cancelled" as const,
                refundAmount: refund.amount,
                refundStatus: refund.amount > 0 ? "pending" as const : "none" as const,
                cancelledAt: new Date().toISOString(),
              }
            : b
        )
      );
      setRefundProcessing(false);
      setCancelStep("done");
    }, 2000);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelBookingId(null);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Booking History", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
      startY: 38,
      head: [["Hotel", "Location", "Check-in", "Check-out", "Guests", "Status", "Total"]],
      body: bookings.map((b) => [b.hotelName, b.location, b.checkIn, b.checkOut, `${b.guests} guests, ${b.rooms} room`, b.status.charAt(0).toUpperCase() + b.status.slice(1), `$${b.total}`]),
      theme: "striped",
      headStyles: { fillColor: [41, 37, 36] },
    });
    doc.save("booking-history.pdf");
    toast({ title: "PDF Exported", description: "Your booking history has been downloaded." });
  };

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: Hotel, color: "text-primary" },
    { label: "Upcoming Trips", value: stats.upcoming, icon: Clock, color: "text-accent" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-muted-foreground" },
    { label: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
  ];

  const cancelReasons = [
    "Change of plans",
    "Found a better deal",
    "Travel restrictions",
    "Personal emergency",
    "Weather concerns",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">JD</div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">John Doe</h1>
              <p className="text-muted-foreground text-sm">john.doe@email.com</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "My Bookings" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl p-4 md:p-5 shadow-card flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10 bg-card" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm">
                    {statusFilters.map((s) => (
                      <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm">
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <Button variant="outline" onClick={exportPDF} className="gap-2">
                    <Download size={16} /> <span className="hidden sm:inline">Export PDF</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-xl shadow-card">
                    <Hotel size={40} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">No bookings found</h3>
                    <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-card rounded-xl shadow-card overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="flex flex-col md:flex-row">
                        <img src={booking.image} alt={booking.hotelName} loading="lazy" decoding="async" className="w-full md:w-52 h-44 md:h-auto object-cover" />
                        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between gap-3 md:gap-4">
                          <div>
                            <div className="flex items-start gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-foreground text-sm md:text-base">{booking.hotelName}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                              {booking.refundStatus === "pending" && (
                                <Badge variant="outline" className="text-[10px] border-accent/50 text-accent gap-1">
                                  <RotateCcw size={10} /> Refund Pending
                                </Badge>
                              )}
                              {booking.refundStatus === "processed" && (
                                <Badge variant="outline" className="text-[10px] border-green-500/50 text-green-600 gap-1">
                                  <CheckCircle size={10} /> Refunded ${booking.refundAmount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin size={14} /> {booking.location}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar size={14} /> {booking.checkIn} → {booking.checkOut}</span>
                              <span>{booking.guests} guests · {booking.rooms} room</span>
                            </div>
                            {booking.confirmationCode && (
                              <p className="text-xs text-muted-foreground mt-1.5 font-mono">Conf: {booking.confirmationCode}</p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border">
                            <div>
                              <span className="text-lg md:text-xl font-bold text-foreground">${booking.total}</span>
                              <span className="text-sm text-muted-foreground ml-1">total</span>
                              {booking.paymentMethod && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <CreditCard size={10} /> {booking.paymentMethod}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => navigate(`/hotel/${booking.id}`)}>
                                <Eye size={14} /> View
                              </Button>
                              {(booking.status === "upcoming" || booking.status === "confirmed") && (
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => openCancelDialog(booking.id)}>
                                  <XCircle size={14} /> Cancel & Refund
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="max-w-xl animate-fade-in">
              <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">First Name</label><Input className="h-11 bg-muted/50" defaultValue="John" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Last Name</label><Input className="h-11 bg-muted/50" defaultValue="Doe" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Email</label><Input className="h-11 bg-muted/50" defaultValue="john.doe@email.com" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Phone</label><Input className="h-11 bg-muted/50" defaultValue="+1 (555) 123-4567" /></div>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-gold-light">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="max-w-xl animate-fade-in">
              <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div><div className="font-medium text-foreground text-sm">Email Notifications</div><div className="text-xs text-muted-foreground">Receive booking updates via email</div></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div><div className="font-medium text-foreground text-sm">SMS Notifications</div><div className="text-xs text-muted-foreground">Receive booking updates via SMS</div></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-card after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div><div className="font-medium text-foreground text-sm">Currency</div><div className="text-xs text-muted-foreground">Preferred display currency</div></div>
                    <select className="h-9 px-3 rounded-lg border border-border bg-muted/50 text-foreground text-sm">
                      <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
                    </select>
                  </div>
                </div>
                <hr className="border-border" />
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel & Refund Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={(open) => { if (!open) closeCancelDialog(); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {cancelStep === "confirm" && cancelTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-destructive" /> Cancel Reservation
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your reservation at <strong className="text-foreground">{cancelTarget.hotelName}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="text-foreground">{cancelTarget.checkIn}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="text-foreground">{cancelTarget.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Paid</span><span className="text-foreground font-semibold">${cancelTarget.total}</span></div>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Refund Policy</p>
                    <p className="text-muted-foreground text-xs">{getRefundAmount(cancelTarget).policy}</p>
                    <p className="text-accent font-semibold mt-1">Estimated refund: ${getRefundAmount(cancelTarget).amount} ({getRefundAmount(cancelTarget).percentage}%)</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={closeCancelDialog}>Keep Booking</Button>
                <Button variant="destructive" onClick={proceedToReason}>Proceed</Button>
              </DialogFooter>
            </>
          )}

          {cancelStep === "reason" && (
            <>
              <DialogHeader>
                <DialogTitle>Reason for Cancellation</DialogTitle>
                <DialogDescription>Please let us know why you're cancelling (optional).</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {cancelReasons.map((r) => (
                  <button key={r} onClick={() => setCancelReason(r)} className={`px-3 py-2.5 rounded-lg text-sm text-left transition-colors border ${cancelReason === r ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setCancelStep("confirm")}>Back</Button>
                <Button variant="destructive" onClick={proceedToRefund}>Continue</Button>
              </DialogFooter>
            </>
          )}

          {cancelStep === "refund" && cancelTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Cancellation & Refund</DialogTitle>
                <DialogDescription>Review your refund details before confirming.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Original Amount</span><span className="text-foreground">${cancelTarget.total}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Refund Percentage</span><span className="text-foreground">{getRefundAmount(cancelTarget).percentage}%</span></div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold"><span className="text-foreground">Refund Amount</span><span className="text-accent">${getRefundAmount(cancelTarget).amount}</span></div>
                </div>
                {cancelTarget.paymentMethod && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard size={14} />
                    <span>Refund to: {cancelTarget.paymentMethod}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Refunds typically take 5-10 business days to process.</p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setCancelStep("reason")}>Back</Button>
                <Button variant="destructive" onClick={processRefund} disabled={refundProcessing}>
                  {refundProcessing ? (
                    <span className="flex items-center gap-2">
                      <RotateCcw size={14} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {cancelStep === "done" && cancelTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" /> Cancellation Complete
                </DialogTitle>
                <DialogDescription>Your reservation has been cancelled successfully.</DialogDescription>
              </DialogHeader>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4 space-y-2 text-sm">
                {getRefundAmount(cancelTarget).amount > 0 ? (
                  <>
                    <p className="text-foreground font-medium">Refund of ${getRefundAmount(cancelTarget).amount} initiated</p>
                    <p className="text-muted-foreground text-xs">You'll receive the refund to your {cancelTarget.paymentMethod} within 5-10 business days.</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No refund applicable based on the cancellation policy.</p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={closeCancelDialog} className="bg-accent text-accent-foreground">Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
