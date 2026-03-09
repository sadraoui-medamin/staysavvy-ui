import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, Users, UserCheck, UserX, Shield, LayoutGrid, List,
  MoreHorizontal, Eye, Pencil, Trash2, Mail, Clock,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Receptionist" | "Revenue Manager" | "Housekeeping" | "Concierge";
  status: "Active" | "Inactive" | "Invited";
  avatar: string;
  phone: string;
  joinedAt: string;
}

const initialMembers: TeamMember[] = [
  { id: "t1", name: "Marie Dupont", email: "marie@hotel.com", role: "Manager", status: "Active", avatar: "MD", phone: "+33 6 12 34 56 78", joinedAt: "2024-06-15" },
  { id: "t2", name: "Pierre Laurent", email: "pierre@hotel.com", role: "Receptionist", status: "Active", avatar: "PL", phone: "+33 6 98 76 54 32", joinedAt: "2024-09-01" },
  { id: "t3", name: "Sophie Bernard", email: "sophie@hotel.com", role: "Revenue Manager", status: "Active", avatar: "SB", phone: "+33 6 55 44 33 22", joinedAt: "2025-01-10" },
  { id: "t4", name: "Lucas Martin", email: "lucas@hotel.com", role: "Housekeeping", status: "Inactive", avatar: "LM", phone: "+33 6 11 22 33 44", joinedAt: "2025-03-20" },
  { id: "t5", name: "Emma Petit", email: "emma@hotel.com", role: "Concierge", status: "Invited", avatar: "EP", phone: "+33 6 66 77 88 99", joinedAt: "2026-02-28" },
];

const roleFilters = ["All", "Manager", "Receptionist", "Revenue Manager", "Housekeeping", "Concierge"] as const;
const statusFilters = ["All", "Active", "Inactive", "Invited"] as const;

const statusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-accent/10 text-accent border border-accent/20";
    case "Inactive": return "bg-muted text-muted-foreground border border-border";
    case "Invited": return "bg-primary/10 text-primary border border-primary/20";
    default: return "bg-muted text-muted-foreground border border-border";
  }
};

const roleColor = (role: string) => {
  switch (role) {
    case "Manager": return "bg-accent/10 text-accent";
    case "Revenue Manager": return "bg-primary/10 text-primary";
    default: return "bg-muted/60 text-muted-foreground";
  }
};

const emptyMember: Omit<TeamMember, "id" | "avatar" | "joinedAt"> = {
  name: "", email: "", role: "Receptionist", status: "Invited", phone: "",
};

const PartnerTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewMember, setViewMember] = useState<TeamMember | null>(null);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState(emptyMember);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === "Active").length;
    const inactive = members.filter(m => m.status === "Inactive").length;
    const invited = members.filter(m => m.status === "Invited").length;
    return { total, active, inactive, invited };
  }, [members]);

  const filtered = useMemo(() => {
    let result = [...members];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (roleFilter !== "All") result = result.filter(m => m.role === roleFilter);
    if (statusFilter !== "All") result = result.filter(m => m.status === statusFilter);
    return result;
  }, [members, search, roleFilter, statusFilter]);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const openCreate = () => { setFormData(emptyMember); setIsCreating(true); };
  const openEdit = (m: TeamMember) => {
    setFormData({ name: m.name, email: m.email, role: m.role, status: m.status, phone: m.phone });
    setEditMember(m);
  };

  const saveMember = () => {
    if (!formData.name || !formData.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    if (isCreating) {
      const newMember: TeamMember = { ...formData, id: `t${Date.now()}`, avatar: getInitials(formData.name), joinedAt: new Date().toISOString().slice(0, 10) };
      setMembers(prev => [...prev, newMember]);
      toast({ title: "Member Added", description: `${formData.name} has been invited.` });
      setIsCreating(false);
    } else if (editMember) {
      setMembers(prev => prev.map(m => m.id === editMember.id ? { ...m, ...formData, avatar: getInitials(formData.name) } : m));
      toast({ title: "Member Updated", description: `${formData.name} has been updated.` });
      setEditMember(null);
    }
  };

  const confirmDeleteMember = () => {
    if (!deleteConfirm) return;
    setMembers(prev => prev.filter(m => m.id !== deleteConfirm.id));
    toast({ title: "Member Removed", description: `${deleteConfirm.name} has been removed from the team.` });
    setDeleteConfirm(null);
  };

  const statCards = [
    { label: "Total Members", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Active", value: stats.active, icon: UserCheck, color: "text-accent" },
    { label: "Inactive", value: stats.inactive, icon: UserX, color: "text-muted-foreground" },
    { label: "Invited", value: stats.invited, icon: Mail, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground text-sm">Invite and manage your team members</p>
        </div>
        <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-gold-light gap-1.5 rounded-xl shadow-sm">
          <Plus size={16} /> Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 hover:shadow-card-hover transition-all">
            <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
          {roleFilters.map(r => <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>)}
        </select>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Members */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <Users size={40} className="mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No members found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-sm text-foreground">
                  {m.avatar}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => setViewMember(m)}><Eye size={14} /> View</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => openEdit(m)}><Pencil size={14} /> Edit</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2 text-destructive" onClick={() => setDeleteConfirm(m)}><Trash2 size={14} /> Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-foreground">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{m.email}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${roleColor(m.role)}`}>{m.role}</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="text-right px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-xs text-foreground">{m.avatar}</div>
                      <span className="font-medium text-foreground">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{m.email}</td>
                  <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-md font-medium ${roleColor(m.role)}`}>{m.role}</span></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span></td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{m.joinedAt}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setViewMember(m)}><Eye size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(m)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => setDeleteConfirm(m)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Member Dialog */}
      <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Team Member</DialogTitle>
          </DialogHeader>
          {viewMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-lg text-foreground">{viewMember.avatar}</div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{viewMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewMember.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs mb-1">Role</p><span className={`text-xs px-2.5 py-1 rounded-md font-medium ${roleColor(viewMember.role)}`}>{viewMember.role}</span></div>
                <div><p className="text-muted-foreground text-xs mb-1">Status</p><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(viewMember.status)}`}>{viewMember.status}</span></div>
                <div><p className="text-muted-foreground text-xs mb-1">Phone</p><p className="font-medium text-foreground">{viewMember.phone}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Joined</p><p className="font-medium text-foreground">{viewMember.joinedAt}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isCreating || !!editMember} onOpenChange={() => { setIsCreating(false); setEditMember(null); }}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{isCreating ? "Add Team Member" : "Edit Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Full Name *</label>
                <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email *</label>
                <Input value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Phone</label>
                <Input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} className="h-10 bg-muted/30 rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Role</label>
                <select value={formData.role} onChange={e => setFormData(f => ({ ...f, role: e.target.value as TeamMember["role"] }))} className="w-full h-10 px-3 rounded-lg border border-border bg-muted/30 text-foreground text-sm">
                  <option value="Manager">Manager</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Revenue Manager">Revenue Manager</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Concierge">Concierge</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                <select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value as TeamMember["status"] }))} className="w-full h-10 px-3 rounded-lg border border-border bg-muted/30 text-foreground text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Invited">Invited</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditMember(null); }} className="rounded-lg">Cancel</Button>
            <Button onClick={saveMember} className="bg-accent text-accent-foreground hover:bg-gold-light rounded-lg">{isCreating ? "Add Member" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Remove Team Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <strong className="text-foreground">{deleteConfirm?.name}</strong> from the team? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-lg">Cancel</Button>
            <Button onClick={confirmDeleteMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg gap-1.5">
              <Trash2 size={14} /> Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerTeam;
