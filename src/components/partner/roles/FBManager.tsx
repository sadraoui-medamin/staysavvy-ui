import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UtensilsCrossed, Clock, CheckCircle, ChefHat, Plus,
  Search, DollarSign, ShoppingCart, Edit, Trash2, Eye,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const menuItems = [
  { id: 1, name: "Club Sandwich", category: "Main", price: 18, available: true },
  { id: 2, name: "Caesar Salad", category: "Starter", price: 14, available: true },
  { id: 3, name: "Grilled Salmon", category: "Main", price: 28, available: true },
  { id: 4, name: "Chocolate Fondant", category: "Dessert", price: 12, available: false },
  { id: 5, name: "Crème Brûlée", category: "Dessert", price: 10, available: true },
  { id: 6, name: "Tomato Soup", category: "Starter", price: 9, available: true },
  { id: 7, name: "Steak Frites", category: "Main", price: 32, available: true },
  { id: 8, name: "Fresh Juice", category: "Beverage", price: 7, available: true },
];

const orders = [
  { id: "ORD-001", room: "301", guest: "Marie Dupont", items: ["Club Sandwich", "Fresh Juice"], total: 25, status: "new", time: "12:15", notes: "No onions" },
  { id: "ORD-002", room: "415", guest: "James Wilson", items: ["Steak Frites", "Caesar Salad"], total: 46, status: "preparing", time: "12:30", notes: "Medium rare" },
  { id: "ORD-003", room: "505", guest: "Ahmed Hassan", items: ["Grilled Salmon", "Crème Brûlée"], total: 38, status: "ready", time: "12:05", notes: "Halal" },
  { id: "ORD-004", room: "107", guest: "Sofia Garcia", items: ["Tomato Soup"], total: 9, status: "delivered", time: "11:45", notes: "" },
  { id: "ORD-005", room: "208", guest: "Yuki Tanaka", items: ["Caesar Salad", "Fresh Juice"], total: 21, status: "new", time: "12:40", notes: "" },
];

const statusFlow = { new: "preparing", preparing: "ready", ready: "delivered" } as Record<string, string>;

const FBManager = () => {
  const [orderList, setOrderList] = useState(orders);
  const [menu, setMenu] = useState(menuItems);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [menuDialog, setMenuDialog] = useState(false);

  const advanceOrder = (id: string) => {
    setOrderList((prev) => prev.map((o) => o.id === id ? { ...o, status: statusFlow[o.status] || o.status } : o));
  };

  const toggleAvailability = (id: number) => {
    setMenu((prev) => prev.map((m) => m.id === id ? { ...m, available: !m.available } : m));
  };

  const statusColor: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    preparing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
    ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
    delivered: "bg-gray-100 text-gray-700 dark:bg-gray-900/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Food & Beverage</h2>
          <p className="text-muted-foreground">Menu management, room service orders & billing</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setMenuDialog(true)}><Plus size={16} /> Add Menu Item</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: orderList.filter((o) => o.status === "new").length, icon: ShoppingCart, color: "text-blue-500" },
          { label: "Preparing", value: orderList.filter((o) => o.status === "preparing").length, icon: ChefHat, color: "text-amber-500" },
          { label: "Ready", value: orderList.filter((o) => o.status === "ready").length, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Today's Revenue", value: `$${orderList.reduce((s, o) => s + o.total, 0)}`, icon: DollarSign, color: "text-violet-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/60"><s.icon size={20} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="rounded-xl bg-muted/50">
          <TabsTrigger value="orders" className="rounded-lg gap-1.5"><ShoppingCart size={14} /> Orders</TabsTrigger>
          <TabsTrigger value="menu" className="rounded-lg gap-1.5"><UtensilsCrossed size={14} /> Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4 space-y-3">
          {["new", "preparing", "ready", "delivered"].map((status) => {
            const statusOrders = orderList.filter((o) => o.status === status);
            if (!statusOrders.length) return null;
            return (
              <div key={status} className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground capitalize flex items-center gap-2">
                  {status === "new" ? <ShoppingCart size={14} /> : status === "preparing" ? <ChefHat size={14} /> : status === "ready" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {status} ({statusOrders.length})
                </p>
                {statusOrders.map((order) => (
                  <Card key={order.id} className="rounded-xl border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${statusColor[order.status]}`}>
                          {order.status === "new" ? <ShoppingCart size={16} /> : order.status === "preparing" ? <ChefHat size={16} /> : <CheckCircle size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">Room {order.room} · {order.guest}</p>
                          <p className="text-xs text-muted-foreground">{order.items.join(", ")} {order.notes && `· ${order.notes}`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{order.time}</span>
                        <span className="font-bold text-sm text-foreground">${order.total}</span>
                        {statusFlow[order.status] && (
                          <Button size="sm" className="rounded-lg text-xs" onClick={() => advanceOrder(order.id)}>
                            {order.status === "new" ? "→ Kitchen" : order.status === "preparing" ? "→ Ready" : "→ Delivered"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="menu" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Item</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr></thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{item.name}</td>
                      <td className="p-3 text-muted-foreground">{item.category}</td>
                      <td className="p-3 text-foreground">${item.price}</td>
                      <td className="p-3">
                        <Badge variant={item.available ? "default" : "secondary"} className="text-xs cursor-pointer" onClick={() => toggleAvailability(item.id)}>
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </td>
                      <td className="p-3 flex gap-1">
                        <Button variant="ghost" size="sm" className="rounded-lg"><Edit size={14} /></Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-destructive"><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={menuDialog} onOpenChange={setMenuDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Add Menu Item</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Item Name</Label><Input className="rounded-xl mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Select><SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="starter">Starter</SelectItem><SelectItem value="main">Main</SelectItem><SelectItem value="dessert">Dessert</SelectItem><SelectItem value="beverage">Beverage</SelectItem></SelectContent></Select></div>
              <div><Label>Price ($)</Label><Input type="number" className="rounded-xl mt-1" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" className="rounded-xl" onClick={() => setMenuDialog(false)}>Cancel</Button><Button className="rounded-xl">Add Item</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FBManager;
