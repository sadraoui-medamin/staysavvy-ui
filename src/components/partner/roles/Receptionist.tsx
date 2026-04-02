import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck, UserX, Search, Clock, CreditCard, FileText,
  DoorOpen, DoorClosed, Phone, Mail, Plus, Eye, ArrowRight,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const todayGuests = [
  { id: "G001", name: "Marie Dupont", room: "301", type: "Deluxe", checkIn: "2026-04-02", checkOut: "2026-04-05", status: "arriving", idType: "Passport", idNum: "FR****892", phone: "+33 6 12 34 56 78", email: "marie@email.com", amount: "$720", paid: false },
  { id: "G002", name: "James Wilson", room: "415", type: "Suite", checkIn: "2026-04-02", checkOut: "2026-04-07", status: "arriving", idType: "ID Card", idNum: "UK****331", phone: "+44 7700 123456", email: "james@email.com", amount: "$1,950", paid: true },
  { id: "G003", name: "Yuki Tanaka", room: "208", type: "Standard", checkIn: "2026-03-30", checkOut: "2026-04-02", status: "departing", idType: "Passport", idNum: "JP****567", phone: "+81 90 1234 5678", email: "yuki@email.com", amount: "$480", paid: true },
  { id: "G004", name: "Hans Müller", room: "512", type: "Executive", checkIn: "2026-03-31", checkOut: "2026-04-02", status: "departing", idType: "Passport", idNum: "DE****110", phone: "+49 170 1234567", email: "hans@email.com", amount: "$640", paid: false },
  { id: "G005", name: "Sofia Garcia", room: "107", type: "Family", checkIn: "2026-04-01", checkOut: "2026-04-04", status: "in-house", idType: "Passport", idNum: "ES****445", phone: "+34 612 345 678", email: "sofia@email.com", amount: "$540", paid: true },
];

const roomAvailability = [
  { floor: 1, rooms: Array.from({ length: 8 }, (_, i) => ({ num: `${100 + i + 1}`, status: i < 3 ? "occupied" : i < 5 ? "available" : i < 7 ? "cleaning" : "maintenance" })) },
  { floor: 2, rooms: Array.from({ length: 8 }, (_, i) => ({ num: `${200 + i + 1}`, status: i < 5 ? "occupied" : i < 7 ? "available" : "reserved" })) },
  { floor: 3, rooms: Array.from({ length: 8 }, (_, i) => ({ num: `${300 + i + 1}`, status: i < 4 ? "occupied" : i < 6 ? "available" : "reserved" })) },
];

const statusColor: Record<string, string> = {
  occupied: "bg-red-500", available: "bg-emerald-500", cleaning: "bg-amber-500", maintenance: "bg-gray-500", reserved: "bg-blue-500",
};

