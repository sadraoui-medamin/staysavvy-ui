import { useState } from "react";
import { Wallet, ArrowUpRight, RefreshCcw, Download, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { revenueSeries, staffKPIs } from "@/lib/staffMockData";
import { useStaffAuth } from "@/lib/staffRoles";
import { ExportReportDialog, type ExportField } from "@/components/staff/ExportReportDialog";
import { toast } from "sonner";

type Payout = { id: string; partner: string; amount: number; status: "pending" | "released" | "scheduled"; date: string };

const initialPayouts: Payout[] = [
  { id: "PO-4401", partner: "Aurora Hotels Group", amount: 18420, status: "pending",   date: "2026-06-23" },
  { id: "PO-4402", partner: "Coastal Stays Ltd.",  amount: 7240,  status: "scheduled", date: "2026-06-25" },
  { id: "PO-4403", partner: "Sunset Riads",        amount: 3120,  status: "pending",   date: "2026-06-23" },
  { id: "PO-4404", partner: "Nordic Lodges",       amount: 980,   status: "released",  date: "2026-06-21" },
  { id: "PO-4405", partner: "Aurora Hotels Group", amount: 12880, status: "released",  date: "2026-06-18" },
];

const statusStyles: Record<Payout["status"], string> = {
  pending:   "bg-amber-500/10 text-amber-600 border-amber-500/30",
  scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  released:  "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

export default function StaffFinance() {
  const { can } = useStaffAuth();
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportKind, setExportKind] = useState<"revenue" | "payouts">("revenue");
  const openExport = (kind: "revenue" | "payouts") => { setExportKind(kind); setExportOpen(true); };

  const revenueFields: ExportField[] = [
    { key: "month",    label: "Month",    default: true },
    { key: "revenue",  label: "Revenue",  default: true },
    { key: "bookings", label: "Bookings", default: true },
  ];
  const payoutFields: ExportField[] = [
    { key: "id",      label: "ID",      default: true },
    { key: "partner", label: "Partner", default: true },
    { key: "amount",  label: "Amount",  default: true },
    { key: "status",  label: "Status",  default: true },
    { key: "date",    label: "Date",    default: true },
  ];

  const release = (id: string) => {
    setPayouts((p) => p.map((x) => (x.id === id ? { ...x, status: "released" } : x)));
    toast.success(`Payout ${id} released`);
  };

  const totals = {
    pending:  payouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    released: payouts.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0),
    revenue:  staffKPIs.monthlyRevenue,
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold">Finance & Payouts</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Revenue ledger, partner payouts and refund accounting.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-card to-muted/40 border border-border rounded-xl p-4 shadow-soft">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Monthly revenue</span>
            <ArrowUpRight size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-display font-bold">€{totals.revenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">+{staffKPIs.growth}% MoM</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Payouts pending</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-display font-bold">€{totals.pending.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Payouts released (mo.)</span>
            <Wallet size={16} className="text-accent" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-display font-bold">€{totals.released.toLocaleString()}</div>
        </div>
      </div>

      {/* Revenue ledger chart */}
      <div className="bg-card border border-border rounded-xl p-3 sm:p-5 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-display font-semibold">Revenue ledger</h2>
          <Button size="sm" variant="outline" onClick={() => { downloadCSV("revenue-ledger.csv", revenueSeries); toast.success("Ledger exported (.csv)"); }}>
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        </div>
        <div className="h-48 sm:h-64 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries}>
              <defs>
                <linearGradient id="finRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#finRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payouts list */}
      <div className="bg-card border border-border rounded-xl shadow-soft">
        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCcw size={16} className="text-accent" />
            <h2 className="text-sm sm:text-base font-display font-semibold">Partner payouts</h2>
            <Badge variant="outline" className="text-[10px]">{payouts.length}</Badge>
          </div>
          <Button size="sm" variant="outline" onClick={() => { downloadCSV("payouts.csv", payouts); toast.success("Payouts exported"); }}>
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        </div>
        <div className="divide-y divide-border">
          {payouts.map((p) => (
            <div key={p.id} className="p-3 sm:p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                  <Badge variant="outline" className={`text-[10px] capitalize ${statusStyles[p.status]}`}>{p.status}</Badge>
                </div>
                <div className="text-sm font-semibold truncate mt-1">{p.partner}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Scheduled {p.date} · €{p.amount.toLocaleString()}</div>
              </div>
              {p.status !== "released" && can("finance.payout") && (
                <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-500/90 text-white shrink-0" onClick={() => release(p.id)}>
                  <CheckCircle2 size={12} className="mr-1" /> Release
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
