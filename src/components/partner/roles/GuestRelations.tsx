import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, Star, Search, MessageSquare, Car, UtensilsCrossed,
  AlertTriangle, UserCheck, Crown, Phone, Mail, Plus, Eye,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const guests = [
  { id: "GP01", name: "Marie Dupont", room: "301", vip: true, stays: 12, preferences: ["Extra pillows", "Late checkout", "Quiet room"], allergies: "Gluten-free", notes: "Anniversary trip", complaints: 0, rating: 5, phone: "+33 6 12 34 56 78", email: "marie@email.com" },
  { id: "GP02", name: "James Wilson", room: "415", vip: true, stays: 8, preferences: ["High floor", "King bed"], allergies: "None", notes: "Business traveler, needs fast WiFi", complaints: 1, rating: 4, phone: "+44 7700 123456", email: "james@email.com" },
  { id: "GP03", name: "Sofia Garcia", room: "107", vip: false, stays: 2, preferences: ["Baby crib", "Pool view"], allergies: "Nut allergy", notes: "Traveling with infant", complaints: 0, rating: 5, phone: "+34 612 345 678", email: "sofia@email.com" },
  { id: "GP04", name: "Yuki Tanaka", room: "208", vip: false, stays: 1, preferences: ["Green tea"], allergies: "None", notes: "First visit", complaints: 0, rating: 0, phone: "+81 90 1234 5678", email: "yuki@email.com" },
  { id: "GP05", name: "Ahmed Hassan", room: "505", vip: true, stays: 15, preferences: ["Halal meals", "Extra towels", "Airport transfer"], allergies: "None", notes: "Loyal guest, always tips staff", complaints: 0, rating: 5, phone: "+971 50 123 4567", email: "ahmed@email.com" },
];

const complaints = [
  { id: "C001", guest: "James Wilson", room: "415", subject: "Noisy neighbors", date: "2026-04-01", status: "Open", priority: "High" },
  { id: "C002", guest: "Anonymous", room: "312", subject: "AC not working properly", date: "2026-03-31", status: "Resolved", priority: "Medium" },
  { id: "C003", guest: "Sofia Garcia", room: "107", subject: "Room not cleaned on time", date: "2026-04-02", status: "In Progress", priority: "Medium" },
];

const serviceRequests = [
  { id: "SR01", guest: "Marie Dupont", room: "301", type: "Restaurant", details: "Table for 2 at Le Gourmet, 8PM", status: "Confirmed" },
  { id: "SR02", guest: "Ahmed Hassan", room: "505", type: "Transport", details: "Airport transfer at 6AM tomorrow", status: "Pending" },
  { id: "SR03", guest: "James Wilson", room: "415", type: "Tour", details: "City walking tour, April 3rd", status: "Confirmed" },
];

const GuestRelations = () => {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<typeof guests[0] | null>(null);
  const [complaintDialog, setComplaintDialog] = useState(false);

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) || g.room.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Guest Relations</h2>
          <p className="text-muted-foreground">Guest profiles, preferences & service requests</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setComplaintDialog(true)}><AlertTriangle size={16} /> Log Complaint</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "VIP Guests", value: guests.filter((g) => g.vip).length, icon: Crown, color: "text-amber-500" },
          { label: "Active Requests", value: serviceRequests.filter((s) => s.status === "Pending").length, icon: MessageSquare, color: "text-blue-500" },
          { label: "Open Complaints", value: complaints.filter((c) => c.status === "Open").length, icon: AlertTriangle, color: "text-red-500" },
          { label: "Avg. Rating", value: "4.8", icon: Star, color: "text-emerald-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60"><s.icon size={20} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="profiles">
        <TabsList className="rounded-xl bg-muted/50">
          <TabsTrigger value="profiles" className="rounded-lg gap-1.5"><UserCheck size={14} /> Guest Profiles</TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg gap-1.5"><Heart size={14} /> Service Requests</TabsTrigger>
          <TabsTrigger value="complaints" className="rounded-lg gap-1.5"><AlertTriangle size={14} /> Complaints</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="mt-4 space-y-4">
          <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><Input placeholder="Search guests..." className="pl-9 rounded-xl max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((guest) => (
              <Card key={guest.id} className="rounded-xl border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuest(guest)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs ${guest.vip ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-gradient-to-br from-blue-400 to-blue-600"}`}>
                        {guest.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm">{guest.name}</p>
                          {guest.vip && <Crown size={14} className="text-amber-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">Room {guest.room} · {guest.stays} stays</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={12} className={i < guest.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {guest.preferences.slice(0, 3).map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                    {guest.allergies !== "None" && <Badge variant="destructive" className="text-xs">{guest.allergies}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-3">
          {serviceRequests.map((sr) => (
            <Card key={sr.id} className="rounded-xl border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/60">
                    {sr.type === "Restaurant" ? <UtensilsCrossed size={16} /> : sr.type === "Transport" ? <Car size={16} /> : <Eye size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{sr.details}</p>
                    <p className="text-xs text-muted-foreground">{sr.guest} · Room {sr.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sr.status === "Confirmed" ? "default" : "secondary"}>{sr.status}</Badge>
                  {sr.status === "Pending" && <Button size="sm" className="rounded-lg">Confirm</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="complaints" className="mt-4 space-y-3">
          {complaints.map((c) => (
            <Card key={c.id} className="rounded-xl border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${c.priority === "High" ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                    <AlertTriangle size={16} className={c.priority === "High" ? "text-red-600" : "text-amber-600"} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{c.subject}</p>
                    <p className="text-xs text-muted-foreground">{c.guest} · Room {c.room} · {c.date}</p>
                  </div>
                </div>
                <Badge variant={c.status === "Resolved" ? "default" : c.status === "Open" ? "destructive" : "secondary"}>{c.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Guest Profile Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2">{selectedGuest?.name} {selectedGuest?.vip && <Crown size={16} className="text-amber-500" />}</DialogTitle></DialogHeader>
          {selectedGuest && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Room</span><p className="font-medium">{selectedGuest.room}</p></div>
                <div><span className="text-muted-foreground">Total Stays</span><p className="font-medium">{selectedGuest.stays}</p></div>
              </div>
              <div><span className="text-muted-foreground">Preferences</span><div className="flex flex-wrap gap-1.5 mt-1">{selectedGuest.preferences.map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}</div></div>
              <div><span className="text-muted-foreground">Allergies</span><p className="font-medium">{selectedGuest.allergies}</p></div>
              <div><span className="text-muted-foreground">Notes</span><p className="font-medium">{selectedGuest.notes}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><Phone size={14} /> Call</Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><Mail size={14} /> Email</Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><UtensilsCrossed size={14} /> Book Restaurant</Button>
                <Button variant="outline" size="sm" className="rounded-lg gap-1.5"><Car size={14} /> Book Transfer</Button>
              </div>
              <div><Label>Add Note</Label><Textarea placeholder="Type a note about this guest..." className="rounded-xl mt-1" /><Button size="sm" className="rounded-xl mt-2">Save Note</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complaint Dialog */}
      <Dialog open={complaintDialog} onOpenChange={setComplaintDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Log Complaint</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Guest Name</Label><Input className="rounded-xl mt-1" /></div>
              <div><Label>Room</Label><Input className="rounded-xl mt-1" /></div>
            </div>
            <div><Label>Subject</Label><Input className="rounded-xl mt-1" /></div>
            <div><Label>Details</Label><Textarea className="rounded-xl mt-1" /></div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setComplaintDialog(false)}>Cancel</Button><Button className="rounded-xl">Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestRelations;