const Receptionist = () => {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<typeof todayGuests[0] | null>(null);
  const [walkInDialog, setWalkInDialog] = useState(false);
  const [tab, setTab] = useState("arrivals");

  const filtered = todayGuests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) || g.room.includes(search) || g.id.includes(search)
  );

  const arrivals = filtered.filter((g) => g.status === "arriving");
  const departures = filtered.filter((g) => g.status === "departing");
  const inHouse = filtered.filter((g) => g.status === "in-house");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Front Desk</h2>
          <p className="text-muted-foreground">Check-ins, Check-outs & Walk-in Bookings</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setWalkInDialog(true)}><Plus size={16} /> Walk-in Booking</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Arrivals Today", value: arrivals.length, icon: DoorOpen, color: "text-blue-600" },
          { label: "Departures Today", value: departures.length, icon: DoorClosed, color: "text-amber-600" },
          { label: "In-House Guests", value: inHouse.length, icon: UserCheck, color: "text-emerald-600" },
          { label: "Available Rooms", value: "14", icon: DoorOpen, color: "text-violet-600" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60"><s.icon size={20} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><Input placeholder="Search guest, room, ID..." className="pl-9 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="rounded-xl bg-muted/50">
              <TabsTrigger value="arrivals" className="rounded-lg gap-1.5"><DoorOpen size={14} /> Arrivals ({arrivals.length})</TabsTrigger>
              <TabsTrigger value="departures" className="rounded-lg gap-1.5"><DoorClosed size={14} /> Departures ({departures.length})</TabsTrigger>
              <TabsTrigger value="in-house" className="rounded-lg gap-1.5"><UserCheck size={14} /> In-House ({inHouse.length})</TabsTrigger>
            </TabsList>

            {["arrivals", "departures", "in-house"].map((t) => (
              <TabsContent key={t} value={t} className="space-y-3 mt-4">
                {(t === "arrivals" ? arrivals : t === "departures" ? departures : inHouse).map((guest) => (
                  <Card key={guest.id} className="rounded-xl border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs ${guest.status === "arriving" ? "bg-blue-500" : guest.status === "departing" ? "bg-amber-500" : "bg-emerald-500"}`}>
                          {guest.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{guest.name}</p>
                          <p className="text-xs text-muted-foreground">Room {guest.room} · {guest.type} · {guest.checkIn} → {guest.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={guest.paid ? "default" : "destructive"} className="text-xs">{guest.paid ? "Paid" : "Unpaid"}</Badge>
                        <span className="font-semibold text-sm text-foreground">{guest.amount}</span>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          {guest.status === "arriving" ? <><UserCheck size={14} className="mr-1" /> Check In</> : guest.status === "departing" ? <><UserX size={14} className="mr-1" /> Check Out</> : <><Eye size={14} className="mr-1" /> View</>}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(t === "arrivals" ? arrivals : t === "departures" ? departures : inHouse).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No guests found</div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Room Map */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Room Map</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(statusColor).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-sm ${c}`} /><span className="text-muted-foreground capitalize">{s}</span></div>
              ))}
            </div>
            {roomAvailability.map((floor) => (
              <div key={floor.floor}>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Floor {floor.floor}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {floor.rooms.map((r) => (
                    <button key={r.num} className={`p-2 rounded-lg text-white text-xs font-medium ${statusColor[r.status]} hover:opacity-80 transition-opacity`}>{r.num}</button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Guest Detail Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle>Guest: {selectedGuest?.name}</DialogTitle></DialogHeader>
          {selectedGuest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Room</span><p className="font-medium">{selectedGuest.room} ({selectedGuest.type})</p></div>
                <div><span className="text-muted-foreground">ID</span><p className="font-medium">{selectedGuest.idType}: {selectedGuest.idNum}</p></div>
                <div><span className="text-muted-foreground">Check-in</span><p className="font-medium">{selectedGuest.checkIn}</p></div>
                <div><span className="text-muted-foreground">Check-out</span><p className="font-medium">{selectedGuest.checkOut}</p></div>
              </div>
              <div className="flex gap-3 text-sm">
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><Phone size={14} /> {selectedGuest.phone}</Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><Mail size={14} /> Email</Button>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{selectedGuest.amount}</span>
                  <Badge variant={selectedGuest.paid ? "default" : "destructive"}>{selectedGuest.paid ? "Paid" : "Unpaid"}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="rounded-xl gap-2"><FileText size={14} /> Pro-forma Invoice</Button>
            <Button className="rounded-xl gap-2"><CreditCard size={14} /> Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Walk-in Dialog */}
      <Dialog open={walkInDialog} onOpenChange={setWalkInDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Walk-in Booking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Guest Name</Label><Input placeholder="Full name" className="rounded-xl mt-1" /></div>
              <div><Label>Phone</Label><Input placeholder="+33..." className="rounded-xl mt-1" /></div>
              <div><Label>ID Type</Label><Select><SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="passport">Passport</SelectItem><SelectItem value="id">ID Card</SelectItem><SelectItem value="license">Driver License</SelectItem></SelectContent></Select></div>
              <div><Label>ID Number</Label><Input placeholder="ID number" className="rounded-xl mt-1" /></div>
              <div><Label>Room Type</Label><Select><SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="deluxe">Deluxe</SelectItem><SelectItem value="suite">Suite</SelectItem></SelectContent></Select></div>
              <div><Label>Nights</Label><Input type="number" defaultValue={1} className="rounded-xl mt-1" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setWalkInDialog(false)}>Cancel</Button><Button className="rounded-xl">Book & Check In</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receptionist;
