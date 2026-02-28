import { useState, useMemo } from "react";
import { Calendar, MapPin, User, Settings, LogOut, Star, Search, SlidersHorizontal, ArrowUpDown, Eye, XCircle, Download, Hotel, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { myBookings, Booking } from "@/data/hotels";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("My Bookings");
  const [bookings, setBookings] = useState<Booking[]>(myBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState("date-desc");
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const cancelBooking = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b));
    toast({ title: "Booking Cancelled", description: "Your reservation has been cancelled successfully." });
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
      body: bookings.map((b) => [
        b.hotelName,
        b.location,
        b.checkIn,
        b.checkOut,
        `${b.guests} guests, ${b.rooms} room`,
        b.status.charAt(0).toUpperCase() + b.status.slice(1),
        `$${b.total}`,
      ]),
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
          <div className="flex gap-1 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "My Bookings" && (
            <div className="animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search, Filter, Sort, Export */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-card"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm"
                  >
                    {statusFilters.map((s) => (
                      <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <Button variant="outline" onClick={exportPDF} className="gap-2">
                    <Download size={16} /> Export PDF
                  </Button>
                </div>
              </div>

              {/* Bookings List */}
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
                        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{booking.hotelName}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin size={14} /> {booking.location}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar size={14} /> {booking.checkIn} → {booking.checkOut}</span>
                              <span>{booking.guests} guests · {booking.rooms} room</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border">
                            <div>
                              <span className="text-xl font-bold text-foreground">${booking.total}</span>
                              <span className="text-sm text-muted-foreground ml-1">total</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate(`/hotel/${booking.id}`)}>
                                <Eye size={14} /> View
                              </Button>
                              {booking.status !== "cancelled" && booking.status !== "completed" && (
                                <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => cancelBooking(booking.id)}>
                                  <XCircle size={14} /> Cancel
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
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">First Name</label>
                    <Input className="h-11 bg-muted/50" defaultValue="John" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Last Name</label>
                    <Input className="h-11 bg-muted/50" defaultValue="Doe" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                    <Input className="h-11 bg-muted/50" defaultValue="john.doe@email.com" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
                    <Input className="h-11 bg-muted/50" defaultValue="+1 (555) 123-4567" />
                  </div>
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
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
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
      <Footer />
    </div>
  );
}
