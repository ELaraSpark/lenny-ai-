import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SidebarHeader from './sidebar/SidebarHeader';
import PicassoNavItem from './sidebar/PicassoNavItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  BookOpen,
  Users,
  FileText,
  Zap,
  Gift,
  List,
  ClipboardList,
  Settings,
  LogOut,
  Plus,
  MoreVertical,
  Clock,
  Coffee,
  PartyPopper,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onMouseEnter?: () => void;
  onToggle?: () => void; // Add toggle function prop
}

// Navigation Items
const navItems = [
  { to: '/chat', label: 'Ask Leny', icon: MessageSquare, subItem: { to: '/recent-chats', label: 'View all chats', icon: Clock } },
  { to: '/my-agents', label: 'AI Agents', icon: Users, subItem: { to: '/tasks', label: 'My Tasks', icon: List } },
  { to: '/my-templates', label: 'Smart Notes', icon: Zap },
  { to: '/tumor-board', label: 'Expert Panel', icon: ClipboardList },
  // Removed Rewards & Lounge from main nav
];

const Sidebar = ({ className, isCollapsed = false, onMouseEnter, onToggle }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast();

  const handleLogout = () => {
    signOut();
    // Add toast notification
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    // Navigate to the public main page
    navigate("/");
  };

  // Function to render navigation items
  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => {
      const isMainActive = location.pathname === item.to || 
                          (item.to === '/chat' && location.pathname === '/chat') || 
                          (item.to !== '/chat' && location.pathname.startsWith(item.to));
      const isSubItemActive = item.subItem && location.pathname.startsWith(item.subItem.to);
      const isParentActive = isMainActive || isSubItemActive;
      const showSubItem = isParentActive && item.subItem;

      return (
        <React.Fragment key={item.to}>
          {/* Removed check for item.topMargin as it's no longer used */}
          <Link
            to={item.to}
            className={cn(
              "flex items-center w-full font-medium group transition-all duration-200 ease-in-out mb-1 py-2",
              isCollapsed ? "justify-center px-2" : "justify-start px-3",
              isParentActive
                ? "bg-primary/10 border border-primary/50 text-primary rounded-md hover:text-white hover:bg-primary hover:border-primary/50"
                : "text-muted-foreground hover:text-primary hover:bg-transparent rounded-md"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <div className={cn("w-4 h-4", isCollapsed ? "mr-0" : "mr-2")}>
              <item.icon size={16} className={cn(
                isParentActive ? "text-primary group-hover:text-white" : "text-muted-foreground group-hover:text-primary",
              )} />
            </div>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
          {showSubItem && !isCollapsed && (
            <Link
              to={item.subItem.to}
              className={cn(
                "flex items-center pl-9 pr-3 py-1.5 rounded-md text-xs font-medium group transition-all duration-200 ease-in-out mb-2",
                isSubItemActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <div className="mr-2 w-3.5 h-3.5">
                <item.subItem.icon size={14} className={cn(
                  isSubItemActive ? "text-primary" : "text-muted-foreground",
                  "group-hover:text-primary"
                )} />
              </div>
              <span>{item.subItem.label}</span>
            </Link>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out", // Removed hidden lg:flex
        isCollapsed ? "lg:w-16" : "lg:w-60", // Apply width changes only on lg+ screens
        "w-60", // Default width for mobile (when shown)
        className 
      )}
      onMouseEnter={onMouseEnter}
    >
      <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle} />

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1 px-1 pt-2">
          {renderNavItems(navItems)}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
          <PicassoAvatar
            email={user?.email || 'User'}
            size="sm"
            color="text-primary"
            className="flex-shrink-0"
          />
          
          {!isCollapsed && (
            <>
              <div className="ml-2 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email || 'User'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200 ease-in-out">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => navigate('/settings')} className="font-medium">
                    <div className="mr-2 w-4 h-4">
                      <PicassoIllustration
                        name="brain"
                        size="xs"
                        color="text-muted-foreground"
                        className="group-hover:text-primary"
                      />
                    </div>
                    Settings
                  </DropdownMenuItem>
                  {/* Add Rewards & Lounge to Dropdown */}
                   <DropdownMenuItem onSelect={() => navigate('/referrals')} className="font-medium">
                     <div className="mr-2 w-4 h-4">
                       <Sparkles size={16} className="text-muted-foreground group-hover:text-primary" />
                     </div>
                     Rewards & Referrals
                   </DropdownMenuItem>
                   <DropdownMenuItem onSelect={() => navigate('/doctors-lounge')} className="font-medium">
                     <div className="mr-2 w-4 h-4">
                       <Coffee size={16} className="text-muted-foreground group-hover:text-primary" />
                     </div>
                     Doctor's Lounge
                   </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-600 font-medium focus:text-red-600 focus:bg-red-50">
                    <div className="mr-2 w-4 h-4">
                      <PicassoIllustration
                        name="empty"
                        size="xs"
                        color="text-red-600"
                      />
                    </div>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
