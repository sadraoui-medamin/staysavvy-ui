import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Video, FileText, MessageCircle, Mail, LifeBuoy,
  Search, ChevronRight, ExternalLink, Play, Clock, CheckCircle,
  Send, ArrowLeft, Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type HelpPage = "main" | "docs" | "videos" | "faq" | "chat" | "email" | "ticket";

const docsSections = [
  { title: "Getting Started", desc: "Set up your account, add properties, and invite team members", articles: 12, icon: "🚀" },
  { title: "Booking Management", desc: "Handle reservations, check-ins, cancellations, and payments", articles: 18, icon: "📅" },
  { title: "Property Setup", desc: "Configure rooms, rates, amenities, and photos", articles: 15, icon: "🏨" },
  { title: "Team & Roles", desc: "Manage staff accounts, permissions, and role-based access", articles: 8, icon: "👥" },
  { title: "Reports & Analytics", desc: "Understand dashboards, export data, and track KPIs", articles: 10, icon: "📊" },
  { title: "Billing & Payments", desc: "Subscriptions, invoices, payment methods, and refunds", articles: 7, icon: "💳" },
  { title: "API Reference", desc: "REST API endpoints, authentication, and webhooks", articles: 22, icon: "🔌" },
  { title: "Integrations", desc: "Connect with OTAs, PMS systems, and third-party tools", articles: 14, icon: "🔗" },
];

const videoTutorials = [
  { title: "Complete Dashboard Walkthrough", duration: "12:30", category: "Getting Started", thumbnail: "🎬" },
  { title: "Setting Up Your First Property", duration: "8:45", category: "Properties", thumbnail: "🏠" },
  { title: "Managing Bookings Efficiently", duration: "10:15", category: "Bookings", thumbnail: "📋" },
  { title: "Team Roles & Permissions Guide", duration: "7:20", category: "Team", thumbnail: "👤" },
  { title: "Understanding Reports & Analytics", duration: "15:00", category: "Reports", thumbnail: "📈" },
  { title: "Revenue Management Best Practices", duration: "11:30", category: "Revenue", thumbnail: "💰" },
  { title: "Guest Relations & Concierge Tips", duration: "9:00", category: "Guests", thumbnail: "🤝" },
  { title: "Housekeeping Workflow Optimization", duration: "6:45", category: "Operations", thumbnail: "🧹" },
];

const faqItems = [
  { q: "How do I add a new property?", a: "Navigate to the Properties tab, click 'Add Property', fill in the details including name, location, rooms, and amenities, then upload photos and save.", category: "Properties" },
  { q: "How do I invite team members?", a: "Go to the Team tab, click 'Add Member', enter their email and assign a role. They'll receive an invitation email to set up their account.", category: "Team" },
  { q: "How does the booking status system work?", a: "Bookings follow an automatic lifecycle: Pending → Confirmed → Checked In → Checked Out → Completed. The system auto-transitions based on dates.", category: "Bookings" },
  { q: "Can I export my reports?", a: "Yes! In the Reports tab, use the export buttons to download data as PDF or CSV. You can filter by date range before exporting.", category: "Reports" },
  { q: "How do I change my subscription plan?", a: "Go to Settings → Billing → Subscription tab. You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.", category: "Billing" },
  { q: "What roles are available for team members?", a: "StayVista supports 10 roles: Super Admin, Revenue Manager, Receptionist, Guest Relations, Housekeeping Lead, Room Attendant, Maintenance, F&B Manager, Accountant, and Security Officer.", category: "Team" },
  { q: "How do I handle a booking cancellation?", a: "Open the booking details and click 'Reject' for pending bookings. For confirmed bookings, the guest can cancel through their portal, or you can manage it through the front desk interface.", category: "Bookings" },
  { q: "Is my data secure?", a: "Yes, we use industry-standard encryption (AES-256), regular security audits, and comply with GDPR. Two-factor authentication is available in Settings.", category: "Security" },
];

