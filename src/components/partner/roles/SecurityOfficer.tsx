import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield, AlertTriangle, Eye, Users, KeyRound, FileText,
  Plus, Search, Clock, MapPin, DoorOpen,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const accessLogs = [
  { id: 1, time: "12:45 PM", room: "301", guest: "Marie Dupont", action: "Entry", method: "Key Card", card: "KC-4521" },
  { id: 2, time: "12:30 PM", room: "Main Entrance", guest: "Unknown", action: "Entry", method: "Badge", card: "STAFF-089" },
  { id: 3, time: "12:15 PM", room: "415", guest: "James Wilson", action: "Exit", method: "Key Card", card: "KC-4533" },
  { id: 4, time: "11:58 AM", room: "Pool Area", guest: "Sofia Garcia", action: "Entry", method: "Key Card", card: "KC-4519" },
  { id: 5, time: "11:45 AM", room: "Parking B2", guest: "Vehicle #FR-2846", action: "Entry", method: "License Plate", card: "—" },
  { id: 6, time: "11:30 AM", room: "505", guest: "Ahmed Hassan", action: "Entry", method: "Key Card", card: "KC-4540" },
  { id: 7, time: "11:12 AM", room: "Staff Entrance", guest: "Marco T.", action: "Entry", method: "Badge", card: "STAFF-023" },
  { id: 8, time: "10:50 AM", room: "208", guest: "Yuki Tanaka", action: "Exit", method: "Key Card", card: "KC-4525" },
];

const incidents = [
  { id: "INC-001", date: "2026-04-02 01:30", location: "Parking Lot", type: "Suspicious Activity", description: "Unknown vehicle parked for 4+ hours", severity: "Medium", status: "Investigating", officer: "Marc D." },
  { id: "INC-002", date: "2026-04-01 22:15", location: "Pool Area", type: "Safety Hazard", description: "Broken glass near pool edge", severity: "High", status: "Resolved", officer: "Sarah K." },
  { id: "INC-003", date: "2026-04-01 18:00", location: "Lobby", type: "Guest Disturbance", description: "Verbal altercation between guests", severity: "Medium", status: "Resolved", officer: "Marc D." },
  { id: "INC-004", date: "2026-03-31 03:45", location: "Floor 3", type: "Noise Complaint", description: "Loud music from room 310", severity: "Low", status: "Resolved", officer: "Jean P." },
];

const occupancyList = [
  { room: "101", guest: "Pierre Martin", checkIn: "2026-04-01", checkOut: "2026-04-04", adults: 2, children: 0, nationality: "French" },
  { room: "107", guest: "Sofia Garcia", checkIn: "2026-04-01", checkOut: "2026-04-04", adults: 2, children: 1, nationality: "Spanish" },
  { room: "204", guest: "Li Wei", checkIn: "2026-03-31", checkOut: "2026-04-03", adults: 1, children: 0, nationality: "Chinese" },
  { room: "301", guest: "Marie Dupont", checkIn: "2026-04-02", checkOut: "2026-04-05", adults: 2, children: 0, nationality: "French" },
  { room: "415", guest: "James Wilson", checkIn: "2026-04-02", checkOut: "2026-04-07", adults: 1, children: 0, nationality: "British" },
  { room: "505", guest: "Ahmed Hassan", checkIn: "2026-04-01", checkOut: "2026-04-06", adults: 1, children: 0, nationality: "Emirati" },
];

