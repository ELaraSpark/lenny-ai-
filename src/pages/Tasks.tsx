import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListChecks, Search, CheckCircle2, XCircle, Loader2, Bot, FileText as FileTextIcon, Link as LinkIcon } from 'lucide-react'; // Updated icons
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea
// EmptyState import was added in the previous step, keep it if needed later
// import { EmptyState } from '@/components/library/EmptyState';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Example data structure for Agent Tasks
interface AgentTaskItem {
  id: string;
  agentName: string;
  action: string; // e.g., "Generated SOAP Note", "Summarized Report"
  context?: string; // e.g., "Patient: John Doe", "Chat ID: xyz"
  status: 'Success' | 'Failed' | 'In Progress';
  timestamp: Date;
  outputLink?: string; // Optional link to the result
  agentAvatar?: string; // Optional avatar
}

// Updated example data
const now = new Date();
const initialExampleTasks: AgentTaskItem[] = [
  { id: 't1', agentName: 'SOAP Note Generator', action: 'Generated SOAP Note', context: 'Patient: Jane Smith', status: 'Success', timestamp: new Date(now.getTime() - 5 * 60 * 1000), outputLink: '/notes/123', agentAvatar: '/agents/gen.jpg' },
  { id: 't2', agentName: 'Radiology Report AI', action: 'Summarized Chest X-Ray', context: 'Patient: Robert Johnson', status: 'Success', timestamp: new Date(now.getTime() - 15 * 60 * 1000), outputLink: '/reports/456', agentAvatar: '/agents/radiology.jpg' },
  { id: 't3', agentName: 'Pharmacology Advisor', action: 'Checked Drug Interactions', context: 'Chat ID: abc-123', status: 'Failed', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), agentAvatar: '/agents/pharma.jpg' },
  { id: 't4', agentName: 'Cardiology Consult AI', action: 'Analyzed ECG Strip', context: 'Patient: Emily White', status: 'In Progress', timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), agentAvatar: '/agents/cardio.jpg' },
  { id: 't5', agentName: 'SOAP Note Generator', action: 'Generated SOAP Note', context: 'Patient: Michael Brown', status: 'Success', timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000), outputLink: '/notes/789', agentAvatar: '/agents/gen.jpg' }, // Yesterday
  { id: 't6', agentName: 'Radiology Report AI', action: 'Summarized MRI Brain', context: 'Patient: Sarah Davis', status: 'Success', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), outputLink: '/reports/101', agentAvatar: '/agents/radiology.jpg' }, // 3 days ago
];

