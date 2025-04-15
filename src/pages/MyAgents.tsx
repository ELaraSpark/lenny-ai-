import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Sparkles, Lightbulb, ArrowUp, MessageSquare, Zap } from 'lucide-react'; // Added MessageSquare, Zap
import { agents as allAgentsData } from '@/components/agents/data/agentsData';
import { Agent } from '@/components/agents/types/agentTypes';
import { EmptyState } from '@/components/library/EmptyState';
import confetti from 'canvas-confetti';
import AgentCard from '@/components/agents/AgentCard';
import { AgentCategory } from '@/components/agents/AgentCategoryFilters';
import SuggestionsDropdown from '@/components/onboarding/SuggestionsDropdown';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

// Define props to accept isPublicView
interface MyAgentsProps {
  isPublicView?: boolean;
}

const MyAgents: React.FC<MyAgentsProps> = ({ isPublicView = false }) => {
  const navigate = useNavigate();

  const { user } = useAuth(); // Get user status
  // Conditionally load initial agents based on view
  const [agents, setAgents] = useState<Agent[]>(isPublicView ? allAgentsData.slice(0, 6) : allAgentsData); // Show fewer in public view initially
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedAgentIndex, setFocusedAgentIndex] = useState<number>(-1);
  const agentCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Handle suggestion click
  const handleSuggestionClick = (searchQuery: string) => {
    setSearchTerm(searchQuery);
    // Focus the search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Toggle suggestions dropdown
  const toggleSuggestions = () => {
    setShowSuggestions(prev => !prev);
  };
  
  // Initialize with mock data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position for header behavior and scroll-to-top button
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Add scroll behavior for header and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Show scroll-to-top button when scrolled down 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Filter agents based on search term and category
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      agent.category === selectedCategory || 
      ((!agent.category || agent.category === 'general'));
    
    return matchesSearch && matchesCategory;
  });

  // Determine if an agent is recommended (has a real image)
  const isRecommended = (agent: Agent) => 
    agent.imageUrl && !agent.imageUrl.includes('placeholder');
  
  // Use filtered agents directly
  const displayedAgents = filteredAgents;
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Handle selecting an agent (Primary Action)
  const handlePrimaryAction = (agent: Agent) => {
    if (isPublicView) {
      // In public view, prompt login
      navigate('/login'); 
      // Optionally show a toast message
      // toast.info("Please sign in to start a task with this agent.");
    } else {
      // Authenticated view: Trigger confetti and navigate (or perform intended action)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#3B82F6'],
      });
      console.log("Selected agent:", agent.name);
      // navigate(`/chat/${agent.id}`); // Uncomment when chat is ready
    }
  };
  
  // Handle creating a new agent (Only available if not public view)
  const handleCreateAgent = () => {
    if (!isPublicView) {
      navigate('/agents/create');
    } else {
       navigate('/login'); // Or show a signup prompt
    }
  };

  // Handle showing agent details (Secondary Action)
  const handleSecondaryAction = (agent: Agent) => {
    // Details modal can be shown in both views, content might differ later if needed
    setSelectedAgent(agent);
    setShowDetails(true);
  };
  
  // Keyboard navigation handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!displayedAgents.length) return;
    
    const gridCols = window.innerWidth < 640 ? 1 : 
                     window.innerWidth < 1024 ? 2 : 
                     window.innerWidth < 1280 ? 3 : 
                     window.innerWidth < 1536 ? 3 : 4;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedAgentIndex(prev => 
          prev < displayedAgents.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedAgentIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedAgentIndex(prev => {
          const nextIndex = prev + gridCols;
          return nextIndex < displayedAgents.length ? nextIndex : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedAgentIndex(prev => {
          const nextIndex = prev - gridCols;
          return nextIndex >= 0 ? nextIndex : prev;
        });
        break;
      case 'Enter':
      case ' ': // Space key
        e.preventDefault();
        if (focusedAgentIndex >= 0 && focusedAgentIndex < displayedAgents.length) {
          handlePrimaryAction(displayedAgents[focusedAgentIndex]); // Use primary action
        }
        break;
      default:
        break;
    }
  }, [displayedAgents, focusedAgentIndex]);
  
  // Focus the card when focusedAgentIndex changes
  useEffect(() => {
    if (focusedAgentIndex >= 0 && agentCardsRef.current[focusedAgentIndex]) {
      agentCardsRef.current[focusedAgentIndex]?.focus();
    }
  }, [focusedAgentIndex]);
  
  // Reset refs array when displayedAgents changes
  useEffect(() => {
    agentCardsRef.current = agentCardsRef.current.slice(0, displayedAgents.length);
  }, [displayedAgents]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Ultra-minimal background */}
      <div className="absolute inset-0 -z-10 bg-background/80"></div>
      
      {/* Header with Search Section - Sticky with scroll behavior */}
      <div className={`sticky top-0 z-20 bg-background/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'shadow-sm'}`}>
        {/* Title removed for simplicity */}
        
        {/* Combined Search, Filter, and Create Row */}
        <div className="px-4 py-3">
          <div className="flex flex-col gap-2 max-w-3xl mx-auto">
            {/* Simplified Search and Filter UI */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for specialists or tasks..."
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-background border border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/40 shadow-sm transition-all duration-200"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
                  </div>
                </form> {/* Form closes here, after input */}
                {/* Simplified Filter Pills (Outside Form) */}
                <div className="flex justify-center mt-2">
                  <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                    {['all', 'cardiology', 'neurology', 'oncology', 'pediatrics'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category as AgentCategory)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Simplified Suggestions Dropdown (Outside Form) */}
                <SuggestionsDropdown
                  isVisible={showSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
              
              {/* Conditionally render Create button or hide/disable in public view */}
              {!isPublicView && (
                <button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-4 rounded-lg font-medium shadow-sm flex items-center justify-center"
                  onClick={handleCreateAgent}
                  title="Create New Agent"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {isLoading ? (
          // Optimized loading state
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
            <p className="text-muted-foreground text-sm font-medium">Loading specialists...</p>
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="flex flex-col">
            <section className="px-6 py-4">
              <div className="max-w-7xl mx-auto">
                {/* Specialists heading removed for cleaner UI */}
                
                {/* Unified Agents Grid with Keyboard Navigation */}
                <div 
                  ref={gridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-2"
                  onKeyDown={handleKeyDown}
                  role="grid"
                  aria-label="Specialists grid"
                  tabIndex={-1}
                >
                  {displayedAgents.map((agent, index) => (
                    <div
                      key={agent.id}
                      ref={el => agentCardsRef.current[index] = el}
                      tabIndex={0}
                      role="gridcell"
                      aria-selected={focusedAgentIndex === index}
                      className={`outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl transition-all duration-200 ${
                        focusedAgentIndex === index ? 'scale-[1.02]' : ''
                      }`}
                      onFocus={() => setFocusedAgentIndex(index)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePrimaryAction(agent); // Use primary action
                        }
                      }}
                    >
                      {/* Use unified AgentCard with appropriate props */}
                      <AgentCard
                        agent={agent}
                        onPrimaryAction={() => handlePrimaryAction(agent)}
                        primaryActionLabel={isPublicView ? "Try Me" : "Start Task"}
                        primaryActionIcon={isPublicView ? Sparkles : MessageSquare}
                        onSecondaryAction={() => handleSecondaryAction(agent)}
                        secondaryActionLabel="Details" // Keep details label consistent
                        secondaryActionIcon={Zap} // Keep details icon consistent
                        delay={0.01} 
                        isRecommended={isRecommended(agent)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          // Empty state
          <div className="p-6 flex-1 flex items-center justify-center">
            <EmptyState
              title={isPublicView ? "No Specialists Found" : "No Agents Found"}
              description={searchTerm 
                ? 'Try adjusting your search or filters.' 
                : (isPublicView ? 'No specialists match the current criteria.' : 'Create a new AI agent to get started.')}
              actionLabel={isPublicView ? undefined : "Create Agent"} // No action button in public empty state
              onAction={isPublicView ? undefined : handleCreateAgent}
              illustrationType="agent" // Keep illustration consistent
            />
          </div>
        )}
      </div>
      
      {/* Enhanced Agent Details Modal */}
      <AnimatePresence>
        {showDetails && selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full-Width Avatar Background Header */}
              <div className="relative h-48 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10">
                  {selectedAgent.imageUrl && !selectedAgent.imageUrl.includes('placeholder') && (
                    <div className="absolute inset-0 opacity-20">
                      <img
                        src={selectedAgent.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                
                {/* Close Button */}
                <motion.button
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm z-10"
                  onClick={() => setShowDetails(false)}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
                
                {/* Avatar and Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                  <motion.div 
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg"
                    initial={{ scale: 0.8, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <img
                      src={selectedAgent.imageUrl || '/placeholder.svg'}
                      alt={selectedAgent.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div 
                    className="flex-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-foreground">{selectedAgent.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedAgent.specialty}</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Simplified Content Area */}
              <div className="p-5">
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5">{selectedAgent.description}</p>
                
                {/* Capabilities as simple tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedAgent.capabilities.map((capability, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
                
                {/* Action Button */}
                {/* Modal action button depends on view */}
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                  onClick={() => {
                    setShowDetails(false);
                    handlePrimaryAction(selectedAgent); // Use primary action handler
                  }}
                >
                  {isPublicView ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Sign in to Start
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Task
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Simplified Scroll to Top Button */}
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

export default MyAgents;
