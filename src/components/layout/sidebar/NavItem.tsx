import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // Assuming Tooltip is used

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isSubItem?: boolean; // Added optional prop for sub-items
  hoverAccent?: boolean; // Add option to use accent color on hover for active items
}

const NavItem = ({ to, icon: Icon, label, isSubItem, hoverAccent = false }: NavItemProps) => { 
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const linkContent = (
    <>
      <Icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {/* Label is always visible now */}
      <span className={cn(
        "ml-3 text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
        // Removed isCollapsed conditional class
      )}>
        {label}
      </span>
    </>
  );

  // Use theme variables for active and hover states
  const linkClasses = cn(
    "flex items-center px-3 py-1.5 rounded-md group transition-colors text-sm", 
    isActive 
      ? hoverAccent 
        ? "bg-primary/10 text-primary font-medium hover:text-white hover:bg-primary" // Use theme variables
        : "bg-primary/10 text-primary font-medium" // Use theme variables
      : "text-gray-600 hover:bg-primary/10 hover:text-primary", // Use theme variables
    isSubItem ? "py-1 text-xs" : "" // Make sub-item text slightly smaller too
  );

  return (
    // Removed "no-underline" class to use default link behavior
    <Link to={to} className={linkClasses}> 
      <Icon 
        size={isSubItem ? 14 : 16} 
        className={cn(
          "mr-3 flex-shrink-0",
          isActive && hoverAccent ? "text-primary group-hover:text-white" : "", // Use theme variable
          isActive && !hoverAccent ? "text-primary" : "", // Use theme variable
          !isActive ? "text-muted-foreground group-hover:text-primary" : "" // Use theme variable
        )} 
      /> 
      <span className="truncate">{label}</span> 
    </Link>
  );
};

export default NavItem;
