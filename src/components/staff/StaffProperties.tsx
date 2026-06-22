import { useMemo, useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, Flag, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProperties, type StaffProperty } from "@/lib/staffMockData";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  flagged: "bg-orange-500/10 text-orange-600 border-orange-500/30",
};

export default function StaffProperties() {
  const [items, setItems] = useState<StaffProperty[]>(mockProperties);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StaffProperty["status"]>("all");

  const filtered = useMemo(() => items.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !`${p.name} ${p.partner} ${p.city} ${p.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, search, statusFilter]);

  const setStatus = (id: string, status: StaffProperty["status"]) => {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Property ${id} ${status}`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Properties Moderation</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Review submissions, flag issues, and curate the catalog.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search property, partner or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-card"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter size={14} className="mr-1.5" /> {statusFilter === "all" ? "All status" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="flagged">Flagged</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rejected">Rejected</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  <span className="font-mono">{p.id}</span> · {p.city}, {p.country}
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[p.status]} shrink-0`}>
                {p.status}
              </Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
              <div>Partner: <span className="text-foreground font-medium">{p.partner}</span></div>
              <div>Rooms: {p.rooms} {p.rating && <>· Rating: {p.rating} ★</>}</div>
              <div>Submitted: {p.submittedAt}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8" onClick={() => toast.info(`Opening ${p.id}`)}>
                <Eye size={12} className="mr-1" /> View
              </Button>
              {p.status !== "approved" && (
                <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-500/90 text-white" onClick={() => setStatus(p.id, "approved")}>
                  <CheckCircle2 size={12} className="mr-1" /> Approve
                </Button>
              )}
              {p.status !== "flagged" && (
                <Button size="sm" variant="outline" className="h-8 text-orange-600 border-orange-500/40" onClick={() => setStatus(p.id, "flagged")}>
                  <Flag size={12} className="mr-1" /> Flag
                </Button>
              )}
              {p.status !== "rejected" && (
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40" onClick={() => setStatus(p.id, "rejected")}>
                  <XCircle size={12} className="mr-1" /> Reject
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
