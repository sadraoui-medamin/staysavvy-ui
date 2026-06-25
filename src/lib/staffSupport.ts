// StayVista Staff — support tickets / disputes + cross-module notification system
import { create } from "zustand";

// ─── Tickets / disputes ───────────────────────────────────────────────
export type TicketCategory =
  | "booking_dispute"
  | "refund_dispute"
  | "property_issue"
  | "payout_issue"
  | "account_help"
  | "other";

export type TicketStatus = "open" | "pending" | "resolved" | "escalated";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type RequesterType = "client" | "partner";

export type TicketMessage = {
  id: string;
  authorName: string;
  authorRole: "requester" | "staff" | "system";
  body: string;
  at: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  requester: { name: string; email: string; type: RequesterType };
  relatedRef?: string; // e.g. booking id, property id
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  messages: TicketMessage[];
};

export const TICKET_CATEGORY_LABEL: Record<TicketCategory, string> = {
  booking_dispute: "Booking dispute",
  refund_dispute: "Refund dispute",
  property_issue: "Property issue",
  payout_issue: "Payout issue",
  account_help: "Account help",
  other: "Other",
};

export const TICKET_PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: "bg-muted text-foreground/70 border-border",
  normal: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  high: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  urgent: "bg-destructive/10 text-destructive border-destructive/30",
};

export const TICKET_STATUS_STYLES: Record<TicketStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  escalated: "bg-destructive/10 text-destructive border-destructive/30",
  resolved: "bg-muted text-foreground/60 border-border",
};

const seedTickets: Ticket[] = [
  {
    id: "TCK-3001",
    subject: "Room not as described — requesting refund",
    category: "refund_dispute",
    status: "open",
    priority: "high",
    requester: { name: "Sofia Martinez", email: "sofia.m@mail.com", type: "client" },
    relatedRef: "BK-9003",
    createdAt: "2026-06-22T07:14:00Z",
    updatedAt: "2026-06-22T09:02:00Z",
    messages: [
      { id: "m1", authorName: "Sofia Martinez", authorRole: "requester", body: "Hi, the room I booked had no sea view despite the listing. I'd like a partial refund.", at: "2026-06-22T07:14:00Z" },
      { id: "m2", authorName: "System", authorRole: "system", body: "Ticket assigned to Support queue.", at: "2026-06-22T07:14:05Z" },
    ],
  },
  {
    id: "TCK-3002",
    subject: "Payout not received for May",
    category: "payout_issue",
    status: "pending",
    priority: "urgent",
    requester: { name: "Aurora Hotels Group", email: "ops@aurorahotels.com", type: "partner" },
    relatedRef: "PO-4421",
    createdAt: "2026-06-21T16:40:00Z",
    updatedAt: "2026-06-22T08:11:00Z",
    assignee: "finance@stayvista.com",
    messages: [
      { id: "m1", authorName: "Aurora Hotels Group", authorRole: "requester", body: "Our May payout of €18,420 has not arrived. Bank says nothing pending.", at: "2026-06-21T16:40:00Z" },
      { id: "m2", authorName: "Lina Khoury", authorRole: "staff", body: "Looking into it — bank batch may have been delayed. Will confirm by EOD.", at: "2026-06-22T08:11:00Z" },
    ],
  },
  {
    id: "TCK-3003",
    subject: "Listing photos mismatch — guest complaint",
    category: "property_issue",
    status: "escalated",
    priority: "high",
    requester: { name: "Emma Dubois", email: "emma.d@mail.com", type: "client" },
    relatedRef: "PR-504",
    createdAt: "2026-06-20T11:20:00Z",
    updatedAt: "2026-06-21T09:45:00Z",
    messages: [
      { id: "m1", authorName: "Emma Dubois", authorRole: "requester", body: "Photos of Lisbon Harbor Hotel don't match reality.", at: "2026-06-20T11:20:00Z" },
      { id: "m2", authorName: "Tomás Oliveira", authorRole: "staff", body: "Escalated to moderation team for property review.", at: "2026-06-21T09:45:00Z" },
    ],
  },
  {
    id: "TCK-3004",
    subject: "Cannot reset partner account password",
    category: "account_help",
    status: "open",
    priority: "normal",
    requester: { name: "Sunset Riads", email: "contact@sunsetriads.ma", type: "partner" },
    createdAt: "2026-06-22T06:00:00Z",
    updatedAt: "2026-06-22T06:00:00Z",
    messages: [
      { id: "m1", authorName: "Sunset Riads", authorRole: "requester", body: "Reset link not arriving in our inbox.", at: "2026-06-22T06:00:00Z" },
    ],
  },
  {
    id: "TCK-3005",
    subject: "Double charge on confirmation",
    category: "booking_dispute",
    status: "open",
    priority: "urgent",
    requester: { name: "Liam Tanaka", email: "liam.t@mail.com", type: "client" },
    relatedRef: "BK-9002",
    createdAt: "2026-06-22T05:21:00Z",
    updatedAt: "2026-06-22T05:21:00Z",
    messages: [
      { id: "m1", authorName: "Liam Tanaka", authorRole: "requester", body: "I was charged twice for the same booking.", at: "2026-06-22T05:21:00Z" },
    ],
  },
  {
    id: "TCK-3006",
    subject: "Thanks — refund processed",
    category: "refund_dispute",
    status: "resolved",
    priority: "low",
    requester: { name: "Noah Becker", email: "noah.b@mail.com", type: "client" },
    relatedRef: "BK-9006",
    createdAt: "2026-06-18T10:00:00Z",
    updatedAt: "2026-06-19T12:30:00Z",
    assignee: "support@stayvista.com",
    messages: [
      { id: "m1", authorName: "Noah Becker", authorRole: "requester", body: "Refund received, thank you!", at: "2026-06-19T12:30:00Z" },
    ],
  },
];

