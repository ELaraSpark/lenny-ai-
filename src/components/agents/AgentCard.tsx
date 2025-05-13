// Component: AgentCard
// Purpose: Displays a card representation of an AI agent with details and actions.
// Used in: AIAgentsView, potentially other agent listing views.

import React from 'react'; // Ensure React is imported
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, Star, Zap, Sparkles, HelpCircle } from "lucide-react"; // Added HelpCircle as default icon
import { 
  Card, 
  CardDescription, 
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from "./types/agentTypes";

// --- Unified Props Interface ---
interface UnifiedAgentCardProps {
  agent: Agent;
  // Action Callbacks
  onPrimaryAction: () => void; // Renamed from onSelect
  onSecondaryAction?: () => void; // Renamed from onConsultation
  // Configurable Button Labels & Icons
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  primaryActionIcon?: React.ElementType;
  secondaryActionIcon?: React.ElementType;
  // Display Options
  delay?: number;
  isRecommended?: boolean;
}

// --- Unified Agent Card Component ---
const AgentCard = ({ 
  agent, 
  onPrimaryAction, 
  onSecondaryAction, 
  primaryActionLabel = "Start Task", // Default labels
  secondaryActionLabel = "Details",
  primaryActionIcon: PrimaryIcon = MessageSquare, // Default icons
  secondaryActionIcon: SecondaryIcon = Zap,
  delay = 0, 
  isRecommended = false 
}: UnifiedAgentCardProps) => {
  
  // Handle rating and review count display
  const displayRating = typeof agent.rating === 'number' ? agent.rating.toFixed(1) : agent.rating;
  const displayReviewCount = agent.reviewCount ? `(${agent.reviewCount.toLocaleString()})` : '';

  // Get fun tagline based on specialty (Redefined)
  const getTagline = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('research')) return "Finding answers to your toughest questions!";
    if (specialty.includes('writing')) return "Crafting words that make an impact!";
    if (specialty.includes('data')) return "Turning numbers into insights!";
    if (specialty.includes('design')) return "Making your ideas look amazing!";
    if (specialty.includes('coding')) return "Building digital solutions that work!";
    if (specialty.includes('marketing')) return "Helping your message reach the right people!";
    if (specialty.includes('planning')) return "Organizing chaos into clear action steps!";
    if (specialty.includes('analysis')) return "Digging deep to find what matters!";
    if (specialty.includes('assistant')) return "Making your day more productive!";
    return "Ready to tackle any task you throw my way!";
  };

  // Get specialty emoji
  const getSpecialtyEmoji = () => {
    const specialty = agent.specialty?.toLowerCase() || '';
    if (specialty.includes('research')) return '🔍';
    if (specialty.includes('writing')) return '✍️';
    if (specialty.includes('data')) return '📊';
    if (specialty.includes('design')) return '🎨';
    if (specialty.includes('coding')) return '💻';
    if (specialty.includes('marketing')) return '📢';
    if (specialty.includes('planning')) return '📅';
    if (specialty.includes('analysis')) return '📈';
    if (specialty.includes('assistant')) return '🤖';
    return '✨';
  };

  // --- Render Logic ---
  return (
    // Added hover effect from HealthcareCard
    <Card className="w-full rounded-xl overflow-hidden shadow-sm bg-card border border-border h-full flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      
      {/* Full-width avatar background */}
      <div className="relative h-48 overflow-hidden">
        {/* Recommended badge - simplified */}
        {isRecommended && (
          <div className="absolute top-2 right-2 z-20">
            <Badge className="bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
          </div>
        )}
        
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={agent.imageUrl || '/placeholder.svg'}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 20%" }} /* Adjusted to show faces better */
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
          {/* Removed primary gradient overlay */}
          {/* Added dark gradient overlay at the bottom for text */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        {/* Content overlay - Ensure text is white */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10"> 
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src={agent.imageUrl || '/placeholder.svg'}
                alt={agent.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-lg">{agent.name}</h3>
                <span className="text-lg">{getSpecialtyEmoji()}</span>
              </div>
              <p className="font-medium text-white/90">{agent.specialty}</p>
              {displayRating && (
                <div className="flex items-center mt-1 text-xs font-medium text-white/80">
                  <Star className="h-3.5 w-3.5 mr-1 text-yellow-300" />
                  {/* Merged rating and review count display */}
                  {displayRating}
                  {displayReviewCount && <span className="ml-1">{displayReviewCount}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - simplified */}
      <div className="p-3 flex-grow flex flex-col"> 
        {/* Tagline */}
        <p className="text-xs text-muted-foreground italic mb-2">{getTagline()}</p> 
        {/* Capabilities Section - more compact */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary"
              >
                {capability}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Buttons - using card-actions class for consistent height and alignment */}
      <CardFooter className="p-3 mt-auto card-actions"> 
        <Button 
          className="flex-1 bg-muted hover:bg-muted/90 text-foreground rounded-lg text-sm" 
          variant="outline"
          onClick={onSecondaryAction} 
          disabled={!onSecondaryAction} 
        > 
          <SecondaryIcon className="mr-1.5 h-4 w-4" />
          {secondaryActionLabel}
        </Button>
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm" 
          onClick={onPrimaryAction}
        > 
          <PrimaryIcon className="mr-1.5 h-4 w-4" />
          {primaryActionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
