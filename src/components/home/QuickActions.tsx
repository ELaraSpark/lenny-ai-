import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QUICK_ACTIONS, QuickOption } from '@/components/quickActionsData';
import { ChevronUp } from 'lucide-react';

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  isHidden?: boolean;
  useCustomButtons?: boolean; // Flag to indicate if we're using custom quick action buttons
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelectPrompt, isHidden = false, useCustomButtons = false }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (prompt: string) => {
    onSelectPrompt(prompt);
    setActiveTab(null);
  };
  // Handle tab click - toggle active tab
  const handleTabClick = (id: string) => {
    setActiveTab(activeTab === id ? null : id);
  };

  // Listen for custom events to toggle quick actions
  useEffect(() => {
    const handleToggleQuickAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.actionId) {
        const actionId = customEvent.detail.actionId;
        setActiveTab(activeTab === actionId ? null : actionId);
      }
    };
    
    window.addEventListener('toggleQuickAction', handleToggleQuickAction);
    return () => {
      window.removeEventListener('toggleQuickAction', handleToggleQuickAction);
    };
  }, [activeTab]);

  // Get the active action data
  const activeAction = QUICK_ACTIONS.find(action => action.id === activeTab);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-1 md:px-2 -mt-6 sm:-mt-8">
      {/* Options Panel */}
      {activeTab && activeAction && (
        <div 
          ref={panelRef}
          className="
            absolute top-full left-0 
            mt-1
            w-full
            bg-white rounded-md shadow-lg 
            p-2 sm:p-3
            text-xs sm:text-sm
            max-h-[50vh] sm:max-h-60
            overflow-y-auto
            z-10
            border border-gray-100
          "
          role="region"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: activeAction.icon }} className="text-blue-500" />
              {activeAction.label}
            </h3>
            <button 
              onClick={() => setActiveTab(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close panel"
            >
              <ChevronUp size={16} />
            </button>
          </div>
          
          <ul className="space-y-1">
            {activeAction.options.map((option: QuickOption) => (
              <li key={option.id}>
                <button
                  onClick={() => handleOptionClick(option.prompt)}
                  className="w-full text-left px-3 py-2 text-sm rounded-none text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}      {/* Standard Quick Action Buttons */}
      {!useCustomButtons && (
        <div className="overflow-x-auto px-4 mb-8 sm:mb-16">
          <ul 
            role="tablist"
            className={cn(
              "flex justify-start gap-x-1 sm:gap-x-2 md:gap-x-4 transition-opacity duration-300 flex-nowrap quick-actions pb-2",
              isHidden ? "opacity-0" : "opacity-100"
            )}
          >
            {QUICK_ACTIONS.map((action) => (
              <li key={action.id}>                <button 
                  role="tab"
                  onClick={() => handleTabClick(action.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors",
                    "text-sm",
                    activeTab === action.id ? "bg-blue-50 border-blue-300" : "bg-white"
                  )}
                  id={`tab-${action.id}`}
                  aria-expanded={activeTab === action.id ? "true" : "false"}
                  aria-controls={`panel-${action.id}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: action.icon }} className="text-blue-500" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{action.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickActions;