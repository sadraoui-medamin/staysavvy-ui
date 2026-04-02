import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, TrendingDown, Percent, Calendar,
  Tag, Gift, BarChart3, ArrowUpRight, ArrowDownRight,
  Plus, Edit, Trash2, Eye, Search, Filter,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, AreaChart, Area,
} from "recharts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const rateData = [
  { date: "Mon", standard: 120, deluxe: 210, suite: 380 },
  { date: "Tue", standard: 130, deluxe: 220, suite: 390 },
  { date: "Wed", standard: 145, deluxe: 240, suite: 410 },
  { date: "Thu", standard: 160, deluxe: 260, suite: 450 },
  { date: "Fri", standard: 190, deluxe: 310, suite: 520 },
  { date: "Sat", standard: 210, deluxe: 340, suite: 580 },
  { date: "Sun", standard: 180, deluxe: 290, suite: 480 },
];

const occupancyData = [
  { month: "Jan", occupancy: 72, revenue: 42000 },
  { month: "Feb", occupancy: 78, revenue: 48000 },
  { month: "Mar", occupancy: 85, revenue: 55000 },
  { month: "Apr", occupancy: 82, revenue: 52000 },
  { month: "May", occupancy: 88, revenue: 62000 },
  { month: "Jun", occupancy: 95, revenue: 78000 },
];

const roomTypes = [
  { id: 1, name: "Standard Room", baseRate: 120, currentRate: 145, minRate: 90, maxRate: 250, demand: "Medium", status: "Active" },
  { id: 2, name: "Deluxe Room", baseRate: 210, currentRate: 240, minRate: 150, maxRate: 400, demand: "High", status: "Active" },
  { id: 3, name: "Executive Suite", baseRate: 380, currentRate: 410, minRate: 280, maxRate: 650, demand: "High", status: "Active" },
  { id: 4, name: "Family Room", baseRate: 180, currentRate: 180, minRate: 120, maxRate: 320, demand: "Low", status: "Active" },
  { id: 5, name: "Penthouse", baseRate: 800, currentRate: 920, minRate: 600, maxRate: 1500, demand: "Premium", status: "Active" },
];

const promotions = [
  { id: 1, name: "Early Bird 15%", code: "EARLY15", discount: "15%", type: "Percentage", validFrom: "2026-04-01", validTo: "2026-06-30", uses: 42, status: "Active" },
  { id: 2, name: "Weekend Escape", code: "WEEKEND20", discount: "20%", type: "Percentage", validFrom: "2026-04-01", validTo: "2026-05-31", uses: 28, status: "Active" },
  { id: 3, name: "Loyalty $50 Off", code: "LOYAL50", discount: "$50", type: "Fixed", validFrom: "2026-03-01", validTo: "2026-12-31", uses: 15, status: "Active" },
  { id: 4, name: "Flash Sale 30%", code: "FLASH30", discount: "30%", type: "Percentage", validFrom: "2026-03-15", validTo: "2026-03-20", uses: 87, status: "Expired" },
];

const stats = [
  { label: "Avg. Daily Rate", value: "$187", change: "+5.2%", up: true, icon: DollarSign },
  { label: "RevPAR", value: "$162", change: "+8.1%", up: true, icon: TrendingUp },
  { label: "Occupancy Rate", value: "86.4%", change: "+3.2%", up: true, icon: Percent },
  { label: "Total Revenue", value: "$78,450", change: "+12.3%", up: true, icon: BarChart3 },
];

