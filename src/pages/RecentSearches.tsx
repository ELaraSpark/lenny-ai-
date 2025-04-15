import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2, ArrowUpRight } from 'lucide-react';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns'; // Date utility

// Example data structure with Date object
interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: Date; // Use Date object
}

// Example data with actual dates
const now = new Date();
const exampleSearches: RecentSearchItem[] = [
  { id: '1', query: 'differential diagnosis for chest pain', timestamp: new Date(now.getTime() - 5 * 60 * 1000) }, // 5 mins ago
  { id: '2', query: 'latest guidelines for hypertension management', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) }, // 2 hours ago
  { id: '3', query: 'side effects of metformin', timestamp: new Date(now.setDate(now.getDate() - 1)) }, // Yesterday
  { id: '4', query: 'pediatric dosage for amoxicillin', timestamp: new Date(now.setDate(now.getDate() - 2)) }, // 2 days ago (now 3 days ago)
  { id: '5', query: 'treatment options for atrial fibrillation', timestamp: new Date(now.setDate(now.getDate() - 5)) }, // 5 days ago (now 8 days ago)
];

// Helper function to group searches by date
const groupSearchesByDate = (searches: RecentSearchItem[]) => {
  const groups: { [key: string]: RecentSearchItem[] } = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  const today = new Date();

  searches.forEach(search => {
    if (isToday(search.timestamp)) {
      groups.Today.push(search);
    } else if (isYesterday(search.timestamp)) {
      groups.Yesterday.push(search);
    } else if (differenceInDays(today, search.timestamp) < 7) {
      groups['Previous 7 Days'].push(search);
    } else {
      groups.Older.push(search);
    }
  });

  // Sort searches within each group by timestamp descending
  for (const group in groups) {
      groups[group].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  return groups;
};


const RecentSearches = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter searches based on search term (simple example)
  const filteredSearches = exampleSearches.filter(search =>
    search.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group the filtered searches
  const groupedSearches = groupSearchesByDate(filteredSearches);

  // Placeholder action handlers
  const handleRerunSearch = (query: string) => {
    console.log("Rerun search:", query);
    alert(`Rerun search for "${query}"? (Not implemented)`);
  };

  const handleDeleteSearch = (searchId: string) => {
    console.log("Delete search:", searchId);
    alert(`Delete search ${searchId}? (Not implemented)`);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Recent Searches</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search history..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {Object.entries(groupedSearches).map(([groupName, searchesInGroup]) => (
                searchesInGroup.length > 0 && (
                  <div key={groupName} className="mb-4 last:mb-0">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground px-4 py-2 bg-muted/50 border-b border-t">
                      {groupName}
                    </h3>
                    <div className="divide-y divide-gray-200">
                      {searchesInGroup.map((search) => (
                        <div key={search.id} className="flex items-center p-4 hover:bg-gray-50 group">
                          <Search size={16} className="mr-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleRerunSearch(search.query)}>
                            <p className="text-sm text-gray-800 truncate">{search.query}</p>
                          </div>
                          <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             {/* Format timestamp more specifically if needed */}
                             <span className="text-xs text-gray-400 whitespace-nowrap mr-2">{format(search.timestamp, 'p')}</span>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); handleRerunSearch(search.query); }}>
                                <ArrowUpRight size={16} />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteSearch(search.id); }}>
                                <Trash2 size={16} />
                             </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
              {filteredSearches.length === 0 && (
                 <p className="text-gray-500 text-sm p-6 text-center">No matching searches found.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default RecentSearches;
