
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useActiveCallContext } from "../context/ActiveCallContext";
import { useToast } from "@/hooks/use-toast";

export const SidebarLiveCallIndicator = () => {
  const { activeCall } = useActiveCallContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState("00:00");
  
  // Calculate and update call duration
  useEffect(() => {
    if (!activeCall) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - activeCall.startTime.getTime()) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setCallDuration(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeCall]);
  
  if (!activeCall) return null;
  
  const goToLiveCall = () => {
    navigate("/followup-monitoring");
    toast({
      title: "Monitoring live call",
      description: `Now monitoring call with ${activeCall.patient.name}`
    });
  };
  
  return (
    <div 
      onClick={goToLiveCall}
      className="flex items-center gap-2 px-3 py-2 mx-2 mb-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-md cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
    >
      <div className="relative">
        <Phone className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">
          Live call: {activeCall.patient.name}
        </p>
        <div className="flex items-center text-xs">
          <Badge variant="outline" className="h-4 text-[10px] bg-transparent border-amber-300 dark:border-amber-700">
            {callDuration}
          </Badge>
        </div>
      </div>
      <Monitor className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
    </div>
  );
};
