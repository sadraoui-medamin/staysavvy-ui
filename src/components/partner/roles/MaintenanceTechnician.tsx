import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Wrench, AlertTriangle, Clock, CheckCircle, Upload,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const filtered = ticketList.filter((t) => filter === "all" || t.status === filter);

  const updateTicketStatus = (id: string, status: string) => {
    setTicketList((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    setSelectedTicket(null);
    toast({ title: "Status Updated", description: `Ticket ${id} is now ${status}` });
  };

  const priorityColor: Record<string, string> = {
    Urgent: "text-red-600 bg-red-100 dark:bg-red-900/30",
    High: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    Medium: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    Low: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  };

  const statusIcon = (status: string) => {
    if (status === "open") return <AlertTriangle size={20} className="text-red-600" />;
    if (status === "in-progress") return <Wrench size={20} className="text-amber-600" />;
    return <CheckCircle size={20} className="text-emerald-600" />;
  };

  const statusBg = (status: string) => {
    if (status === "open") return "bg-red-100 dark:bg-red-900/30";
    if (status === "in-progress") return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-emerald-100 dark:bg-emerald-900/30";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Maintenance</h2>
        <p className="text-sm text-muted-foreground">Repair tickets & status updates</p>
      </div>

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: ticketList.filter((t) => t.status === "open").length, icon: AlertTriangle, color: "text-red-500" },
          { label: "In Progress", value: ticketList.filter((t) => t.status === "in-progress").length, icon: Clock, color: "text-amber-500" },
          { label: "Resolved", value: ticketList.filter((t) => t.status === "resolved").length, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Total", value: ticketList.length, icon: Wrench, color: "text-blue-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60 shrink-0"><s.icon size={20} className={s.color} /></div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters - scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {["all", "open", "in-progress", "resolved"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className="rounded-xl capitalize whitespace-nowrap h-10 px-4 active:scale-[0.97] transition-transform shrink-0"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tickets - touch-friendly cards */}
      <div className="space-y-3">
        {filtered.map((ticket) => (
          <Card
            key={ticket.id}
            className={`rounded-2xl border-border/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.99] ${ticket.priority === "Urgent" ? "ring-1 ring-red-400" : ""}`}
            onClick={() => setSelectedTicket(ticket)}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl ${statusBg(ticket.status)} shrink-0`}>
                  {statusIcon(ticket.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-foreground">{ticket.issue}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.id} · Room {ticket.room} · {ticket.category}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{ticket.reported}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant="outline" className={`text-[10px] sm:text-xs ${priorityColor[ticket.priority]}`}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={ticket.status === "resolved" ? "default" : "secondary"} className="text-[10px] sm:text-xs capitalize">
                    {ticket.status === "in-progress" ? "In Progress" : ticket.status}
                  </Badge>
                </div>
              </div>

              {/* Quick action buttons for mobile */}
              {ticket.status !== "resolved" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                  {ticket.status === "open" && (
                    <Button
                      className="flex-1 h-11 rounded-xl text-sm font-medium active:scale-[0.98] transition-transform"
                      onClick={(e) => { e.stopPropagation(); updateTicketStatus(ticket.id, "in-progress"); }}
                    >
                      <Wrench size={16} className="mr-2" /> Start Repair
                    </Button>
                  )}
                  {ticket.status === "in-progress" && (
                    <Button
                      className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-medium active:scale-[0.98] transition-transform"
                      onClick={(e) => { e.stopPropagation(); updateTicketStatus(ticket.id, "resolved"); }}
                    >
                      <CheckCircle size={16} className="mr-2" /> Mark Resolved
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="rounded-2xl max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-base">{selectedTicket?.id}: {selectedTicket?.issue}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Room</span><p className="font-medium">{selectedTicket.room}</p></div>
                <div><span className="text-muted-foreground text-xs">Category</span><p className="font-medium">{selectedTicket.category}</p></div>
                <div><span className="text-muted-foreground text-xs">Priority</span><p className="font-medium">{selectedTicket.priority}</p></div>
                <div><span className="text-muted-foreground text-xs">Reported</span><p className="font-medium text-xs">{selectedTicket.reported}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Before Photo</Label>
                  <div className="h-28 sm:h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30 active:bg-muted/50 transition-colors">
                    {selectedTicket.beforePhoto ? (
                      <span className="text-4xl">{selectedTicket.beforePhoto}</span>
                    ) : (
                      <Button variant="ghost" size="sm" className="gap-1.5 h-10"><Upload size={14} /> Upload</Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">After Photo</Label>
                  <div className="h-28 sm:h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30 active:bg-muted/50 transition-colors">
                    {selectedTicket.afterPhoto ? (
                      <span className="text-4xl">{selectedTicket.afterPhoto}</span>
                    ) : (
                      <Button variant="ghost" size="sm" className="gap-1.5 h-10"><Upload size={14} /> Upload</Button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs">Repair Notes</Label>
                <Textarea placeholder="Describe the work done..." className="rounded-xl mt-1 min-h-[80px]" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            {selectedTicket?.status === "open" && (
              <Button className="h-12 rounded-xl gap-2 w-full sm:w-auto active:scale-[0.98] transition-transform" onClick={() => updateTicketStatus(selectedTicket.id, "in-progress")}>
                <Wrench size={16} /> Start Repair
              </Button>
            )}
            {selectedTicket?.status === "in-progress" && (
              <Button className="h-12 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto active:scale-[0.98] transition-transform" onClick={() => updateTicketStatus(selectedTicket.id, "resolved")}>
                <CheckCircle size={16} /> Mark Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceTechnician;
