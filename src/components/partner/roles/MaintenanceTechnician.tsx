import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Wrench, AlertTriangle, Clock, CheckCircle, Camera,
  Plus, Search, Filter, Upload,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tickets = [
  { id: "MT-001", room: "203", issue: "AC unit not cooling", category: "HVAC", priority: "High", status: "open", reported: "2026-04-01 09:30", assignee: "Self", beforePhoto: "", afterPhoto: "" },
  { id: "MT-002", room: "415", issue: "Leaky faucet in bathroom", category: "Plumbing", priority: "Medium", status: "in-progress", reported: "2026-04-01 14:00", assignee: "Self", beforePhoto: "📷", afterPhoto: "" },
  { id: "MT-003", room: "107", issue: "Power outlet not working", category: "Electrical", priority: "High", status: "open", reported: "2026-04-02 08:15", assignee: "Self", beforePhoto: "", afterPhoto: "" },
  { id: "MT-004", room: "Lobby", issue: "Elevator B making noise", category: "Mechanical", priority: "Urgent", status: "in-progress", reported: "2026-03-31 16:00", assignee: "Self", beforePhoto: "📷", afterPhoto: "" },
  { id: "MT-005", room: "301", issue: "TV remote not working", category: "Electronics", priority: "Low", status: "resolved", reported: "2026-03-30 10:00", assignee: "Self", beforePhoto: "📷", afterPhoto: "📷" },
  { id: "MT-006", room: "Pool", issue: "Pool pump maintenance", category: "Mechanical", priority: "Medium", status: "resolved", reported: "2026-03-29 07:00", assignee: "Self", beforePhoto: "📷", afterPhoto: "📷" },
];

const MaintenanceTechnician = () => {
  const [ticketList, setTicketList] = useState(tickets);
  const [filter, setFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [updateDialog, setUpdateDialog] = useState(false);

  const filtered = ticketList.filter((t) => filter === "all" || t.status === filter);

  const updateTicketStatus = (id: string, status: string) => {
    setTicketList((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    setSelectedTicket(null);
  };

  const priorityColor: Record<string, string> = {
    Urgent: "text-red-600 bg-red-100 dark:bg-red-900/30",
    High: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    Medium: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    Low: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Maintenance</h2>
          <p className="text-muted-foreground">Repair tickets, status updates & photo documentation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: ticketList.filter((t) => t.status === "open").length, icon: AlertTriangle, color: "text-red-500" },
          { label: "In Progress", value: ticketList.filter((t) => t.status === "in-progress").length, icon: Clock, color: "text-amber-500" },
          { label: "Resolved Today", value: ticketList.filter((t) => t.status === "resolved").length, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Total Tickets", value: ticketList.length, icon: Wrench, color: "text-blue-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60"><s.icon size={20} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "open", "in-progress", "resolved"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="rounded-xl capitalize" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {filtered.map((ticket) => (
          <Card key={ticket.id} className={`rounded-xl border-border/50 hover:shadow-md transition-shadow cursor-pointer ${ticket.priority === "Urgent" ? "ring-1 ring-red-400" : ""}`} onClick={() => setSelectedTicket(ticket)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${ticket.status === "open" ? "bg-red-100 dark:bg-red-900/30" : ticket.status === "in-progress" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                  {ticket.status === "open" ? <AlertTriangle size={18} className="text-red-600" /> : ticket.status === "in-progress" ? <Wrench size={18} className="text-amber-600" /> : <CheckCircle size={18} className="text-emerald-600" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{ticket.issue}</p>
                  <p className="text-xs text-muted-foreground">{ticket.id} · Room {ticket.room} · {ticket.category} · {ticket.reported}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${priorityColor[ticket.priority]}`}>{ticket.priority}</Badge>
                <Badge variant={ticket.status === "resolved" ? "default" : "secondary"} className="text-xs capitalize">{ticket.status}</Badge>
                {ticket.beforePhoto && <Camera size={14} className="text-muted-foreground" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle>{selectedTicket?.id}: {selectedTicket?.issue}</DialogTitle></DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Room</span><p className="font-medium">{selectedTicket.room}</p></div>
                <div><span className="text-muted-foreground">Category</span><p className="font-medium">{selectedTicket.category}</p></div>
                <div><span className="text-muted-foreground">Priority</span><p className="font-medium">{selectedTicket.priority}</p></div>
                <div><span className="text-muted-foreground">Reported</span><p className="font-medium">{selectedTicket.reported}</p></div>
              </div>

              {/* Photo Upload Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Before Photo</Label>
                  <div className="h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30">
                    {selectedTicket.beforePhoto ? (
                      <span className="text-4xl">{selectedTicket.beforePhoto}</span>
                    ) : (
                      <Button variant="ghost" size="sm" className="gap-1.5"><Upload size={14} /> Upload</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>After Photo</Label>
                  <div className="h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30">
                    {selectedTicket.afterPhoto ? (
                      <span className="text-4xl">{selectedTicket.afterPhoto}</span>
                    ) : (
                      <Button variant="ghost" size="sm" className="gap-1.5"><Upload size={14} /> Upload</Button>
                    )}
                  </div>
                </div>
              </div>

              <div><Label>Repair Notes</Label><Textarea placeholder="Describe the work done..." className="rounded-xl mt-1" /></div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedTicket?.status === "open" && <Button className="rounded-xl gap-2" onClick={() => updateTicketStatus(selectedTicket.id, "in-progress")}><Wrench size={14} /> Start Repair</Button>}
            {selectedTicket?.status === "in-progress" && <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateTicketStatus(selectedTicket.id, "resolved")}><CheckCircle size={14} /> Mark Resolved</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceTechnician;
