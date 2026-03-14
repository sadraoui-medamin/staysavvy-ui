import {
  HelpCircle, BookOpen, MessageCircle, FileText, ExternalLink,
  LifeBuoy, Video, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PartnerHelpDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
          <HelpCircle size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-1.5">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-2">
          Help & Support
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Documentation</p>
            <p className="text-xs text-muted-foreground">Guides & API reference</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Video size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Video Tutorials</p>
            <p className="text-xs text-muted-foreground">Learn with walkthroughs</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <FileText size={14} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">FAQ</p>
            <p className="text-xs text-muted-foreground">Frequently asked questions</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-2">
          Contact Us
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Live Chat</p>
            <p className="text-xs text-muted-foreground">Chat with support team</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Mail size={14} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Email Support</p>
            <p className="text-xs text-muted-foreground">support@stayvista.com</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <LifeBuoy size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Submit a Ticket</p>
            <p className="text-xs text-muted-foreground">We'll respond within 24h</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 cursor-pointer rounded-lg py-2.5 px-3 text-muted-foreground">
          <ExternalLink size={14} />
          <span className="text-sm">StayVista Community Forum</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PartnerHelpDropdown;
