import { useMemo, useState } from "react";
import {
  TrendingUp, Percent, Save, Plus, Trash2, Download, History, Sparkles, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { revenueSeries, staffKPIs } from "@/lib/staffMockData";
import { useStaffAuth } from "@/lib/staffRoles";
import { downloadCSV } from "@/lib/staffExport";
import { toast } from "sonner";

type Plan = {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  commission: number; // %
  maxProperties: number;
  highlighted: boolean;
  features: string[];
};

type ChangeLog = {
  id: string;
  timestamp: string;
  actor: string;
  field: string;
  before: string;
  after: string;
};

const seedPlans: Plan[] = [
  { id: "starter",  name: "Starter",  monthly: 0,   yearly: 0,    commission: 15, maxProperties: 2,  highlighted: false, features: ["Up to 2 properties","Basic analytics","Email support"] },
  { id: "growth",   name: "Growth",   monthly: 79,  yearly: 790,  commission: 12, maxProperties: 10, highlighted: true,  features: ["Up to 10 properties","Advanced analytics","Priority support","Channel manager"] },
  { id: "scale",    name: "Scale",    monthly: 199, yearly: 1990, commission: 9,  maxProperties: 50, highlighted: false, features: ["Up to 50 properties","Revenue optimisation","24/7 support","API access"] },
  { id: "enterprise", name: "Enterprise", monthly: 499, yearly: 4990, commission: 7, maxProperties: 9999, highlighted: false, features: ["Unlimited properties","Dedicated CSM","Custom contracts","White-label"] },
];

const seedLogs: ChangeLog[] = [
  { id: "RC-9821", timestamp: "2026-06-21T11:22:00Z", actor: "revenue@stayvista.com", field: "Growth commission",   before: "13%",  after: "12%"  },
  { id: "RC-9820", timestamp: "2026-06-15T09:08:00Z", actor: "revenue@stayvista.com", field: "Scale monthly price", before: "€179", after: "€199" },
  { id: "RC-9819", timestamp: "2026-06-02T14:41:00Z", actor: "superadmin@stayvista.com", field: "Starter commission", before: "18%", after: "15%" },
];

export default function StaffRevenue() {
  const { can, identity } = useStaffAuth();
  const canManage = can("revenue.manage");
  const [plans, setPlans] = useState<Plan[]>(seedPlans);
  const [logs, setLogs] = useState<ChangeLog[]>(seedLogs);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [draft, setDraft] = useState<Plan | null>(null);
  const [globalCommission, setGlobalCommission] = useState(12);

  const totals = useMemo(() => {
    const arpu = plans.reduce((s, p) => s + p.monthly, 0) / plans.length;
    return {
      arpu: Math.round(arpu),
      avgCommission: (plans.reduce((s, p) => s + p.commission, 0) / plans.length).toFixed(1),
      activePlans: plans.length,
    };
  }, [plans]);

  const recordChange = (field: string, before: string, after: string) => {
    setLogs((p) => [
      { id: `RC-${Math.floor(9000 + Math.random() * 999)}`, timestamp: new Date().toISOString(), actor: identity.email, field, before, after },
      ...p,
    ]);
  };

  const openEdit = (p: Plan) => { setEditing(p); setDraft({ ...p }); };
  const savePlan = () => {
    if (!draft || !editing) return;
    setPlans((arr) => arr.map((x) => (x.id === editing.id ? draft : x)));
    if (draft.monthly !== editing.monthly) recordChange(`${draft.name} monthly`, `€${editing.monthly}`, `€${draft.monthly}`);
    if (draft.commission !== editing.commission) recordChange(`${draft.name} commission`, `${editing.commission}%`, `${draft.commission}%`);
    if (draft.maxProperties !== editing.maxProperties) recordChange(`${draft.name} max properties`, String(editing.maxProperties), String(draft.maxProperties));
    setEditing(null); setDraft(null);
    toast.success("Plan updated");
  };

  const addPlan = () => {
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = { id, name: "New plan", monthly: 49, yearly: 490, commission: 12, maxProperties: 5, highlighted: false, features: ["Custom feature"] };
    setPlans((p) => [...p, newPlan]);
    recordChange("Plan created", "—", newPlan.name);
    toast.success("Plan created");
  };

  const deletePlan = (p: Plan) => {
    setPlans((arr) => arr.filter((x) => x.id !== p.id));
    recordChange("Plan removed", p.name, "—");
    toast.success(`${p.name} removed`);
  };

  const applyGlobalCommission = () => {
    setPlans((arr) => arr.map((p) => ({ ...p, commission: globalCommission })));
    recordChange("Global commission", "various", `${globalCommission}%`);
    toast.success(`All plans set to ${globalCommission}% commission`);
  };

  const exportPlans = () => {
    downloadCSV("subscription-plans.csv", plans.map((p) => ({
      id: p.id, name: p.name, monthly: p.monthly, yearly: p.yearly,
      commission_pct: p.commission, max_properties: p.maxProperties,
    })));
    toast.success("Plans exported");
  };

  const exportRevenue = () => {
    downloadCSV("revenue-history.csv", revenueSeries);
    toast.success("Revenue history exported");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">Revenue & Pricing</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Customize subscriptions, commissions per booking and review revenue performance.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportRevenue}><Download size={14} className="mr-1.5" /> Revenue CSV</Button>
          <Button size="sm" variant="outline" onClick={exportPlans}><Download size={14} className="mr-1.5" /> Plans CSV</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI icon={TrendingUp} label="Monthly revenue" value={`€${staffKPIs.monthlyRevenue.toLocaleString()}`} hint={`+${staffKPIs.growth}% MoM`} accent />
        <KPI icon={CreditCard} label="ARPU (subs)" value={`€${totals.arpu}`} hint="Avg monthly / plan" />
        <KPI icon={Percent} label="Avg commission" value={`${totals.avgCommission}%`} hint="Across all plans" />
        <KPI icon={Sparkles} label="Active plans" value={totals.activePlans} hint={`${plans.filter((p) => p.highlighted).length} featured`} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Revenue trend" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="rmRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#rmRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Bookings by month" subtitle="Volume">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Global commission tuner */}
      {canManage && (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-accent" />
            <h2 className="text-sm sm:text-base font-display font-semibold">Global commission per booking</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Quickly normalize the commission rate across every plan. Individual plans can still be overridden below.</p>
          <div className="flex items-center gap-4">
            <Slider value={[globalCommission]} min={0} max={30} step={0.5} onValueChange={(v) => setGlobalCommission(v[0])} className="flex-1" />
            <div className="w-16 text-right font-display text-lg font-bold">{globalCommission}%</div>
            <Button size="sm" onClick={applyGlobalCommission} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save size={14} className="mr-1.5" /> Apply to all
            </Button>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-display font-semibold">Subscription plans</h2>
          {canManage && (
            <Button size="sm" variant="outline" onClick={addPlan}><Plus size={14} className="mr-1.5" /> New plan</Button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((p) => (
            <div key={p.id} className={`relative bg-card border rounded-xl p-4 shadow-soft flex flex-col ${p.highlighted ? "border-accent/60 ring-1 ring-accent/30" : "border-border"}`}>
              {p.highlighted && <Badge className="absolute -top-2 right-3 bg-accent text-accent-foreground text-[10px]">Popular</Badge>}
              <div className="text-sm font-display font-semibold">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-display font-bold">€{p.monthly}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              <div className="text-[11px] text-muted-foreground">€{p.yearly}/yr · {p.maxProperties === 9999 ? "Unlimited" : `${p.maxProperties} properties`}</div>
              <Badge variant="outline" className="mt-2 self-start text-[10px] bg-accent/10 text-accent border-accent/30">
                {p.commission}% commission
              </Badge>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground flex-1">
                {p.features.map((f) => <li key={f}>· {f}</li>)}
              </ul>
              {canManage && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => openEdit(p)}>Edit</Button>
                  <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/40" onClick={() => deletePlan(p)}>
                    <Trash2 size={12} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change history */}
      <div className="bg-card border border-border rounded-xl shadow-soft">
        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-accent" />
            <h2 className="text-sm sm:text-base font-display font-semibold">Change history</h2>
            <Badge variant="outline" className="text-[10px]">{logs.length}</Badge>
          </div>
          <Button size="sm" variant="outline" onClick={() => { downloadCSV("pricing-history.csv", logs); toast.success("History exported"); }}>
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        </div>
        <div className="divide-y divide-border">
          {logs.map((l) => (
            <div key={l.id} className="p-3 sm:p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.field}</div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">
                  <span className="font-mono">{l.id}</span> · {l.before} → <span className="text-foreground font-medium">{l.after}</span> · by {l.actor}
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0">
                {new Date(l.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setDraft(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit plan</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-3">
              <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly (€)"><Input type="number" value={draft.monthly} onChange={(e) => setDraft({ ...draft, monthly: Number(e.target.value) })} /></Field>
                <Field label="Yearly (€)"><Input type="number" value={draft.yearly} onChange={(e) => setDraft({ ...draft, yearly: Number(e.target.value) })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Commission %"><Input type="number" step="0.5" value={draft.commission} onChange={(e) => setDraft({ ...draft, commission: Number(e.target.value) })} /></Field>
                <Field label="Max properties"><Input type="number" value={draft.maxProperties} onChange={(e) => setDraft({ ...draft, maxProperties: Number(e.target.value) })} /></Field>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label htmlFor="hl" className="text-xs">Mark as featured</Label>
                <Switch id="hl" checked={draft.highlighted} onCheckedChange={(c) => setDraft({ ...draft, highlighted: c })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setDraft(null); }}>Cancel</Button>
            <Button onClick={savePlan} className="bg-accent text-accent-foreground hover:bg-accent/90"><Save size={14} className="mr-1.5" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KPI({ icon: Icon, label, value, hint, accent }: { icon: typeof TrendingUp; label: string; value: string | number; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-soft ${accent ? "bg-gradient-to-br from-card to-muted/40 border-border" : "bg-card border-border"}`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">{label}</span>
        <Icon size={16} className="text-accent" />
      </div>
      <div className="mt-2 text-lg sm:text-2xl font-display font-bold">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
      <div className="mb-2">
        <h3 className="text-sm sm:text-base font-display font-semibold">{title}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-44 sm:h-56 -ml-3">{children}</div>
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
