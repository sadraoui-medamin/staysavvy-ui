import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Send, Search, Hash, Users, Plus, Smile, Paperclip, MoreHorizontal,
  Circle, Phone, Video, Pin, Reply, Trash2, Edit3, Check, CheckCheck,
  Image as ImageIcon, FileText, X, Star, Bell, BellOff, Settings,
  UserPlus, Lock, Globe, AtSign, MessageSquare, ChevronDown, ArrowDown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type MessageReaction = { emoji: string; users: string[]; };
type Attachment = { id: string; name: string; type: "image" | "file"; url: string; size: string; };

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  date: string;
  isOwn: boolean;
  reactions: MessageReaction[];
  attachments: Attachment[];
  replyTo?: { sender: string; content: string; };
  isPinned: boolean;
  isEdited: boolean;
  readBy: string[];
  status: "sent" | "delivered" | "read";
}

interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  unread: number;
  avatar?: string;
  online?: boolean;
  lastMessage?: string;
  lastTime?: string;
  description?: string;
  isPrivate?: boolean;
  isMuted?: boolean;
  members?: string[];
  typing?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
  lastSeen?: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const teamMembers: TeamMember[] = [
  { id: "u1", name: "Marie Dupont", avatar: "MD", role: "Manager", online: true },
  { id: "u2", name: "Pierre Laurent", avatar: "PL", role: "Receptionist", online: true },
  { id: "u3", name: "Sophie Bernard", avatar: "SB", role: "Housekeeping Lead", online: false, lastSeen: "2h ago" },
  { id: "u4", name: "Lucas Martin", avatar: "LM", role: "Maintenance", online: false, lastSeen: "30m ago" },
  { id: "u5", name: "Emma Wilson", avatar: "EW", role: "Night Auditor", online: true },
  { id: "u6", name: "Ahmed Hassan", avatar: "AH", role: "Concierge", online: true },
];

const defaultChannels: Channel[] = [
  { id: "c1", name: "general", type: "channel", unread: 3, lastMessage: "Welcome to the team!", lastTime: "9:30 AM", description: "General discussion for all team members", members: ["u1","u2","u3","u4","u5","u6"], typing: [] },
  { id: "c2", name: "front-desk", type: "channel", unread: 0, lastMessage: "Guest in room 204 needs towels", lastTime: "8:45 AM", description: "Front desk operations & guest requests", isPrivate: true, members: ["u1","u2","u6"], typing: [] },
  { id: "c3", name: "housekeeping", type: "channel", unread: 1, lastMessage: "Room 305 is ready", lastTime: "10:12 AM", description: "Housekeeping tasks & room status", members: ["u1","u3"], typing: [] },
  { id: "c4", name: "management", type: "channel", unread: 0, lastMessage: "Q1 review scheduled for Friday", lastTime: "Yesterday", description: "Management & strategy discussions", isPrivate: true, members: ["u1"], typing: [] },
  { id: "c5", name: "maintenance", type: "channel", unread: 2, lastMessage: "AC unit in 402 fixed", lastTime: "11:00 AM", description: "Maintenance requests & updates", members: ["u1","u4"], typing: [] },
  { id: "d1", name: "Marie Dupont", type: "dm", unread: 2, avatar: "MD", online: true, lastMessage: "Can you check the bookings?", lastTime: "10:08 AM", typing: [] },
  { id: "d2", name: "Pierre Laurent", type: "dm", unread: 0, avatar: "PL", online: true, lastMessage: "Done!", lastTime: "9:50 AM", typing: [] },
  { id: "d3", name: "Sophie Bernard", type: "dm", unread: 0, avatar: "SB", online: false, lastMessage: "See you tomorrow", lastTime: "Yesterday", typing: [] },
  { id: "d4", name: "Lucas Martin", type: "dm", unread: 1, avatar: "LM", online: false, lastMessage: "I'll handle the AC issue", lastTime: "11:05 AM", typing: [] },
];

