
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Phone, FileText, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, you'd fetch this from your backend
const mockUpcomingCalls = [
  {
    id: "call1",
    patientId: "p1",
    patientName: "Jane Doe",
    agentId: "cardio",
    agentName: "CardioAssist",
    date: new Date(Date.now() + 86400000), // tomorrow
    time: "10:00",
    purpose: "Post-surgery check-in",
    questions: "How are you feeling after surgery? Any pain or discomfort? Have you been taking your medication as prescribed?",
    status: "scheduled",
  },
  {
    id: "call2",
    patientId: "p2",
    patientName: "John Smith",
    agentId: "neuro",
    agentName: "NeuroLogic",
    date: new Date(Date.now() + 172800000), // day after tomorrow
    time: "14:30",
    purpose: "Medication follow-up",
    questions: "Any side effects from the new medication? Has your headache frequency decreased? Are you experiencing any new symptoms?",
    status: "scheduled",
  },
  {
    id: "call3",
    patientId: "p3",
    patientName: "Maria Garcia",
    agentId: "gen",
    agentName: "GeneralMD",
    date: new Date(Date.now() + 259200000), // three days from now
    time: "11:15",
    purpose: "General wellness check",
    questions: "How have you been sleeping? Any changes in appetite? Have you been able to maintain your exercise routine?",
    status: "scheduled",
  },
];

const UpcomingTab = () => {
  const [upcomingCalls, setUpcomingCalls] = useState(mockUpcomingCalls);
  const { toast } = useToast();

  const handleCancelCall = (callId: string) => {
    setUpcomingCalls(upcomingCalls.filter(call => call.id !== callId));
    toast({
      title: "Follow-up cancelled",
      description: "The follow-up call has been cancelled successfully",
    });
  };

  const handleReschedule = (callId: string) => {
    // In a real app, this would open a reschedule form
    toast({
      title: "Reschedule functionality",
      description: "This would open a form to reschedule the call",
    });
  };

  return (
    <div className="space-y-6">
      {upcomingCalls.length > 0 ? (
        upcomingCalls.map((call) => (
          <Card key={call.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{call.patientName}</CardTitle>
                  <CardDescription>
                    Follow-up by {call.agentName}
                  </CardDescription>
                </div>
                <Badge>{call.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(call.date, "PPP")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{call.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Call ID: {call.id}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Purpose</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {call.purpose}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-1">
                        <FileText className="mr-2 h-4 w-4" />
                        View Questions
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Follow-up Questions</DialogTitle>
                        <DialogDescription>
                          Questions for {call.patientName}'s follow-up call on {format(call.date, "PPP")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm">{call.questions}</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" type="button">
                          Close
                        </Button>
                        <Button type="button">
                          Edit Questions
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleReschedule(call.id)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleCancelCall(call.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No upcoming follow-up calls scheduled</p>
            <Button className="mt-4" variant="outline">
              Schedule a Follow-up
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpcomingTab;
