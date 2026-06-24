import { useState } from "react";
import { UserPlus, Trash2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LIST, ROLES, STAFF_DIRECTORY, type StaffIdentity, type StaffRole, useStaffAuth } from "@/lib/staffRoles";
import { toast } from "sonner";

export default function StaffTeam() {
  const { can, identity } = useStaffAuth();
  const [team, setTeam] = useState<StaffIdentity[]>(STAFF_DIRECTORY);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("support");

  const canManage = can("team.manage");

  const add = () => {
    if (!name.trim() || !email.trim()) return toast.error("Name and email required");
    if (team.some((t) => t.email === email.toLowerCase())) return toast.error("Email already exists");
    setTeam((p) => [...p, { name: name.trim(), email: email.trim().toLowerCase(), role }]);
    setName(""); setEmail(""); setRole("support");
    toast.success("Team member added");
  };

  const remove = (email: string) => {
    setTeam((p) => p.filter((t) => t.email !== email));
    toast.success("Member removed");
  };

  const changeRole = (email: string, role: StaffRole) => {
    setTeam((p) => p.map((t) => (t.email === email ? { ...t, role } : t)));
    toast.success("Role updated");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Staff & Roles</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage the internal team and their access scopes.</p>
      </div>

      {/* Role legend */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLE_LIST.map((r) => (
          <div key={r.key} className="bg-card border border-border rounded-xl p-3 sm:p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] uppercase ${r.color}`}>{r.label}</Badge>
              <span className="text-[11px] text-muted-foreground">{r.permissions.length} perms</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Add member */}
      {canManage && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus size={16} className="text-accent" />
            <h2 className="text-sm font-display font-semibold">Invite member</h2>
          </div>
          <div className="grid sm:grid-cols-[1fr_1fr_160px_auto] gap-2">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
            <Input placeholder="email@stayvista.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 justify-between">
                  {ROLES[role].label}
                  <ShieldCheck size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Assign role</DropdownMenuLabel>
                {ROLE_LIST.map((r) => (
                  <DropdownMenuItem key={r.key} onClick={() => setRole(r.key)}>{r.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={add} className="h-10 bg-accent text-accent-foreground hover:bg-accent/90">Add</Button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="bg-card border border-border rounded-xl shadow-soft divide-y divide-border">
        {team.map((m) => {
          const r = ROLES[m.role];
          const isSelf = m.email === identity.email;
          return (
            <div key={m.email} className="flex items-center gap-3 p-3 sm:p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center font-display font-bold text-foreground shrink-0">
                {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold truncate">{m.name}</span>
                  <Badge variant="outline" className={`text-[10px] uppercase ${r.color}`}>{r.label}</Badge>
                  {isSelf && <Badge variant="outline" className="text-[10px]">You</Badge>}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">{m.email}</div>
              </div>
              {canManage && !isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 shrink-0">Manage</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Change role</DropdownMenuLabel>
                    {ROLE_LIST.map((r) => (
                      <DropdownMenuItem key={r.key} onClick={() => changeRole(m.email, r.key)}>{r.label}</DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.success(`Reset link sent to ${m.email}`)}>
                      <Mail size={14} className="mr-2" /> Send reset link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => remove(m.email)}>
                      <Trash2 size={14} className="mr-2" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
