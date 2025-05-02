import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QUICK_ACTIONS, QuickOption } from '@/components/quickActionsData';
import { ChevronUp } from 'lucide-react';

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  isHidden?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelectPrompt, isHidden = false }) => {
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
            bg-white rounded-lg shadow-lg 
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
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: activeAction.icon }} />
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
                  className="w-full text-left px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2 lg:text-base rounded-md text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Action Buttons - Wrapped in overflow div with padding */}
      <div className="overflow-x-auto px-4 mb-8 sm:mb-16">
        <ul 
          role="tablist"
          className={cn(
            "flex justify-start gap-x-1 sm:gap-x-2 md:gap-x-4 transition-opacity duration-300 flex-nowrap quick-actions pb-2",
            isHidden ? "opacity-0" : "opacity-100"
          )}
        >
          {QUICK_ACTIONS.map((action) => (
            <li key={action.id}>
              <button 
                role="tab"
                onClick={() => handleTabClick(action.id)}
                className={cn(
                  "inline-flex items-center gap-x-2 shrink-0 whitespace-nowrap rounded-lg border hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:py-2 lg:text-base",
                  action.baseClassName,
                  activeTab === action.id && "border-blue-500 shadow-md"
                )}
                id={`tab-${action.id}`}
                aria-expanded={activeTab === action.id ? "true" : "false"}
                aria-controls={`panel-${action.id}`}
              >
                <span dangerouslySetInnerHTML={{ __html: action.icon }} />
                <span className="truncate max-w-[80px] sm:max-w-none">{action.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuickActions;