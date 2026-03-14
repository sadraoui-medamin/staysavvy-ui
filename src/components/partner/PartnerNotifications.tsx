import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell, CalendarCheck, UserPlus, AlertTriangle, Star, DollarSign,
  Check, CheckCheck, Trash2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "booking" | "team" | "alert" | "review" | "payment";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "n1", type: "booking", title: "New Booking", message: "Alice Martin booked Grand Hotel Paris for Mar 5-8", time: "2 min ago", read: false },
  { id: "n2", type: "payment", title: "Payment Received", message: "$540 received for booking BK-001", time: "15 min ago", read: false },
  { id: "n3", type: "team", title: "Team Invite Accepted", message: "Emma Petit joined as Concierge", time: "1 hour ago", read: false },
  { id: "n4", type: "review", title: "New Review", message: "Grand Hotel Paris received a 5-star review", time: "3 hours ago", read: true },
  { id: "n5", type: "alert", title: "Low Occupancy Alert", message: "City Center Inn occupancy dropped to 45%", time: "5 hours ago", read: true },
  { id: "n6", type: "booking", title: "Booking Cancelled", message: "Emma Davis cancelled booking BK-005", time: "1 day ago", read: true },
  { id: "n7", type: "payment", title: "Payout Processed", message: "Monthly payout of $12,450 processed", time: "2 days ago", read: true },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "booking": return <CalendarCheck size={14} className="text-accent" />;
    case "payment": return <DollarSign size={14} className="text-accent" />;
    case "team": return <UserPlus size={14} className="text-primary" />;
    case "review": return <Star size={14} className="text-accent" />;
    case "alert": return <AlertTriangle size={14} className="text-destructive" />;
    default: return <Bell size={14} />;
  }
};

const PartnerNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-destructive ring-2 ring-card flex items-center justify-center text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] rounded-2xl p-0 max-h-[500px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-accent hover:underline font-medium flex items-center gap-1">
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer ${
                  !n.read ? "bg-accent/5" : ""
                }`}
                onClick={() => markRead(n.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
                  {typeIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PartnerNotifications;
