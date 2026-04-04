import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onNavigateHelp?: () => void;
}

const PartnerHelpDropdown = ({ onNavigateHelp }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground rounded-xl"
      onClick={onNavigateHelp}
    >
      <HelpCircle size={18} />
    </Button>
  );
};

export default PartnerHelpDropdown;