// ─── Notifications ────────────────────────────────────────────────────
export type NotificationKind =
  | "property"
  | "booking"
  | "refund"
  | "dispute"
  | "log";

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  at: string; // ISO
  read: boolean;
  targetTab?: string;     // staff tab to deep-link to
  severity?: "info" | "warning" | "critical";
};

export const NOTIFICATION_STYLES: Record<NotificationKind, { label: string; chip: string; dot: string }> = {
  property: { label: "Property",  chip: "bg-blue-500/10 text-blue-600 border-blue-500/30",       dot: "bg-blue-500" },
  booking:  { label: "Booking",   chip: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500" },
  refund:   { label: "Refund",    chip: "bg-amber-500/10 text-amber-600 border-amber-500/30",    dot: "bg-amber-500" },
  dispute:  { label: "Dispute",   chip: "bg-destructive/10 text-destructive border-destructive/30", dot: "bg-destructive" },
  log:      { label: "System",    chip: "bg-muted text-foreground/70 border-border",             dot: "bg-foreground/40" },
};

const seedNotifications: Notification[] = [
  { id: "N-9001", kind: "dispute",  title: "New refund dispute opened",  description: "Sofia Martinez · BK-9003",                     at: "2026-06-22T09:05:00Z", read: false, targetTab: "support", severity: "warning" },
  { id: "N-9002", kind: "refund",   title: "Refund awaiting approval",   description: "BK-9003 · €445",                               at: "2026-06-22T08:42:00Z", read: false, targetTab: "bookings", severity: "warning" },
  { id: "N-9003", kind: "property", title: "Property submitted for review", description: "Riad Andalous · Sunset Riads",              at: "2026-06-22T08:10:00Z", read: false, targetTab: "properties", severity: "info" },
  { id: "N-9004", kind: "booking",  title: "Booking checked-in",          description: "Emma Dubois · Kyoto Ryokan Sakura",            at: "2026-06-22T07:30:00Z", read: true,  targetTab: "bookings", severity: "info" },
  { id: "N-9005", kind: "log",      title: "5x failed logins detected",   description: "ops@aurorahotels.com · 194.34.12.88",           at: "2026-06-22T08:12:22Z", read: false, targetTab: "reports", severity: "critical" },
  { id: "N-9006", kind: "dispute",  title: "Dispute escalated",           description: "Lisbon Harbor Hotel · PR-504",                  at: "2026-06-21T09:45:00Z", read: true,  targetTab: "support", severity: "warning" },
  { id: "N-9007", kind: "property", title: "Property flagged",            description: "PR-504 Lisbon Harbor Hotel",                    at: "2026-06-22T07:44:00Z", read: true,  targetTab: "properties", severity: "warning" },
  { id: "N-9008", kind: "refund",   title: "Refund processed",            description: "BK-9006 · €735",                               at: "2026-06-21T22:10:00Z", read: true,  targetTab: "bookings", severity: "info" },
];

// ─── Zustand store (single source of truth) ──────────────────────────
type Store = {
  tickets: Ticket[];
  notifications: Notification[];
  addReply: (ticketId: string, body: string, author: { name: string; email: string }) => void;
  setStatus: (ticketId: string, status: TicketStatus) => void;
  setPriority: (ticketId: string, priority: TicketPriority) => void;
  pushNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

const nid = () => `N-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const useStaffStore = create<Store>((set) => ({
  tickets: seedTickets,
  notifications: seedNotifications,
  addReply: (ticketId, body, author) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: t.status === "resolved" ? "open" : t.status,
              updatedAt: new Date().toISOString(),
              assignee: author.email,
              messages: [
                ...t.messages,
                { id: `m${t.messages.length + 1}`, authorName: author.name, authorRole: "staff", body, at: new Date().toISOString() },
              ],
            }
          : t,
      ),
    })),
  setStatus: (ticketId, status) =>
    set((s) => ({
      tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
      notifications: [
        {
          id: nid(),
          kind: "dispute",
          title: status === "resolved" ? "Dispute resolved" : status === "escalated" ? "Dispute escalated" : `Ticket marked ${status}`,
          description: `${ticketId}`,
          at: new Date().toISOString(),
          read: false,
          targetTab: "support",
          severity: status === "escalated" ? "critical" : "info",
        },
        ...s.notifications,
      ],
    })),
  setPriority: (ticketId, priority) =>
    set((s) => ({
      tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t)),
    })),
  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: nid(), at: new Date().toISOString(), read: false },
        ...s.notifications,
      ].slice(0, 50),
    })),
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  clearAll: () => set({ notifications: [] }),
}));
