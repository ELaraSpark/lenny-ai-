import React from 'react';
import { PlusCircle } from 'lucide-react'; // For the "New Chat" button icon
import { ChatSession } from '@/pages/LandingPage'; // Import ChatSession type
import { cn } from '@/lib/utils';

interface ChatHistorySidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  const sortedSessions = [...chatSessions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 p-4 flex flex-col"> {/* Removed overflow-y-auto here, will add to list */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center p-3 mb-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Start new chat"
      >
        <PlusCircle size={20} className="mr-2" />
        New Chat
      </button>
      <div className="flex justify-between items-center mb-3"> {/* Reduced mb slightly */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat History</h2>
        {/* Icon-only new chat button removed as it's now a full button above */}
      </div>
      {sortedSessions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4 flex-1">No chat history yet. Start a new chat!</p>
      ) : (
        <ul className="space-y-2 flex-1 overflow-y-auto"> {/* Added overflow-y-auto here */}
          {sortedSessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => onSelectChat(session.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  session.id === activeChatId
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                )}
              >
                <p className={cn(
                  "text-sm truncate", // Added truncate
                  session.id === activeChatId ? "text-white font-semibold" : "text-gray-700 dark:text-gray-300 font-medium" // Added font-semibold for active
                )}>
                  {session.title}
                </p>
                {session.messages.length > 0 && (
                  <p className={cn(
                    "text-xs truncate",
                    session.id === activeChatId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {session.messages[session.messages.length - 1].text}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistorySidebar;