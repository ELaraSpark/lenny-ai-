// Component: ChatHistoryModal
// Purpose: Displays a modal with chat and task history, allowing users to search and select past interactions.
// Used in: ChatInterface.

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Clock, X, Bot, FileText, Link as LinkIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { TabsContainer, TabsContent, TabsList, TabsTrigger } from '@/components/ui/perplexity-tabs';

// Define the chat history entry type
export interface ChatHistoryEntry {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages?: { sender: 'user' | 'bot'; text: string }[];
  pinned?: boolean;
}

// Define the task history entry type
export interface TaskHistoryEntry {
  id: string;
  agentName: string;
  action: string;
  context?: string;
  status: 'Success' | 'Failed' | 'In Progress';
  timestamp: Date;
  outputLink?: string;
}

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  chatHistory: ChatHistoryEntry[];
}

// Mock data for tasks
const mockTaskHistory: TaskHistoryEntry[] = [
  { id: 't1', agentName: 'SOAP Note Generator', action: 'Generated SOAP Note', context: 'Patient: Jane Smith', status: 'Success', timestamp: new Date(Date.now() - 5 * 60 * 1000), outputLink: '/notes/123' },
  { id: 't2', agentName: 'Radiology Report AI', action: 'Summarized Chest X-Ray', context: 'Patient: Robert Johnson', status: 'Success', timestamp: new Date(Date.now() - 15 * 60 * 1000), outputLink: '/reports/456' },
  { id: 't3', agentName: 'Pharmacology Advisor', action: 'Checked Drug Interactions', context: 'Chat ID: abc-123', status: 'Failed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 't4', agentName: 'Cardiology Consult AI', action: 'Analyzed ECG Strip', context: 'Patient: Emily White', status: 'In Progress', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 't5', agentName: 'SOAP Note Generator', action: 'Generated SOAP Note', context: 'Patient: Michael Brown', status: 'Success', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), outputLink: '/notes/789' },
];

// Helper function to group items by time period
const groupItemsByTimePeriod = <T extends { timestamp: Date }>(items: T[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastMonthStart = new Date(today);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  return {
    'Today': items.filter(item => item.timestamp >= today),
    'Yesterday': items.filter(item => item.timestamp >= yesterday && item.timestamp < today),
    'Last Week': items.filter(item => item.timestamp >= lastWeekStart && item.timestamp < yesterday),
    'Last Month': items.filter(item => item.timestamp >= lastMonthStart && item.timestamp < lastWeekStart),
    'Older': items.filter(item => item.timestamp < lastMonthStart),
  };
};

// Helper function to format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

// Status badge component for tasks
const StatusBadge = ({ status }: { status: TaskHistoryEntry['status'] }) => {
  switch (status) {
    case 'Success': 
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle2 size={12} className="mr-1" />Success
      </Badge>;
    case 'Failed': 
      return <Badge variant="destructive">
        <XCircle size={12} className="mr-1" />Failed
      </Badge>;
    case 'In Progress': 
      return <Badge variant="outline" className="text-primary border-primary/40"> // Use theme variable
        <Loader2 size={12} className="mr-1 animate-spin" />In Progress
      </Badge>;
    default: 
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectChat,
  chatHistory
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'tasks'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory;
    
    return chatHistory.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatHistory, searchQuery]);
  
  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return mockTaskHistory;
    
    return mockTaskHistory.filter(task => 
      task.agentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.context && task.context.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);
  
  // Group filtered items by time period
  const groupedChats = useMemo(() => 
    groupItemsByTimePeriod(filteredChats), 
    [filteredChats]
  );
  
  const groupedTasks = useMemo(() => 
    groupItemsByTimePeriod(filteredTasks), 
    [filteredTasks]
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">History</DialogTitle>
        </DialogHeader>
        
        <TabsContainer value={activeTab} onValueChange={(value) => setActiveTab(value as 'chats' | 'tasks')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={`Search ${activeTab === 'chats' ? 'chat' : 'task'} history...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TabsContent value="chats" className="mt-0">
            <div className="overflow-y-auto max-h-[50vh] pr-1">
              {Object.entries(groupedChats).map(([timePeriod, chats]) => {
                if (chats.length === 0) return null;
                
                return (
                  <div key={timePeriod} className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{timePeriod}</h3>
                    <div className="space-y-2">
                      {chats.map(chat => (
                        <div 
                          key={chat.id}
                          className="p-3 bg-muted/50 rounded-md hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => onSelectChat(chat.id)}
                        >
                          <div className="flex items-start gap-3">
                            <PicassoAvatar
                              name="Leny"
                              illustrationType="healing"
                              size="sm"
                              color="text-primary" // Use theme variable
                              className="flex-shrink-0 mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground">{chat.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{chat.preview}</p>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(chat.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {filteredChats.length === 0 && (
                <div className="text-center py-8">
                  <PicassoIllustration
                    name="empty"
                    size="md"
                    color="text-muted-foreground"
                    className="mx-auto mb-3"
                  />
                  <p className="text-muted-foreground">No chat history found</p>
                </div>
              )}
              
              {filteredChats.length > 0 && (
                <div className="text-center mt-4">
                  <Button variant="link" asChild>
                    <Link to="/recent-chats">View All Chats</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="overflow-y-auto max-h-[50vh] pr-1">
              {Object.entries(groupedTasks).map(([timePeriod, tasks]) => {
                if (tasks.length === 0) return null;
                
                return (
                  <div key={timePeriod} className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{timePeriod}</h3>
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-muted rounded-md self-start">
                              <Bot size={18} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground">{task.action}</h4>
                              <p className="text-xs text-muted-foreground">by <span className="font-medium">{task.agentName}</span></p>
                              {task.context && <p className="text-xs text-muted-foreground mt-1">Context: {task.context}</p>}
                              <div className="flex items-center justify-between mt-2">
                                <StatusBadge status={task.status} />
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(task.timestamp)}
                                </span>
                              </div>
                              {task.outputLink && (
                                <div className="mt-1">
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80" asChild> // Use theme variable
                                    <a href={task.outputLink}>View Output <LinkIcon size={12} className="ml-1"/></a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-8">
                  <PicassoIllustration
                    name="empty"
                    size="md"
                    color="text-muted-foreground"
                    className="mx-auto mb-3"
                  />
                  <p className="text-muted-foreground">No task history found</p>
                </div>
              )}
              
              {filteredTasks.length > 0 && (
                <div className="text-center mt-4">
                  <Button variant="link" asChild>
                    <Link to="/tasks">View All Tasks</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </TabsContainer>
      </DialogContent>
    </Dialog>
  );
};
