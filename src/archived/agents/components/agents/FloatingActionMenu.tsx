import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Clock, 
  Plus, 
  X,
  MessageSquare,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionMenuProps {
  notificationCount?: number;
  onHistoryOpen?: () => void;
  onNotificationsOpen?: () => void;
}

const FloatingActionMenu = ({ 
  notificationCount = 0, 
  onHistoryOpen, 
  onNotificationsOpen 
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-3 mb-4"
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
              onClick={() => handleAction(onHistoryOpen)}
              title="Chat History"
            >
              <Clock className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg relative"
              onClick={() => handleAction(onNotificationsOpen)}
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
            
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              onClick={() => handleAction()}
              title="New Chat"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
              onClick={() => handleAction()}
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-red-500 hover:bg-red-600 rotate-45" 
            : "bg-primary hover:bg-primary/90"
        )}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default FloatingActionMenu;
