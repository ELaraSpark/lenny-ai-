
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, User, Settings, LogOut, Brain, Zap } from "lucide-react"; // Removed Menu icon import here, it's in MobileNav
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav"; // Import MobileNav
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import NotificationsList from "./NotificationsList";

type NavbarProps = {
  className?: string;
};

const Navbar = ({ className }: NavbarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    // Navigate to the public main page
    navigate("/");
  };

  return (
    <div
      className={cn(
        "h-16 border-b border-border bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10",
        className
      )}
    >
      {/* Integrate MobileNav component (stays on the left) */}
      <MobileNav />

      {/* Container for right-aligned items */}
      <div className="flex items-center ml-auto space-x-2">
        {/* Search Section - Removed flex-1, adjusted margins */}
        <div className="flex items-center"> {/* Removed flex-1 and margins */}
          {searchOpen ? (
            <div className="max-w-md w-full animate-fadeIn">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoFocus
                type="search"
                placeholder="Search patients, records, or AI agents..."
                className="pl-10 py-2 border-blue-100 focus:border-blue-300"
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
              <Search size={18} />
            </Button>
          )}
        </div>

        {/* Other right-aligned items would go here */}
        {/* Notification Popover Removed */}
        {/* Avatar Dropdown Menu Removed */}
      </div>
    </div>
  );
};

export default Navbar;
