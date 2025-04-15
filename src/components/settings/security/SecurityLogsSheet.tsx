
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { 
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type LogLevel = "info" | "warning" | "error";
export type LogBadgeVariant = "default" | "secondary" | "destructive" | "outline";
export type ActivityLog = {
  id: number;
  message: string;
  timestamp: string;
  level: LogLevel;
};

type SecurityLogsSheetProps = {
  activityLogs: ActivityLog[];
};

export const SecurityLogsSheet = ({ activityLogs }: SecurityLogsSheetProps) => {
  const [logLevel, setLogLevel] = useState<string>("all");

  const getLogBadgeVariant = (level: string): LogBadgeVariant => {
    switch (level) {
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <SheetContent className="w-[400px] sm:w-[540px]" side="right">
      <SheetHeader>
        <SheetTitle>Security Activity Log</SheetTitle>
        <SheetDescription>
          Review your recent security-related activity
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Log Level</h3>
          <Select value={logLevel} onValueChange={setLogLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select log level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        {activityLogs
          .filter(log => logLevel === "all" || log.level === logLevel)
          .map(log => (
            <div key={log.id} className="relative pl-6 pb-4 border-l border-muted">
              <div className="absolute -left-1.5 mt-1.5">
                <Badge variant={getLogBadgeVariant(log.level)} className="rounded-full h-3 w-3 p-0" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{log.message}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
      </div>
      
      <SheetFooter className="mt-6">
        <Button variant="outline" size="sm" className="space-x-2">
          <FileText className="h-4 w-4" />
          <span>Export Logs</span>
        </Button>
        <SheetClose asChild>
          <Button>Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};