const SecurityOfficer = () => {
  const [incidentDialog, setIncidentDialog] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLogs = accessLogs.filter((l) =>
    l.guest.toLowerCase().includes(search.toLowerCase()) || l.room.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Security</h2>
          <p className="text-muted-foreground">Access logs, incident reporting & emergency data</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setIncidentDialog(true)}><Plus size={16} /> Report Incident</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Access Events (24h)", value: accessLogs.length, icon: KeyRound, color: "text-blue-500" },
          { label: "Open Incidents", value: incidents.filter((i) => i.status === "Investigating").length, icon: AlertTriangle, color: "text-red-500" },
          { label: "Occupied Rooms", value: occupancyList.length, icon: DoorOpen, color: "text-emerald-500" },
          { label: "Total Guests", value: occupancyList.reduce((s, o) => s + o.adults + o.children, 0), icon: Users, color: "text-violet-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60"><s.icon size={20} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="access">
        <TabsList className="rounded-xl bg-muted/50">
          <TabsTrigger value="access" className="rounded-lg gap-1.5"><KeyRound size={14} /> Access Logs</TabsTrigger>
          <TabsTrigger value="incidents" className="rounded-lg gap-1.5"><AlertTriangle size={14} /> Incidents</TabsTrigger>
          <TabsTrigger value="occupancy" className="rounded-lg gap-1.5"><Users size={14} /> Occupancy List</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4 space-y-4">
          <div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><Input placeholder="Search logs..." className="pl-9 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Time</th><th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Person</th><th className="text-left p-3 font-medium">Action</th>
                  <th className="text-left p-3 font-medium">Method</th><th className="text-left p-3 font-medium">Card ID</th>
                </tr></thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-3 text-muted-foreground flex items-center gap-1.5"><Clock size={12} /> {log.time}</td>
                      <td className="p-3 font-medium text-foreground">{log.room}</td>
                      <td className="p-3 text-foreground">{log.guest}</td>
                      <td className="p-3"><Badge variant={log.action === "Entry" ? "default" : "secondary"} className="text-xs">{log.action}</Badge></td>
                      <td className="p-3 text-muted-foreground">{log.method}</td>
                      <td className="p-3 text-muted-foreground font-mono text-xs">{log.card}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4 space-y-3">
          {incidents.map((inc) => (
            <Card key={inc.id} className={`rounded-xl border-border/50 ${inc.severity === "High" ? "ring-1 ring-red-400" : ""}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${inc.severity === "High" ? "bg-red-100 dark:bg-red-900/30" : inc.severity === "Medium" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                    <AlertTriangle size={18} className={inc.severity === "High" ? "text-red-600" : inc.severity === "Medium" ? "text-amber-600" : "text-blue-600"} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{inc.type}</p>
                    <p className="text-xs text-muted-foreground">{inc.id} · {inc.location} · {inc.date} · Officer: {inc.officer}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{inc.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inc.severity === "High" ? "destructive" : "outline"} className="text-xs">{inc.severity}</Badge>
                  <Badge variant={inc.status === "Resolved" ? "default" : "secondary"} className="text-xs">{inc.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="occupancy" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Shield size={18} /> Emergency Occupancy List</CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5"><FileText size={14} /> Print</Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Room</th><th className="text-left p-3 font-medium">Guest</th>
                  <th className="text-left p-3 font-medium">Nationality</th><th className="text-left p-3 font-medium">Adults</th>
                  <th className="text-left p-3 font-medium">Children</th><th className="text-left p-3 font-medium">Check-out</th>
                </tr></thead>
                <tbody>
                  {occupancyList.map((o) => (
                    <tr key={o.room} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-3 font-bold text-foreground">{o.room}</td>
                      <td className="p-3 text-foreground">{o.guest}</td>
                      <td className="p-3 text-muted-foreground">{o.nationality}</td>
                      <td className="p-3 text-center text-foreground">{o.adults}</td>
                      <td className="p-3 text-center text-foreground">{o.children}</td>
                      <td className="p-3 text-muted-foreground">{o.checkOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={incidentDialog} onOpenChange={setIncidentDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Report Security Incident</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Location</Label><Input placeholder="e.g. Parking Lot" className="rounded-xl mt-1" /></div>
              <div><Label>Severity</Label><Select><SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label>Type</Label><Select><SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="suspicious">Suspicious Activity</SelectItem><SelectItem value="hazard">Safety Hazard</SelectItem><SelectItem value="disturbance">Guest Disturbance</SelectItem><SelectItem value="theft">Theft Report</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
            <div><Label>Description</Label><Textarea className="rounded-xl mt-1" placeholder="Describe the incident..." /></div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setIncidentDialog(false)}>Cancel</Button><Button className="rounded-xl">Submit Report</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityOfficer;
