import { useMemo, useState } from "react";
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { mockUsers, type StaffUser } from "@/lib/staffMockData";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function StaffUsers() {
  const [users, setUsers] = useState<StaffUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "client" | "partner">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "suspended">("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (typeFilter !== "all" && u.type !== typeFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search && !`${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [users, search, typeFilter, statusFilter]);

  const updateStatus = (id: string, status: StaffUser["status"]) => {
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, status } : u)));
    toast.success(`User ${id} ${status === "active" ? "activated" : status}`);
  };

  const activeFilterCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Users & Partners</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage clients, partner accounts, and access.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-card"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-10">
              <Filter size={14} className="mr-1.5" /> Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account type</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="client">Clients</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="partner">Partners</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="suspended">Suspended</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-soft divide-y divide-border">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No accounts match your filters.</div>
        )}
        {filtered.map((u) => (
          <div key={u.id} className="flex items-center gap-3 p-3 sm:p-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center font-display font-semibold text-foreground shrink-0">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold truncate">{u.name}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{u.type}</Badge>
                <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[u.status]}`}>{u.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                <span className="font-mono">{u.id}</span> · {u.email} · {u.country}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {u.type === "client" ? `${u.bookings ?? 0} bookings` : `${u.properties ?? 0} properties`} · joined {u.joinedAt}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => toast.info(`Opening ${u.id}`)}>
                  <Shield size={14} className="mr-2" /> View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`Email sent to ${u.email}`)}>
                  <Mail size={14} className="mr-2" /> Send email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {u.status !== "active" && (
                  <DropdownMenuItem onClick={() => updateStatus(u.id, "active")}>
                    <CheckCircle2 size={14} className="mr-2 text-emerald-500" /> Activate
                  </DropdownMenuItem>
                )}
                {u.status !== "suspended" && (
                  <DropdownMenuItem className="text-destructive" onClick={() => updateStatus(u.id, "suspended")}>
                    <Ban size={14} className="mr-2" /> Suspend
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
