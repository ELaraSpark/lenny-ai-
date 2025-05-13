import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Save, FileText, Clipboard, Eye } from 'lucide-react';

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

const CreateTemplatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Clinical Notes');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      
      toast.success('Template created successfully');
      navigate('/saved-templates');
    } catch (error) {
      toast.error('Failed to create template');
      console.error('Template creation error:', error);
    } finally {
      setIsSubmitting(false);
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
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Create New Template</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a reusable template for your documentation needs
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? <FileText className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {previewMode ? 'Edit Mode' : 'Preview'}
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
                  <Save className="mr-2 h-4 w-4" /> Save Template
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
              {isSubmitting ? 'Saving...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplatePage;
