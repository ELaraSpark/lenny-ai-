import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import SidebarHeader from './sidebar/SidebarHeader';
import NavItem from './sidebar/NavItem';
import { cn } from '@/lib/utils';
import {
  Menu,
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
} from 'lucide-react';

// Define navigation items (same as Sidebar)
const navItems = [
  { to: '/chat', label: 'Ask Leny', icon: MessageSquare, subItems: [ // Updated label
      { to: '/recent-chats', label: 'View all chats', icon: Clock }
    ]
  },
  { to: '/my-templates', label: 'Smart Notes', icon: FileText }, // Updated label
  { to: '/tumor-board', label: 'Expert Panel', icon: ClipboardList },
  // Small gap before non-medical items
  { to: '/referrals', label: 'Referrals', icon: Gift, topMargin: true },
  { to: '/doctors-lounge', label: 'Doctor\'s Lounge', icon: Coffee },
];

// Example recent chats (should match Sidebar)
const recentChats = [
  { id: 'chat1', title: 'Cardiology Consult' },
  { id: 'chat2', title: 'Radiology Report Review' },
];

const MobileNav = () => {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* Hamburger button - visible only on small screens */}
        <Button variant="ghost" size="icon" className="lg:hidden mr-2 text-primary">
          <Menu size={20} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col w-60 bg-[#F4F7F5] border-r border-[#E1EAE5]">
        {/* Replicate Sidebar structure */}
        <SidebarHeader />

        {/* Removed separate Ask AI Button since it's now in the main navigation */}

        <ScrollArea className="flex-1 px-3 py-2">
          {/* Recent Chats Section */}
          <div className="space-y-1 mb-3">
            {recentChats.map((chat) => (
              <SheetClose asChild key={chat.id}>
                <Link 
                  to={`/chat/${chat.id}`} 
                  className={cn(
                    "flex items-center px-3 py-1.5 rounded-md text-sm transition-colors text-gray-600 hover:bg-primary/10 hover:text-primary",
                    location.pathname === `/chat/${chat.id}` ? "bg-primary/10 text-primary font-medium" : ""
                  )}
                >
                  {/* TODO: Consider using PicassoIllustration here too for consistency */}
                  <MessageSquare size={16} className={cn("mr-3 flex-shrink-0", location.pathname === `/chat/${chat.id}` ? "text-primary" : "")} />
                  <span className="truncate">{chat.title}</span>
                </Link>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Link 
                to="/recent-chats" 
                className="flex items-center px-3 py-1.5 rounded-md text-xs transition-colors text-gray-500 hover:bg-primary/10 hover:text-primary"
              >
                <Clock size={14} className="mr-3 flex-shrink-0" />
                <span>View all chats</span>
              </Link>
            </SheetClose>
          </div>

          <Separator className="bg-[#E1EAE5] my-3" />

          {/* Main Navigation Section */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <React.Fragment key={item.to}>
                {/* Add margin top for items that need separation */}
                {item.topMargin && <div className="mt-6"></div>}
                <SheetClose asChild>
                <NavItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label} // Pass the label directly from the updated navItems array
                  hoverAccent={true}
                />
                </SheetClose>
                {item.subItems && item.subItems.length > 0 && (
                  <div className="pl-6 space-y-1 mt-1">
                    {item.subItems.map((subItem) => (
                      <SheetClose asChild key={subItem.to}>
                        <NavItem
                          to={subItem.to}
                          icon={subItem.icon}
                          label={subItem.label}
                          isSubItem={true}
                        />
                      </SheetClose>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer section */}
        <div className="border-t border-[#E1EAE5] p-3">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={"/avatar-placeholder.jpg"} alt={user?.email || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-medium text-primary truncate">
                {user?.email || 'User'}
              </p>
            </div>
            {/* Settings and Logout are now in a dropdown */}
          </div>
          <div className="mt-2">
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-600 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                <span>Log Out</span>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
