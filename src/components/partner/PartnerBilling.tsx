import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreditCard, TrendingUp, DollarSign, Calendar, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Download, AlertTriangle, Star, Zap,
  Crown, Building2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

type BillingTab = "overview" | "history";

const subscriptionPlans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    features: ["Up to 3 properties", "5 team members", "Basic analytics", "Email support"],
    current: false,
    popular: false,
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    features: ["Up to 10 properties", "25 team members", "Advanced analytics", "Priority support", "API access"],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    features: ["Unlimited properties", "Unlimited members", "Custom analytics", "Dedicated support", "White-label", "SLA guarantee"],
    current: false,
    popular: false,
  },
];

const billingHistory = [
  { id: "INV-001", date: "Mar 1, 2026", description: "Professional Plan - Monthly", amount: 79, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-002", date: "Feb 1, 2026", description: "Professional Plan - Monthly", amount: 79, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-003", date: "Jan 1, 2026", description: "Professional Plan - Monthly", amount: 79, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-004", date: "Dec 1, 2025", description: "Professional Plan - Monthly", amount: 79, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-005", date: "Nov 1, 2025", description: "Professional Plan - Monthly", amount: 79, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-006", date: "Oct 1, 2025", description: "Starter Plan - Monthly", amount: 29, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-007", date: "Sep 1, 2025", description: "Starter Plan - Monthly", amount: 29, status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-008", date: "Aug 1, 2025", description: "Starter Plan - Monthly", amount: 29, status: "Refunded", method: "Visa •••• 4242" },
];

const monthlySpending = [
  { month: "Aug", amount: 29 },
  { month: "Sep", amount: 29 },
  { month: "Oct", amount: 29 },
  { month: "Nov", amount: 79 },
  { month: "Dec", amount: 79 },
  { month: "Jan", amount: 79 },
  { month: "Feb", amount: 79 },
  { month: "Mar", amount: 79 },
];

const spendingBreakdown = [
  { name: "Subscription", value: 79, color: "hsl(38 90% 55%)" },
  { name: "Add-ons", value: 15, color: "hsl(220 45% 20%)" },
  { name: "Overages", value: 6, color: "hsl(220 10% 50%)" },
];

const PartnerBilling = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");
  const [cancelDialog, setCancelDialog] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState<string | null>(null);
  const { toast } = useToast();

  const totalSpent = billingHistory.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
  const avgMonthly = Math.round(totalSpent / billingHistory.filter(b => b.status === "Paid").length);

  const billingStats = [
    { label: "Current Plan", value: "Professional", icon: Crown, color: "text-accent" },
    { label: "Monthly Cost", value: "$79", icon: DollarSign, color: "text-primary" },
    { label: "Total Spent", value: `$${totalSpent}`, icon: TrendingUp, color: "text-accent" },
    { label: "Next Payment", value: "Apr 1", icon: Calendar, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Billing Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {billingStats.map(s => (
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

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {[
          { key: "overview" as const, label: "Subscription & Overview" },
          { key: "history" as const, label: "Billing History" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.key ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Current Subscription */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Current Subscription</h2>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={18} className="text-accent" />
                  <span className="text-xl font-bold text-foreground">Professional Plan</span>
                </div>
                <p className="text-sm text-muted-foreground">$79/month · Renews Apr 1, 2026</p>
                <p className="text-xs text-muted-foreground mt-1">Visa ending in 4242</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setCancelDialog(true)}>
                  Cancel Plan
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg text-accent border-accent/30 hover:bg-accent/10">
                  Change Card
                </Button>
              </div>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-5">Upgrade or Downgrade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map(plan => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-5 transition-all duration-300 ${
                    plan.current
                      ? "border-accent/40 bg-accent/5 ring-1 ring-accent/20"
                      : "border-border/50 hover:border-accent/30 hover:shadow-card-hover"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-foreground text-lg">{plan.name}</h3>
                    {plan.popular && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">Popular</span>}
                    {plan.current && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">Current</span>}
                  </div>
                  <p className="text-3xl font-bold text-foreground">${plan.price}<span className="text-sm text-muted-foreground font-normal">/{plan.period}</span></p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle size={13} className="text-accent shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-5 rounded-xl ${
                      plan.current
                        ? "bg-muted text-muted-foreground cursor-default"
                        : "bg-accent text-accent-foreground hover:bg-gold-light"
                    }`}
                    disabled={plan.current}
                    onClick={() => !plan.current && setUpgradeDialog(plan.name)}
                  >
                    {plan.current ? "Current Plan" : plan.price > 79 ? "Upgrade" : "Downgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Chart */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-4">Spending Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12, border: "1px solid hsl(220 15% 90%)" }} />
                <Line type="monotone" dataKey="amount" stroke="hsl(38 90% 55%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(38 90% 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-6">
          {/* History Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
              <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-foreground">${totalSpent}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
              <p className="text-xs text-muted-foreground mb-1">Avg Monthly</p>
              <p className="text-2xl font-bold text-foreground">${avgMonthly}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
              <p className="text-xs text-muted-foreground mb-1">Invoices</p>
              <p className="text-2xl font-bold text-foreground">{billingHistory.length}</p>
            </div>
          </div>

          {/* Spending Breakdown Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
              <h3 className="font-display font-bold text-foreground mb-4">Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={spendingBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {spendingBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12, border: "1px solid hsl(220 15% 90%)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {spendingBreakdown.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-semibold text-foreground ml-auto">${s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Spending Bar Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5">
              <h3 className="font-display font-bold text-foreground mb-4">Monthly Payments</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220 10% 50%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12, border: "1px solid hsl(220 15% 90%)" }} />
                  <Bar dataKey="amount" fill="hsl(38 90% 55%)" radius={[6, 6, 0, 0]} name="Amount ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <h3 className="font-display font-bold text-foreground text-lg">All Invoices</h3>
              <Button variant="outline" size="sm" className="rounded-lg gap-1.5">
                <Download size={14} /> Export All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Description</th>
                    <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-right px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map(inv => (
                    <tr key={inv.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{inv.id}</td>
                      <td className="px-5 py-4 text-foreground text-sm">{inv.date}</td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{inv.description}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          inv.status === "Paid"
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-foreground">${inv.amount}</td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg gap-1 text-xs">
                          <Download size={12} /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <AlertTriangle size={18} className="text-destructive" /> Cancel Subscription
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Are you sure you want to cancel your Professional plan? You'll lose access to:</p>
            <ul className="text-sm space-y-1.5">
              {["Advanced analytics", "Priority support", "API access", "Up to 10 properties"].map(f => (
                <li key={f} className="flex items-center gap-2 text-destructive">
                  <XCircle size={13} /> {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">Your plan will remain active until the end of your billing period (Apr 1, 2026).</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setCancelDialog(false)}>Keep Plan</Button>
            <Button variant="destructive" className="rounded-xl" onClick={() => {
              setCancelDialog(false);
              toast({ title: "Subscription Cancelled", description: "Your plan will end on Apr 1, 2026." });
            }}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade/Downgrade Dialog */}
      <Dialog open={!!upgradeDialog} onOpenChange={() => setUpgradeDialog(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {upgradeDialog === "Enterprise" ? "Upgrade" : "Downgrade"} to {upgradeDialog}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {upgradeDialog === "Enterprise"
                ? "Unlock unlimited properties, members, and premium features."
                : "You'll be moved to the Starter plan with reduced limits."}
            </p>
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-sm text-foreground font-medium">
                New price: ${subscriptionPlans.find(p => p.name === upgradeDialog)?.price}/month
              </p>
              <p className="text-xs text-muted-foreground mt-1">Changes take effect on your next billing date.</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setUpgradeDialog(null)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-gold-light rounded-xl" onClick={() => {
              setUpgradeDialog(null);
              toast({ title: "Plan Changed", description: `You'll be moved to ${upgradeDialog} on your next billing date.` });
            }}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerBilling;
