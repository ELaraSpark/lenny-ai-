
import { 
  Form, 
  FormField, 
  FormItem, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

// Re-use the schema from the parent component
const expertFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().min(1, "Color is required"),
  capabilities: z.array(z.string()).min(1, "At least one capability is required")
});

type ExpertFormValues = z.infer<typeof expertFormSchema>;

interface CapabilitiesTabProps {
  form: UseFormReturn<ExpertFormValues>;
}

const CapabilitiesTab = ({ form }: CapabilitiesTabProps) => {
  const handleAddNewCapability = () => {
    const currentCapabilities = form.getValues().capabilities || [];
    form.setValue("capabilities", [...currentCapabilities, ""]);
  };

  const handleRemoveCapability = (index: number) => {
    const currentCapabilities = form.getValues().capabilities;
    form.setValue("capabilities", currentCapabilities.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capabilities</CardTitle>
        <CardDescription>Define what the AI expert is capable of</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            {form.getValues().capabilities?.map((capability, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`capabilities.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder={`Capability ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRemoveCapability(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={handleAddNewCapability}>
              <Plus className="h-4 w-4 mr-2" /> Add Capability
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CapabilitiesTab;