const RevenueManager = () => {
  const [editRate, setEditRate] = useState<typeof roomTypes[0] | null>(null);
  const [promoDialog, setPromoDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Revenue Management</h2>
          <p className="text-muted-foreground">Monitor and optimize pricing strategy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2"><Calendar size={16} /> Season Settings</Button>
          <Button className="rounded-xl gap-2" onClick={() => setPromoDialog(true)}><Plus size={16} /> New Promotion</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10"><s.icon size={18} className="text-primary" /></div>
                <Badge variant="outline" className={`text-xs ${s.up ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-red-600 border-red-200 bg-red-50"}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rate Trends Chart */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Dynamic Rate Trends (This Week)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="standard" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Standard" />
                <Line type="monotone" dataKey="deluxe" stroke="#10b981" strokeWidth={2} dot={false} name="Deluxe" />
                <Line type="monotone" dataKey="suite" stroke="#f59e0b" strokeWidth={2} dot={false} name="Suite" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy & Revenue */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Occupancy vs Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Area yAxisId="left" type="monotone" dataKey="occupancy" fill="hsl(var(--primary)/0.2)" stroke="hsl(var(--primary))" name="Occupancy %" />
                  <Area yAxisId="right" type="monotone" dataKey="revenue" fill="rgba(16,185,129,0.2)" stroke="#10b981" name="Revenue $" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Promotions */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Promotions</CardTitle>
            <Button variant="ghost" size="sm" className="rounded-xl gap-1"><Tag size={14} /> Manage</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {promotions.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10"><Gift size={16} className="text-accent" /></div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.code} · {p.discount} off · {p.uses} uses</p>
                    </div>
                  </div>
                  <Badge variant={p.status === "Active" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Rate Table */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Room Rate Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><Input placeholder="Search rooms..." className="pl-9 rounded-xl w-48" /></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Room Type</th>
                <th className="text-left p-3 font-medium">Base Rate</th>
                <th className="text-left p-3 font-medium">Current Rate</th>
                <th className="text-left p-3 font-medium">Min/Max</th>
                <th className="text-left p-3 font-medium">Demand</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {roomTypes.map((r) => (
                  <tr key={r.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{r.name}</td>
                    <td className="p-3 text-muted-foreground">${r.baseRate}</td>
                    <td className="p-3">
                      <span className={`font-semibold ${r.currentRate > r.baseRate ? "text-emerald-600" : "text-foreground"}`}>${r.currentRate}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">${r.minRate} – ${r.maxRate}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-xs ${r.demand === "High" || r.demand === "Premium" ? "text-emerald-600 border-emerald-200" : r.demand === "Low" ? "text-amber-600 border-amber-200" : "text-blue-600 border-blue-200"}`}>{r.demand}</Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => setEditRate(r)}><Edit size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Rate Dialog */}
      <Dialog open={!!editRate} onOpenChange={() => setEditRate(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Edit Rate: {editRate?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Current Rate ($)</Label><Input type="number" defaultValue={editRate?.currentRate} className="rounded-xl mt-1" /></div>
              <div><Label>Base Rate ($)</Label><Input type="number" defaultValue={editRate?.baseRate} className="rounded-xl mt-1" /></div>
              <div><Label>Min Rate ($)</Label><Input type="number" defaultValue={editRate?.minRate} className="rounded-xl mt-1" /></div>
              <div><Label>Max Rate ($)</Label><Input type="number" defaultValue={editRate?.maxRate} className="rounded-xl mt-1" /></div>
            </div>
            <div><Label>Demand Level</Label>
              <Select defaultValue={editRate?.demand}><SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Premium">Premium</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setEditRate(null)}>Cancel</Button><Button className="rounded-xl">Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Dialog */}
      <Dialog open={promoDialog} onOpenChange={setPromoDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Create Promotion</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input placeholder="e.g. Summer Sale" className="rounded-xl mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Promo Code</Label><Input placeholder="SUMMER25" className="rounded-xl mt-1" /></div>
              <div><Label>Discount</Label><Input placeholder="25%" className="rounded-xl mt-1" /></div>
              <div><Label>Valid From</Label><Input type="date" className="rounded-xl mt-1" /></div>
              <div><Label>Valid To</Label><Input type="date" className="rounded-xl mt-1" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setPromoDialog(false)}>Cancel</Button><Button className="rounded-xl">Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenueManager;
