import React from 'react';
import { Bot } from 'lucide-react';
import { BaseCard, BaseCardProps } from './BaseCard'; // Import BaseCard
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

// Extend BaseCardProps, omit icon as we provide it internally
export interface AgentCardProps extends Omit<BaseCardProps, 'icon' | 'children'> { 
  specialty?: string;
  avatarUrl?: string; // Optional avatar URL for the agent
  category?: string; // Optional category for filtering
}

export const AgentCard = ({
  specialty,
  avatarUrl,
  category, // Destructure agent-specific props
  ...props // Pass remaining props to BaseCard
}: AgentCardProps) => {
  
  // Example: Enhance preview if specialty exists
  const enhancedPreview = specialty 
    ? `${props.preview} • Specialty: ${specialty}` 
    : props.preview;

  return (
    <BaseCard
      {...props} // Pass common props like id, title, date, onClick, etc.
      preview={enhancedPreview} // Use the potentially enhanced preview
      // Provide the specific icon for AgentCard
      icon={
        <Avatar className="h-8 w-8"> {/* Use Avatar for agent icon */}
          <AvatarImage src={avatarUrl} alt={props.title} />
          <AvatarFallback className="bg-muted text-muted-foreground"> {/* Use standard theme colors */}
            <Bot size={16} /> {/* Default Bot icon */}
          </AvatarFallback>
        </Avatar>
      }
    />
  );
};
