import { useMemo, useState } from "react";
import {
  Bell, Check, Trash2, ArrowRight, Filter, AlertOctagon,
  Building2, CalendarCheck, RefreshCcw, MessageSquare,
  ShieldAlert, CheckCircle2, XCircle, Inbox, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
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

const ALL_KINDS: NotificationKind[] = [
  "approval", "rejection", "refund", "dispute", "booking", "property", "log",
];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
};

type Props = { onOpenTab: (tab: string) => void };

export default function StaffNotifications({ onOpenTab }: Props) {
  const { notifications, markRead, markAllRead, clearAll, setFocusRef } = useStaffStore();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [kinds, setKinds] = useState<NotificationKind[]>(ALL_KINDS);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (!kinds.includes(n.kind)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [notifications, tab, kinds, query]);

  const unread = notifications.filter((n) => !n.read).length;

  const toggleKind = (k: NotificationKind) =>
    setKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const open = (id: string, target?: string, ref?: string) => {
    markRead(id);
    setFocusRef(ref ?? null);
    if (target) onOpenTab(target);
  };

  const groups = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    filtered.forEach((n) => {
      const d = new Date(n.at);
      const dayKey = d.toDateString();
      (g[dayKey] ||= []).push(n);
    });
    return Object.entries(g);
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Inbox size={15} className="text-accent" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight">Notifications</h1>
            {unread > 0 && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                {unread} unread
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Approvals, rejections, refunds and disputes across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
            <Check size={14} className="mr-1.5" /> Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            <Trash2 size={14} className="mr-1.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 self-start">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} {t === "unread" && unread > 0 && `(${unread})`}
            </button>
          ))}
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notifications…"
          className="h-9 sm:max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 justify-start sm:ml-auto">
              <Filter size={14} className="mr-1.5" />
              Types <Badge variant="outline" className="ml-2 h-5">{kinds.length}</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_KINDS.map((k) => (
              <DropdownMenuCheckboxItem
                key={k}
                checked={kinds.includes(k)}
                onCheckedChange={() => toggleKind(k)}
                onSelect={(e) => e.preventDefault()}
              >
                {NOTIFICATION_STYLES[k].label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Bell size={22} className="mx-auto mb-2 opacity-40" />
            No notifications match your filters.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {groups.map(([day, items]) => (
              <div key={day}>
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30">
                  {day}
                </div>
                {items.map((n) => {
                  const Icon = KIND_ICON[n.kind];
                  const styles = NOTIFICATION_STYLES[n.kind];
                  return (
                    <div
                      key={n.id}
                      className={`group flex items-start gap-3 p-4 transition-colors hover:bg-muted/30 ${
                        !n.read ? "bg-accent/[0.04]" : ""
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${styles.chip}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{n.title}</span>
                          <Badge variant="outline" className={`text-[10px] ${styles.chip}`}>{styles.label}</Badge>
                          {n.severity === "critical" && (
                            <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                              <AlertOctagon size={10} className="mr-1" /> Critical
                            </Badge>
                          )}
                          {!n.read && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatTime(n.at)}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px]" onClick={() => markRead(n.id)}>
                            <Check size={12} className="mr-1" /> Read
                          </Button>
                        )}
                        {n.targetTab && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-[11px]"
                            onClick={() => open(n.id, n.targetTab, n.recordId)}
                          >
                            Open <ArrowRight size={12} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
