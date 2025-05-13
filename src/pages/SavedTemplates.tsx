import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import { PlusCircle, FileText, Edit, Trash2, Search, ArrowLeft, SlidersHorizontal } from 'lucide-react';

// Example data structure
interface SavedTemplateItem {
  id: string;
  name: string;
  description: string;
  lastUsed: string;
}

const exampleTemplates: SavedTemplateItem[] = [
  { id: '1', name: 'SOAP Note Generator', description: 'Generates a SOAP note based on consultation transcript.', lastUsed: '2h ago' },
  { id: '2', name: 'Discharge Summary Template', description: 'Standard template for patient discharge summaries.', lastUsed: 'Yesterday' },
  { id: '3', name: 'Referral Letter - Cardiology', description: 'Template for referring patients to cardiology.', lastUsed: '3 days ago' },
  { id: '4', name: 'Pre-Op Checklist Prompt', description: 'Generates checklist items for pre-operative planning.', lastUsed: '1 week ago' },
  { id: '5', name: 'Progress Note Template', description: 'Daily progress note format for inpatient care.', lastUsed: '2 weeks ago' },
  { id: '6', name: 'Medication Reconciliation', description: 'Structured template for medication reconciliation.', lastUsed: '3 weeks ago' },
  { id: '7', name: 'Clinical Handover Template', description: 'Standardized format for shift handovers.', lastUsed: '1 month ago' },
  { id: '8', name: 'Patient Education Template', description: 'Format for creating patient education materials.', lastUsed: '1 month ago' },
  { id: '9', name: 'Post-Op Follow-up Note', description: 'Template for post-operative follow-up visits.', lastUsed: '2 months ago' },
  { id: '10', name: 'Radiology Order Template', description: 'Structured template for radiology study orders.', lastUsed: '2 months ago' },
  { id: '11', name: 'Mental Health Assessment', description: 'Comprehensive mental health evaluation form.', lastUsed: '3 months ago' },
  { id: '12', name: 'Medical Necessity Letter', description: 'Template for insurance authorization requests.', lastUsed: '3 months ago' },
];

const SavedTemplates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter templates based on search term
  const filteredTemplates = exampleTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Placeholder action handlers
  const handleEditTemplate = (templateId: string) => {
    console.log("Edit template:", templateId);
    alert(`Edit template ${templateId}? (Not implemented)`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log("Delete template:", templateId);
    alert(`Delete template ${templateId}? (Not implemented)`);
  };  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/my-templates')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Smart Notes
          </Button>
        </div>
      </header>
      
      {/* Main content */}      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">All Templates</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and manage your complete collection of templates.
            </p>
          </div>          <Button onClick={() => navigate('/templates/create')}>
            <PlusCircle size={18} className="mr-2" />
            Create New Template
          </Button>
        </div>        {/* Search Bar */}
        <div className="flex justify-between items-center mb-8 w-full">
          <div className="relative max-w-md w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-10 border-primary/20 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal size={16} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Latest
            </Button>
          </div>
        </div>        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (              <Card key={template.id} className="flex flex-col hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 mr-3">
                        <FileText className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 py-2">
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    {/* Preview of template structure */}
                    <p className="line-clamp-3">Template structure: Header, Patient Info, Assessment, Plan, Follow-up...</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t">
                   <span className="text-xs text-muted-foreground">Last used: {template.lastUsed}</span>
                   <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                         <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTemplate(template.id)}>
                         <Trash2 size={16} />
                      </Button>
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Matching Templates Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or create a new template.
            </p>            <Button className="mt-4" onClick={() => navigate('/templates/create')}>
              <PlusCircle size={18} className="mr-2" />
              Create Template            </Button>
          </div>
        )}
        
        {/* Section dividers - Add more sections for different categories */}
        <div className="mt-16 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Recently Used Templates</h2>
          <p className="text-sm text-muted-foreground">Templates you've accessed in the last 30 days</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {exampleTemplates.slice(0, 4).map((template) => (
              <Card key={`recent-${template.id}`} className="flex flex-col hover:shadow-md transition-all duration-200 border-2 hover:border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 mr-3">
                        <FileText className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 py-2">
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    <p className="line-clamp-3">Template structure: Header, Patient Info, Assessment, Plan, Follow-up...</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xs text-muted-foreground">Last used: {template.lastUsed}</span>
                  <Button variant="outline" size="sm">Use</Button>
                </CardFooter>
              </Card>            ))}
          </div>
        </div>
        
        {/* Featured Templates Section */}
        <div className="mt-16 mb-12 bg-gradient-to-r from-primary/5 to-transparent p-8 rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-2">Featured Templates</h2>
          <p className="text-sm text-muted-foreground mb-6">Curated templates to enhance your workflow</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Template 1 */}
            <div className="bg-background rounded-lg shadow-sm border-2 border-primary/20 p-6 flex gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">Complete Medical Documentation Suite</h3>
                <p className="text-sm text-muted-foreground mb-3">A comprehensive set of templates for all your documentation needs</p>
                <div className="flex gap-3">
                  <Button size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </div>
            </div>
            
            {/* Featured Template 2 */}
            <div className="bg-background rounded-lg shadow-sm border-2 border-primary/20 p-6 flex gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">Specialty-Specific Templates</h3>
                <p className="text-sm text-muted-foreground mb-3">Templates tailored for different medical specialties</p>
                <div className="flex gap-3">
                  <Button size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedTemplates;
