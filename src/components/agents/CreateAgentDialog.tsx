// Component: CreateAgentDialog
// Purpose: Provides a dialog for creating a new AI agent, either from a template or from scratch.
// Used in: AIAgentsView, MyAgents page.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Added relevant icons for templates
import { PlusCircle, X, Zap, ArrowLeft, Loader2, Bot, Users, Mail, FileText as FileTextIcon, MessageSquareText, CalendarDays, ClipboardEdit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Keep this type, might be used by the 'Start from scratch' flow later
export interface NewAgentData {
  name: string;
  description: string;
  prompt: string;
  avatar?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
interface CreateAgentDialogProps {
  // No props needed now
}

// Example Template Data (Medical Focus)
const agentTemplates = [
    { id: 'soap-note', title: 'SOAP Note Generator', description: 'Generates SOAP notes from consultation transcripts.', icon: ClipboardEdit },
    { id: 'discharge-summary', title: 'Discharge Summary', description: 'Creates patient discharge summaries.', icon: FileTextIcon },
    { id: 'referral-letter', title: 'Referral Letter', description: 'Drafts referral letters to specialists.', icon: Mail },
    { id: 'patient-education', title: 'Patient Education', description: 'Generates patient-friendly explanations.', icon: Users },
    { id: 'lab-result-summary', title: 'Lab Result Summarizer', description: 'Summarizes key lab findings.', icon: MessageSquareText },
    { id: 'appointment-scheduling', title: 'Appointment Scheduler', description: 'Helps coordinate and schedule appointments.', icon: CalendarDays },
];


const CreateAgentDialog = () => { // Removed props
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'options' | 'scratchForm'>('options');
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Keep for potential future use within dialog
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const handleStartFromScratchClick = () => {
    setView('scratchForm');
  };

  const handleBack = () => {
    setView('options');
    setName('');
    setPrompt('');
  };

  // This now navigates instead of creating directly
  const handleSubmitScratch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) {
      toast({ title: "Missing Information", description: "Please provide both an agent name and a task prompt.", variant: "destructive" });
      return;
    }

    // Navigate to the create page, passing data in state
    navigate('/agents/create', { state: { name, prompt } });

    // Reset form and close dialog
    setName('');
    setPrompt('');
    setView('options');
    setIsOpen(false);
  };

   const handleTemplateSelect = (templateId: string) => {
    console.log("Template selected:", templateId);
    const selectedTemplate = agentTemplates.find(t => t.id === templateId);
    // Navigate to create page, passing template info
    navigate('/agents/create', {
        state: {
            name: `New Agent (${selectedTemplate?.title || templateId})`,
            prompt: selectedTemplate?.description || `Based on ${templateId} template`,
            description: selectedTemplate?.description || `Based on ${templateId} template` // Pass description too
        }
    });
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setView('options');
        setName('');
        setPrompt('');
      }, 150);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle size={18} className="mr-2" />
          Create New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4 border-b relative">
           {view === 'scratchForm' && (
             <Button type="button" variant="ghost" size="sm" onClick={handleBack} className="absolute left-4 top-5 text-muted-foreground hover:text-foreground px-2" disabled={isSubmitting}>
               <ArrowLeft className="h-4 w-4 mr-1" /> Back
             </Button>
           )}
          <DialogTitle className={`text-xl ${view === 'scratchForm' ? 'text-center' : ''}`}>
            {view === 'options' ? 'New Agent' : 'Create Agent from Scratch'}
          </DialogTitle>
           {view === 'scratchForm' && (
             <DialogDescription className="text-center pt-1">
               Describe the agent's primary task or goal.
             </DialogDescription>
           )}
        </DialogHeader>
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
        </DialogClose>

        {view === 'options' && (
          <div className="p-6 pt-4 grid gap-6 max-h-[70vh] overflow-y-auto">
              <div
                  className="h-auto p-4 flex items-center justify-start text-left border rounded-lg cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50 bg-card"
                  onClick={handleStartFromScratchClick}
              >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                      <div className="font-semibold">Start from scratch</div>
                      <p className="text-sm text-muted-foreground">Define the agent's task with a simple prompt.</p>
                  </div>
              </div>
              <div>
                  <p className="text-sm text-muted-foreground mb-4">Or choose from our templates:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {agentTemplates.map((template) => (
                          <Card
                              key={template.id}
                              className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
                              onClick={() => handleTemplateSelect(template.id)}
                          >
                              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                                      <template.icon className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <CardTitle className="text-base font-medium">{template.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <CardDescription className="text-xs">{template.description}</CardDescription>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              </div>
              <div className="text-center mt-2">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => alert('See all templates (Not implemented)')}>
                      See all templates
                  </Button>
              </div>
          </div>
        )}

        {view === 'scratchForm' && (
          <form onSubmit={handleSubmitScratch}>
            <div className="p-6 grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agent-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="agent-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Discharge Summary Bot"
                  required
                  disabled={isSubmitting} // Keep disabled state for potential future use
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="agent-prompt" className="text-right pt-2">
                  Task Prompt
                </Label>
                <Textarea
                  id="agent-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="col-span-3"
                  placeholder="Describe what this agent should do..."
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter className="p-6 pt-4 border-t">
              <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              {/* Changed button text to "Next" as it navigates */}
              <Button type="submit" disabled={isSubmitting || !name.trim() || !prompt.trim()}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;
