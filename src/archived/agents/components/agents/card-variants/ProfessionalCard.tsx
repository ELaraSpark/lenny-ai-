import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agent } from '../types/agentTypes';

interface ProfessionalCardProps {
  agent: Agent;
  onSelect: () => void;
  onConsultation?: () => void;
  delay?: number;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  agent, 
  onSelect,
  onConsultation,
  delay = 0 
}) => {
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
      <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-md bg-background border border-border h-full flex flex-col">
        {/* Header with image */}
        <div className="relative h-48 bg-gradient-to-r from-primary/10 to-primary/5">
          {/* Professional badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-background text-primary border-primary/20 font-semibold px-3 py-1">
              <Award className="h-3.5 w-3.5 mr-1" />
              {typeof agent.rating === 'number' ? `${agent.rating.toFixed(1)} Rating` : agent.rating || 'Expert'}
            </Badge>
          </div>
          
          {/* Agent image */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-4 border-background shadow-md">
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
        
        {/* Content */}
        <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
          {/* Agent info */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-foreground">{agent.name}</h3>
            <p className="text-primary font-medium">{agent.specialty}</p>
          </div>
          
          {/* Expertise section */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Areas of Expertise</h4>
            <div className="space-y-1.5">
              {agent.capabilities?.slice(0, 3).map((capability, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
              {agent.capabilities && agent.capabilities.length > 3 && (
                <div className="text-xs text-muted-foreground pl-6">
                  +{agent.capabilities.length - 3} more areas of expertise
                </div>
              )}
            </div>
          </div>
          
          {/* Brief description */}
          <div className="mb-6 text-sm text-muted-foreground">
            <p>{agent.description?.slice(0, 120)}{agent.description && agent.description.length > 120 ? '...' : ''}</p>
          </div>
          
          {/* Action buttons */}
          <div className="mt-auto flex gap-2">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={onSelect}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            
            {onConsultation ? (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onConsultation}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Consult
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-10 px-0"
                onClick={onSelect}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionalCard;
