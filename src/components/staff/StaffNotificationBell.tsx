import { useMemo } from "react";
import { Bell, Check, Trash2, AlertOctagon, Building2, CalendarCheck, RefreshCcw, MessageSquare, ShieldAlert, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useStaffStore, NOTIFICATION_STYLES, type NotificationKind } from "@/lib/staffSupport";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  property: Building2,
  booking: CalendarCheck,
  refund: RefreshCcw,
  dispute: MessageSquare,
  approval: CheckCircle2,
  rejection: XCircle,
  log: ShieldAlert,
};


type Props = { onOpenTab: (tab: string) => void };

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
};

export default function StaffNotificationBell({ onOpenTab }: Props) {
  const { notifications, markRead, markAllRead, clearAll, setFocusRef } = useStaffStore();
  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] sm:w-[380px] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-accent" />
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && <Badge variant="outline" className="h-4 px-1.5 text-[10px] bg-destructive/10 text-destructive border-destructive/30">{unread} new</Badge>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={markAllRead} disabled={unread === 0}>
              <Check size={12} className="mr-1" />Mark read
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={clearAll} aria-label="Clear all">
              <Trash2 size={12} />
            </Button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-border/60">
          {notifications.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">You're all caught up.</div>
          )}
          {notifications.map((n) => {
            const Icon = KIND_ICON[n.kind];
            const styles = NOTIFICATION_STYLES[n.kind];
            return (
              <button
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  setFocusRef(n.recordId ?? null);
                  if (n.targetTab) onOpenTab(n.targetTab);
                }}

                className={`w-full text-left p-3 flex items-start gap-3 transition-colors hover:bg-muted/50 ${!n.read ? "bg-accent/[0.04]" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${styles.chip}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground truncate">{n.title}</span>
                    {n.severity === "critical" && <AlertOctagon size={11} className="text-destructive shrink-0" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{n.description}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{formatTime(n.at)}</div>
                </div>
                {!n.read && <span className={`w-2 h-2 rounded-full mt-1.5 ${styles.dot}`} />}
              </button>
            );
          })}
        </div>
        <div className="border-t border-border/70 bg-muted/20 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs justify-center"
            onClick={() => onOpenTab("notifications")}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
