import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MessageSquare, Search, Sparkles, Brain, HeartPulse, Stethoscope, FileText } from 'lucide-react';

interface SuggestionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-background/80 backdrop-blur-sm border border-primary/10 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface FirstTimeUserSuggestionsProps {
  onSuggestionClick: (searchQuery: string) => void;
  className?: string;
}

const FirstTimeUserSuggestions: React.FC<FirstTimeUserSuggestionsProps> = ({ 
  onSuggestionClick,
  className = ''
}) => {
  const suggestions = [
    {
      icon: <HeartPulse className="h-5 w-5" />,
      title: "Cardiology consultation",
      description: "Find specialists to discuss heart conditions and treatments",
      searchQuery: "cardiology heart disease"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Neurological assessment",
      description: "Connect with experts on brain and nervous system disorders",
      searchQuery: "neurology brain assessment"
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "General health check",
      description: "Get a comprehensive health evaluation from primary care physicians",
      searchQuery: "general practitioner health check"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Medical report analysis",
      description: "Have specialists review and explain your medical reports",
      searchQuery: "medical report analysis interpretation"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Second opinion",
      description: "Get additional perspectives on diagnoses or treatment plans",
      searchQuery: "second opinion consultation"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Specialized treatment options",
      description: "Explore cutting-edge treatments for specific conditions",
      searchQuery: "specialized treatment options"
    }
  ];

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Try these suggestions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            onClick={() => onSuggestionClick(suggestion.searchQuery)}
          />
        ))}
      </div>
    </div>
  );
};

export default FirstTimeUserSuggestions;
