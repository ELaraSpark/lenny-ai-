import React from 'react';
import { MessageSquare } from 'lucide-react';
import { BaseCard, BaseCardProps } from './BaseCard';

// Ensure ThreadCardProps includes the new props from BaseCardProps it needs to pass down
export interface ThreadCardProps extends Omit<BaseCardProps, 'icon' | 'children'> { // Omit children as well
  messageCount?: number; 
}

export const ThreadCard = ({
  messageCount, 
  // Destructure pinning props to pass them down
  pinned,
  onPinToggle,
  ...props 
}: ThreadCardProps) => {
  // You could potentially use messageCount here if needed

  return (
    <BaseCard
      {...props}
      pinned={pinned} // Pass down pinned status
      onPinToggle={onPinToggle} // Pass down toggle handler
      icon={<MessageSquare size={16} className="text-muted-foreground" />} // Use standard muted-foreground
    />
  );
};
