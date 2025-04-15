import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Agent } from '../types/agentTypes';

interface MinimalistCardProps {
  agent: Agent;
  onSelect: () => void;
  delay?: number;
}

const MinimalistCard: React.FC<MinimalistCardProps> = ({ 
  agent, 
  onSelect,
  delay = 0 
}) => {
  // Get the primary capability to highlight
  const primaryCapability = agent.capabilities?.[0] || 'Medical consultation';

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
      <div className="w-full max-w-sm overflow-hidden bg-background border border-border h-full flex flex-col group hover:border-primary/30 transition-colors duration-300">
        {/* Minimal header with just the name and specialty */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg text-foreground">{agent.name}</h3>
              <p className="text-muted-foreground text-sm">{agent.specialty}</p>
            </div>
            
            {/* Minimal avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
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
          </div>
        </div>
        
        {/* Minimal content - just one key capability */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-sm text-muted-foreground mb-2">Primary focus</div>
          <p className="text-foreground font-medium">{primaryCapability}</p>
          
          {/* Minimal action button */}
          <div className="mt-auto pt-6">
            <Button 
              variant="ghost" 
              className="w-full justify-between group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-300"
              onClick={onSelect}
            >
              <span>Consult</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MinimalistCard;
