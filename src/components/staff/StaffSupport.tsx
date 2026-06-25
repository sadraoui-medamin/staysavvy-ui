import { useMemo, useState, useContext } from "react";
import {
  Search, MessageSquare, AlertOctagon, CheckCircle2, ArrowUpRight,
  ChevronDown, Send, Building2, User as UserIcon, Clock, Filter, Inbox,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useStaffStore, TICKET_CATEGORY_LABEL, TICKET_PRIORITY_STYLES, TICKET_STATUS_STYLES,
  type Ticket, type TicketStatus, type TicketPriority,
} from "@/lib/staffSupport";
import { StaffAuthContext } from "@/lib/staffRoles";

const STATUS_FILTERS: { key: "all" | TicketStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "pending", label: "Pending" },
  { key: "escalated", label: "Escalated" },
  { key: "resolved", label: "Resolved" },
];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
};

export default function StaffSupport() {
  const { tickets, addReply, setStatus, setPriority } = useStaffStore();
  const ctx = useContext(StaffAuthContext);
  const canHandle = !!ctx?.can("support.handle");

  const [search, setSearch] = useState("");
  const [status, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [type, setType] = useState<"all" | "client" | "partner">("all");
  const [selectedId, setSelectedId] = useState<string | null>(tickets[0]?.id ?? null);
  const [reply, setReply] = useState("");
  const [showList, setShowList] = useState(true); // mobile list/detail toggle

  const filtered = useMemo(() => {
    return tickets
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (type === "all" ? true : t.requester.type === type))
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.requester.name.toLowerCase().includes(q) ||
          (t.relatedRef?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [tickets, status, type, search]);

  const selected = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null;

  const counts = useMemo(() => ({
    open: tickets.filter((t) => t.status === "open").length,
    escalated: tickets.filter((t) => t.status === "escalated").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }), [tickets]);

  const handleReply = () => {
    if (!selected || !reply.trim() || !ctx) return;
    addReply(selected.id, reply.trim(), { name: ctx.identity.name, email: ctx.identity.email });
    setReply("");
    toast.success("Reply sent to requester");
  };

  const handleStatus = (s: TicketStatus) => {
    if (!selected) return;
    setStatus(selected.id, s);
    toast.success(`Ticket marked ${s}`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Support & Disputes</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Handle complaints and disputes from clients and partners.</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Open", value: counts.open, icon: Inbox, accent: "text-emerald-600" },
          { label: "Pending", value: counts.pending, icon: Clock, accent: "text-amber-600" },
          { label: "Escalated", value: counts.escalated, icon: AlertOctagon, accent: "text-destructive" },
          { label: "Resolved", value: counts.resolved, icon: CheckCircle2, accent: "text-foreground/60" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/70 rounded-xl p-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{s.label}</span>
              <s.icon size={14} className={s.accent} />
            </div>
            <div className="mt-1.5 text-lg sm:text-xl font-display font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, requesters, refs…"
            className="pl-9 h-9 text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 shrink-0">
              <Filter size={14} />
              <span className="hidden sm:inline">Filter</span>
              {(status !== "all" || type !== "all") && (
                <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
                  {(status !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0)}
                </Badge>
              )}
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-[10px] uppercase">Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={status} onValueChange={(v) => setStatusFilter(v as any)}>
              {STATUS_FILTERS.map((s) => (
                <DropdownMenuRadioItem key={s.key} value={s.key}>{s.label}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase">Requester</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={type} onValueChange={(v) => setType(v as any)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="client">Clients</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="partner">Partners</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        {/* List */}
        <div className={`bg-card border border-border/70 rounded-xl shadow-soft overflow-hidden ${selected && !showList ? "hidden lg:block" : ""}`}>
          <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No tickets match your filters.</div>
            )}
            {filtered.map((t) => {
              const active = selected?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setSelectedId(t.id); setShowList(false); }}
                  className={`w-full text-left p-3 transition-colors ${active ? "bg-accent/10" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[9px] uppercase ${TICKET_STATUS_STYLES[t.status]}`}>{t.status}</Badge>
                    <Badge variant="outline" className={`text-[9px] uppercase ${TICKET_PRIORITY_STYLES[t.priority]}`}>{t.priority}</Badge>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{t.id}</span>
                  </div>
                  <div className="text-sm font-semibold truncate">{t.subject}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    {t.requester.type === "partner" ? <Building2 size={11} /> : <UserIcon size={11} />}
                    <span className="truncate">{t.requester.name}</span>
                    <span>·</span>
                    <span>{formatTime(t.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className={`bg-card border border-border/70 rounded-xl shadow-soft flex flex-col min-h-[60vh] ${!selected || showList ? "hidden lg:flex" : "flex"}`}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a ticket to view the conversation.</div>
          ) : (
            <>
              <div className="p-4 border-b border-border/70">
                <div className="flex items-start gap-2">
                  <button onClick={() => setShowList(true)} className="lg:hidden text-xs text-muted-foreground mr-1">← Back</button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-muted-foreground">{selected.id}</span>
                      <Badge variant="outline" className={`text-[10px] uppercase ${TICKET_STATUS_STYLES[selected.status]}`}>{selected.status}</Badge>
                      <Badge variant="outline" className={`text-[10px] uppercase ${TICKET_PRIORITY_STYLES[selected.priority]}`}>{selected.priority}</Badge>
                      <Badge variant="outline" className="text-[10px] uppercase border-border">{TICKET_CATEGORY_LABEL[selected.category]}</Badge>
                    </div>
                    <h2 className="mt-1.5 text-base sm:text-lg font-display font-semibold truncate">{selected.subject}</h2>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {selected.requester.type === "partner" ? <Building2 size={12} /> : <UserIcon size={12} />}
                      <span>{selected.requester.name}</span>
                      <span>·</span>
                      <span className="truncate">{selected.requester.email}</span>
                      {selected.relatedRef && <>
                        <span>·</span>
                        <span className="font-mono">{selected.relatedRef}</span>
                      </>}
                    </div>
                  </div>
                </div>

                {canHandle && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                          Status <ChevronDown size={12} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(["open","pending","resolved","escalated"] as TicketStatus[]).map((s) => (
                          <DropdownMenuItem key={s} onClick={() => handleStatus(s)} className="text-xs capitalize">{s}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                          Priority <ChevronDown size={12} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(["low","normal","high","urgent"] as TicketPriority[]).map((p) => (
                          <DropdownMenuItem key={p} onClick={() => { setPriority(selected.id, p); toast.success(`Priority set to ${p}`); }} className="text-xs capitalize">{p}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => handleStatus("escalated")}>
                      <ArrowUpRight size={12} /> Escalate
                    </Button>
                    <Button size="sm" className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleStatus("resolved")}>
                      <CheckCircle2 size={12} /> Resolve
                    </Button>
                  </div>
                )}
              </div>

              {/* Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                {selected.messages.map((m) => {
                  const me = m.authorRole === "staff";
                  const sys = m.authorRole === "system";
                  if (sys) {
                    return (
                      <div key={m.id} className="text-center text-[11px] text-muted-foreground">
                        — {m.body} —
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm shadow-soft ${me ? "bg-accent text-accent-foreground rounded-br-sm" : "bg-card border border-border/70 rounded-bl-sm"}`}>
                        <div className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${me ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
                          {m.authorName}
                        </div>
                        <div className="whitespace-pre-wrap leading-snug">{m.body}</div>
                        <div className={`text-[10px] mt-1 ${me ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{formatTime(m.at)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply */}
              <div className="p-3 border-t border-border/70 bg-card">
                {canHandle ? (
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder={`Reply to ${selected.requester.name}…`}
                      className="min-h-[44px] max-h-32 text-sm resize-none"
                      onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply(); }}
                    />
                    <Button onClick={handleReply} size="sm" className="h-10 gap-1.5 shrink-0" disabled={!reply.trim()}>
                      <Send size={14} /> Send
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare size={14} /> Your role can view but not reply to tickets.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