const PartnerHelp = () => {
  const [page, setPage] = useState<HelpPage>("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "general", priority: "medium", message: "" });
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "bot", text: "Hello! 👋 Welcome to StayVista support. How can I help you today?", time: "Just now" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const { toast } = useToast();

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: "user", text: chatInput, time: "Just now" }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: "Thanks for reaching out! A support agent will be with you shortly. In the meantime, you can check our FAQ or documentation for quick answers.",
        time: "Just now"
      }]);
    }, 1500);
  };

  const submitTicket = () => {
    if (!ticketForm.subject || !ticketForm.message) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Ticket Submitted", description: `Ticket #${Math.floor(Math.random() * 10000)} created. We'll respond within 24 hours.` });
    setTicketForm({ subject: "", category: "general", priority: "medium", message: "" });
    setPage("main");
  };

  const BackButton = () => (
    <button onClick={() => setPage("main")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
      <ArrowLeft size={16} /> Back to Help Center
    </button>
  );

  if (page === "docs") return (
    <div className="space-y-6 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Documentation</h1>
        <p className="text-muted-foreground text-sm">Guides, references, and how-to articles</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documentation..." className="pl-9 h-10 bg-card rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {docsSections.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-card-hover hover:border-accent/20 transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                <p className="text-xs text-accent mt-2 font-medium">{s.articles} articles</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (page === "videos") return (
    <div className="space-y-6 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Video Tutorials</h1>
        <p className="text-muted-foreground text-sm">Learn with step-by-step video walkthroughs</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoTutorials.map((v, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-card-hover hover:border-accent/20 transition-all cursor-pointer group">
            <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
              <span className="text-4xl">{v.thumbnail}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/10 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <Play size={20} className="text-accent-foreground ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded-md font-mono">{v.duration}</span>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{v.category}</span>
              <h3 className="font-semibold text-foreground text-sm mt-2 group-hover:text-accent transition-colors">{v.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (page === "faq") return (
    <div className="space-y-6 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-sm">Quick answers to common questions</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search FAQ..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-10 bg-card rounded-xl" />
      </div>
      <div className="space-y-3">
        {faqItems.filter(f => !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())).map((f, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden transition-all">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">{f.category}</span>
                <h3 className="font-semibold text-foreground text-sm">{f.q}</h3>
              </div>
              <ChevronRight size={16} className={`text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4">{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (page === "chat") return (
    <div className="space-y-4 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Live Chat</h1>
        <p className="text-muted-foreground text-sm">Chat with our support team in real-time</p>
      </div>
      <div className="bg-card rounded-2xl border border-border/50 flex flex-col" style={{ height: "60vh" }}>
        <div className="p-4 border-b border-border/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <MessageCircle size={14} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">StayVista Support</p>
            <p className="text-xs text-accent flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Online</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border/40 flex gap-2">
          <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="rounded-xl" onKeyDown={e => e.key === "Enter" && sendChat()} />
          <Button onClick={sendChat} className="rounded-xl bg-accent text-accent-foreground hover:bg-gold-light px-4">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  if (page === "email") return (
    <div className="space-y-6 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Email Support</h1>
        <p className="text-muted-foreground text-sm">Send us an email and we'll get back to you</p>
      </div>
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div className="bg-accent/5 rounded-xl p-5 border border-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <Mail size={20} className="text-accent" />
            <h3 className="font-semibold text-foreground">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">General Support</p>
              <p className="font-medium text-foreground">support@stayvista.com</p>
            </div>
            <div>
              <p className="text-muted-foreground">Billing Inquiries</p>
              <p className="font-medium text-foreground">billing@stayvista.com</p>
            </div>
            <div>
              <p className="text-muted-foreground">Technical Support</p>
              <p className="font-medium text-foreground">tech@stayvista.com</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone Support</p>
              <p className="font-medium text-foreground flex items-center gap-1"><Phone size={12} /> +33 1 23 45 67 89</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><Clock size={14} /> Response times:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { plan: "Starter", time: "48 hours", color: "bg-muted" },
              { plan: "Professional", time: "24 hours", color: "bg-accent/10" },
              { plan: "Enterprise", time: "4 hours", color: "bg-primary/10" },
            ].map(r => (
              <div key={r.plan} className={`${r.color} rounded-xl p-4 text-center`}>
                <p className="font-bold text-foreground text-lg">{r.time}</p>
                <p className="text-xs text-muted-foreground">{r.plan} Plan</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (page === "ticket") return (
    <div className="space-y-6 animate-fade-in">
      <BackButton />
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Submit a Ticket</h1>
        <p className="text-muted-foreground text-sm">Create a support request and we'll respond within 24 hours</p>
      </div>
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Subject *</label>
          <Input value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of your issue" className="rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Category</label>
            <select value={ticketForm.category} onChange={e => setTicketForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
              <option value="general">General</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Priority</label>
            <select value={ticketForm.priority} onChange={e => setTicketForm(f => ({ ...f, priority: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-foreground text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Message *</label>
          <Textarea value={ticketForm.message} onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue in detail..." className="rounded-xl min-h-[120px]" />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => setPage("main")}>Cancel</Button>
          <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-gold-light gap-2" onClick={submitTicket}>
            <Send size={16} /> Submit Ticket
          </Button>
        </div>
      </div>
      <div className="bg-muted/30 rounded-2xl border border-border/50 p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Recent Tickets</h3>
        <div className="space-y-3">
          {[
            { id: "TK-1042", subject: "Property sync issue", status: "Resolved", date: "Mar 10, 2026" },
            { id: "TK-1038", subject: "Payment not processing", status: "In Progress", date: "Mar 8, 2026" },
            { id: "TK-1035", subject: "Feature request: bulk import", status: "Open", date: "Mar 5, 2026" },
          ].map(t => (
            <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                <span className="text-sm text-foreground">{t.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${t.status === "Resolved" ? "bg-accent/10 text-accent" : t.status === "In Progress" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main help center page
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground text-sm">Find answers, tutorials, and contact our support team</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for help..." className="pl-9 h-12 bg-card rounded-xl text-base" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { page: "docs" as const, icon: BookOpen, title: "Documentation", desc: "Guides & API reference", color: "bg-accent/10 text-accent" },
          { page: "videos" as const, icon: Video, title: "Video Tutorials", desc: "Learn with walkthroughs", color: "bg-primary/10 text-primary" },
          { page: "faq" as const, icon: FileText, title: "FAQ", desc: "Frequently asked questions", color: "bg-accent/10 text-accent" },
          { page: "chat" as const, icon: MessageCircle, title: "Live Chat", desc: "Chat with support team", color: "bg-primary/10 text-primary" },
          { page: "email" as const, icon: Mail, title: "Email Support", desc: "support@stayvista.com", color: "bg-accent/10 text-accent" },
          { page: "ticket" as const, icon: LifeBuoy, title: "Submit a Ticket", desc: "We'll respond within 24h", color: "bg-primary/10 text-primary" },
        ].map(item => (
          <button key={item.page} onClick={() => setPage(item.page)} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-card-hover hover:border-accent/20 transition-all text-left group">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
              <item.icon size={22} />
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PartnerHelp;
