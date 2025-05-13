import React, { useState, useEffect, useCallback } from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { cn } from '@/lib/utils';
import MyAgents from "@/components/agents/AIAgentsView"; // Corrected import to AIAgentsView
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner";
import CTASection from "@/components/home/CTASection";
import {
  GraduationCap,
  FlaskConical,
  Stethoscope,
  Sparkles,
  ClipboardList,
  Zap,
  Menu, // Added for mobile sidebar toggle
  X // Added for close button on mobile sidebar
} from 'lucide-react';
import { AgentCategory } from '@/components/agents/AgentCategoryFilters';
import PublicChat from "@/components/home/PublicChat";
import ChatHistorySidebar from "@/components/home/ChatHistorySidebar";
import ExpertPanelView from "@/components/tumor-board/TumorBoardView";
import { Skeleton } from "@/components/ui/skeleton";
import LandingHero from "@/components/home/LandingHero";
import { v4 as uuidv4 } from 'uuid';

// Define types for chat
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Define type for filter/tool items
type FilterItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  type: 'filter' | 'tool';
};

// Filter/tool data
const filterCategories: FilterItem[] = [
  { id: 'all', label: 'All Specialists', icon: Sparkles, type: 'filter' },
  { id: 'expert_panel', label: 'Expert Panel', icon: ClipboardList, type: 'tool' },
  { id: 'quick_notes', label: 'Quick Notes', icon: Zap, type: 'tool' },
  // 'ask_ai' is implicitly a tool, managed by isChatActive state
  { id: 'cardiology', label: 'Cardiology', icon: GraduationCap, type: 'filter' },
  { id: 'neurology', label: 'Neurology', icon: Stethoscope, type: 'filter' },
  { id: 'oncology', label: 'Oncology', icon: FlaskConical, type: 'filter' },
];

const LandingPage = () => {
  const [activeFilter, setActiveFilter] = useState<AgentCategory | 'all'>('all');
  const [activeTool, setActiveTool] = useState<string | null>(null); // Default to null, 'ask_ai' managed by isChatActive
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false); // This controls the chat UI visibility

  // State for chat sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for mobile sidebar
