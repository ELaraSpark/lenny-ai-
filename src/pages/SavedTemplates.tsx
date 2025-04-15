import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import { PlusCircle, FileText, Edit, Trash2, Search } from 'lucide-react'; // Added Search icon

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
];

const SavedTemplates = () => {
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
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Saved Templates</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your saved prompt templates and workflows.
            </p>
          </div>
          <Button>
            <PlusCircle size={18} className="mr-2" />
            Create New Template
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {/* Could add more details here if needed */}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t">
                   <span className="text-xs text-gray-500">Last used: {template.lastUsed}</span>
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
            </p>
            <Button className="mt-4">
              <PlusCircle size={18} className="mr-2" />
              Create Template
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SavedTemplates;
