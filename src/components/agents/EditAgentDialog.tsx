import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from 'lucide-react'; // Removed Edit icon as it's not used here
import { useToast } from "@/hooks/use-toast";
import { MyAgentItem } from '@/pages/MyAgents';

// Define the structure for updated agent data - Exported
export interface UpdatedAgentData {
  name: string;
  description: string;
  // Add other editable fields like avatar, prompt later if needed
}

interface EditAgentDialogProps {
  agent: MyAgentItem | null; // Agent data to edit
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentUpdate: (agentId: string, updatedData: UpdatedAgentData) => void; // Callback to update agent
}

const EditAgentDialog = ({ agent, isOpen, onOpenChange, onAgentUpdate }: EditAgentDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Pre-fill form when agent data changes (dialog opens)
  useEffect(() => {
    if (agent && isOpen) { // Only update state if dialog is open and agent exists
      setName(agent.name);
      setDescription(agent.description);
    }
    // No need to reset here, handled by onOpenChange if desired
  }, [agent, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !name.trim() || !description.trim()) {
      toast({ title: "Missing Information", description: "Please provide both a name and description.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onAgentUpdate(agent.id, { name, description });
      toast({ title: "Success", description: `Agent "${name}" updated.` });
      onOpenChange(false); // Close dialog

    } catch (error) {
      console.error("Agent update failed:", error);
      toast({ title: "Error", description: `Failed to update agent. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state when dialog is closed externally
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        // Reset form fields when closing
        setName('');
        setDescription('');
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Edit Agent: {agent?.name}</DialogTitle>
          <DialogDescription>
            Update the details for this agent.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
        </DialogClose>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-agent-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-agent-desc" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="edit-agent-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe the agent's function..."
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Add other fields like avatar or prompt editing later */}
          </div>
          <DialogFooter className="p-6 pt-4 border-t">
             {/* Removed DialogClose wrapper from Cancel button */}
             <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => handleOpenChange(false)}>Cancel</Button>
             <Button type="submit" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Save Changes
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentDialog;