// Helper function to group tasks by date
const groupTasksByDate = (tasks: AgentTaskItem[]) => {
  const groups: { [key: string]: AgentTaskItem[] } = { Today: [], Yesterday: [], 'Previous 7 Days': [], Older: [] };
  const today = new Date();
  tasks.forEach(task => {
    if (isToday(task.timestamp)) groups.Today.push(task);
    else if (isYesterday(task.timestamp)) groups.Yesterday.push(task);
    else if (differenceInDays(today, task.timestamp) < 7) groups['Previous 7 Days'].push(task);
    else groups.Older.push(task);
  });
  for (const group in groups) {
      groups[group].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  return groups;
};

type StatusFilter = 'all' | 'Success' | 'Failed' | 'In Progress';

const Tasks = () => {
  const navigate = useNavigate(); // Get navigate function
  const [tasks, setTasks] = useState<AgentTaskItem[]>(initialExampleTasks); // Use state if tasks can be updated/deleted
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter and Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
        const matchesSearch =
          task.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.context && task.context.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesFilter;
      }
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Always sort by date desc for log view
  }, [tasks, searchTerm, statusFilter]);

  const groupedTasks = groupTasksByDate(filteredTasks);

  const getStatusBadge = (status: AgentTaskItem['status']) => {
    switch (status) {
      // Use theme colors for success badge
      case 'Success': return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 size={12} className="mr-1" />Success</Badge>; // Keep green for success
      case 'Failed': return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Failed</Badge>;
      // Use blue for In Progress
      case 'In Progress': return <Badge variant="outline" className="text-blue-600 border-blue-600/40"><Loader2 size={12} className="mr-1 animate-spin" />In Progress</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    if (isToday(timestamp)) return format(timestamp, 'p');
    if (isYesterday(timestamp)) return 'Yesterday ' + format(timestamp, 'p');
    return format(timestamp, 'MMM d, yyyy p');
  };

  return (
    // <AppLayout> // Removed AppLayout wrapper
      <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        {/* Use theme foreground color */}
        <h1 className="text-2xl font-semibold text-foreground mb-4">Agent Task Log</h1>
        <p className="text-sm text-muted-foreground mb-6">
          View the history of tasks performed by AI agents.
        </p>

        {/* Filter and Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
           <div className="relative flex-1">
             <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" /> {/* Added pointer-events-none */}
             <Input
               type="search"
               placeholder="Search tasks by agent, action, context..."
               className="w-full rounded-full bg-muted border-border pl-10 pr-4 py-2 text-sm focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary" /* Applied consistent style */
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
             <SelectTrigger className="w-full sm:w-[180px]"> {/* Consider standardizing select trigger style too if needed */}
               <SelectValue placeholder="Filter by status..." />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="Success">Success</SelectItem>
               <SelectItem value="Failed">Failed</SelectItem>
               <SelectItem value="In Progress">In Progress</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border"> {/* Added subtle shadow and border */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {Object.entries(groupedTasks).map(([groupName, tasksInGroup]) => (
                tasksInGroup.length > 0 && (
                  <div key={groupName} className="mb-2 last:mb-0">
                    {/* Increased date group header size */}
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground px-4 py-2 bg-muted/50 border-b border-t">
                      {groupName}
                    </h3>
                    {/* Use theme border color */}
                    <div className="divide-y divide-border">
                      {tasksInGroup.map((task) => (
                        /* Stack vertically by default, row on sm+ */
                        <div key={task.id} className="flex flex-col sm:flex-row sm:items-start p-4 gap-3 sm:gap-4">
                           {/* Icon - align self start in both layouts */}
                           <div className="p-1.5 bg-muted rounded-md sm:mt-1 self-start">
                              <Bot size={18} className="text-muted-foreground" />
                           </div>
                           {/* Main content - takes remaining space */}
                           <div className="flex-1 min-w-0">
                              {/* Increased task action size */}
                              <p className="text-base font-medium text-foreground">{task.action}</p>
                              {/* Increased agent name weight */}
                              <p className="text-xs text-muted-foreground">by <span className="font-medium">{task.agentName}</span></p>
                              {task.context && <p className="text-xs text-muted-foreground mt-1">Context: {task.context}</p>}
                           </div>
                           {/* Status/Timestamp/Link - align end on sm+, start (default) when stacked */}
                           <div className="flex flex-col items-start sm:items-end space-y-1 text-xs whitespace-nowrap mt-1 sm:mt-0">
                              {getStatusBadge(task.status)}
                              <span className="text-muted-foreground">{formatTimestamp(task.timestamp)}</span>
                              {task.outputLink && (
                                 /* Use secondary-accent for View Output link */
                                 <Button variant="link" size="sm" className="h-auto p-0 text-xs text-secondary-accent hover:text-secondary-accent/80" asChild>
                                    <a href={task.outputLink} target="_blank" rel="noopener noreferrer">View Output <LinkIcon size={12} className="ml-1"/></a>
                                 </Button>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
              {filteredTasks.length === 0 && (
                 <div className="p-12 text-center">
                   {/* Use muted foreground */}
                   <ListChecks size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                   {/* Use theme foreground/muted */}
                   <h3 className="text-lg font-medium text-foreground">No Matching Tasks Found</h3>
                   <p className="mt-1 text-sm text-muted-foreground">
                     Try adjusting your search or filters.
                   </p>
                 </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    // </AppLayout> // Removed AppLayout wrapper
  );
};

export default Tasks;