// Load chat sessions and active chat ID from localStorage on mount
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('publicChatSessions');
      if (storedSessions) {
        // Define interfaces for the shape of data in localStorage (with string dates)
        interface StoredMessage {
          id: string;
          sender: 'user' | 'ai';
          text: string;
          timestamp: string; // Date is stored as string
        }

        interface StoredChatSession {
          id: string;
          title: string;
          messages: StoredMessage[];
          createdAt: string; // Date is stored as string
        }

        const parsedSessions: ChatSession[] = JSON.parse(storedSessions).map((session: StoredChatSession) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((message: StoredMessage) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
        }));
        setChatSessions(parsedSessions);
      }

      const storedActiveId = localStorage.getItem('publicActiveChatId');
      if (storedActiveId !== null) {
        try {
          const parsedActiveId = JSON.parse(storedActiveId);
          setActiveChatId(parsedActiveId);
        } catch (e) {
          console.error("Failed to parse activeChatId from localStorage:", e);
          // localStorage.removeItem('publicActiveChatId'); // Optional: clear corrupted
        }
      }
    } catch (error) {
      console.error("Failed to load chat data from localStorage:", error);
      // localStorage.removeItem('publicChatSessions'); // Optional: clear corrupted
      // localStorage.removeItem('publicActiveChatId'); // Optional: clear corrupted
    }
  }, []); // Empty dependency array: runs once on mount

  // Save chat sessions and active chat ID to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('publicChatSessions', JSON.stringify(chatSessions));
      localStorage.setItem('publicActiveChatId', JSON.stringify(activeChatId));
    } catch (error) {
      console.error("Failed to save chat data to localStorage:", error);
    }
  }, [chatSessions, activeChatId]);

  // Effect to manage chat activation based on tool selection or direct toggle
  useEffect(() => {
    if (activeTool === 'ask_ai') {
      setIsChatActive(true);
    }
    // If chat is active, ensure body overflow is hidden
    if (isChatActive) {
      document.body.style.overflow = 'hidden';
      // If chat becomes active and there's no active chat ID:
      // - If sessions exist, set the most recent one as active.
      // - If no sessions exist, prepare for a new one by setting activeChatId to null.
      if (!activeChatId && chatSessions.length > 0) {
        const sortedSessions = [...chatSessions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setActiveChatId(sortedSessions[0].id);
      } else if (!activeChatId && chatSessions.length === 0) {
        setActiveChatId(null); // Ready for a new chat session
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isChatActive, activeTool, chatSessions, activeChatId]); // Added activeChatId and chatSessions dependencies carefully

  const handleFilterClick = (item: FilterItem) => {
    setIsToolLoading(false); // Reset tool loading
    if (item.type === 'filter') {
      setActiveFilter(item.id as AgentCategory | 'all');
      setActiveTool(null); // Deactivate any active tool
      setIsChatActive(false); // Deactivate chat view
    } else if (item.type === 'tool') {
      const newTool = activeTool === item.id ? null : item.id;
      setActiveTool(newTool);
      setActiveFilter('all'); // Reset filter to 'all' when a tool is selected
      if (newTool) {
        setIsChatActive(false); // Deactivate chat for other tools initially
        setIsToolLoading(true);
        setTimeout(() => setIsToolLoading(false), 300); // Simulate loading
      }
    }
  };

  // Toggle chat active state, can be triggered by PublicChat or other UI elements
  const toggleChatActive = useCallback((active?: boolean) => {
    const newActiveState = active !== undefined ? active : !isChatActive;
    setIsChatActive(newActiveState);
    if (newActiveState) {
      setActiveTool('ask_ai'); // Explicitly set tool to 'ask_ai' when chat is activated
    } else if (activeTool === 'ask_ai') {
      setActiveTool(null); // If chat is deactivated and current tool was 'ask_ai', clear tool
    }
  }, [isChatActive, activeTool]);

  const handleNewMessage = (newMessageContent: Omit<Message, 'id' | 'timestamp' | 'sender'>, sender: 'user' | 'ai') => {
    const messageWithIdAndTimestamp: Message = {
      ...newMessageContent,
      id: uuidv4(),
      timestamp: new Date(),
      sender: sender,
    };

    setChatSessions(prevSessions => {
      const currentChatIdToUse = activeChatId; // Use a const for the current activeChatId
      // If no active chat or the active chat doesn't exist, create a new one
      if (currentChatIdToUse === null || !prevSessions.find(session => session.id === currentChatIdToUse)) {
        const newSessionId = uuidv4();
        const newSession: ChatSession = {
          id: newSessionId,
          title: `Chat ${prevSessions.length + 1}`,
          messages: [messageWithIdAndTimestamp],
          createdAt: new Date(),
        };
        setActiveChatId(newSessionId); // Set the new session as active
        return [...prevSessions, newSession];
      } else {
        // Add message to the existing active session
        return prevSessions.map(session =>
          session.id === currentChatIdToUse
            ? { ...session, messages: [...session.messages, messageWithIdAndTimestamp] }
            : session
        );
      }
    });
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveTool('ask_ai'); // Ensure 'ask_ai' tool is active
    setIsChatActive(true);   // Ensure chat view is active
  };

  const handleNewChat = () => {
    setActiveChatId(null); // Setting to null signals that the next message should create a new chat
    setActiveTool('ask_ai');
    setIsChatActive(true);
    // The actual new session object is created in handleNewMessage when the first message is sent
  };

  const currentMessages = chatSessions.find(session => session.id === activeChatId)?.messages || [];

  const renderMainContent = () => {
    if (isToolLoading && !isChatActive) {
      return (
        <div className="space-y-4 w-full mt-8">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    }

    if (isChatActive && activeTool === 'ask_ai') {
      return (
        <PublicChat
          isChatActive={isChatActive}
          toggleChatActive={toggleChatActive}
          messages={currentMessages}
          onNewMessage={(msgContent, sender) => handleNewMessage(msgContent, sender)}
        />
      );
    }

    switch (activeTool) {
      case 'quick_notes':
        return <MyTemplates />;
      case 'expert_panel':
        return <ExpertPanelView isPublicView={true} />;
      default: // No specific tool active, or 'ask_ai' but chat not active (e.g. landing page view)
        if (!isChatActive) { // Only show MyAgents if chat is not the main focus
          return <MyAgents />;
        }
        return null; // Or a placeholder if chat is active but tool isn't 'ask_ai'
    }
  };

  return (
    <PublicLayout showHeader={!isChatActive} showFooter={!isChatActive}>
      <div className={cn(!isChatActive ? "opacity-100" : "opacity-0 pointer-events-none hidden", "transition-opacity duration-300 ease-in-out")}>
        <LandingHero />
      </div>

      <div className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col flex-1",
        isChatActive ? "h-screen overflow-hidden p-0 m-0 max-w-full" : "mt-8" // Added mt-8 for spacing when not chat active
      )}>
        {isChatActive ? (
          <div className="flex flex-1 h-full overflow-hidden"> {/* Added overflow-hidden */}
            {/* Desktop Sidebar - static */}
            <div className="hidden md:block md:w-1/4 lg:w-1/5 xl:w-1/6 h-full border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
              <ChatHistorySidebar
                chatSessions={chatSessions}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
              />
            </div>

            {/* Mobile Sidebar - overlay */}
            <div className={cn(
              "fixed inset-y-0 left-0 z-50 h-full w-3/4 sm:w-72 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 shadow-xl",
              "transform transition-transform duration-300 ease-in-out md:hidden",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-3 right-3 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 md:hidden z-[51]"
                aria-label="Close chat history"
              >
                <X size={20} />
              </button>
              <ChatHistorySidebar
                chatSessions={chatSessions}
                activeChatId={activeChatId}
                onSelectChat={(id) => { handleSelectChat(id); setMobileSidebarOpen(false); }}
                onNewChat={() => { handleNewChat(); setMobileSidebarOpen(false); }}
              />
            </div>
            {mobileSidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
            )}

            {/* Main Chat Content Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
              {/* Hamburger button for mobile */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden absolute top-4 left-4 z-30 p-2 bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Open chat history"
              >
                <Menu size={22} />
              </button>
              {renderMainContent()}
            </div>
          </div>
        ) : (
          // Landing Page Content (when chat is not active)
          <div className={cn("transition-opacity duration-300 ease-in-out", isChatActive ? "opacity-0 pointer-events-none hidden" : "opacity-100")}>
            {/* Main Content Area with Visual Container */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-border/30 p-6">
              <div className="w-full">
                {renderMainContent()}
              </div>
            </div>
            {/* Other Landing Page Sections */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="my-12 md:my-16">
                <BenefitsSection />
              </div>
              <div className="my-12 md:my-16">
                <FeaturesSection />
              </div>
              <div className="mb-16">
                <CTASection />
              </div>
              <div className="mb-16">
                <SecurityBanner />
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

// This component should be imported from its own file, but for simplicity we're adding it inline
const MyTemplates = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">Quick Notes Feature Coming Soon</h2>
    </div>
  );
};

export default LandingPage;
