
import { useState, useEffect } from "react";
import { Patient, Call } from "../../types/callTypes";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Mic,
  MicOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CallHeaderProps {
  activeCall: Call;
  isListening: boolean;
  toggleListening: () => void;
  handleEndCall: () => void;
  getCallDuration: () => string;
  isRecording?: boolean;
  toggleRecording?: () => void;
}

const CallHeader = ({ 
  activeCall, 
  isListening, 
  toggleListening, 
  handleEndCall, 
  getCallDuration,
  isRecording = true,
  toggleRecording
}: CallHeaderProps) => {
  const [duration, setDuration] = useState("00:00");
  const [blinkStatus, setBlinkStatus] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(getCallDuration());
      // Create a blinking effect for recording
      if (isRecording) {
        setBlinkStatus(prev => !prev);
      } else {
        setBlinkStatus(false);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [getCallDuration, isRecording]);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold flex items-center">
                {activeCall.patient.name}
                <Badge className="ml-2 bg-green-500 text-white">Active Call</Badge>
                {isRecording !== undefined && (
                  <Badge 
                    className={`ml-2 ${isRecording ? 'bg-red-500' : 'bg-gray-400'} text-white ${isRecording && blinkStatus ? 'opacity-100' : 'opacity-80'}`}
                  >
                    {isRecording ? 'Recording' : 'Not Recording'}
                  </Badge>
                )}
              </h2>
              <div className="text-sm text-muted-foreground">
                Call Duration: {duration} | Topic: {activeCall.purpose}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {toggleRecording && (
              <Button
                variant="outline"
                size="sm"
                className={isRecording ? "text-red-500" : ""}
                onClick={toggleRecording}
                title={isRecording ? "Pause recording" : "Resume recording"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                <span className="ml-2 hidden md:inline">
                  {isRecording ? "Pause Recording" : "Record Call"}
                </span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={toggleListening}
              title={isListening ? "Mute call" : "Unmute call"}
            >
              {isListening ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span className="ml-2 hidden md:inline">
                {isListening ? "Mute" : "Listen"}
              </span>
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndCall}
              title="End call"
            >
              <PhoneOff size={16} />
              <span className="ml-2 hidden md:inline">End Call</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallHeader;
