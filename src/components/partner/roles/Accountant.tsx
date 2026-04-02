import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, FileText, Download, Calendar,
  CreditCard, ArrowUpRight, ArrowDownRight, Receipt, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dailySales = [
  { day: "Mon", revenue: 12400, expenses: 4200 },
  { day: "Tue", revenue: 15600, expenses: 5100 },
  { day: "Wed", revenue: 13800, expenses: 4800 },
  { day: "Thu", revenue: 18200, expenses: 5500 },
  { day: "Fri", revenue: 22500, expenses: 6200 },
  { day: "Sat", revenue: 28900, expenses: 7800 },
  { day: "Sun", revenue: 21300, expenses: 6100 },
];

const revenueBreakdown = [
  { name: "Room Revenue", value: 62, color: "hsl(var(--primary))" },
  { name: "F&B", value: 22, color: "#10b981" },
  { name: "Spa & Services", value: 10, color: "#f59e0b" },
  { name: "Events", value: 6, color: "#8b5cf6" },
];

const transactions = [
  { id: "TRX-001", date: "2026-04-02", description: "Room 301 - Check-out", type: "Income", amount: "+$720", method: "Credit Card", guest: "Marie Dupont" },
  { id: "TRX-002", date: "2026-04-02", description: "Room Service Order #ORD-002", type: "Income", amount: "+$46", method: "Room Charge", guest: "James Wilson" },
  { id: "TRX-003", date: "2026-04-02", description: "Linen Supplier Invoice", type: "Expense", amount: "-$1,200", method: "Bank Transfer", guest: "" },
  { id: "TRX-004", date: "2026-04-01", description: "Room 505 - Walk-in", type: "Income", amount: "+$950", method: "Cash", guest: "Ahmed Hassan" },
  { id: "TRX-005", date: "2026-04-01", description: "Utility Bill - Electric", type: "Expense", amount: "-$3,400", method: "Bank Transfer", guest: "" },
  { id: "TRX-006", date: "2026-04-01", description: "Spa Package", type: "Income", amount: "+$180", method: "Credit Card", guest: "Sofia Garcia" },
];

const shifts = [
  { id: "SH-01", cashier: "Pierre L.", shift: "Morning (6AM-2PM)", openBalance: "$500", closeBalance: "$3,240", transactions: 28, status: "Closed" },
  { id: "SH-02", cashier: "Amina K.", shift: "Afternoon (2PM-10PM)", openBalance: "$500", closeBalance: "$4,180", transactions: 35, status: "Closed" },
  { id: "SH-03", cashier: "Marco T.", shift: "Night (10PM-6AM)", openBalance: "$300", closeBalance: "$1,120", transactions: 12, status: "Active" },
];

const Accountant = () => {
  const [period, setPeriod] = useState("week");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Finance & Accounting</h2>
          <p className="text-muted-foreground">Daily sales, auditing & shift closures</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}><SelectTrigger className="rounded-xl w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="today">Today</SelectItem><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem></SelectContent></Select>
          <Button variant="outline" className="rounded-xl gap-2"><Download size={16} /> Export</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$132,700", change: "+14.2%", up: true, icon: DollarSign },
          { label: "Net Profit", value: "$93,000", change: "+11.8%", up: true, icon: TrendingUp },
          { label: "Total Expenses", value: "$39,700", change: "+6.3%", up: false, icon: CreditCard },
          { label: "Pending Payments", value: "$4,280", change: "3 invoices", up: false, icon: Clock },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10"><s.icon size={18} className="text-primary" /></div>
                <Badge variant="outline" className={`text-xs ${s.up ? "text-emerald-600 border-emerald-200" : "text-muted-foreground"}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="rounded-2xl border-border/50 lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Revenue vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Pie */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Revenue Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`}>
                  {revenueBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {revenueBreakdown.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: r.color }} /><span className="text-muted-foreground">{r.name}</span></div>
                  <span className="font-medium text-foreground">{r.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="rounded-xl bg-muted/50">
          <TabsTrigger value="transactions" className="rounded-lg gap-1.5"><Receipt size={14} /> Transactions</TabsTrigger>
          <TabsTrigger value="shifts" className="rounded-lg gap-1.5"><Clock size={14} /> Shift Closures</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">ID</th><th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Description</th><th className="text-left p-3 font-medium">Method</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                </tr></thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-3 text-muted-foreground">{t.id}</td>
                      <td className="p-3 text-muted-foreground">{t.date}</td>
                      <td className="p-3 text-foreground">{t.description}</td>
                      <td className="p-3 text-muted-foreground">{t.method}</td>
                      <td className={`p-3 font-semibold ${t.type === "Income" ? "text-emerald-600" : "text-red-600"}`}>{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4 space-y-3">
          {shifts.map((s) => (
            <Card key={s.id} className="rounded-xl border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{s.cashier} · {s.shift}</p>
                  <p className="text-xs text-muted-foreground">Open: {s.openBalance} → Close: {s.closeBalance} · {s.transactions} transactions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "Active" ? "default" : "secondary"}>{s.status}</Badge>
                  <Button variant="outline" size="sm" className="rounded-lg gap-1"><FileText size={14} /> Audit</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accountant;
