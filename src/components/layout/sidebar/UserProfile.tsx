
import React from "react";
import { cn } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "@/stores/authStore"; // Import the Zustand store
import { useToast } from "@/hooks/use-toast";
import NavItem from "./NavItem";

type UserProfileProps = {
  collapsed: boolean;
};

const UserProfile = ({ collapsed }: UserProfileProps) => {
  const { user, signOut } = useAuthStore(); // Use Zustand store
  const { toast } = useToast();
  
  const handleSignOut = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="p-4 border-t border-border">
      {!collapsed && (
        <div className="flex items-center space-x-3 mb-3 px-2 py-2">
          <Avatar className="h-8 w-8 bg-aida-100">
            <AvatarFallback className="bg-aida-500 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email} {/* Display name or email */}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Medical Professional
            </p>
          </div>
        </div>
      )}
      
      <nav className="space-y-1">
        <NavItem
          to="/settings"
          icon={Settings}
          label="Settings"
          collapsed={collapsed}
        />
        <button 
          onClick={handleSignOut}
          className={cn(
            "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all",
            "text-red-500 hover:bg-red-50",
            collapsed ? "justify-center" : "space-x-3"
          )}
        >
          <LogOut size={20} className={collapsed ? "mx-auto" : ""} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </nav>
    </div>
  );
};

export default UserProfile;
