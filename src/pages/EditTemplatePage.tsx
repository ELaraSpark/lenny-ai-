import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Save, FileText, Clipboard, Eye, Trash2 } from 'lucide-react';

// Template categories for the dropdown
const templateCategories = [
  'Clinical Notes',
  'Reports',
  'Referrals',
  'Forms',
  'Letters',
  'Educational',
  'Other'
];

// Mock template data (in a real app, this would be fetched from an API)
const templateData = {
  'tpl1': { 
    title: 'SOAP Note Template', 
    category: 'Clinical Notes',
    content: `<h3>Subjective:</h3>
Chief Complaint: 
History of Present Illness:
Past Medical History:
Medications:
Allergies:
Social History:

<h3>Objective:</h3>
Vital Signs:
Physical Examination:
Lab Results:

<h3>Assessment:</h3>
Primary Diagnosis:
Differential Diagnoses:

<h3>Plan:</h3>
Treatment:
Medications:
Follow-up:`
  },
  'tpl2': {
    title: 'Discharge Summary Template',
    category: 'Reports',
    content: `<h3>Discharge Summary</h3>

<h4>Patient Information:</h4>
Name: [Patient Name]
DOB: [Date of Birth]
MRN: [Medical Record Number]

<h4>Admission Details:</h4>
Date of Admission: 
Date of Discharge:
Admitting Diagnosis:
Discharge Diagnosis:

<h4>Hospital Course:</h4>
[Describe the patient's hospital stay, treatments, procedures, and response]

<h4>Discharge Medications:</h4>
[List all medications, dosages, and instructions]

<h4>Follow-up Instructions:</h4>
[Appointments, care instructions, activity restrictions]

<h4>Physician Signature:</h4>
[Name and credentials]`
  }
};

const EditTemplatePage = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, fetch from an API
        const template = templateData[templateId as keyof typeof templateData];
        
        if (template) {
          setTitle(template.title);
          setCategory(template.category);
          setContent(template.content);
        } else {
          toast.error('Template not found');
          navigate('/saved-templates');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Failed to load template');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTemplate();
  }, [templateId, navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a template title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter template content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate saving the template
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Template updated successfully');
      navigate('/saved-templates');
    } catch (error) {
      toast.error('Failed to update template');
      console.error('Template update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle template deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Template deleted successfully');
      navigate('/saved-templates');
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Template deletion error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/saved-templates')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Templates
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading template...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Edit Template</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your template content and settings
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button 
                  type="submit" 
                  form="template-form" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <form id="template-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left column - Template settings */}
                <div className="col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Template Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter a descriptive title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {templateCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-medium mb-2">Template Tips</h3>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Use HTML tags for formatting</li>
                            <li>• Include placeholders with [brackets]</li>
                            <li>• Structure content with headers (h3, h4)</li>
                            <li>• Include instructions in italics if needed</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right column - Content editor */}
                <div className="col-span-1 md:col-span-3">
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <Tabs defaultValue="editor" className="h-full">
                        <TabsList className="w-full border-b rounded-none px-4">
                          <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
                          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="editor" className="p-4 mt-0">
                          <Textarea 
                            className="min-h-[500px] font-mono text-sm resize-none"
                            placeholder="Enter your template content here. Use HTML tags for formatting if needed."
                            value={content}
                            onChange={(e) => setContent(e.target.value)} 
                          />
                        </TabsContent>
                        <TabsContent value="preview" className="p-4 mt-0">
                          <div className="border rounded-md p-4 min-h-[500px] prose prose-sm max-w-none">
                            {content ? (
                              <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                              <p className="text-muted-foreground italic">Preview will appear here...</p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/saved-templates')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditTemplatePage;
