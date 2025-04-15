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
import { X, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { MyTemplateItem } from '@/pages/MyTemplates'; // Import the type

// Define the structure for updated template data
export interface UpdatedTemplateData {
  name: string;
  description: string;
  content?: string;
}

interface EditTemplateDialogProps {
  template: MyTemplateItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateUpdate: (templateId: string, updatedData: UpdatedTemplateData) => void;
}

const EditTemplateDialog = ({ template, isOpen, onOpenChange, onTemplateUpdate }: EditTemplateDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setContent(template.content || '');
    } else {
      setName('');
      setDescription('');
      setContent('');
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || !name.trim() || !description.trim() || !content.trim()) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onTemplateUpdate(template.id, { name, description, content });
      toast({ title: "Success", description: `Template "${name}" updated.` });
      onOpenChange(false); // Close dialog

    } catch (error) {
      console.error("Template update failed:", error);
      toast({ title: "Error", description: `Failed to update template. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Edit Template: {template?.name}</DialogTitle>
          <DialogDescription>
            Update the details for this template.
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
              <Label htmlFor="edit-template-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-template-desc" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="edit-template-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Describe when to use this template..."
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-template-content" className="text-right pt-2">
                Template Content
              </Label>
              <Textarea
                id="edit-template-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 font-mono text-xs" // Smaller font for content
                placeholder="Enter the template text, use {{placeholder}} for variables..."
                rows={8}
                required
                disabled={isSubmitting}
              />
             </div>
           </div>
           <DialogFooter className="p-6 pt-4 border-t">
             {/* Removed DialogClose wrapper from Cancel button */}
             <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>Cancel</Button>
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

export default EditTemplateDialog;
