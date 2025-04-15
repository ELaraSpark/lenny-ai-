
import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Meeting } from "../types/collaborationTypes";

interface MeetingCardProps {
  meeting: Meeting;
  delay?: number;
  compact?: boolean;
}

const MeetingCard = ({ meeting, delay = 0, compact = false }: MeetingCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <Card className="overflow-hidden">
          <div className="flex items-center p-4 gap-3">
            <div className="bg-primary/10 p-3 rounded-md">
              {meeting.virtual ? (
                <Video className="h-5 w-5 text-primary" />
              ) : (
                <Users className="h-5 w-5 text-primary" />
              )}
            </div>
            
            <div className="flex-grow">
              <h4 className="font-medium text-sm">{meeting.title}</h4>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                {formatDate(meeting.date)}
                <Clock className="h-3 w-3 ml-1" />
                {formatTime(meeting.date)}
              </div>
            </div>
            
            <Button size="sm">Join</Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>{meeting.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-1">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {formatDate(meeting.date)}
              <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
              {formatTime(meeting.date)} ({meeting.duration} min)
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-secondary rounded-md p-2 mr-3">
                {meeting.virtual ? (
                  <Video className="h-4 w-4 text-blue-500" />
                ) : (
                  <Users className="h-4 w-4 text-purple-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{meeting.location}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-secondary rounded-md p-2 mr-3">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Participants</p>
                <p className="text-sm text-muted-foreground">
                  {meeting.participants.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm">Reschedule</Button>
          <Button size="sm">Join Meeting</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MeetingCard;
