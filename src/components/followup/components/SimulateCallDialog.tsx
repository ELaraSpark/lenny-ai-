import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActiveCallContext } from "../context/ActiveCallContext";
import { ScheduleFormValues } from "../types/scheduleTypes";

interface SimulateCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ScheduleFormValues;
  patientName: string;
  agentName: string;
}

const SimulateCallDialog = ({ 
  open, 
  onOpenChange, 
  formData,
  patientName,
  agentName
}: SimulateCallDialogProps) => {
  const { startCall } = useActiveCallContext();
  const [isStarting, setIsStarting] = useState(false);
  
  const handleStartSimulation = () => {
    setIsStarting(true);
    
    // Simulate a brief delay before starting
    setTimeout(() => {
      startCall({
        id: `sim-${Date.now()}`,
        patientName,
        agentName,
        purpose: formData.purpose,
        conditions: formData.condition ? [formData.condition] : [],
        duration: 5 // 5 minutes simulation
      });
      
      setIsStarting(false);
      onOpenChange(false);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate Follow-up Call</DialogTitle>
          <DialogDescription>
            This will simulate a real-time follow-up call with {patientName} using the {agentName} AI agent.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4">
            <h4 className="font-medium mb-2">Call Details</h4>
            <p className="text-sm mb-1"><strong>Patient:</strong> {patientName}</p>
            <p className="text-sm mb-1"><strong>Agent:</strong> {agentName}</p>
            <p className="text-sm mb-1"><strong>Purpose:</strong> {formData.purpose}</p>
            <p className="text-sm"><strong>Condition:</strong> {formData.condition}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>This simulation will run for approximately 5 minutes and generate a follow-up report.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleStartSimulation} 
            disabled={isStarting}
          >
            {isStarting ? "Starting..." : "Start Simulation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimulateCallDialog;
