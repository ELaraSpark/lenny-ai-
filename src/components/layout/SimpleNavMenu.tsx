import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, PlusCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleNavMenuProps {
  className?: string;
}

const SimpleNavMenu: React.FC<SimpleNavMenuProps> = ({ className }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>('ask_ai');

  // Define navigation items
  const navItems = [
    { id: 'ask_ai', label: 'Ask Leny', icon: MessageSquare, path: '/chat' },
    { id: 'ai_agents', label: 'AI Agents', icon: Users, path: '/my-agents' },
    { id: 'smart_notes', label: 'Smart Notes', icon: PlusCircle, path: '/my-templates' },
    { id: 'expert_panel', label: 'Expert Panel', icon: ClipboardList, path: '/tumor-board' },
  ];

  // Handle nav item click
  const handleNavItemClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <div className={cn("flex items-center gap-2 md:gap-5", className)}>
      {navItems.map((item) => {
        const isActive = activeItem === item.id || location.pathname === item.path;
        
        return (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200",
              "text-sm font-medium",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => handleNavItemClick(item.id)}
          >
            <div className="flex items-center justify-center">
              <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
            </div>
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SimpleNavMenu;
