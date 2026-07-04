import { useMemo, useState } from "react";
import { Search, Filter, RefreshCcw, XCircle, Eye, Download, CalendarDays, TrendingUp, Wallet, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { mockStaffBookings, analyticsSeries, type StaffBooking } from "@/lib/staffMockData";
import { useStaffAuth } from "@/lib/staffRoles";
import { useStaffStore } from "@/lib/staffSupport";
import StatCard from "@/components/staff/StatCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { downloadCSV } from "@/lib/staffExport";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  checked_in: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  completed: "bg-muted text-foreground/70 border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  refund_pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function StaffBookings() {
  const { can } = useStaffAuth();
  const pushNotification = useStaffStore((s) => s.pushNotification);
  const [items, setItems] = useState<StaffBooking[]>(mockStaffBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StaffBooking["status"]>("all");
  const [viewing, setViewing] = useState<StaffBooking | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<StaffBooking | null>(null);
  const [confirmRefund, setConfirmRefund] = useState<StaffBooking | null>(null);

  const filtered = useMemo(() => items.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search && !`${b.id} ${b.guest} ${b.hotel}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter]);

  const refund = () => {
    if (!confirmRefund) return;
    setItems((p) => p.map((b) => (b.id === confirmRefund.id ? { ...b, status: "cancelled", refundAmount: b.total } : b)));
    pushNotification({
      kind: "refund", title: "Refund processed",
      description: `${confirmRefund.id} · €${confirmRefund.total}`,
      targetTab: "bookings", recordId: confirmRefund.id, severity: "info",
    });
    toast.success(`Refund processed for ${confirmRefund.id}`);
    setConfirmRefund(null);
  };
  const cancel = () => {
    if (!confirmCancel) return;
    setItems((p) => p.map((b) => (b.id === confirmCancel.id ? { ...b, status: "cancelled" } : b)));
    pushNotification({
      kind: "booking", title: "Booking cancelled",
      description: `${confirmCancel.id} · ${confirmCancel.guest}`,
      targetTab: "bookings", recordId: confirmCancel.id, severity: "warning",
    });
    toast.success(`Booking ${confirmCancel.id} cancelled`);

    setConfirmCancel(null);
  };

  const exportItems = () => {
    downloadCSV("bookings.csv", filtered);
    toast.success(`Exported ${filtered.length} bookings`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Bookings & Refunds</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Oversee all platform bookings, force-cancel, and process refunds.</p>
        </div>
        <Button size="sm" variant="outline" onClick={exportItems}><Download size={14} className="mr-1.5" /> Export</Button>
      </div>

      {/* KPI cards */}
      {(() => {
        const total = items.length;
        const active = items.filter((b) => b.status === "confirmed" || b.status === "checked_in").length;
        const refundsPending = items.filter((b) => b.status === "refund_pending");
        const cancelled = items.filter((b) => b.status === "cancelled").length;
        const revenue = items.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0);
        const refundValue = refundsPending.reduce((s, b) => s + (b.refundAmount ?? b.total * 0.5), 0);
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total bookings" value={total} delta={7.2} icon={CalendarDays} tone="accent" series={analyticsSeries.map((a) => ({ v: a.bookings }))} />
            <StatCard label="Active" value={active} delta={4.6} icon={TrendingUp} tone="success" series={analyticsSeries.map((a) => ({ v: Math.round(a.bookings * 0.65) }))} />
            <StatCard label="Refunds pending" value={refundsPending.length} hint={`€${refundValue.toLocaleString()}`} icon={RefreshCcw} tone="warning" series={analyticsSeries.map((a) => ({ v: a.refunds }))} />
            <StatCard label="Cancellations" value={cancelled} delta={-2.1} icon={Ban} tone="danger" series={analyticsSeries.map((a) => ({ v: Math.round(a.refunds * 1.3) }))} />
          </div>
        );
      })()}

      {/* Evolution chart */}
      <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-display font-semibold">Bookings evolution</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <Wallet size={11} /> Volume vs refunds · last 6 months
            </p>
          </div>
        </div>
        <div className="h-40 sm:h-56 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="refunds" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Refund processing focus panel */}
      {(() => {
        const pend = items.filter((b) => b.status === "refund_pending");
        if (pend.length === 0) return null;
        return (
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RefreshCcw size={16} className="text-amber-600" />
                <h2 className="text-sm sm:text-base font-display font-semibold">Refunds awaiting action</h2>
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">{pend.length}</Badge>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {pend.map((b) => (
                <div key={b.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{b.guest}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      <span className="font-mono">{b.id}</span> · {b.hotel} · €{b.total.toLocaleString()}
                    </div>
                  </div>
                  {can("refunds.process") && (
                    <Button size="sm" className="h-8 bg-accent text-accent-foreground shrink-0" onClick={() => setConfirmRefund(b)}>
                      <RefreshCcw size={12} className="mr-1" /> Process
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}


      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ID, guest, or hotel..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 bg-card" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter size={14} className="mr-1.5" /> {statusFilter === "all" ? "All status" : statusFilter.replace("_", " ")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="confirmed">Confirmed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="checked_in">Checked in</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="refund_pending">Refund pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-soft divide-y divide-border">
        {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No bookings match.</div>}
        {filtered.map((b) => (
          <div key={b.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[b.status]}`}>{b.status.replace("_", " ")}</Badge>
              </div>
              <div className="text-sm font-semibold truncate mt-1">{b.guest} · {b.hotel}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {b.checkIn} → {b.checkOut} · €{b.total.toLocaleString()}
                {b.refundAmount !== undefined && <> · refund €{b.refundAmount}</>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8" onClick={() => setViewing(b)}>
                <Eye size={12} className="mr-1" /> View
              </Button>
              {can("refunds.process") && b.status === "refund_pending" && (
                <Button size="sm" className="h-8 bg-accent text-accent-foreground" onClick={() => setConfirmRefund(b)}>
                  <RefreshCcw size={12} className="mr-1" /> Refund
                </Button>
              )}
              {can("bookings.cancel") && b.status !== "cancelled" && b.status !== "completed" && (
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40" onClick={() => setConfirmCancel(b)}>
                  <XCircle size={12} className="mr-1" /> Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Booking {viewing?.id}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <Row label="Status" value={<Badge variant="outline" className={`capitalize ${statusStyles[viewing.status]}`}>{viewing.status.replace("_", " ")}</Badge>} />
              <Row label="Guest" value={viewing.guest} />
              <Row label="Hotel" value={viewing.hotel} />
              <Row label="Check-in" value={viewing.checkIn} />
              <Row label="Check-out" value={viewing.checkOut} />
              <Row label="Total" value={`€${viewing.total.toLocaleString()}`} />
              {viewing.refundAmount !== undefined && <Row label="Refunded" value={`€${viewing.refundAmount}`} />}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewing(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmCancel} onOpenChange={(o) => !o && setConfirmCancel(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Cancel booking?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This force-cancels <strong className="text-foreground">{confirmCancel?.id}</strong> for {confirmCancel?.guest}. The guest will be notified.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(null)}>Keep</Button>
            <Button variant="destructive" onClick={cancel}>Cancel booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmRefund} onOpenChange={(o) => !o && setConfirmRefund(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Process refund?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Refund <strong className="text-foreground">€{confirmRefund?.total.toLocaleString()}</strong> to {confirmRefund?.guest} for booking {confirmRefund?.id}.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRefund(null)}>Cancel</Button>
            <Button onClick={refund} className="bg-accent text-accent-foreground hover:bg-accent/90"><RefreshCcw size={14} className="mr-1.5" /> Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
