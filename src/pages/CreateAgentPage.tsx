import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Wand2, FlaskConical, CheckCircle } from 'lucide-react'; // Added icons
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator'; // Added Separator
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert

type Step = 'initial' | 'refine' | 'test' | 'generate';

const CreateAgentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialState = location.state as { name?: string; prompt?: string } || {};
  const [agentName, setAgentName] = useState(initialState.name || 'New Agent');
  const [initialPrompt, setInitialPrompt] = useState(initialState.prompt || '');
  const [refinedPrompt, setRefinedPrompt] = useState(initialState.prompt || ''); // Start with initial
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testInput, setTestInput] = useState(''); // State for test input
  const [testOutput, setTestOutput] = useState(''); // State for simulated test output

  // Handler for moving from initial prompt to refinement
  const handleAnalyzePrompt = () => {
    if (!agentName.trim() || !initialPrompt.trim()) {
      toast({ title: "Missing Information", description: "Agent name and initial prompt are required.", variant: "destructive" });
      return;
    }
    setRefinedPrompt(initialPrompt); // Initialize refined prompt
    setCurrentStep('refine');
  };

  // Handler for moving from refinement to test
  const handleTestPrompt = () => {
     if (!refinedPrompt.trim()) {
      toast({ title: "Missing Information", description: "Refined prompt cannot be empty.", variant: "destructive" });
      return;
    }
    setCurrentStep('test');
    setTestInput(''); // Clear previous test input/output
    setTestOutput('');
  };

  // Simulate running a test
  const handleRunTest = () => {
    if (!testInput.trim()) {
        setTestOutput('Please provide some test input.');
        return;
    }
    setTestOutput(`Simulating output for "${testInput}" based on prompt: "${refinedPrompt}"`);
    // In reality, this might call a lightweight backend endpoint
  };

  // Final generation handler
  const handleGenerateAgent = async () => {
    setIsGenerating(true);
    console.log("Triggering agent generation for:", { name: agentName, prompt: refinedPrompt });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({ title: "Success", description: `Agent "${agentName}" generation initiated.` });
      navigate('/my-agents');
    } catch (error) {
      console.error("Agent generation failed:", error);
      toast({ title: "Error", description: `Failed to initiate agent generation. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    // <AppLayout> // Removed AppLayout wrapper
      <div className="p-4 sm:p-6 lg:p-8">
         <Button variant="ghost" onClick={() => navigate('/my-agents')} className="mb-4 text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Agents
         </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Agent</CardTitle>
            {currentStep === 'initial' && <CardDescription>Start by giving your agent a name and describing its main task.</CardDescription>}
            {currentStep === 'refine' && <CardDescription>Review the initial prompt and add details or clarifications.</CardDescription>}
            {currentStep === 'test' && <CardDescription>Test your agent's prompt with sample inputs.</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Step 1: Initial Prompt */}
            {currentStep === 'initial' && (
              <div className="space-y-4">
                 <div>
                    <Label htmlFor="agent-page-name">Agent Name</Label>
                    <Input id="agent-page-name" value={agentName} onChange={(e) => setAgentName(e.target.value)} className="mt-1" />
                 </div>
                 <div>
                    <Label htmlFor="agent-page-prompt">Task Prompt</Label>
                    <Textarea id="agent-page-prompt" value={initialPrompt} onChange={(e) => setInitialPrompt(e.target.value)} className="mt-1" rows={6} placeholder="Describe what this agent should do..." />
                 </div>
                 <div className="flex justify-end pt-2">
                    <Button onClick={handleAnalyzePrompt} disabled={!agentName.trim() || !initialPrompt.trim()}>
                        Next: Refine Prompt <Wand2 className="ml-2 h-4 w-4" />
                    </Button>
                 </div>
              </div>
            )}

            {/* Step 2: Refinement */}
            {currentStep === 'refine' && (
               <div className="space-y-4">
                  <div>
                    <Label>Initial Prompt</Label>
                    <p className="text-sm p-3 bg-muted/50 rounded-md border mt-1">{initialPrompt}</p>
                  </div>
                  <Alert variant="default">
                     <FlaskConical className="h-4 w-4" />
                     <AlertTitle>Refinement Suggestions (Placeholder)</AlertTitle>
                     <AlertDescription className="text-xs space-y-1">
                        <li>Consider specifying the desired output format.</li>
                        <li>Should the agent ask clarifying questions?</li>
                        <li>Are there specific knowledge sources it should use or avoid?</li>
                     </AlertDescription>
                  </Alert>
                  <div>
                    <Label htmlFor="agent-refined-prompt">Refined Prompt</Label>
                    <Textarea id="agent-refined-prompt" value={refinedPrompt} onChange={(e) => setRefinedPrompt(e.target.value)} className="mt-1" rows={8} />
                  </div>
                  <div className="flex justify-between pt-2">
                     <Button variant="outline" onClick={() => setCurrentStep('initial')}>Back</Button>
                     <Button onClick={handleTestPrompt} disabled={!refinedPrompt.trim()}>
                        Next: Test Agent <FlaskConical className="ml-2 h-4 w-4" />
                     </Button>
                  </div>
               </div>
            )}

            {/* Step 3: Testing */}
            {currentStep === 'test' && (
                <div className="space-y-4">
                    <div>
                        <Label>Current Prompt</Label>
                        <p className="text-sm p-3 bg-muted/50 rounded-md border mt-1">{refinedPrompt}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="test-input">Test Input</Label>
                        <Textarea id="test-input" value={testInput} onChange={(e) => setTestInput(e.target.value)} placeholder="Enter sample input here..." rows={3} />
                        <Button onClick={handleRunTest} size="sm">Run Test</Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Simulated Output</Label>
                        <div className="p-3 border rounded-md bg-card min-h-[60px] text-sm text-muted-foreground whitespace-pre-wrap">
                            {testOutput || "Output will appear here..."}
                        </div>
                    </div>
                     <div className="flex justify-between pt-2">
                         <Button variant="outline" onClick={() => setCurrentStep('refine')}>Back</Button>
                         <Button onClick={handleGenerateAgent} disabled={isGenerating}>
                           {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           {isGenerating ? 'Generating...' : 'Generate Agent via n8n'} <CheckCircle className="ml-2 h-4 w-4" />
                         </Button>
                     </div>
                </div>
            )}

          </CardContent>
        </Card>
      </div>
    // </AppLayout> // Removed AppLayout wrapper
  );
};

export default CreateAgentPage;
