import React, { useState, useEffect, useRef } from 'react';
// Removed MobileNav import, will use a simple button
import { cn } from '@/lib/utils';
import { History, Coffee, Bell, Menu } from 'lucide-react'; // Added Menu icon
import { Button } from '@/components/ui/button';
import { ChatHistoryModal, ChatHistoryEntry } from '@/components/agents/ChatHistoryModal';
import useAuthStore from '@/stores/authStore'; // Import the Zustand store
import { getMedicalJoke, getMedicalFact, getHealthcareTip } from '@/lib/personalityUtils'; // Import personality utilities

// Mock data for chat history
const mockChatHistory: ChatHistoryEntry[] = [
  {
    id: '1',
    title: 'Brucella infection diagnosis',
    preview: 'Brucella is a genus of Gram-negative, facultative intracellular bacteria responsible for brucellosis...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    title: 'Differential diagnosis for fever and joint pain',
    preview: 'The differential diagnosis for fever and joint pain includes infectious arthritis, rheumatoid arthritis...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: '3',
    title: 'Treatment options for hypertension',
    preview: 'First-line medications for hypertension include thiazide diuretics, calcium channel blockers...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    title: 'Interpreting CBC results',
    preview: 'When interpreting a Complete Blood Count (CBC), key parameters to consider include...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: '5',
    title: 'Guidelines for antibiotic stewardship',
    preview: 'Antibiotic stewardship involves selecting the appropriate antibiotic, dose, route, and duration...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
];

interface HeaderProps {
  className?: string;
  onMobileMenuToggle?: () => void; // Add the optional toggle prop
}

const Header = ({ className, onMobileMenuToggle }: HeaderProps) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const { user } = useAuthStore(); // Use Zustand store
  const tipButtonRef = useRef<HTMLButtonElement>(null);
  const tipPopupRef = useRef<HTMLDivElement>(null);

  // Get user's first name from email (temporary until we have proper user profiles)
  const getUserFirstName = () => {
    if (!user?.email) return undefined;
    // Extract name from email (e.g., john.doe@example.com -> John)
    const emailName = user.email.split('@')[0].split('.')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  // Initialize random tip on first load
  useEffect(() => {
    setCurrentTip(getHealthcareTip());
  }, []);

  // Add click outside handler for tip popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTip &&
        tipPopupRef.current &&
        tipButtonRef.current &&
        !tipPopupRef.current.contains(event.target as Node) &&
        !tipButtonRef.current.contains(event.target as Node)
      ) {
        setShowTip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTip]);

  const handleSelectChat = (chatId: string) => {
    console.log(`Selected chat: ${chatId}`);
    // Here you would load the selected chat
    setIsHistoryModalOpen(false);
  };

  // Toggle tip visibility
  const toggleTip = () => {
    if (!showTip) {
      // Get a new tip when showing
      setCurrentTip(getHealthcareTip());
    }
    setShowTip(!showTip);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 px-4 md:px-6 bg-background border-b border-border shadow-sm font-sans",
        "rounded-b-lg",
        className
      )}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Playful Logo/Accent - Using the landing page style */}
      <a href="/" className="text-2xl font-semibold text-neutral-900 flex items-center transform -rotate-1 mr-8">
        <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full mr-2 transform -translate-y-1"></span>
        Leny<span className="text-primary">.ai</span>
      </a>

      {/* Mobile Menu Trigger (Hamburger) */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden mr-4" // Show only on small screens
        onClick={onMobileMenuToggle}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {/* Spacer to push items to right */}
      <div className="flex-1"></div>
      
      {/* Right-aligned actions */}
      <div className="flex items-center gap-2"> 
        {/* Quick tip button */}
        <Button 
          ref={tipButtonRef}
          variant="ghost" 
          size="icon"
          onClick={toggleTip}
          className="text-muted-foreground hover:text-foreground relative"
          title="Healthcare Tip"
        >
          <Coffee className="h-5 w-5" />
          
          {/* Tip popup */}
          {showTip && (
            <div 
              ref={tipPopupRef}
              className="absolute right-0 top-full mt-2 w-64 p-3 bg-primary/5 border border-primary/20 rounded-lg shadow-lg z-50"
            >
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 rounded-full p-1.5 text-primary flex-shrink-0">
                  <Coffee size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-primary-dark mb-1">Healthcare Pro Tip</h4>
                  <p className="text-xs text-primary-dark/80">{currentTip}</p>
                </div>
              </div>
              <div className="mt-2 text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary hover:text-primary-dark p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTip(getHealthcareTip());
                  }}
                >
                  New Tip
                </Button>
              </div>
            </div>
          )}
        </Button>
        
        {/* History button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsHistoryModalOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          title="Chat History"
        >
          <History className="h-5 w-5" />
        </Button>
        
        {/* Notifications button - just for show */}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
        </Button>
        
        {/* Chat History Modal */}
        <ChatHistoryModal 
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          onSelectChat={handleSelectChat}
          chatHistory={mockChatHistory}
        />
      </div>
    </header>
  );
};

export default Header;
