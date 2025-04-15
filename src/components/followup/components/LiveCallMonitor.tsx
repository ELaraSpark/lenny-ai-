
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useActiveCallContext } from "../context/ActiveCallContext";
import CallHeader from "./call-monitor/CallHeader";
import ConversationPanel from "./call-monitor/ConversationPanel";
import CallInfoPanel from "./call-monitor/CallInfoPanel";
import { useConversationState } from "../hooks/useConversationState";

const LiveCallMonitor = () => {
  const { activeCall, endCall } = useActiveCallContext();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(true);
  
  // Use our custom hook for conversation state management
  const {
    message,
    setMessage,
    isListening,
    isTakingOver,
    conversation,
    editingQuestion,
    modifiedQuestion,
    setModifiedQuestion,
    sendMessage,
    toggleListening,
    toggleTakeover,
    startEditQuestion,
    saveEditedQuestion,
    cancelEditing,
    formatTime
  } = useConversationState({
    patientName: activeCall?.patient.name || "",
    agentName: activeCall?.agentName || ""
  });

  // Calculate duration of the call
  const getCallDuration = () => {
    if (!activeCall) return "00:00";
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - activeCall.startTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Load monitoring settings
  useEffect(() => {
    // This would typically be loaded from an API or state management
    // For now we're using default values that match the settings form
    const loadSettings = () => {
      // Default to true for now - in a real app this would be loaded from storage/API
      setIsRecording(true);
    };
    
    loadSettings();
  }, []);

  // Toggle call recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording paused" : "Recording resumed",
      description: isRecording 
        ? "Call recording has been paused" 
        : "Call recording has been resumed",
    });
  };

  // End the call
  const handleEndCall = () => {
    if (window.confirm("Are you sure you want to end this call?")) {
      endCall();
      toast({
        title: "Call ended",
        description: "The follow-up call has been terminated"
      });
    }
  };

  if (!activeCall) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <CallHeader 
        activeCall={activeCall}
        isListening={isListening}
        toggleListening={toggleListening}
        handleEndCall={handleEndCall}
        getCallDuration={getCallDuration}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ConversationPanel 
          activeCall={activeCall}
          conversation={conversation}
          message={message}
          setMessage={setMessage}
          isTakingOver={isTakingOver}
          toggleTakeover={toggleTakeover}
          sendMessage={sendMessage}
          editingQuestion={editingQuestion}
          modifiedQuestion={modifiedQuestion}
          setModifiedQuestion={setModifiedQuestion}
          startEditQuestion={startEditQuestion}
          saveEditedQuestion={saveEditedQuestion}
          cancelEditing={cancelEditing}
          formatTime={formatTime}
        />

        <CallInfoPanel 
          activeCall={activeCall}
          isListening={isListening}
          isTakingOver={isTakingOver}
          toggleListening={toggleListening}
          toggleTakeover={toggleTakeover}
          handleEndCall={handleEndCall}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
        />
      </div>
    </motion.div>
  );
};

export default LiveCallMonitor;
