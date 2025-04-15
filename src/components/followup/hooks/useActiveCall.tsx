
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import { addFollowUpNotification } from "@/components/layout/NotificationsList";
import { Call, Patient } from "../types/callTypes";

// This hook manages the state of an active call
export const useActiveCall = () => {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const { toast } = useToast();

  const startCall = (callData: {
    id: string;
    patientName: string;
    agentName: string;
    purpose?: string;
    conditions?: string[];
    duration?: number;
  }) => {
    // Create a patient object from the patient name
    const patient: Patient = {
      id: `pat-${Date.now()}`,
      name: callData.patientName,
      age: 0, // Default value
      gender: "", // Default value
      conditions: callData.conditions || []
    };
    
    // Create a call object that matches the Call interface
    const newActiveCall: Call = {
      id: callData.id,
      patient: patient,
      startTime: new Date(),
      purpose: callData.purpose || "Follow-up call",
      conditions: callData.conditions || [],
      agentName: callData.agentName,
      duration: callData.duration || 5 // Default to 5 minutes if not specified
    };
    
    setActiveCall(newActiveCall);
    
    // Show toast notification
    toast({
      title: "Call started",
      description: `Follow-up call with ${callData.patientName} has started`,
    });
    
    // Add to notifications
    addFollowUpNotification({
      title: "Follow-up call started",
      description: `AI agent ${callData.agentName} is conducting a follow-up with ${callData.patientName}`,
      icon: <Phone className="h-4 w-4 text-green-500" />
    });

    // Return a cleanup function
    return () => endCall();
  };

  const endCall = () => {
    if (activeCall) {
      toast({
        title: "Call ended",
        description: `Call with ${activeCall.patient.name} has ended`,
      });
      
      // Add to notifications
      addFollowUpNotification({
        title: "Follow-up call completed",
        description: `AI agent ${activeCall.agentName} has completed the follow-up with ${activeCall.patient.name}`,
        icon: <Phone className="h-4 w-4 text-blue-500" />
      });
      
      setActiveCall(null);
    }
  };

  return {
    activeCall,
    startCall,
    endCall,
  };
};
