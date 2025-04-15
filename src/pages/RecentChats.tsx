import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed AppLayout import
// import AppLayout from '@/components/layout/AppLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Trash2, Play, Pin, PinOff, ArrowUpDown, Bot } from 'lucide-react'; // Use SearchIcon alias
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { cn } from '@/lib/utils';
import { ThreadCard } from '@/components/library/ThreadCard'; // Import the new ThreadCard
import { EmptyState } from '@/components/library/EmptyState'; // Import EmptyState
import { CardSkeleton } from '@/components/library/CardSkeleton'; // Import skeleton

// Update data structure if needed (ThreadCard expects title, preview, date)
interface RecentChatItem {
  id: string;
  agentName: string; // Will be used as title
  lastMessage: string; // Will be used as preview
  timestamp: Date; // Will be used as date
  agentAvatar?: string; // Can be passed to ThreadCard if customized
  pinned?: boolean;
}

// Keep example data, but map it to ThreadCard props later
const now = new Date();
const initialExampleChats: RecentChatItem[] = [
  { id: '1', agentName: 'Cardiology Consult AI', lastMessage: 'Based on the ECG, consider ruling out...', timestamp: new Date(now.getTime() - 10 * 60 * 1000), agentAvatar: '/agents/cardio.jpg', pinned: true },
  { id: '5', agentName: 'Oncology Second Opinion', lastMessage: 'Reviewing the pathology report provided...', timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), agentAvatar: '', pinned: true },
  { id: '2', agentName: 'Radiology Report AI', lastMessage: 'The findings suggest moderate degenerative changes...', timestamp: new Date(now.getTime() - 60 * 60 * 1000), agentAvatar: '/agents/radiology.jpg', pinned: false },
  { id: '3', agentName: 'Pharmacology Advisor', lastMessage: 'Recommend checking for interactions with Warfarin.', timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000), agentAvatar: '/agents/pharma.jpg', pinned: false }, // Yesterday
  { id: '6', agentName: 'Neurology Consult', lastMessage: 'Differential includes migraine vs tension headache.', timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), agentAvatar: '/agents/neuro.jpg', pinned: false }, // 10 days ago
  { id: '4', agentName: 'General Practice AI', lastMessage: 'Patient presents with symptoms consistent with...', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), agentAvatar: '/agents/gen.jpg', pinned: false }, // 2 days ago
];

// Helper function to group chats by date
const groupChatsByDate = (chats: RecentChatItem[]) => {
  // Grouping logic remains similar
  const groups: { [key: string]: RecentChatItem[] } = { Today: [], Yesterday: [], 'Previous 7 Days': [], Older: [] };
  const today = new Date();
  chats.forEach(chat => {
    if (isToday(chat.timestamp)) groups.Today.push(chat);
    else if (isYesterday(chat.timestamp)) groups.Yesterday.push(chat);
    else if (differenceInDays(today, chat.timestamp) < 7) groups['Previous 7 Days'].push(chat);
    else groups.Older.push(chat);
  });
  return groups;
};

type SortOption = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc';

