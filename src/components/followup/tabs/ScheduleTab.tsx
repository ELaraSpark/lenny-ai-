
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarClock, Play } from "lucide-react";

import { ScheduleFormValues } from "../types/scheduleTypes";
import { useQuestionGenerator } from "../hooks/useQuestionGenerator";
import { useActiveCallContext } from "../context/ActiveCallContext";
import { getPatientNameById, getAgentNameById } from "../utils/mockData";
import PatientAgentSelect from "../components/PatientAgentSelect";
import DateTimeSelect from "../components/DateTimeSelect";
import PurposeConditionInputs from "../components/PurposeConditionInputs";
import QuestionsTextarea from "../components/QuestionsTextarea";
import SimulateCallDialog from "../components/SimulateCallDialog";

const ScheduleTab = () => {
  const { toast } = useToast();
  const { activeCall } = useActiveCallContext();
  const [showSimulateDialog, setShowSimulateDialog] = useState(false);
  
  const form = useForm<ScheduleFormValues>({
    defaultValues: {
      patientId: "",
      agentId: "",
      date: undefined,
      time: "",
      purpose: "",
      condition: "",
      questions: "",
    },
  });

  const { isGeneratingQuestions } = useQuestionGenerator(form);

  const onSubmit = (data: ScheduleFormValues) => {
    console.log("Form submitted:", data);
    
    // Here we would typically save this to a database
    // For now, we'll just show a success toast
    toast({
      title: "Follow-up scheduled",
      description: `Follow-up with patient scheduled for ${format(data.date, "PPP")} at ${data.time}`,
    });
    
    // Reset the form
    form.reset();
  };

  const handleSimulateCall = () => {
    const data = form.getValues();
    
    // Basic validation
    if (!data.patientId || !data.agentId || !data.condition) {
      toast({
        title: "Missing information",
        description: "Please fill in patient, agent, and condition fields to simulate a call.",
        variant: "destructive"
      });
      return;
    }
    
    setShowSimulateDialog(true);
  };

  const canSimulate = !activeCall && form.getValues().patientId && form.getValues().agentId;
  const patientName = getPatientNameById(form.watch("patientId"));
  const agentName = getAgentNameById(form.watch("agentId"));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Patient Follow-up</CardTitle>
        <CardDescription>
          Schedule an AI agent to make a follow-up call to a patient and generate a report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PatientAgentSelect form={form} />
            <DateTimeSelect form={form} />
            <PurposeConditionInputs form={form} />
            <QuestionsTextarea 
              form={form} 
              isGeneratingQuestions={isGeneratingQuestions} 
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={handleSimulateCall}
          disabled={!canSimulate}
        >
          <Play className="mr-2 h-4 w-4" />
          Simulate Now
        </Button>
        <Button 
          type="button"
          className="flex-1 sm:flex-none"
          onClick={form.handleSubmit(onSubmit)}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule Follow-up
        </Button>
      </CardFooter>
      
      <SimulateCallDialog
        open={showSimulateDialog}
        onOpenChange={setShowSimulateDialog}
        formData={form.getValues()}
        patientName={patientName}
        agentName={agentName}
      />
    </Card>
  );
};

export default ScheduleTab;
