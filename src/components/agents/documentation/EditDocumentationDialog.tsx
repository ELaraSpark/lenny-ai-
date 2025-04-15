
import React, { useState, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AgentDocument, saveDocument } from "../services/documentationService";

interface EditDocumentationDialogProps {
  document: AgentDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (document: AgentDocument) => void;
}

const CATEGORIES = [
  "Clinical Guidelines",
  "Assessment Protocols",
  "Diagnostic Resources",
  "Treatment Resources",
  "Medication Resources",
  "Prevention Resources",
  "General"
];

const EditDocumentationDialog = ({ 
  document, 
  isOpen, 
  onClose,
  onSaved
}: EditDocumentationDialogProps) => {
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [category, setCategory] = useState(document?.category || CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when document changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setCategory(document.category);
    } else {
      setTitle("");
      setContent("");
      setCategory(CATEGORIES[0]);
    }
  }, [document]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!document?.agent_id) {
      toast.error("Agent ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      const updatedDoc = await saveDocument({
        id: document?.id || "",
        agent_id: document.agent_id,
        title,
        content,
        category
      });

      if (updatedDoc) {
        toast.success(`Document ${document?.id ? "updated" : "created"} successfully`);
        onSaved(updatedDoc);
      } else {
        toast.error("Failed to save document");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("An error occurred while saving the document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {document?.id ? "Edit Documentation" : "Add Documentation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Document content"
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentationDialog;