const RecentChats = () => {
  const [chats, setChats] = useState<RecentChatItem[]>(initialExampleChats);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOption>('dateDesc');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [isAlertOpen, setIsAlertOpen] = useState(false); // State for dialog visibility
  const [chatToDelete, setChatToDelete] = useState<string | null>(null); // State for targeted chat ID
  const navigate = useNavigate();

  // Filter and Sort Logic
  const processedChats = useMemo(() => {
    // Simulate loading on search/sort change
    setIsLoading(true);

    let filtered = chats.filter(chat =>
      chat.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'dateAsc': return a.timestamp.getTime() - b.timestamp.getTime();
        case 'nameAsc': return a.agentName.localeCompare(b.agentName);
        case 'nameDesc': return b.agentName.localeCompare(a.agentName);
        case 'dateDesc':
        default: return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    // Separate pinned after sorting
    const pinned = filtered.filter(chat => chat.pinned);
    const unpinned = filtered.filter(chat => !chat.pinned);

    // Simulate loading finished
    setTimeout(() => setIsLoading(false), 300); // Short delay for visual feedback

    return { pinned, unpinned };
  }, [chats, searchTerm, sortOrder]);

  // Group the unpinned chats
  const groupedUnpinnedChats = groupChatsByDate(processedChats.unpinned);

  // --- Action Handlers ---
  const handleContinueChat = (chatId: string) => { navigate(`/chat/${chatId}`); }; // Navigate to specific chat

  // Updated handleDeleteChat to trigger the dialog
  const handleDeleteChat = (chatId: string) => {
    setChatToDelete(chatId);
    setIsAlertOpen(true);
  };
  const handleTogglePin = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.timestamp.getTime() - a.timestamp.getTime())); // Keep pinned on top after toggle
    // Add API call to update pin status
  };

  // Actual deletion logic (called from AlertDialog)
  const confirmDelete = () => {
    if (!chatToDelete) return;
    console.log(`Confirmed delete chat ${chatToDelete}`);
    // TODO: Add actual API call here
    setChats(prev => prev.filter(c => c.id !== chatToDelete));
    setChatToDelete(null); // Reset state
    setIsAlertOpen(false); // Close dialog
    // Optional: Add success toast
  };

  // --- Render Logic ---
  return (
      // AppLayout is handled by the parent route in App.tsx
      // Use container for consistent padding/width and add background
      <> {/* Added Fragment to wrap content and AlertDialog */}
      <div className="container mx-auto max-w-4xl px-4 py-6 h-full flex flex-col bg-background">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Recent Chats</h1> {/* Use foreground */}

        {/* Search and Sort Controls - Use new styles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" /> {/* Use muted-foreground */}
            <Input
              type="search"
              placeholder="Search chat history..."
              className="w-full rounded-full bg-muted border-border pl-10 pr-4 py-2 text-sm focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary" /* Use standard theme colors */
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOption)}>
            {/* Removed explicit bg, border, text classes to rely on default theme */}
            <SelectTrigger className="w-full sm:w-[180px]">
              <ArrowUpDown size={14} className="mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateDesc">Date: Newest</SelectItem>
              <SelectItem value="dateAsc">Date: Oldest</SelectItem>
              <SelectItem value="nameAsc">Name: A-Z</SelectItem>
              <SelectItem value="nameDesc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remove outer Card, use ScrollArea directly */}
        <ScrollArea className="flex-1 -mx-4"> {/* Negative margin to extend dividers */}
          <div className="px-4"> {/* Add padding back inside ScrollArea */}
            {isLoading ? (
              <CardSkeleton count={5} />
            ) : (
              <>
                {/* Pinned Section */}
                {processedChats.pinned.length > 0 && (
                  <div className="mb-1">
                    <h3 className="text-xs font-semibold uppercase text-amber-700 px-3 py-1.5 bg-amber-50/50 border-b border-t border-amber-100"> {/* Keep amber for pinned */}
                      Pinned
                    </h3>
                    <div className="divide-y divide-border"> {/* Use standard border */}
                      {processedChats.pinned.map((chat) => (
                        <ThreadCard
                          key={chat.id}
                          id={chat.id}
                          title={chat.agentName}
                          preview={chat.lastMessage}
                          date={chat.timestamp}
                          onClick={() => handleContinueChat(chat.id)}
                          onDelete={() => handleDeleteChat(chat.id)}
                          pinned={chat.pinned} // Pass pinned status
                          onPinToggle={() => handleTogglePin(chat.id)} // Pass toggle handler
                          className="group"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Grouped Section */}
                {Object.entries(groupedUnpinnedChats).map(([groupName, chatsInGroup]) => (
                  chatsInGroup.length > 0 && (
                    <div key={groupName} className="mb-1">
                      <h3 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-1.5 bg-muted/50 border-b border-t border-border"> {/* Use standard theme colors */}
                        {groupName}
                      </h3>
                      <div className="divide-y divide-border"> {/* Use standard border */}
                        {chatsInGroup.map((chat) => (
                           <ThreadCard
                            key={chat.id}
                            id={chat.id}
                            title={chat.agentName}
                            preview={chat.lastMessage}
                            date={chat.timestamp}
                            onClick={() => handleContinueChat(chat.id)}
                            onDelete={() => handleDeleteChat(chat.id)}
                            pinned={chat.pinned} // Pass pinned status
                            onPinToggle={() => handleTogglePin(chat.id)} // Pass toggle handler
                            className="group"
                          />
                        ))}
                      </div>
                    </div>
                  )
                ))}

                {/* No Results Message */}
                {processedChats.pinned.length === 0 && processedChats.unpinned.length === 0 && !isLoading && (
                   <EmptyState
                      title="No chats found"
                      description={searchTerm ? 'Try adjusting your search terms.' : 'Start a new chat to see it here.'}
                      actionLabel="Ask AI"
                      onAction={() => navigate('/')}
                      illustrationType="chat" // Add illustration prop
                    />
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
      {/* Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chat
              "{chats.find(c => c.id === chatToDelete)?.agentName || 'this chat'}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setChatToDelete(null)}>Cancel</AlertDialogCancel>
            {/* Use destructive variant for the action button */}
            <AlertDialogAction onClick={confirmDelete} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </> // Close Fragment
  );
};

export default RecentChats;
