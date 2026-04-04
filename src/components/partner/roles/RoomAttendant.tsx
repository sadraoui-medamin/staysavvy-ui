import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Sparkles, CheckCircle, Clock, Play, AlertTriangle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const assignedRooms = [
  { num: "101", floor: 1, type: "Standard", status: "pending" as const, priority: "High", notes: "Guest checkout at 11AM", checklist: ["Bed linen", "Bathroom", "Vacuum", "Minibar", "Towels"] },
  { num: "205", floor: 2, type: "Deluxe", status: "pending" as const, priority: "Normal", notes: "", checklist: ["Bed linen", "Bathroom", "Vacuum", "Minibar", "Towels"] },
  { num: "301", floor: 3, type: "Suite", status: "in-progress" as const, priority: "VIP", notes: "Extra attention - VIP guest arriving", checklist: ["Bed linen", "Bathroom", "Vacuum", "Minibar", "Towels", "Welcome amenities"] },
  { num: "108", floor: 1, type: "Standard", status: "done" as const, priority: "Normal", notes: "", checklist: ["Bed linen", "Bathroom", "Vacuum", "Minibar", "Towels"] },
  { num: "210", floor: 2, type: "Deluxe", status: "done" as const, priority: "Normal", notes: "Reported broken lamp", checklist: ["Bed linen", "Bathroom", "Vacuum", "Minibar", "Towels"] },
];

const RoomAttendant = () => {
  const [rooms, setRooms] = useState(assignedRooms);
  const { toast } = useToast();

  const startCleaning = (num: string) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, status: "in-progress" as const } : r));
    toast({ title: "Cleaning Started", description: `Room ${num} cleaning in progress` });
  };

  const finishCleaning = (num: string) => {
    setRooms((prev) => prev.map((r) => r.num === num ? { ...r, status: "done" as const } : r));
    toast({ title: "Cleaning Complete", description: `Room ${num} marked as finished` });
  };

  const reportIssue = (num: string) => {
    toast({ title: "Issue Reported", description: `Maintenance ticket created for Room ${num}` });
  };

  const pending = rooms.filter((r) => r.status === "pending");
  const inProgress = rooms.filter((r) => r.status === "in-progress");
  const done = rooms.filter((r) => r.status === "done");
  const progress = rooms.length ? Math.round((done.length / rooms.length) * 100) : 0;

  return (
    <div className="space-y-5 max-w-lg mx-auto px-1">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Tasks</h2>
        <p className="text-sm text-muted-foreground">Today's cleaning assignments</p>
      </div>

      {/* Progress Card */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <span className="font-bold text-foreground text-lg">{done.length}/{rooms.length}</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-right">{progress}% complete</p>
        </CardContent>
      </Card>

      {/* Stats - large touch targets */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{inProgress.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">In Progress</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{done.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Room List */}
      <div className="space-y-3">
        {/* In Progress */}
        {inProgress.length > 0 && (
          <p className="text-sm font-semibold text-blue-600 flex items-center gap-2 px-1">
            <Clock size={14} /> In Progress
          </p>
        )}
        {inProgress.map((room) => (
          <Card key={room.num} className="rounded-2xl border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Bed size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-foreground">Room {room.num}</span>
                    <p className="text-xs text-muted-foreground">{room.type} · Floor {room.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {room.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30">VIP</Badge>}
                  <Badge variant="outline" className="text-xs text-blue-600">Cleaning</Badge>
                </div>
              </div>
              {room.notes && (
                <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl mb-3">{room.notes}</p>
              )}
              <div className="flex gap-2">
                <Button
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-semibold active:scale-[0.98] transition-transform"
                  onClick={() => finishCleaning(room.num)}
                >
                  <CheckCircle size={18} className="mr-2" /> Mark Finished
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-xl shrink-0 active:scale-[0.98] transition-transform"
                  onClick={() => reportIssue(room.num)}
                >
                  <AlertTriangle size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pending */}
        {pending.length > 0 && (
          <p className="text-sm font-semibold text-amber-600 flex items-center gap-2 mt-4 px-1">
            <Clock size={14} /> Pending
          </p>
        )}
        {pending.map((room) => (
          <Card key={room.num} className="rounded-2xl border-border/50">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
                    <Bed size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-foreground">Room {room.num}</span>
                    <p className="text-xs text-muted-foreground">{room.type} · Floor {room.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {room.priority === "VIP" && <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30">VIP</Badge>}
                  {room.priority === "High" && <Badge variant="destructive" className="text-[10px]">High</Badge>}
                </div>
              </div>
              {room.notes && (
                <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl mb-3">{room.notes}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-base font-semibold active:scale-[0.98] transition-transform"
                  onClick={() => startCleaning(room.num)}
                >
                  <Play size={18} className="mr-2" /> Start Cleaning
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-xl shrink-0 active:scale-[0.98] transition-transform"
                  onClick={() => reportIssue(room.num)}
                >
                  <AlertTriangle size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Completed */}
        {done.length > 0 && (
          <p className="text-sm font-semibold text-emerald-600 flex items-center gap-2 mt-4 px-1">
            <CheckCircle size={14} /> Completed
          </p>
        )}
        {done.map((room) => (
          <Card key={room.num} className="rounded-2xl border-border/50 opacity-60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Sparkles size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground">Room {room.num}</span>
                    <p className="text-xs text-muted-foreground">{room.type} · Floor {room.floor}</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs bg-emerald-600">Done</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomAttendant;
