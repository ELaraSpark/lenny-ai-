
import { motion } from "framer-motion";
import { MessageSquare, Video } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Colleague } from "../types/collaborationTypes";

interface ColleagueCardProps {
  colleague: Colleague;
  delay?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const ColleagueCard = ({ colleague, delay = 0, onClick, isSelected }: ColleagueCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "text-medical-green bg-green-50";
      case "away":
        return "text-amber-500 bg-amber-50";
      case "in a meeting":
        return "text-blue-500 bg-blue-50";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
    >
      <Card className={`hover:shadow-md transition-shadow ${isSelected ? "border-medical-green" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={colleague.avatar || `/avatar-placeholder.jpg`} />
                <AvatarFallback className="bg-secondary">
                  {colleague.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-base">{colleague.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {colleague.specialty} • {colleague.hospital}
                </p>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(colleague.status)}`}>
              {colleague.status}
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button size="sm" className="flex-1 ml-2">
            <Video className="mr-2 h-4 w-4" />
            Call
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ColleagueCard;
