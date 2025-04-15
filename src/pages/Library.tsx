import React, { useState } from 'react';
import { PlusIcon, ListIcon, FileIcon, MoreHorizontal, Search as SearchIcon } from 'lucide-react'; // Renamed Search to SearchIcon
import AppLayout from '@/components/layout/AppLayout';
import { TabsContainer, TabsList, TabsTrigger, TabsContent } from '@/components/ui/perplexity-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThreadsList } from '@/components/library/ThreadsList'; // Assuming this exists
import { PagesList } from '@/components/library/PagesList'; // Assuming this exists
import { CardSkeleton } from '@/components/library/CardSkeleton'; // Import skeleton
import { EmptyState } from '@/components/library/EmptyState'; // Import empty state

type TabValue = 'threads' | 'pages';

// Placeholder components if they don't exist yet
const PlaceholderList = ({ type }: { type: string }) => (
  <div className="mt-4 text-center text-perplexity-text-secondary">
    {/* <EmptyState 
      title={`No ${type} yet`}
      description={`Create a new ${type.slice(0, -1)} to get started.`}
      actionLabel={`New ${type.slice(0, -1)}`}
      onAction={() => console.log(`Create new ${type.slice(0, -1)}`)}
    /> */}
    Placeholder for {type} list. Implement ThreadsList/PagesList components.
  </div>
);

// Assume ThreadsList and PagesList exist or use PlaceholderList
const ThreadsListComponent = typeof ThreadsList !== 'undefined' ? ThreadsList : () => <PlaceholderList type="threads" />;
const PagesListComponent = typeof PagesList !== 'undefined' ? PagesList : () => <PlaceholderList type="pages" />;


const Library = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('threads');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Simulate search loading
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(`Searching ${activeTab} for:`, searchQuery);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000); 
  };

  const handleCreateNew = () => {
    console.log(`Create new ${activeTab === 'threads' ? 'Thread' : 'Page'}`);
    // Add navigation or modal logic here
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-4xl px-4 py-6"> {/* Constrain width */}
        {/* Library Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Use theme foreground */}
          <h1 className="text-2xl font-semibold text-foreground">Library</h1> 
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-perplexity-border text-perplexity-text-secondary hover:bg-perplexity-bg-hover"
              onClick={handleCreateNew}
            >
              <PlusIcon size={16} className="mr-1" />
              <span>New</span>
            </Button>
            {/* Optional: More actions dropdown */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-perplexity-text-secondary"
            >
              <MoreHorizontal size={16} />
            </Button> */}
          </div>
        </div>

        {/* Search Bar - Reusing Header's style concept */}
        <form onSubmit={handleSearchSubmit} className="relative w-full mb-6">
          <SearchIcon 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-perplexity-text-tertiary pointer-events-none" 
          />
          <Input
            type="search"
            placeholder={`Search ${activeTab}...`}
            // Use theme colors, increase placeholder text size
            className="w-full rounded-full bg-muted border-border pl-10 pr-4 py-2 text-base placeholder:text-muted-foreground focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Tabs Interface */}
        <TabsContainer value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <div className="flex items-center justify-between border-b border-perplexity-border"> {/* Move border here */}
            <TabsList className="border-b-0"> {/* Remove border from TabsList */}
              <TabsTrigger value="threads" icon={<ListIcon size={16} />}>
                Threads
              </TabsTrigger>
              <TabsTrigger value="pages" icon={<FileIcon size={16} />}>
                Pages
              </TabsTrigger>
            </TabsList>
            {/* Optional: Contextual add button */}
            {/* <Button 
              variant="ghost" 
              size="sm" 
              className="text-perplexity-text-secondary hover:bg-perplexity-bg-hover mb-px" // Align with tabs
              onClick={handleCreateNew}
            >
              <PlusIcon size={16} className="mr-1" />
              <span>{activeTab === 'threads' ? 'Thread' : 'Page'}</span>
            </Button> */}
          </div>

          <TabsContent value="threads">
            {isLoading ? <CardSkeleton count={3} /> : <ThreadsListComponent />}
          </TabsContent>

          <TabsContent value="pages">
            {isLoading ? <CardSkeleton count={3} /> : <PagesListComponent />}
          </TabsContent>
        </TabsContainer>
      </div>
    </AppLayout>
  );
};

export default Library;
