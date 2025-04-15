import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import HealthcareCard from "@/components/home/HealthcareCard";
import { agents } from "@/components/agents/data/agentsData";
import { Button } from '@/components/ui/button'; 
import { ChevronDown, Search, Plus, X, Sparkles, Lightbulb, ArrowUp } from 'lucide-react'; 
import { AgentCategory } from '@/components/agents/AgentCategoryFilters';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/library/EmptyState';

// Define interface for the mapped agent object
interface MappedAgentForHC {
  id: string;
  logoText: string;
  location: string;
  description: string;
  services: string[];
  imageUrl: string; 
  delay: number;
  isNew: boolean;
  logoIconText: string;
  rating: number | 'New';
  reviewCount?: number;
  isRecommended?: boolean;
}

// Define props for the component
interface AIAgentsSectionProps {
  activeFilter: AgentCategory | 'all'; 
  searchTerm?: string;
}

const INITIAL_VISIBLE_COUNT = 6;

const AIAgentsSection = ({ activeFilter, searchTerm = "" }: AIAgentsSectionProps) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>(activeFilter);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Initialize with loading state
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add scroll behavior for header and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Filter agents based on activeFilter and searchTerm
  const filteredAgents = useMemo(() => {
    const lowerSearchTerm = localSearchTerm.toLowerCase();
    
    let results = agents;

    // Filter by category first
    if (selectedCategory !== 'all') {
      results = results.filter(agent => agent.category === selectedCategory); 
    }

    // Then filter by search term
    if (lowerSearchTerm) {
      results = results.filter(agent => 
        agent.name.toLowerCase().includes(lowerSearchTerm) ||
        agent.description.toLowerCase().includes(lowerSearchTerm) ||
        agent.specialty?.toLowerCase().includes(lowerSearchTerm) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    return results;
  }, [selectedCategory, localSearchTerm]);

  // Map the filtered agents data
  const mappedAgents: MappedAgentForHC[] = filteredAgents.map((agent, index) => {
    const isNewAgent = index < 3;
    const isRecommended = agent.imageUrl && !agent.imageUrl.includes('placeholder');
    
    return {
      id: agent.id,
      logoText: agent.name,
      location: agent.specialty,
      description: agent.description,
      services: agent.capabilities.slice(0, 3),
      imageUrl: agent.id === 'cardio' ? '/agents/female-doctor-scrubs.jpg' :
                agent.id === 'neuro' ? '/agents/male-doctor-labcoat.jpg' :
                agent.id === 'path' ? '/agents/female-surgeon-cap.jpg' :
                '/placeholder.svg',
      logoIconText: agent.name.substring(0, 2).toUpperCase(),
      rating: isNewAgent ? 'New' : parseFloat((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewCount: isNewAgent ? undefined : Math.floor(500 + Math.random() * 1500),
      delay: 0,
      isNew: isNewAgent,
      isRecommended: isRecommended
    };
  });

  const handleShowMore = () => {
    setVisibleCount(mappedAgents.length); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleCategoryChange = (category: AgentCategory | 'all') => {
    setSelectedCategory(category);
  };

  // Slice the mapped agents for display
  const visibleAgents = mappedAgents.slice(0, visibleCount); 
  const showMoreButtonVisible = visibleCount < mappedAgents.length;

  return (
    <div className="w-full">
      {/* Category Title */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          {selectedCategory === 'all' ? 'All Specialists' : 
           selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Specialists'}
        </h2>
        <p className="text-muted-foreground mt-2">
          Discover AI specialists trained on the latest medical research
        </p>
      </div>

      {isLoading ? (
        // Loading state
        <div className="flex flex-col items-center justify-center h-64 p-6">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
          <p className="text-muted-foreground text-sm font-medium">Loading specialists...</p>
        </div>
      ) : visibleAgents.length > 0 ? (
        <>
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleAgents.map((aiAgent, index) => (
              <motion.div 
                key={aiAgent.id || index} 
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <HealthcareCard {...aiAgent} />
              </motion.div>
            ))}
          </div>

          {/* Show More Button */}
          {showMoreButtonVisible && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={handleShowMore}>
                More Specialists <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        // Empty state
        <div className="p-6">
          <EmptyState
            title="No specialists found"
            description={localSearchTerm ? 'Try adjusting your search or filters.' : 'No specialists available in this category.'}
            actionLabel="View All Specialists"
            onAction={() => {
              setLocalSearchTerm('');
              setSelectedCategory('all');
            }}
            illustrationType="agent"
          />
        </div>
      )}
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-primary/90 shadow-md flex items-center justify-center text-primary-foreground z-30 hover:bg-primary focus:outline-none"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default AIAgentsSection;
