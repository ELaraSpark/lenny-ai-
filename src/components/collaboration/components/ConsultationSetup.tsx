
import { useState } from "react";
import { Agent } from "../types/consultationTypes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import ColleagueCard from "./ColleagueCard";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { specialists } from "../data/specialistsData";

interface ConsultationSetupProps {
  selectedAgents: Agent[];
  patientSymptoms: string;
  isLoading: boolean;
  isTurnBasedMode: boolean;
  onAgentSelect: (agent: Agent) => void;
  onSymptomsChange: (symptoms: string) => void;
  onStartConsultation: () => void;
  onToggleTurnBasedMode: (enabled: boolean) => void;
}

const ConsultationSetup = ({ 
  selectedAgents, 
  patientSymptoms, 
  isLoading, 
  isTurnBasedMode,
  onAgentSelect, 
  onSymptomsChange, 
  onStartConsultation,
  onToggleTurnBasedMode
}: ConsultationSetupProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleStartConsultation = () => {
    if (selectedAgents.length === 0 || !patientSymptoms.trim()) {
      setShowAlert(true);
      return;
    }
    onStartConsultation();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="h-full card-elevated gradient-card">
          <CardHeader>
            <CardTitle className="gradient-text">Patient Symptoms</CardTitle>
            <CardDescription>
              Describe the patient's symptoms in detail for the specialists to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Example: 55-year-old male experiencing chest pain radiating to the left arm for the past hour, with mild shortness of breath and dizziness. Blood pressure 145/90, pulse 92. No prior cardiac history but does have hypertension."
              className="min-h-[200px] input-gradient"
              value={patientSymptoms}
              onChange={(e) => onSymptomsChange(e.target.value)}
            />
            
            {showAlert && (selectedAgents.length === 0 || !patientSymptoms.trim()) && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing Information</AlertTitle>
                <AlertDescription>
                  {selectedAgents.length === 0 
                    ? "Please select at least one specialist for the consultation." 
                    : "Please describe the patient's symptoms before starting the consultation."}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base">Consultation Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how specialists will contribute to the conversation
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="turn-based"
                    checked={isTurnBasedMode}
                    onCheckedChange={onToggleTurnBasedMode}
                  />
                  <Label htmlFor="turn-based">Turn-based Discussion</Label>
                </div>
              </div>
              
              <div className="text-sm p-4 bg-blue-50 dark:bg-slate-900 rounded-md">
                {isTurnBasedMode ? (
                  <p>
                    <strong>Turn-based mode:</strong> Specialists will respond one-by-one in sequence, allowing each expert to see and
                    respond to previous specialists' opinions. This creates a more structured conversation flow.
                  </p>
                ) : (
                  <p>
                    <strong>Parallel mode:</strong> All specialists will respond simultaneously to your initial description, 
                    providing independent opinions without seeing each other's responses first.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button 
              onClick={handleStartConsultation} 
              disabled={isLoading}
              size="lg"
              className="gradient-btn-blue text-white"
            >
              {isLoading ? "Starting Consultation..." : "Start Consultation"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="md:col-span-1">
        <Card className="h-full card-elevated gradient-card-purple">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="gradient-text">Selected Specialists</CardTitle>
              <CardDescription>
                {selectedAgents.length === 0 
                  ? "Choose which medical specialists to consult" 
                  : `${selectedAgents.length} specialist${selectedAgents.length > 1 ? 's' : ''} selected`}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="ml-2 border-indigo-200 hover:bg-indigo-50">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Specialist
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="gradient-text">Select Medical Specialists</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] mt-4 overflow-y-auto pr-4">
                  <div className="grid grid-cols-1 gap-4">
                    {specialists.map((specialist) => {
                      const isSelected = selectedAgents.some(agent => agent.id === specialist.id);
                      return (
                        <ColleagueCard
                          key={specialist.id}
                          colleague={{
                            id: specialist.id,
                            name: specialist.name,
                            specialty: specialist.specialty,
                            hospital: "AI Medical Center",
                            status: specialist.availability ? "Available" : "Away",
                            avatar: null,
                            availability: specialist.availability
                          }}
                          onClick={() => {
                            onAgentSelect(specialist);
                            // Don't auto-close the dialog so users can select multiple specialists
                          }}
                          isSelected={isSelected}
                        />
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsDialogOpen(false)} className="gradient-btn-purple text-white">
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No specialists selected yet</p>
                <p className="text-sm mt-2">Click "Add Specialist" to select medical experts for this case</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <motion.div layout>
                  {selectedAgents.map((agent) => (
                    <div key={agent.id} className="mb-3">
                      <ColleagueCard
                        colleague={{
                          id: agent.id,
                          name: agent.name,
                          specialty: agent.specialty,
                          hospital: "Medical Center",
                          status: agent.availability ? "Available" : "Away",
                          avatar: null,
                          availability: agent.availability
                        }}
                        onClick={() => onAgentSelect(agent)}
                        isSelected={true}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationSetup;
