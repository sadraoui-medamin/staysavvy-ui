import { useMemo, useState } from "react";
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle2, Mail, UserPlus, Trash2, Download, Eye, Users, Briefcase, UserCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { mockUsers, analyticsSeries, type StaffUser } from "@/lib/staffMockData";
import { useStaffAuth } from "@/lib/staffRoles";
import { downloadCSV } from "@/lib/staffExport";
import StatCard from "@/components/staff/StatCard";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const emptyNew: Omit<StaffUser, "id"> = {
  name: "", email: "", type: "client", status: "active",
  joinedAt: new Date().toISOString().slice(0, 10), country: "", bookings: 0,
};

export default function StaffUsers() {
  const { can } = useStaffAuth();
  const [users, setUsers] = useState<StaffUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "client" | "partner">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [viewing, setViewing] = useState<StaffUser | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<StaffUser, "id">>(emptyNew);
  const [confirmDelete, setConfirmDelete] = useState<StaffUser | null>(null);

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

  const addUser = () => {
    if (!draft.name.trim() || !draft.email.trim()) return toast.error("Name and email required");
    const prefix = draft.type === "partner" ? "P-" : "U-";
    const id = `${prefix}${Math.floor(3000 + Math.random() * 6999)}`;
    setUsers((p) => [{ ...draft, id }, ...p]);
    setAddOpen(false);
    setDraft(emptyNew);
    toast.success(`${draft.type === "partner" ? "Partner" : "Client"} ${id} added`);
  };

  const deleteUser = () => {
    if (!confirmDelete) return;
    setUsers((p) => p.filter((u) => u.id !== confirmDelete.id));
    toast.success(`${confirmDelete.id} deleted`);
    setConfirmDelete(null);
  };

  const exportUsers = () => {
    downloadCSV("users.csv", filtered);
    toast.success(`Exported ${filtered.length} accounts`);
  };

  const activeFilterCount = (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Users & Partners</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage clients, partner accounts, and access.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportUsers}><Download size={14} className="mr-1.5" /> Export</Button>
          {can("users.manage") && (
            <Button size="sm" onClick={() => setAddOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <UserPlus size={14} className="mr-1.5" /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, email, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 bg-card" />
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
        {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No accounts match your filters.</div>}
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
            <Button variant="ghost" size="sm" className="h-8 hidden sm:inline-flex" onClick={() => setViewing(u)}>
              <Eye size={14} className="mr-1" /> View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><MoreVertical size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setViewing(u)}><Shield size={14} className="mr-2" /> View details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.href = `mailto:${u.email}`; }}>
                  <Mail size={14} className="mr-2" /> Send email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {can("users.manage") && u.status !== "active" && (
                  <DropdownMenuItem onClick={() => updateStatus(u.id, "active")}>
                    <CheckCircle2 size={14} className="mr-2 text-emerald-500" /> Activate
                  </DropdownMenuItem>
                )}
                {can("users.manage") && u.status !== "suspended" && (
                  <DropdownMenuItem className="text-destructive" onClick={() => updateStatus(u.id, "suspended")}>
                    <Ban size={14} className="mr-2" /> Suspend
                  </DropdownMenuItem>
                )}
                {can("users.manage") && (
                  <DropdownMenuItem className="text-destructive" onClick={() => setConfirmDelete(u)}>
                    <Trash2 size={14} className="mr-2" /> Delete
                  </DropdownMenuItem>
                )}
                {!can("users.manage") && <DropdownMenuItem disabled className="text-xs text-muted-foreground">Read-only access</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{viewing?.name}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <Row label="ID" value={<span className="font-mono">{viewing.id}</span>} />
              <Row label="Type" value={<Badge variant="outline" className="capitalize">{viewing.type}</Badge>} />
              <Row label="Status" value={<Badge variant="outline" className={`capitalize ${statusStyles[viewing.status]}`}>{viewing.status}</Badge>} />
              <Row label="Email" value={viewing.email} />
              <Row label="Country" value={viewing.country} />
              <Row label="Joined" value={viewing.joinedAt} />
              <Row label={viewing.type === "client" ? "Bookings" : "Properties"} value={viewing.type === "client" ? viewing.bookings ?? 0 : viewing.properties ?? 0} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add account</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Full name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as StaffUser["type"] })}>
                  <option value="client">Client</option>
                  <option value="partner">Partner</option>
                </select>
              </Field>
              <Field label="Status">
                <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as StaffUser["status"] })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </Field>
            </div>
            <Field label="Country"><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addUser} className="bg-accent text-accent-foreground hover:bg-accent/90">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete account?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove <strong className="text-foreground">{confirmDelete?.name}</strong> ({confirmDelete?.id}).</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteUser}><Trash2 size={14} className="mr-1.5" /> Delete</Button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
