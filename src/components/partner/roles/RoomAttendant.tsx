import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Sparkles, CheckCircle, Clock, Play } from "lucide-react";

const assignedRooms = [
  { num: "101", floor: 1, type: "Standard", status: "pending" as const, priority: "High", notes: "Guest checkout at 11AM" },
  { num: "205", floor: 2, type: "Deluxe", status: "pending" as const, priority: "Normal", notes: "" },
  { num: "301", floor: 3, type: "Suite", status: "in-progress" as const, priority: "VIP", notes: "Extra attention - VIP guest arriving" },
  { num: "108", floor: 1, type: "Standard", status: "done" as const, priority: "Normal", notes: "" },
  { num: "210", floor: 2, type: "Deluxe", status: "done" as const, priority: "Normal", notes: "Reported broken lamp" },
];

const RoomAttendant = () => {
  const [rooms, setRooms] = useState(assignedRooms);

  const startCleaning = (num: string) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, status: "in-progress" as const } : r));
  };

  const finishCleaning = (num: string) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, status: "done" as const } : r));
  };

  const pending = rooms.filter((r) => r.status === "pending");
  const inProgress = rooms.filter((r) => r.status === "in-progress");
  const done = rooms.filter((r) => r.status === "done");

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
        <p className="text-muted-foreground">Today's cleaning assignments</p>
      </div>

      {/* Progress */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <span className="font-bold text-foreground">{done.length}/{rooms.length}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(done.length / rooms.length) * 100}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-xl border-border/50"><CardContent className="p-3 text-center"><p className="text-xl font-bold text-amber-600">{pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card className="rounded-xl border-border/50"><CardContent className="p-3 text-center"><p className="text-xl font-bold text-blue-600">{inProgress.length}</p><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
        <Card className="rounded-xl border-border/50"><CardContent className="p-3 text-center"><p className="text-xl font-bold text-emerald-600">{done.length}</p><p className="text-xs text-muted-foreground">Done</p></CardContent></Card>
      </div>

      {/* Room List */}
      <div className="space-y-3">
        {inProgress.length > 0 && <p className="text-sm font-semibold text-blue-600 flex items-center gap-2"><Clock size={14} /> In Progress</p>}
        {inProgress.map((room) => (
          <Card key={room.num} className="rounded-xl border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="text-blue-600" />
                  <span className="font-bold text-lg text-foreground">Room {room.num}</span>
                  {room.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700">VIP</Badge>}
                </div>
                <Badge variant="outline" className="text-xs text-blue-600">Cleaning</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{room.type} · Floor {room.floor}</p>
              {room.notes && <p className="text-xs text-muted-foreground bg-muted/60 p-2 rounded-lg mb-3">{room.notes}</p>}
              <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => finishCleaning(room.num)}>
                <CheckCircle size={16} className="mr-2" /> Mark as Finished
              </Button>
            </CardContent>
          </Card>
        ))}

        {pending.length > 0 && <p className="text-sm font-semibold text-amber-600 flex items-center gap-2 mt-4"><Clock size={14} /> Pending</p>}
        {pending.map((room) => (
          <Card key={room.num} className="rounded-xl border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="text-muted-foreground" />
                  <span className="font-bold text-lg text-foreground">Room {room.num}</span>
                  {room.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700">VIP</Badge>}
                  {room.priority === "High" && <Badge variant="destructive" className="text-[10px]">High</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{room.type} · Floor {room.floor}</p>
              {room.notes && <p className="text-xs text-muted-foreground bg-muted/60 p-2 rounded-lg mb-3">{room.notes}</p>}
              <Button variant="outline" className="w-full rounded-xl" onClick={() => startCleaning(room.num)}>
                <Play size={16} className="mr-2" /> Start Cleaning
              </Button>
            </CardContent>
          </Card>
        ))}

        {done.length > 0 && <p className="text-sm font-semibold text-emerald-600 flex items-center gap-2 mt-4"><CheckCircle size={14} /> Completed</p>}
        {done.map((room) => (
          <Card key={room.num} className="rounded-xl border-border/50 opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600" />
                  <span className="font-bold text-foreground">Room {room.num}</span>
                </div>
                <Badge variant="default" className="text-xs bg-emerald-600">Done</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{room.type} · Floor {room.floor}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomAttendant;
