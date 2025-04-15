
import { Patient, Call } from "../../types/callTypes";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Keyboard,
  Mic,
  MicOff,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CallInfoPanelProps {
  activeCall: Call;
  isListening: boolean;
  isTakingOver: boolean;
  toggleListening: () => void;
  toggleTakeover: () => void;
  handleEndCall: () => void;
  isRecording?: boolean;
  toggleRecording?: () => void;
}

const CallInfoPanel = ({ 
  activeCall, 
  isListening,
  isTakingOver,
  toggleListening,
  toggleTakeover,
  handleEndCall,
  isRecording,
  toggleRecording
}: CallInfoPanelProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  return (
    <div className="col-span-1 lg:col-span-1 space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Call Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Patient: <strong>{activeCall.patient.name}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date: <strong>{formatDate(activeCall.startTime)}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Time: <strong>{formatTime(activeCall.startTime)}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>Purpose: <strong>{activeCall.purpose}</strong></span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Conditions</h3>
            <div className="flex flex-wrap gap-1">
              {activeCall.conditions.map((condition, index) => (
                <Badge key={index} variant="outline">{condition}</Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Call Controls</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={toggleListening}
              >
                {isListening ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                {isListening ? "Mute Call Audio" : "Listen to Call"}
              </Button>
              
              <Button
                variant={isTakingOver ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={toggleTakeover}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                {isTakingOver ? "Return Control to AI" : "Take Over Call"}
              </Button>
              
              {toggleRecording && (
                <Button
                  variant={isRecording ? "default" : "outline"} 
                  size="sm"
                  className={`justify-start ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              )}
              
              {isRecording && (
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => alert("Call transcript would be downloaded")}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Transcript
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                className="justify-start"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallInfoPanel;
