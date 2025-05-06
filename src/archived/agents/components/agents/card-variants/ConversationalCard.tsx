import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agent } from '../types/agentTypes';

interface ConversationalCardProps {
  agent: Agent;
  onSelect: () => void;
  delay?: number;
}

const ConversationalCard: React.FC<ConversationalCardProps> = ({ 
  agent, 
  onSelect,
  delay = 0 
}) => {
  // Generate a personalized greeting based on the agent's specialty
  const getGreeting = () => {
    if (agent.specialty?.toLowerCase().includes('surgery')) {
      return `Hello, I'm your surgical care specialist. How can I assist you today?`;
    } else if (agent.specialty?.toLowerCase().includes('cardio')) {
      return `Hi there! I'm your heart health expert. What questions do you have?`;
    } else if (agent.specialty?.toLowerCase().includes('neuro')) {
      return `Hello! I specialize in neurological care. How can I help you?`;
    } else {
      return `Hello, I'm your ${agent.specialty?.toLowerCase() || 'healthcare'} specialist. How can I assist you today?`;
    }
  };

  // Get the first two capabilities to show as quick action buttons
  const quickActions = agent.capabilities?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.21, 0.45, 0.26, 0.95]
      }}
      className="h-full"
    >
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-background border border-border h-full flex flex-col">
        {/* Header with avatar and status */}
        <div className="p-4 bg-primary/5 flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-background">
              <img
                src={agent.imageUrl || '/placeholder.svg'}
                alt={agent.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-xl">{agent.name}</h3>
            <p className="text-primary font-medium">{agent.specialty}</p>
          </div>
          
          {agent.rating && (
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              {typeof agent.rating === 'number' ? `${agent.rating.toFixed(1)} ★` : agent.rating}
            </Badge>
          )}
        </div>
        
        {/* Chat bubble */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="bg-muted/50 rounded-2xl p-4 rounded-tl-none">
            <p className="text-foreground">{getGreeting()}</p>
          </div>
          
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="bg-background border-primary/20 text-primary hover:bg-primary/10"
              >
                {action}
              </Button>
            ))}
          </div>
          
          <div className="mt-auto">
            {/* Chat input */}
            <div className="relative mt-4 flex items-center">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full h-12 pl-4 pr-12 rounded-full bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                onFocus={onSelect}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button className="h-8 w-8 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted/80">
                  <Mic className="h-4 w-4" />
                </button>
                <button 
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
                  onClick={onSelect}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationalCard;
