
import { motion } from "framer-motion";
import { Heart, MessageSquare, FileText } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SharedCase } from "../types/collaborationTypes";

interface SharedCaseCardProps {
  sharedCase: SharedCase;
  delay?: number;
}

const SharedCaseCard = ({ sharedCase, delay = 0 }: SharedCaseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "text-medical-red bg-red-50";
      case "stable":
        return "text-medical-green bg-green-50";
      case "improving":
        return "text-primary bg-blue-50";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-lg">
                {sharedCase.patientName}
                <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(sharedCase.status)}`}>
                  {sharedCase.status}
                </span>
              </CardTitle>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Heart className="mr-1 h-3 w-3 text-medical-red" />
                {sharedCase.condition}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-3 text-sm">
              <p>{sharedCase.notes}</p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Shared by {sharedCase.sharedBy} on {formatDate(sharedCase.sharedOn)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment
          </Button>
          <Button size="sm" className="flex-1 ml-2">
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SharedCaseCard;
