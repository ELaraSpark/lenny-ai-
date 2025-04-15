import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, X, Loader2, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { MyTemplateItem } from '@/pages/MyTemplates';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UseTemplateDialogProps {
  template: MyTemplateItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const UseTemplateDialog = ({ template, isOpen, onOpenChange }: UseTemplateDialogProps) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && template) {
      setInputText('');
      setOutputText('');
    } else if (!isOpen) {
       setInputText('');
       setOutputText('');
    }
  }, [isOpen, template]);

  const handleCopyToClipboard = () => {
    if (!outputText || outputText === 'Generating output...') {
        toast({ title: "Nothing to Copy", description: "Generate output first.", variant: "destructive" });
        return;
    };
    navigator.clipboard.writeText(outputText);
    toast({ title: "Copied!", description: "Generated output copied to clipboard." });
  };

  const handleGenerateOutput = async () => {
    if (!inputText.trim()) {
      toast({ title: "Input Missing", description: "Please paste the text to transform.", variant: "destructive" });
      return;
    }
    if (!template?.content) {
       toast({ title: "Template Error", description: "Selected template has no content/prompt.", variant: "destructive" });
       return;
    }

    setIsTransforming(true);
    setOutputText('Generating output...');
    console.log("Applying template:", template.name);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      const simulatedOutput = `--- ${template.name} Applied ---\n\nInput Received:\n${inputText.substring(0, 150)}...\n\nGenerated Output based on template instructions:\n(This is simulated output - Replace with actual LLM result)\n${template.content.split('\n')[0]} - Applied.`;
      setOutputText(simulatedOutput);
    } catch (error) {
      console.error("Transformation failed:", error);
      const errorMsg = `Failed to apply template. ${error instanceof Error ? error.message : ''}`;
      setOutputText(`Error: ${errorMsg}`);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Increased width: max-w-6xl. Use h-[90vh] for near full height */}
      <DialogContent className="sm:max-w-6xl p-0 h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b shrink-0"> {/* Header doesn't scroll */}
          <DialogTitle className="text-xl">Use Template: {template?.name}</DialogTitle>
          <DialogDescription>
            Paste your text, apply the template, and copy the generated output.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
        </DialogClose>

        {/* Scrollable main content area takes up remaining space */}
        <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 overflow-y-auto min-h-0"> {/* Added flex-1 and min-h-0 */}
            {/* Input Area */}
            <div className="space-y-2 flex flex-col">
               <Label htmlFor="input-text" className="font-semibold">Input Text</Label>
               <Textarea
                 id="input-text"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Paste your clinical notes or text here..."
                 className="flex-1 resize-none text-sm" // Use flex-1 to grow
                 // Removed fixed rows, rely on flex-1
               />
            </div>

            {/* Output Area */}
            <div className="space-y-2 flex flex-col">
               <Label htmlFor="output-text" className="font-semibold">Generated Output</Label>
               <div className="flex-1 border rounded-md bg-muted/30 p-3 text-sm whitespace-pre-wrap overflow-y-auto relative min-h-[300px]">
                  {isTransforming ? (
                     <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                  ) : (
                     outputText || <span className="text-muted-foreground italic">Output will appear here...</span>
                  )}
               </div>
            </div>
        </div>

        {/* Footer with actions - sticky at the bottom */}
        <DialogFooter className="p-6 pt-4 border-t flex flex-col sm:flex-row sm:justify-between gap-3 shrink-0"> {/* Footer doesn't scroll */}
            <Button
                type="button"
                onClick={handleGenerateOutput}
                disabled={isTransforming || !inputText.trim()}
                className="w-full sm:w-auto order-1 sm:order-none"
                size="lg"
            >
              {isTransforming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isTransforming ? 'Generating...' : 'Apply Template'}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto justify-end order-2 sm:order-none">
                <Button type="button" variant="secondary" onClick={handleCopyToClipboard} disabled={!outputText || isTransforming}>
                   <Copy className="mr-2 h-4 w-4" /> Copy Output
                </Button>
                {/* Removed the DialogClose button from footer */}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UseTemplateDialog;
