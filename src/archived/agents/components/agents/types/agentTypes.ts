
import { ReactNode } from "react";
import { AgentCategory } from "../AgentCategoryFilters"; // Import the category type

export interface Agent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  // color: string; // Removed color property
  capabilities: string[];
  category?: AgentCategory | 'general'; 
  imageUrl?: string; // Re-add optional imageUrl
  rating?: number | string; // Re-add optional rating
  reviewCount?: number; // Added optional reviewCount
  
  // Personality-driven properties
  personality?: string; // Personality traits description
  speechPattern?: string; // How the agent communicates
  gradientColors?: string; // Tailwind gradient classes
  animationStyle?: 'pulse' | 'bounce' | 'breathe' | 'heartbeat'; // Animation style
  color?: string; // Added back for message styling
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
