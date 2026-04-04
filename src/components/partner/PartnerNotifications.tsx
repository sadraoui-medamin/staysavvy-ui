import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell, CalendarCheck, UserPlus, AlertTriangle, Star, DollarSign,
  CheckCheck, Trash2, Wrench, Bed, Shield, UtensilsCrossed,
  Receipt, Heart, DoorOpen,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RoleKey } from "@/lib/roles";

interface Notification {
  id: string;
  type: "booking" | "team" | "alert" | "review" | "payment" | "housekeeping" | "maintenance" | "security" | "fnb" | "frontdesk" | "guest" | "finance";
  title: string;
  message: string;
  time: string;
  read: boolean;
  roles: RoleKey[]; // which roles see this notification
}

const allNotifications: Notification[] = [
  // Super Admin / General
  { id: "n1", type: "booking", title: "New Booking", message: "Alice Martin booked Grand Hotel Paris for Mar 5-8", time: "2 min ago", read: false, roles: ["super_admin", "receptionist", "revenue_manager"] },
  { id: "n2", type: "payment", title: "Payment Received", message: "$540 received for booking BK-001", time: "15 min ago", read: false, roles: ["super_admin", "accountant", "revenue_manager"] },
  { id: "n3", type: "team", title: "Team Invite Accepted", message: "Emma Petit joined as Concierge", time: "1 hour ago", read: false, roles: ["super_admin"] },
  { id: "n4", type: "review", title: "New Review", message: "Grand Hotel Paris received a 5-star review", time: "3 hours ago", read: true, roles: ["super_admin", "guest_relations"] },
  { id: "n5", type: "alert", title: "Low Occupancy Alert", message: "City Center Inn occupancy dropped to 45%", time: "5 hours ago", read: true, roles: ["super_admin", "revenue_manager"] },
  
  // Revenue Manager
  { id: "n6", type: "payment", title: "Rate Alert", message: "Competitor rates dropped 15% for next weekend", time: "30 min ago", read: false, roles: ["revenue_manager"] },
  { id: "n7", type: "alert", title: "Revenue Milestone", message: "Monthly revenue exceeded $80K target", time: "2 hours ago", read: true, roles: ["revenue_manager", "super_admin", "accountant"] },

  // Receptionist / Front Desk
  { id: "n8", type: "frontdesk", title: "Walk-in Guest", message: "New walk-in requesting standard room", time: "5 min ago", read: false, roles: ["receptionist"] },
  { id: "n9", type: "frontdesk", title: "Check-out Due", message: "Room 205 - Robert Chen checkout in 30 min", time: "20 min ago", read: false, roles: ["receptionist"] },
  { id: "n10", type: "booking", title: "Late Check-in", message: "Sarah Johnson arriving after midnight, Room 301", time: "1 hour ago", read: true, roles: ["receptionist", "security"] },

  // Guest Relations
  { id: "n11", type: "guest", title: "VIP Arrival", message: "VIP guest James Wilson arriving at 3 PM", time: "1 hour ago", read: false, roles: ["guest_relations", "receptionist"] },
  { id: "n12", type: "guest", title: "Guest Complaint", message: "Room 108 reported noise complaint", time: "45 min ago", read: false, roles: ["guest_relations", "security"] },
  { id: "n13", type: "guest", title: "Special Request", message: "Room 301 requests extra pillows and champagne", time: "2 hours ago", read: true, roles: ["guest_relations", "housekeeping_lead"] },

  // Housekeeping
  { id: "n14", type: "housekeeping", title: "Room Ready for Cleaning", message: "Room 205 checked out - needs cleaning", time: "10 min ago", read: false, roles: ["housekeeping_lead", "room_attendant"] },
  { id: "n15", type: "housekeeping", title: "Inspection Required", message: "Room 101 cleaning complete, pending inspection", time: "25 min ago", read: false, roles: ["housekeeping_lead"] },
  { id: "n16", type: "housekeeping", title: "Low Inventory", message: "Bath towels stock below threshold", time: "3 hours ago", read: true, roles: ["housekeeping_lead", "super_admin"] },

  // Room Attendant
  { id: "n17", type: "housekeeping", title: "New Assignment", message: "3 rooms assigned for today's shift", time: "8 AM", read: false, roles: ["room_attendant"] },

  // Maintenance
  { id: "n18", type: "maintenance", title: "Urgent Repair", message: "Room 203 AC unit not cooling - High priority", time: "15 min ago", read: false, roles: ["maintenance"] },
  { id: "n19", type: "maintenance", title: "New Ticket", message: "Elevator B making noise - Lobby", time: "1 hour ago", read: false, roles: ["maintenance", "super_admin"] },
  { id: "n20", type: "maintenance", title: "Scheduled Maintenance", message: "Pool pump maintenance due tomorrow", time: "4 hours ago", read: true, roles: ["maintenance"] },

  // F&B
  { id: "n21", type: "fnb", title: "Room Service Order", message: "Room 301 ordered breakfast for 2", time: "5 min ago", read: false, roles: ["fb_manager"] },
  { id: "n22", type: "fnb", title: "Menu Update Required", message: "3 items out of stock for dinner service", time: "2 hours ago", read: true, roles: ["fb_manager"] },

  // Accountant
  { id: "n23", type: "finance", title: "Shift Closure Due", message: "Evening shift closure pending approval", time: "30 min ago", read: false, roles: ["accountant"] },
  { id: "n24", type: "finance", title: "Invoice Generated", message: "Monthly invoice #INV-2026-03 ready for review", time: "1 day ago", read: true, roles: ["accountant", "super_admin"] },

  // Security
  { id: "n25", type: "security", title: "Access Alert", message: "Unauthorized key card attempt on Floor 4", time: "10 min ago", read: false, roles: ["security"] },
  { id: "n26", type: "security", title: "Fire Alarm Test", message: "Scheduled fire alarm test at 2 PM today", time: "3 hours ago", read: true, roles: ["security", "super_admin"] },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "booking": return <CalendarCheck size={14} className="text-accent" />;
    case "payment": return <DollarSign size={14} className="text-accent" />;
    case "team": return <UserPlus size={14} className="text-primary" />;
    case "review": return <Star size={14} className="text-accent" />;
    case "alert": return <AlertTriangle size={14} className="text-destructive" />;
    case "housekeeping": return <Bed size={14} className="text-primary" />;
    case "maintenance": return <Wrench size={14} className="text-amber-500" />;
    case "security": return <Shield size={14} className="text-primary" />;
    case "fnb": return <UtensilsCrossed size={14} className="text-accent" />;
    case "frontdesk": return <DoorOpen size={14} className="text-primary" />;
    case "guest": return <Heart size={14} className="text-pink-500" />;
    case "finance": return <Receipt size={14} className="text-primary" />;
    default: return <Bell size={14} />;
  }
};

interface Props {
  currentRole?: RoleKey;
}

const PartnerNotifications = ({ currentRole = "super_admin" }: Props) => {
  const roleNotifications = useMemo(() => 
    allNotifications.filter(n => n.roles.includes(currentRole)),
    [currentRole]
  );
  
  const [notifications, setNotifications] = useState(roleNotifications);

  // Update when role changes
  useState(() => {
    setNotifications(roleNotifications);
  });

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
      <DropdownMenuContent align="end" className="w-[340px] sm:w-[380px] rounded-2xl p-0 max-h-[500px] overflow-hidden">
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
                className={`flex items-start gap-3 px-4 py-3 border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer ${!n.read ? "bg-accent/5" : ""}`}
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
