
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { ScheduleFormValues } from "../types/scheduleTypes";

interface DateTimeSelectProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const DateTimeSelect: React.FC<DateTimeSelectProps> = ({ form }) => {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel htmlFor="followup-date">Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    id="followup-date"
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setDate(date);
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              The date for the follow-up call
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="followup-time">Time</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  id="followup-time"
                  type="time"
                  placeholder="Select a time"
                  autoComplete="off"
                  {...field}
                  className="pl-10"
                />
              </FormControl>
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <FormDescription>
              The time for the follow-up call
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeSelect;
