import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send, Search, Hash, Users, Plus, Smile, Paperclip, MoreHorizontal,
  Circle, Phone, Video,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  unread: number;
  avatar?: string;
  online?: boolean;
  lastMessage?: string;
}

const channels: Channel[] = [
  { id: "c1", name: "general", type: "channel", unread: 3, lastMessage: "Welcome to the team!" },
  { id: "c2", name: "front-desk", type: "channel", unread: 0, lastMessage: "Guest in room 204 needs..." },
  { id: "c3", name: "housekeeping", type: "channel", unread: 1, lastMessage: "Room 305 is ready" },
  { id: "c4", name: "management", type: "channel", unread: 0, lastMessage: "Q1 review scheduled" },
  { id: "d1", name: "Marie Dupont", type: "dm", unread: 2, avatar: "MD", online: true, lastMessage: "Can you check the bookings?" },
  { id: "d2", name: "Pierre Laurent", type: "dm", unread: 0, avatar: "PL", online: true, lastMessage: "Done!" },
  { id: "d3", name: "Sophie Bernard", type: "dm", unread: 0, avatar: "SB", online: false, lastMessage: "See you tomorrow" },
  { id: "d4", name: "Lucas Martin", type: "dm", unread: 1, avatar: "LM", online: false, lastMessage: "I'll handle it" },
];

const initialMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", sender: "Marie Dupont", avatar: "MD", content: "Good morning everyone! 🌅", timestamp: "9:00 AM", isOwn: false },
    { id: "m2", sender: "Pierre Laurent", avatar: "PL", content: "Morning! Ready for the busy weekend ahead.", timestamp: "9:05 AM", isOwn: false },
    { id: "m3", sender: "You", avatar: "JD", content: "Good morning team! Let's make sure all reservations are confirmed for Friday.", timestamp: "9:10 AM", isOwn: true },
    { id: "m4", sender: "Sophie Bernard", avatar: "SB", content: "I've already confirmed 12 out of 15 bookings. Working on the rest now.", timestamp: "9:15 AM", isOwn: false },
    { id: "m5", sender: "Marie Dupont", avatar: "MD", content: "Great work Sophie! Also, we have a VIP guest arriving at 2 PM. Suite 501 is ready.", timestamp: "9:22 AM", isOwn: false },
    { id: "m6", sender: "You", avatar: "JD", content: "Perfect. Let's prepare the welcome package for the VIP. Pierre, can you coordinate with the kitchen?", timestamp: "9:30 AM", isOwn: true },
  ],
  d1: [
    { id: "dm1", sender: "Marie Dupont", avatar: "MD", content: "Hi John, can you check the bookings for next week?", timestamp: "10:00 AM", isOwn: false },
    { id: "dm2", sender: "You", avatar: "JD", content: "Sure! I'll pull the report now.", timestamp: "10:05 AM", isOwn: true },
    { id: "dm3", sender: "Marie Dupont", avatar: "MD", content: "Thanks! Also, we need to discuss the new pricing strategy.", timestamp: "10:08 AM", isOwn: false },
  ],
};

const PartnerChat = () => {
  const [activeChannel, setActiveChannel] = useState("c1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChannel]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "You",
      avatar: "JD",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), msg],
    }));
    setNewMessage("");
  };

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const channelMessages = messages[activeChannel] || [];
  const channelsList = channels.filter(c => c.type === "channel");
  const dmList = channels.filter(c => c.type === "dm");

  const filteredChannels = searchQuery
    ? channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  return (
    <div className="space-y-0 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Team Chat</h1>
        <p className="text-muted-foreground text-sm">Communicate with your team in real-time</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden flex" style={{ height: "calc(100vh - 240px)", minHeight: 500 }}>
        {/* Sidebar */}
        <div className="w-64 border-r border-border/60 flex flex-col shrink-0 hidden md:flex">
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-9 bg-muted/30 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {filteredChannels ? (
              <div className="space-y-0.5">
                {filteredChannels.map(c => (
                  <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => { setActiveChannel(c.id); setSearchQuery(""); }} />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Channels</span>
                  <button className="text-muted-foreground hover:text-foreground"><Plus size={14} /></button>
                </div>
                <div className="space-y-0.5">
                  {channelsList.map(c => (
                    <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => setActiveChannel(c.id)} />
                  ))}
                </div>

                <div className="flex items-center justify-between px-2 py-2 mt-3">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
                  <button className="text-muted-foreground hover:text-foreground"><Plus size={14} /></button>
                </div>
                <div className="space-y-0.5">
                  {dmList.map(c => (
                    <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => setActiveChannel(c.id)} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <div className="flex items-center gap-3 min-w-0">
              {activeChannelData?.type === "channel" ? (
                <Hash size={18} className="text-muted-foreground shrink-0" />
              ) : (
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-xs text-foreground">
                    {activeChannelData?.avatar}
                  </div>
                  {activeChannelData?.online && (
                    <Circle size={10} className="absolute -bottom-0.5 -right-0.5 text-accent fill-accent" />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{activeChannelData?.name}</h3>
                {activeChannelData?.type === "dm" && (
                  <p className="text-[10px] text-muted-foreground">{activeChannelData.online ? "Online" : "Offline"}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground"><Phone size={16} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground"><Video size={16} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground"><Users size={16} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground"><MoreHorizontal size={16} /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {channelMessages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.isOwn
                    ? "bg-gradient-to-br from-accent to-gold-light text-accent-foreground"
                    : "bg-gradient-to-br from-primary/20 to-primary/5 text-foreground"
                }`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-[70%] ${msg.isOwn ? "text-right" : ""}`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs font-semibold text-foreground">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.isOwn
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-muted/60 text-foreground rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground shrink-0">
                <Paperclip size={16} />
              </Button>
              <Input
                placeholder={`Message ${activeChannelData?.type === "channel" ? "#" : ""}${activeChannelData?.name}...`}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="h-10 bg-muted/30 rounded-xl flex-1"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground shrink-0">
                <Smile size={16} />
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="h-9 w-9 rounded-lg bg-accent text-accent-foreground hover:bg-gold-light shrink-0"
                size="icon"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChannelItem = ({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
      active ? "bg-accent/10 text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    }`}
  >
    {channel.type === "channel" ? (
      <Hash size={15} className="shrink-0" />
    ) : (
      <div className="relative shrink-0">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-[10px] text-foreground">
          {channel.avatar}
        </div>
        {channel.online && <Circle size={8} className="absolute -bottom-0.5 -right-0.5 text-accent fill-accent" />}
      </div>
    )}
    <span className="truncate flex-1 text-left text-xs font-medium">{channel.name}</span>
    {channel.unread > 0 && (
      <span className="bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
        {channel.unread}
      </span>
    )}
  </button>
);

export default PartnerChat;
