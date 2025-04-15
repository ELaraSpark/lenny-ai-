
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const newConsultationSchema = z.object({
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string().min(1, { message: "Please select a time." }),
  consultationType: z.string().min(1, { message: "Please select a consultation type." }),
  notes: z.string().optional(),
});

export type NewConsultationFormValues = z.infer<typeof newConsultationSchema>;

interface NewConsultationFormProps {
  onSubmit: (data: NewConsultationFormValues) => void;
  onCancel: () => void;
}

const NewConsultationForm = ({ onSubmit, onCancel }: NewConsultationFormProps) => {
  const form = useForm<NewConsultationFormValues>({
    resolver: zodResolver(newConsultationSchema),
    defaultValues: {
      date: "",
      time: "",
      consultationType: "in-person",
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="consultation-form">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="consultation-date">Date</FormLabel>
              <FormControl>
                <Input 
                  id="consultation-date" 
                  type="date"
                  autoComplete="off"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="consultation-time">Time</FormLabel>
              <FormControl>
                <Input 
                  id="consultation-time" 
                  type="time" 
                  autoComplete="off"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="consultationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="consultation-type">Consultation Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger id="consultation-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="consultation-notes">Notes</FormLabel>
              <FormControl>
                <Textarea 
                  id="consultation-notes"
                  placeholder="Any specifics about the consultation"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            id="cancel-consultation"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            id="schedule-consultation"
          >
            Schedule Consultation
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewConsultationForm;
