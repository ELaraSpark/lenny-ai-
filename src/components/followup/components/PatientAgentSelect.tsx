
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "../types/scheduleTypes";
import { mockPatients, mockAgents } from "../utils/mockData";

interface PatientAgentSelectProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const PatientAgentSelect: React.FC<PatientAgentSelectProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="patientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="select-patient">Patient</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger id="select-patient">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.age}, {patient.gender})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the patient for the follow-up call
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="select-agent">AI Agent</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger id="select-agent">
                  <SelectValue placeholder="Select an AI agent" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.specialty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the AI agent to conduct the follow-up
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PatientAgentSelect;