const emojiPicker = ["👍","❤️","😂","🎉","🔥","👀","✅","💯","🙏","⭐"];

const initialMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", sender: "Marie Dupont", senderRole: "Manager", avatar: "MD", content: "Good morning everyone! 🌅 Let's have a great day.", timestamp: "9:00 AM", date: "Today", isOwn: false, reactions: [{ emoji: "👍", users: ["Pierre","Sophie"] }], attachments: [], isPinned: false, isEdited: false, readBy: ["u2","u3","u4"], status: "read" },
    { id: "m2", sender: "Pierre Laurent", senderRole: "Receptionist", avatar: "PL", content: "Morning! We have 23 check-ins scheduled today. The VIP suite is prepped.", timestamp: "9:05 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1","u3"], status: "read" },
    { id: "m3", sender: "You", senderRole: "Owner", avatar: "JD", content: "Good morning team! Let's make sure all reservations are confirmed for Friday. Priority on the conference group.", timestamp: "9:10 AM", date: "Today", isOwn: true, reactions: [{ emoji: "✅", users: ["Marie","Sophie"] }], attachments: [], isPinned: true, isEdited: false, readBy: ["u1","u2","u3","u4"], status: "read" },
    { id: "m4", sender: "Sophie Bernard", senderRole: "Housekeeping Lead", avatar: "SB", content: "I've already confirmed 12 out of 15 bookings. Working on the rest now. Also rooms 301-310 are all inspected and ready.", timestamp: "9:15 AM", date: "Today", isOwn: false, reactions: [{ emoji: "🎉", users: ["You"] }], attachments: [], isPinned: false, isEdited: false, readBy: ["u1","u2"], status: "read" },
    { id: "m5", sender: "Marie Dupont", senderRole: "Manager", avatar: "MD", content: "Great work Sophie! Also, we have a VIP guest arriving at 2 PM — Suite 501 is ready. Here's the welcome package checklist:", timestamp: "9:22 AM", date: "Today", isOwn: false, reactions: [], attachments: [{ id: "a1", name: "vip_checklist.pdf", type: "file", url: "#", size: "245 KB" }], isPinned: false, isEdited: false, readBy: ["u2","u3","u4"], status: "read" },
    { id: "m6", sender: "You", senderRole: "Owner", avatar: "JD", content: "Perfect. Let's prepare the welcome package for the VIP. Pierre, can you coordinate with the kitchen for the amenity tray?", timestamp: "9:30 AM", date: "Today", isOwn: true, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1","u2","u3"], status: "delivered" },
  ],
  c2: [
    { id: "fd1", sender: "Pierre Laurent", senderRole: "Receptionist", avatar: "PL", content: "Guest in room 204 requested extra towels and a late checkout.", timestamp: "8:30 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1"], status: "read" },
    { id: "fd2", sender: "Ahmed Hassan", senderRole: "Concierge", avatar: "AH", content: "I'll arrange the towels. Late checkout approved until 1 PM?", timestamp: "8:35 AM", date: "Today", isOwn: false, reactions: [{ emoji: "👍", users: ["Pierre"] }], attachments: [], isPinned: false, isEdited: false, readBy: ["u1","u2"], status: "read" },
    { id: "fd3", sender: "Pierre Laurent", senderRole: "Receptionist", avatar: "PL", content: "Yes, 1 PM is fine. Also, room 108 needs a crib delivered before 3 PM.", timestamp: "8:45 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1","u6"], status: "read" },
  ],
  c3: [
    { id: "hk1", sender: "Sophie Bernard", senderRole: "Housekeeping Lead", avatar: "SB", content: "Morning update: Floors 1-3 done. Starting floor 4 now.", timestamp: "8:00 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1"], status: "read" },
    { id: "hk2", sender: "Sophie Bernard", senderRole: "Housekeeping Lead", avatar: "SB", content: "Room 305 is ready for early check-in. Room 312 needs a mattress replacement — reported to maintenance.", timestamp: "10:12 AM", date: "Today", isOwn: false, reactions: [{ emoji: "✅", users: ["You"] }], attachments: [{ id: "a2", name: "room_312_photo.jpg", type: "image", url: "#", size: "1.2 MB" }], isPinned: false, isEdited: false, readBy: ["u1"], status: "read" },
  ],
  c5: [
    { id: "mt1", sender: "Lucas Martin", senderRole: "Maintenance", avatar: "LM", content: "AC unit in room 402 has been repaired. Tested and working fine now.", timestamp: "10:45 AM", date: "Today", isOwn: false, reactions: [{ emoji: "🎉", users: ["Marie"] }], attachments: [], isPinned: false, isEdited: false, readBy: ["u1"], status: "read" },
    { id: "mt2", sender: "Lucas Martin", senderRole: "Maintenance", avatar: "LM", content: "Next up: Pool pump inspection at 2 PM. Also, the lobby light fixture needs a bulb replacement.", timestamp: "11:00 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: [], status: "delivered" },
  ],
  d1: [
    { id: "dm1", sender: "Marie Dupont", senderRole: "Manager", avatar: "MD", content: "Hi John, can you check the bookings for next week? We might be overbooked on Thursday.", timestamp: "10:00 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: [], status: "read" },
    { id: "dm2", sender: "You", senderRole: "Owner", avatar: "JD", content: "Sure! I'll pull the report now and get back to you.", timestamp: "10:05 AM", date: "Today", isOwn: true, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: ["u1"], status: "read" },
    { id: "dm3", sender: "Marie Dupont", senderRole: "Manager", avatar: "MD", content: "Thanks! Also, we need to discuss the new pricing strategy for the holiday season. Can we schedule a meeting?", timestamp: "10:08 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: [], status: "delivered" },
  ],
  d4: [
    { id: "dm4", sender: "Lucas Martin", senderRole: "Maintenance", avatar: "LM", content: "Hey boss, the AC issue in 402 is resolved. But I noticed the elevator on the east wing is making a weird noise. Should I call the vendor?", timestamp: "11:05 AM", date: "Today", isOwn: false, reactions: [], attachments: [], isPinned: false, isEdited: false, readBy: [], status: "delivered" },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────
const PartnerChat = () => {
  const [activeChannel, setActiveChannel] = useState("c1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChannel]);

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setChannels(prev => prev.map(c => {
        if (c.id === "c1" && Math.random() > 0.85) {
          return { ...c, typing: ["Marie"] };
        }
        return { ...c, typing: [] };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate auto-reply
  const simulateReply = useCallback((channelId: string) => {
    const replies = [
      { sender: "Marie Dupont", avatar: "MD", role: "Manager", responses: ["Got it, I'll take care of it! 👍", "Thanks for the update.", "I'll coordinate with the team on this."] },
      { sender: "Pierre Laurent", avatar: "PL", role: "Receptionist", responses: ["On it!", "The guest has been informed.", "I'll check and get back to you."] },
      { sender: "Sophie Bernard", avatar: "SB", role: "Housekeeping Lead", responses: ["Room will be ready in 20 minutes.", "Adding it to the task list now.", "All done! ✅"] },
    ];
    const replier = replies[Math.floor(Math.random() * replies.length)];
    const response = replier.responses[Math.floor(Math.random() * replier.responses.length)];

    // Show typing first
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, typing: [replier.sender.split(" ")[0]] } : c));

    setTimeout(() => {
      setChannels(prev => prev.map(c => c.id === channelId ? { ...c, typing: [] } : c));
      const msg: Message = {
        id: `reply-${Date.now()}`,
        sender: replier.sender,
        senderRole: replier.role,
        avatar: replier.avatar,
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: "Today",
        isOwn: false,
        reactions: [],
        attachments: [],
        isPinned: false,
        isEdited: false,
        readBy: [],
        status: "delivered",
      };
      setMessages(prev => ({ ...prev, [channelId]: [...(prev[channelId] || []), msg] }));
    }, 2000 + Math.random() * 2000);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "You",
      senderRole: "Owner",
      avatar: "JD",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      isOwn: true,
      reactions: [],
      attachments: [],
      replyTo: replyTo ? { sender: replyTo.sender, content: replyTo.content } : undefined,
      isPinned: false,
      isEdited: false,
      readBy: [],
      status: "sent",
    };
    setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), msg] }));
    setNewMessage("");
    setReplyTo(null);

    // Mark as delivered after delay
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChannel]: (prev[activeChannel] || []).map(m => m.id === msg.id ? { ...m, status: "delivered" } : m),
      }));
    }, 1000);

    // Simulate reply sometimes
    if (Math.random() > 0.4) simulateReply(activeChannel);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(m => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find(r => r.emoji === emoji);
        if (existing) {
          if (existing.users.includes("You")) {
            return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, users: r.users.filter(u => u !== "You") } : r).filter(r => r.users.length > 0) };
          }
          return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, users: [...r.users, "You"] } : r) };
        }
        return { ...m, reactions: [...m.reactions, { emoji, users: ["You"] }] };
      }),
    }));
    setShowEmojiPicker(null);
  };

  const togglePin = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m),
    }));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).filter(m => m.id !== messageId),
    }));
  };

  const saveEdit = (messageId: string) => {
    if (!editContent.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeChannel]: (prev[activeChannel] || []).map(m => m.id === messageId ? { ...m, content: editContent, isEdited: true } : m),
    }));
    setEditingMessage(null);
    setEditContent("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      type: isImage ? "image" : "file",
      url: isImage ? URL.createObjectURL(file) : "#",
      size: `${(file.size / 1024).toFixed(0)} KB`,
    };
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "You",
      senderRole: "Owner",
      avatar: "JD",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      isOwn: true,
      reactions: [],
      attachments: [attachment],
      isPinned: false,
      isEdited: false,
      readBy: [],
      status: "sent",
    };
    setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), msg] }));
    e.target.value = "";
  };

  const createChannel = () => {
    if (!newChannelName.trim()) return;
    const id = `c-${Date.now()}`;
    setChannels(prev => [...prev, {
      id, name: newChannelName.toLowerCase().replace(/\s+/g, "-"), type: "channel",
      unread: 0, lastMessage: "Channel created", lastTime: "Just now",
      description: "", isPrivate: newChannelPrivate, members: [], typing: [],
    }]);
    setNewChannelName("");
    setShowCreateChannel(false);
    setActiveChannel(id);
  };

  const startDm = (member: TeamMember) => {
    const existing = channels.find(c => c.type === "dm" && c.name === member.name);
    if (existing) { setActiveChannel(existing.id); setShowNewDm(false); return; }
    const id = `d-${Date.now()}`;
    setChannels(prev => [...prev, {
      id, name: member.name, type: "dm", unread: 0, avatar: member.avatar,
      online: member.online, lastMessage: "Start a conversation", lastTime: "Now", typing: [],
    }]);
    setActiveChannel(id);
    setShowNewDm(false);
  };

  const toggleMute = (channelId: string) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, isMuted: !c.isMuted } : c));
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 200);
  };

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const channelMessages = messages[activeChannel] || [];
  const pinnedMessages = channelMessages.filter(m => m.isPinned);
  const channelsList = channels.filter(c => c.type === "channel");
  const dmList = channels.filter(c => c.type === "dm");

  const filteredChannels = searchQuery
    ? channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const filteredMessages = messageSearch
    ? channelMessages.filter(m => m.content.toLowerCase().includes(messageSearch.toLowerCase()))
    : channelMessages;

  const typingUsers = activeChannelData?.typing?.filter(t => t.length > 0) || [];

  return (
    <div className="space-y-0 animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Team Chat</h1>
        <p className="text-muted-foreground text-sm">Communicate with your team in real-time</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: 500 }}>
        {/* ─── Sidebar ─── */}
        <div className="w-72 border-r border-border/60 flex-col shrink-0 hidden md:flex bg-muted/10">
          <div className="p-3 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 bg-muted/30 rounded-xl text-xs border-border/40" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            {filteredChannels ? (
              <div className="space-y-0.5 pb-2">
                {filteredChannels.map(c => (
                  <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => { setActiveChannel(c.id); setSearchQuery(""); }} />
                ))}
                {filteredChannels.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No results found</p>}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Channels</span>
                  <button onClick={() => setShowCreateChannel(true)} className="text-muted-foreground hover:text-foreground transition-colors"><Plus size={14} /></button>
                </div>
                <div className="space-y-0.5">
                  {channelsList.map(c => (
                    <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => setActiveChannel(c.id)} />
                  ))}
                </div>

                <div className="flex items-center justify-between px-2 py-2 mt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Direct Messages</span>
                  <button onClick={() => setShowNewDm(true)} className="text-muted-foreground hover:text-foreground transition-colors"><Plus size={14} /></button>
                </div>
                <div className="space-y-0.5 pb-2">
                  {dmList.map(c => (
                    <ChannelItem key={c.id} channel={c} active={activeChannel === c.id} onClick={() => setActiveChannel(c.id)} />
                  ))}
                </div>
              </>
            )}
          </ScrollArea>

          {/* Online members footer */}
          <div className="p-3 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Circle size={8} className="text-emerald-500 fill-emerald-500" />
              <span>{teamMembers.filter(m => m.online).length} online</span>
              <span className="text-border">·</span>
              <span>{teamMembers.length} members</span>
            </div>
          </div>
        </div>

        {/* ─── Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-card/30">
            <div className="flex items-center gap-3 min-w-0">
              {activeChannelData?.type === "channel" ? (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  {activeChannelData.isPrivate ? <Lock size={14} className="text-primary" /> : <Hash size={14} className="text-primary" />}
                </div>
              ) : (
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-xs text-foreground">
                    {activeChannelData?.avatar}
                  </div>
                  {activeChannelData?.online && <Circle size={10} className="absolute -bottom-0.5 -right-0.5 text-emerald-500 fill-emerald-500 ring-2 ring-card" />}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{activeChannelData?.name}</h3>
                <p className="text-[10px] text-muted-foreground truncate">
                  {activeChannelData?.type === "dm"
                    ? activeChannelData.online ? "Active now" : "Offline"
                    : activeChannelData?.description || `${activeChannelData?.members?.length || 0} members`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground" onClick={() => setShowMessageSearch(!showMessageSearch)}><Search size={15} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"><Phone size={15} /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"><Video size={15} /></Button>
              {pinnedMessages.length > 0 && (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground relative" onClick={() => setShowPinnedMessages(true)}>
                  <Pin size={15} />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">{pinnedMessages.length}</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground" onClick={() => setShowMembers(true)}><Users size={15} /></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"><MoreHorizontal size={15} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => toggleMute(activeChannel)} className="gap-2 text-xs rounded-lg">
                    {activeChannelData?.isMuted ? <Bell size={14} /> : <BellOff size={14} />}
                    {activeChannelData?.isMuted ? "Unmute" : "Mute"} conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-xs rounded-lg"><Star size={14} />Star conversation</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-xs rounded-lg"><Settings size={14} />Channel settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Message search bar */}
          {showMessageSearch && (
            <div className="px-4 py-2 border-b border-border/60 bg-muted/20 flex items-center gap-2">
              <Search size={14} className="text-muted-foreground" />
              <Input placeholder="Search in conversation..." value={messageSearch} onChange={e => setMessageSearch(e.target.value)} className="h-8 text-xs bg-transparent border-0 focus-visible:ring-0 p-0" autoFocus />
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowMessageSearch(false); setMessageSearch(""); }}><X size={14} /></Button>
            </div>
          )}

          {/* Messages */}
          <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3 space-y-1 relative">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">{messageSearch ? "No messages found" : "No messages yet"}</p>
                <p className="text-xs mt-1">{messageSearch ? "Try a different search term" : "Start the conversation!"}</p>
              </div>
            )}
            {filteredMessages.map((msg, i) => {
              const prevMsg = filteredMessages[i - 1];
              const showDate = !prevMsg || prevMsg.date !== msg.date;
              const isConsecutive = prevMsg && prevMsg.sender === msg.sender && !showDate && !msg.replyTo;

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px bg-border/50" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{msg.date}</span>
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                  )}
                  <div className={`group flex gap-2.5 py-1 px-2 rounded-xl hover:bg-muted/30 transition-colors ${msg.isOwn ? "flex-row-reverse" : ""} ${isConsecutive ? "mt-0" : "mt-2"}`}>
                    {!isConsecutive ? (
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                        msg.isOwn ? "bg-gradient-to-br from-accent to-accent/70 text-accent-foreground" : "bg-gradient-to-br from-primary/15 to-primary/5 text-foreground"
                      }`}>{msg.avatar}</div>
                    ) : <div className="w-8 shrink-0" />}

                    <div className={`max-w-[75%] min-w-0 ${msg.isOwn ? "text-right" : ""}`}>
                      {!isConsecutive && (
                        <div className={`flex items-center gap-2 mb-0.5 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                          <span className="text-xs font-semibold text-foreground">{msg.sender}</span>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal">{msg.senderRole}</Badge>
                          <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                          {msg.isPinned && <Pin size={10} className="text-accent" />}
                          {msg.isEdited && <span className="text-[9px] text-muted-foreground italic">(edited)</span>}
                        </div>
                      )}

                      {msg.replyTo && (
                        <div className={`flex items-center gap-1.5 mb-1 ${msg.isOwn ? "justify-end" : ""}`}>
                          <div className="text-[10px] text-muted-foreground bg-muted/40 rounded-lg px-2.5 py-1 border-l-2 border-primary/40 max-w-[300px] truncate">
                            <Reply size={10} className="inline mr-1" />
                            <span className="font-semibold">{msg.replyTo.sender}:</span> {msg.replyTo.content}
                          </div>
                        </div>
                      )}

                      {editingMessage === msg.id ? (
                        <div className="flex items-end gap-2">
                          <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="min-h-[60px] text-sm rounded-xl" autoFocus />
                          <div className="flex flex-col gap-1">
                            <Button size="icon" className="h-7 w-7 rounded-lg" onClick={() => saveEdit(msg.id)}><Check size={12} /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => setEditingMessage(null)}><X size={12} /></Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {msg.content && (
                            <div className={`inline-block px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                              msg.isOwn
                                ? "bg-accent text-accent-foreground rounded-br-md"
                                : "bg-muted/50 text-foreground rounded-bl-md"
                            }`}>
                              {msg.content}
                            </div>
                          )}

                          {msg.attachments.map(att => (
                            <div key={att.id} className={`mt-1.5 inline-block ${msg.isOwn ? "text-right" : ""}`}>
                              {att.type === "image" ? (
                                <div className="rounded-xl overflow-hidden border border-border/40 max-w-[260px] bg-muted/30">
                                  <div className="w-full h-32 bg-muted/40 flex items-center justify-center"><ImageIcon size={24} className="text-muted-foreground" /></div>
                                  <div className="px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <ImageIcon size={12} />{att.name}<span className="ml-auto">{att.size}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="rounded-xl border border-border/40 px-3 py-2.5 flex items-center gap-2.5 bg-muted/20 max-w-[260px]">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><FileText size={14} className="text-primary" /></div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-foreground truncate">{att.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{att.size}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}

                      {/* Reactions */}
                      {msg.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${msg.isOwn ? "justify-end" : ""}`}>
                          {msg.reactions.map((r, ri) => (
                            <button key={ri} onClick={() => addReaction(msg.id, r.emoji)}
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                                r.users.includes("You") ? "bg-accent/10 border-accent/30 text-foreground" : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                              }`}>
                              {r.emoji} <span className="font-medium">{r.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Read receipt */}
                      {msg.isOwn && (
                        <div className={`flex items-center gap-1 mt-0.5 ${msg.isOwn ? "justify-end" : ""}`}>
                          {msg.status === "read" ? <CheckCheck size={12} className="text-accent" /> : msg.status === "delivered" ? <CheckCheck size={12} className="text-muted-foreground" /> : <Check size={12} className="text-muted-foreground" />}
                        </div>
                      )}
                    </div>

                    {/* Message actions (hover) */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-0.5 mt-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                      <button onClick={() => addReaction(msg.id, "👍")} className="h-6 w-6 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground"><Smile size={12} /></button>
                      <button onClick={() => { setReplyTo(msg); }} className="h-6 w-6 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground"><Reply size={12} /></button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-6 w-6 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground"><MoreHorizontal size={12} /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={msg.isOwn ? "start" : "end"} className="w-44 rounded-xl">
                          <DropdownMenuItem onClick={() => togglePin(msg.id)} className="gap-2 text-xs rounded-lg"><Pin size={12} />{msg.isPinned ? "Unpin" : "Pin"} message</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)} className="gap-2 text-xs rounded-lg"><Smile size={12} />Add reaction</DropdownMenuItem>
                          {msg.isOwn && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => { setEditingMessage(msg.id); setEditContent(msg.content); }} className="gap-2 text-xs rounded-lg"><Edit3 size={12} />Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteMessage(msg.id)} className="gap-2 text-xs rounded-lg text-destructive focus:text-destructive"><Trash2 size={12} />Delete</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Emoji picker */}
                  {showEmojiPicker === msg.id && (
                    <div className={`flex gap-1 py-1.5 px-2 ${msg.isOwn ? "justify-end" : "ml-10"}`}>
                      <div className="flex gap-0.5 bg-card border border-border/60 rounded-xl px-2 py-1.5 shadow-lg">
                        {emojiPicker.map(emoji => (
                          <button key={emoji} onClick={() => addReaction(msg.id, emoji)} className="w-7 h-7 rounded-lg hover:bg-muted/60 flex items-center justify-center text-sm transition-transform hover:scale-110">{emoji}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />

            {/* Scroll to bottom */}
            {showScrollDown && (
              <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="fixed bottom-28 right-10 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10">
                <ArrowDown size={16} className="text-foreground" />
              </button>
            )}
          </div>

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="px-5 py-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</span>
              </div>
            </div>
          )}

          {/* Reply preview */}
          {replyTo && (
            <div className="px-4 py-2 border-t border-border/60 bg-muted/20 flex items-center gap-3">
              <Reply size={14} className="text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-primary">Replying to {replyTo.sender}</p>
                <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setReplyTo(null)}><X size={12} /></Button>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground shrink-0 hover:text-foreground" onClick={() => fileInputRef.current?.click()}>
                <Paperclip size={16} />
              </Button>
              <Input
                placeholder={`Message ${activeChannelData?.type === "channel" ? "#" : ""}${activeChannelData?.name}...`}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                className="h-10 bg-muted/30 rounded-xl flex-1 border-border/40"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground shrink-0 hover:text-foreground"><Smile size={16} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {emojiPicker.map(emoji => (
                      <button key={emoji} onClick={() => setNewMessage(prev => prev + emoji)} className="w-8 h-8 rounded-lg hover:bg-muted/60 flex items-center justify-center text-base transition-transform hover:scale-110">{emoji}</button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={sendMessage} disabled={!newMessage.trim()} className="h-9 w-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 shrink-0" size="icon">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Dialogs ─── */}

      {/* Pinned Messages */}
      <Dialog open={showPinnedMessages} onOpenChange={setShowPinnedMessages}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pin size={16} className="text-accent" />Pinned Messages</DialogTitle>
            <DialogDescription>Important messages pinned in this conversation</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {pinnedMessages.map(msg => (
                <div key={msg.id} className="rounded-xl border border-border/60 p-3 bg-muted/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold">{msg.avatar}</div>
                    <span className="text-xs font-semibold">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground">{msg.content}</p>
                  <Button variant="ghost" size="sm" className="text-xs mt-2 h-7" onClick={() => { togglePin(msg.id); }}>
                    <Pin size={10} className="mr-1" />Unpin
                  </Button>
                </div>
              ))}
              {pinnedMessages.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No pinned messages</p>}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Members panel */}
      <Dialog open={showMembers} onOpenChange={setShowMembers}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users size={16} />Members</DialogTitle>
            <DialogDescription>People in this conversation</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-1">
              {teamMembers.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center font-bold text-xs">{m.avatar}</div>
                    {m.online && <Circle size={10} className="absolute -bottom-0.5 -right-0.5 text-emerald-500 fill-emerald-500 ring-2 ring-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.role} · {m.online ? "Online" : m.lastSeen || "Offline"}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => { startDm(m); setShowMembers(false); }}><MessageSquare size={12} /></Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create Channel */}
      <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>Create a new channel for your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Channel Name</label>
              <Input value={newChannelName} onChange={e => setNewChannelName(e.target.value)} placeholder="e.g. announcements" className="rounded-xl" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Private Channel</p>
                <p className="text-xs text-muted-foreground">Only invited members can see this channel</p>
              </div>
              <button onClick={() => setNewChannelPrivate(!newChannelPrivate)}
                className={`w-10 h-6 rounded-full transition-colors ${newChannelPrivate ? "bg-accent" : "bg-muted"} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${newChannelPrivate ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateChannel(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={createChannel} disabled={!newChannelName.trim()} className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/80">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New DM */}
      <Dialog open={showNewDm} onOpenChange={setShowNewDm}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AtSign size={16} />New Message</DialogTitle>
            <DialogDescription>Start a direct message with a team member</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-1">
              {teamMembers.map(m => (
                <button key={m.id} onClick={() => startDm(m)} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors text-left">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center font-bold text-xs">{m.avatar}</div>
                    {m.online && <Circle size={10} className="absolute -bottom-0.5 -right-0.5 text-emerald-500 fill-emerald-500 ring-2 ring-card" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Channel Item ────────────────────────────────────────────────────────────
const ChannelItem = ({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all ${
      active ? "bg-accent/10 text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
    }`}
  >
    {channel.type === "channel" ? (
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-accent/20" : "bg-muted/40"}`}>
        {channel.isPrivate ? <Lock size={12} /> : <Hash size={12} />}
      </div>
    ) : (
      <div className="relative shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center font-bold text-[10px] text-foreground">
          {channel.avatar}
        </div>
        {channel.online && <Circle size={8} className="absolute -bottom-0.5 -right-0.5 text-emerald-500 fill-emerald-500 ring-1 ring-card" />}
      </div>
    )}
    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between">
        <span className="truncate text-xs font-medium">{channel.name}</span>
        <span className="text-[9px] text-muted-foreground ml-1 shrink-0">{channel.lastTime}</span>
      </div>
      {channel.lastMessage && (
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{channel.lastMessage}</p>
      )}
    </div>
    {channel.unread > 0 && (
      <span className="bg-accent text-accent-foreground text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 px-1">
        {channel.unread}
      </span>
    )}
    {channel.isMuted && <BellOff size={10} className="text-muted-foreground shrink-0" />}
  </button>
);

export default PartnerChat;
