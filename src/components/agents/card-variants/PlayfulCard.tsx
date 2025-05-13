// Component: PlayfulCard
// Purpose: Displays a card for an AI agent with a playful design and tone.
// Used in: AIAgentsView (as a card variant).

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart, Brain, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Agent } from '../types/agentTypes';

interface PlayfulCardProps {
  agent: Agent;
  onSelect: () => void;
  delay?: number;
}

const PlayfulCard: React.FC<PlayfulCardProps> = ({ 
  agent, 
  onSelect,
  delay = 0 
}) => {
  // Get emoji based on specialty
  const getSpecialtyEmoji = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('cardio')) return '❤️';
    if (specialty.includes('neuro')) return '🧠';
    if (specialty.includes('surgery')) return '🔪';
    if (specialty.includes('pediatric')) return '👶';
    if (specialty.includes('oncology')) return '🔬';
    if (specialty.includes('emergency')) return '🚑';
    if (specialty.includes('radiology')) return '📷';
    return '👨‍⚕️';
  };

  // Get fun tagline based on specialty
  const getTagline = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('cardio')) return "I'll get to the heart of your questions!";
    if (specialty.includes('neuro')) return "Let's put our heads together!";
    if (specialty.includes('surgery')) return "Making precise cuts through medical confusion!";
    if (specialty.includes('pediatric')) return "Big help for your little ones!";
    if (specialty.includes('oncology')) return "Fighting the tough battles with you!";
    if (specialty.includes('emergency')) return "Your medical superhero, no cape needed!";
    return "Your friendly neighborhood health expert!";
  };

  // Get background gradient based on specialty
  const getGradient = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('cardio')) return 'from-red-500/40 to-pink-500/70';
    if (specialty.includes('neuro')) return 'from-purple-500/40 to-blue-500/70';
    if (specialty.includes('surgery')) return 'from-green-500/40 to-teal-500/70';
    if (specialty.includes('pediatric')) return 'from-yellow-500/40 to-orange-500/70';
    if (specialty.includes('oncology')) return 'from-blue-500/40 to-indigo-500/70';
    if (specialty.includes('emergency')) return 'from-red-500/40 to-orange-500/70';
    return 'from-primary/40 to-primary/70';
  };

  // Get icon based on specialty
  const getIcon = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('cardio')) return Heart;
    if (specialty.includes('neuro')) return Brain;
    return Sparkles;
  };

  const Icon = getIcon();

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
      <div className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-background border-2 border-${getGradient().split('-')[1].split('/')[0]}/30 h-full flex flex-col`}>
        {/* Full-width avatar background */}
        <div className="relative h-64 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src={agent.imageUrl || '/placeholder.svg'}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder.svg';
              }}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getGradient()}`}></div>
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
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
              
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-xl">{agent.name}</h3>
                  <span className="text-xl">{getSpecialtyEmoji()}</span>
                </div>
                <p className="font-medium text-white/90">{agent.specialty}</p>
                <div className="flex items-center mt-1 text-xs font-medium text-white/80">
                  <Icon className="h-3.5 w-3.5 mr-1 text-yellow-300" />
                  {typeof agent.rating === 'number' ? `${agent.rating.toFixed(1)} ★ Awesome Rating` : agent.rating || 'Super Expert'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fun tagline */}
        <div className="px-6 py-3 bg-muted/30 italic text-center text-sm font-medium">
          "{getTagline()}"
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Capabilities as fun bullet points */}
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1 text-primary" />
              Super Powers:
            </h4>
            <div className="space-y-2">
              {agent.capabilities?.slice(0, 3).map((capability, index) => (
                <div key={index} className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                  <span className="text-lg">✨</span>
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-auto">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:opacity-90 text-primary-foreground font-medium text-base h-12 rounded-xl"
              onClick={onSelect}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with me!
            </Button>
          </div>
        </div>
      </div>
      
      {/* Animation is handled in index.css */}
    </motion.div>
  );
};

export default PlayfulCard;
