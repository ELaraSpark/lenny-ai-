import React from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Pin, PinOff } from 'lucide-react'; // Import Pin icons
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface BaseCardProps {
  id: string;
  title: string;
  preview: string;
  date: Date;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  pinned?: boolean; // Add pinned status prop
  onPinToggle?: () => void; // Add pin toggle callback
}

export const BaseCard = ({
  id,
  title,
  preview,
  date,
  className,
  icon,
  onClick,
  onEdit,
  onDelete,
  onShare,
  pinned, // Destructure new props
  onPinToggle, // Destructure new props
}: BaseCardProps) => {
  return (
    <div 
      className={cn(
        "group py-4 hover:bg-muted transition-all duration-200 cursor-pointer group-hover:scale-[1.02]", // Added scale effect and duration
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start card-responsive-layout">
        <div className="flex items-start flex-1 min-w-0">
          {/* Use muted foreground for icon */}
          {icon && <div className="mr-3 mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</div>} 
          <div className="flex-1 min-w-0">
            {/* Increased title weight, use foreground */}
            <h3 className="text-base font-semibold text-foreground truncate"> 
              {title}
            </h3>
            {/* Use muted foreground, relaxed leading */}
            <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2"> 
              {preview}
            </p>
          </div>
        </div>

        <div className="flex items-center ml-4 flex-shrink-0 card-metadata"> {/* Added responsive class */}
          {/* Use muted foreground for date */}
          <span className="text-xs text-muted-foreground whitespace-nowrap"> 
            {format(date, 'MMM d, yyyy')}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Use muted foreground for button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 ml-1 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" 
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={14} />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {onEdit && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  Edit
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(); }}>
                  Share
                </DropdownMenuItem>
              )}
              {/* Add Pin/Unpin Action */}
              {onPinToggle && (
                 <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPinToggle(); }}>
                   {pinned ? (
                     <><PinOff size={14} className="mr-2" /> Unpin</>
                   ) : (
                     <><Pin size={14} className="mr-2" /> Pin</>
                   )}
                 </DropdownMenuItem>
              )}
              {/* Separator logic might need adjustment based on which actions are present */}
              {(onEdit || onShare || onPinToggle) && onDelete && <DropdownMenuSeparator />} 
              {onDelete && (
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
