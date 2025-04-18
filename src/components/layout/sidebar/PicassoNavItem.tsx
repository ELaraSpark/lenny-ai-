import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { IllustrationName } from '@/components/illustrations/illustrations';

// Map route paths to illustration names
const routeToIllustrationMap: Record<string, IllustrationName> = {
  '/': 'chat',
  '/library': 'chart',
  '/my-agents': 'agent',
  '/tasks': 'chart',
  '/my-templates': 'template',
  '/integrations': 'stethoscope',
  '/referrals': 'heart',
  '/settings': 'brain',
  '/recent-chats': 'chat',
};

interface PicassoNavItemProps {
  to: string;
  label: string;
  isSubItem?: boolean;
  illustrationType?: IllustrationName;
}

const PicassoNavItem = ({ 
  to, 
  label, 
  isSubItem,
  illustrationType 
}: PicassoNavItemProps) => { 
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  // Use the provided illustration type or look it up from the map
  const illustration = illustrationType || routeToIllustrationMap[to] || 'empty';

  // Use theme variables for active and hover states
  const linkClasses = cn(
    "flex items-center px-3 py-1.5 rounded-md group transition-all duration-200 ease-in-out text-sm font-medium", // Added font-medium as default
    isActive 
      ? "bg-primary/5 text-primary font-semibold" // Use theme variables
      : "text-muted-foreground hover:bg-primary/5 hover:text-primary", // Use theme variables
    isSubItem ? "py-1 text-xs" : "" // Make sub-item text slightly smaller too
  );

  return (
    <Link to={to} className={linkClasses}>
      <div className={cn("mr-3 flex-shrink-0", isSubItem ? "w-3.5 h-3.5" : "w-4 h-4")}>
        <PicassoIllustration 
          name={illustration} 
          size={isSubItem ? "xs" : "xs"} 
          color={isActive ? "text-primary" : "text-muted-foreground"} // Use theme variable for active
          className="group-hover:text-primary" // Use theme variable for hover
        />
      </div>
      <span className="truncate">{label}</span> 
    </Link>
  );
};

export default PicassoNavItem;
