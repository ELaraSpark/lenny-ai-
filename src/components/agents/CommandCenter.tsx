import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, History } from 'lucide-react';

export interface RecentTask {
  id: string;
  query: string;
  timestamp: Date;
}

interface CommandCenterProps {
  onQueryChange: (query: string) => void;
  onAgentSelect?: (agentId: string) => void;
  recentTasks?: RecentTask[];
  className?: string;
}

const CommandCenter: React.FC<CommandCenterProps> = ({
  onQueryChange,
  onAgentSelect,
  recentTasks = [],
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onQueryChange(newQuery);
  };

  const handleTaskSelect = (taskQuery: string) => {
    setQuery(taskQuery);
    onQueryChange(taskQuery);
    inputRef.current?.focus();
  };

  return (
    <div className={`w-full transition-all duration-300 ease-in-out ${className}`}>
      <div 
        className={`relative rounded-xl border ${
          isFocused ? 'border-primary shadow-lg' : 'border-border'
        } bg-background transition-all duration-200`}
      >
        {/* Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className="w-full py-4 pl-12 pr-4 text-lg bg-transparent focus:outline-none"
          placeholder="What do you need help with today, Doctor?"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
        />
        
        {/* Recent Tasks (shown when input is focused and empty) */}
        {isFocused && !query && recentTasks.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-10 p-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <h3 className="text-sm font-medium text-muted-foreground px-2 py-1">Recent Tasks</h3>
            {recentTasks.map(task => (
              <button
                key={task.id}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm flex items-center gap-2"
                onClick={() => handleTaskSelect(task.query)}
              >
                <History className="h-4 w-4" />
                <span className="line-clamp-1">{task.query}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatTimeAgo(task.timestamp)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format timestamps
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
};

export default CommandCenter;
