import { useState } from "react";
import { Calendar, MapPin, User, Settings, LogOut, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { myBookings } from "@/data/hotels";
import { Link } from "react-router-dom";

const tabs = ["My Bookings", "Profile", "Settings"] as const;
type Tab = typeof tabs[number];

const statusColors: Record<string, string> = {
  confirmed: "bg-accent/10 text-accent",
  upcoming: "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("My Bookings");

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
            <div className="space-y-4 animate-fade-in">
              {myBookings.map((booking) => (
                <div key={booking.id} className="bg-card rounded-xl shadow-card overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <img src={booking.image} alt={booking.hotelName} loading="lazy" decoding="async" className="w-full md:w-48 h-40 md:h-auto object-cover" />
                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold text-foreground">${booking.total}</div>
                        <div className="text-sm text-muted-foreground">total</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
