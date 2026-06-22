import { useMemo, useState } from "react";
import { Search, Filter, RefreshCcw, XCircle, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockStaffBookings, type StaffBooking } from "@/lib/staffMockData";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  checked_in: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  completed: "bg-muted text-foreground/70 border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  refund_pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function StaffBookings() {
  const [items, setItems] = useState<StaffBooking[]>(mockStaffBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StaffBooking["status"]>("all");

  const filtered = useMemo(() => items.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (search && !`${b.id} ${b.guest} ${b.hotel}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter]);

  const refund = (id: string) => {
    setItems((p) => p.map((b) => (b.id === id ? { ...b, status: "cancelled", refundAmount: b.total } : b)));
    toast.success(`Refund processed for ${id}`);
  };
  const cancel = (id: string) => {
    setItems((p) => p.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    toast.success(`Booking ${id} cancelled`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Bookings & Refunds</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Oversee all platform bookings, force-cancel, and process refunds.</p>
      </div>

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
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No bookings match.</div>
        )}
        {filtered.map((b) => (
          <div key={b.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[b.status]}`}>
                  {b.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="text-sm font-semibold truncate mt-1">{b.guest} · {b.hotel}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {b.checkIn} → {b.checkOut} · €{b.total.toLocaleString()}
                {b.refundAmount !== undefined && <> · refund €{b.refundAmount}</>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8" onClick={() => toast.info(`Opening ${b.id}`)}>
                <Eye size={12} className="mr-1" /> View
              </Button>
              {b.status === "refund_pending" && (
                <Button size="sm" className="h-8 bg-accent text-accent-foreground" onClick={() => refund(b.id)}>
                  <RefreshCcw size={12} className="mr-1" /> Refund
                </Button>
              )}
              {b.status !== "cancelled" && b.status !== "completed" && (
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40" onClick={() => cancel(b.id)}>
                  <XCircle size={12} className="mr-1" /> Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
