import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bed, Sparkles, ClipboardCheck, AlertTriangle, Search,
  User, Package, CheckCircle, Clock, ArrowRight, Filter,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RoomStatus = "dirty" | "cleaning" | "inspected" | "clean" | "occupied" | "maintenance";

const allRooms: { num: string; floor: number; type: string; status: RoomStatus; assignee: string; priority: string }[] = [
  { num: "101", floor: 1, type: "Standard", status: "dirty", assignee: "", priority: "High" },
  { num: "102", floor: 1, type: "Standard", status: "cleaning", assignee: "Ana L.", priority: "Normal" },
  { num: "103", floor: 1, type: "Deluxe", status: "clean", assignee: "", priority: "Normal" },
  { num: "104", floor: 1, type: "Deluxe", status: "occupied", assignee: "", priority: "Normal" },
  { num: "201", floor: 2, type: "Standard", status: "dirty", assignee: "", priority: "High" },
  { num: "202", floor: 2, type: "Suite", status: "inspected", assignee: "Carlos M.", priority: "Normal" },
  { num: "203", floor: 2, type: "Standard", status: "maintenance", assignee: "", priority: "Urgent" },
  { num: "204", floor: 2, type: "Deluxe", status: "clean", assignee: "", priority: "Normal" },
  { num: "301", floor: 3, type: "Suite", status: "dirty", assignee: "", priority: "VIP" },
  { num: "302", floor: 3, type: "Standard", status: "cleaning", assignee: "Fatima K.", priority: "Normal" },
  { num: "303", floor: 3, type: "Deluxe", status: "clean", assignee: "", priority: "Normal" },
  { num: "304", floor: 3, type: "Executive", status: "occupied", assignee: "", priority: "Normal" },
];

const staff = ["Ana L.", "Carlos M.", "Fatima K.", "David R.", "Elena S."];

const inventory = [
  { item: "Bath Towels", inStock: 245, minStock: 100, status: "OK" },
  { item: "Bed Sheets (King)", inStock: 82, minStock: 50, status: "OK" },
  { item: "Bed Sheets (Twin)", inStock: 35, minStock: 40, status: "Low" },
  { item: "Shampoo Bottles", inStock: 18, minStock: 50, status: "Critical" },
  { item: "Soap Bars", inStock: 120, minStock: 60, status: "OK" },
  { item: "Toilet Paper", inStock: 200, minStock: 80, status: "OK" },
  { item: "Slippers", inStock: 45, minStock: 30, status: "OK" },
];

const statusConfig: Record<RoomStatus, { label: string; color: string; bg: string }> = {
  dirty: { label: "Dirty", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  cleaning: { label: "Cleaning", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
  inspected: { label: "Inspected", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  clean: { label: "Clean", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  occupied: { label: "Occupied", color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/30" },
  maintenance: { label: "Maintenance", color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/30" },
};

const HousekeepingLead = () => {
  const [rooms, setRooms] = useState(allRooms);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFloor, setFilterFloor] = useState<string>("all");

  const filteredRooms = rooms.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterFloor !== "all" && r.floor !== Number(filterFloor)) return false;
    return true;
  });

  const updateStatus = (num: string, status: RoomStatus) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, status } : r));
  };

  const assignStaff = (num: string, assignee: string) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, assignee, status: "cleaning" as RoomStatus } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Housekeeping</h2>
          <p className="text-muted-foreground">Room status board, task assignment & inventory</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(["dirty", "cleaning", "inspected", "clean", "maintenance"] as RoomStatus[]).map((s) => (
          <Card key={s} className="rounded-xl border-border/50">
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold ${statusConfig[s].color}`}>{rooms.filter((r) => r.status === s).length}</p>
              <p className="text-xs text-muted-foreground capitalize">{s}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="board">
        <TabsList className="rounded-xl bg-muted/50">
          <TabsTrigger value="board" className="rounded-lg gap-1.5"><Bed size={14} /> Room Board</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg gap-1.5"><ClipboardCheck size={14} /> Tasks</TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-lg gap-1.5"><Package size={14} /> Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4 space-y-4">
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-xl w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem>{Object.keys(statusConfig).map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filterFloor} onValueChange={setFilterFloor}>
              <SelectTrigger className="rounded-xl w-32"><SelectValue placeholder="Floor" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Floors</SelectItem><SelectItem value="1">Floor 1</SelectItem><SelectItem value="2">Floor 2</SelectItem><SelectItem value="3">Floor 3</SelectItem></SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredRooms.map((room) => {
              const cfg = statusConfig[room.status];
              return (
                <Card key={room.num} className={`rounded-xl border-border/50 ${room.priority === "VIP" ? "ring-2 ring-amber-400" : room.priority === "Urgent" ? "ring-2 ring-red-400" : ""}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">{room.num}</span>
                        {room.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">VIP</Badge>}
                        {room.priority === "Urgent" && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                      </div>
                      <Badge variant="outline" className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{room.type} · Floor {room.floor}</p>
                    {room.assignee && <p className="text-xs flex items-center gap-1"><User size={12} /> {room.assignee}</p>}

                    <div className="flex gap-1.5 flex-wrap">
                      {room.status === "dirty" && (
                        <Select onValueChange={(v) => assignStaff(room.num, v)}>
                          <SelectTrigger className="h-7 text-xs rounded-lg w-full"><SelectValue placeholder="Assign staff" /></SelectTrigger>
                          <SelectContent>{staff.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      )}
                      {room.status === "cleaning" && <Button size="sm" className="rounded-lg text-xs w-full h-7" onClick={() => updateStatus(room.num, "inspected")}>Mark Inspected</Button>}
                      {room.status === "inspected" && <Button size="sm" className="rounded-lg text-xs w-full h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(room.num, "clean")}>Approve Clean</Button>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4 space-y-3">
          {rooms.filter((r) => r.status === "cleaning").map((r) => (
            <Card key={r.num} className="rounded-xl border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30"><Sparkles size={16} className="text-amber-600" /></div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Room {r.num} · {r.type}</p>
                    <p className="text-xs text-muted-foreground">Assigned to {r.assignee || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs text-amber-600"><Clock size={12} className="mr-1" /> In Progress</Badge>
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => updateStatus(r.num, "inspected")}>Complete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {rooms.filter((r) => r.status === "cleaning").length === 0 && <div className="text-center py-12 text-muted-foreground">No active cleaning tasks</div>}
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Item</th>
                  <th className="text-left p-3 font-medium">In Stock</th>
                  <th className="text-left p-3 font-medium">Min Stock</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {inventory.map((inv) => (
                    <tr key={inv.item} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{inv.item}</td>
                      <td className="p-3 text-muted-foreground">{inv.inStock}</td>
                      <td className="p-3 text-muted-foreground">{inv.minStock}</td>
                      <td className="p-3">
                        <Badge variant={inv.status === "OK" ? "default" : inv.status === "Low" ? "secondary" : "destructive"} className="text-xs">{inv.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousekeepingLead;
