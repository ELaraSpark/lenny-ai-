
import { useState } from "react";
import { AgentDocument } from "@/components/agents/services/documentationService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import EditDocumentationDialog from "@/components/agents/documentation/EditDocumentationDialog";

interface DocumentationTabProps {
  isLoading: boolean;
  documentation: AgentDocument[];
  agentId: string | undefined;
  onDocumentSaved: (document: AgentDocument) => void;
}

const DocumentationTab = ({ 
  isLoading, 
  documentation, 
  agentId,
  onDocumentSaved 
}: DocumentationTabProps) => {
  const [isEditDocDialogOpen, setIsEditDocDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AgentDocument | null>(null);

  const handleNewDocument = () => {
    if (!agentId) return;
    
    const newDoc: AgentDocument = {
      id: "",
      agent_id: agentId,
      title: "New Document",
      content: "",
      category: "General"
    };
    
    setSelectedDocument(newDoc);
    setIsEditDocDialogOpen(true);
  };

  const handleEditDocument = (docId: string) => {
    const document = documentation.find(doc => doc.id === docId);
    if (document) {
      setSelectedDocument(document);
      setIsEditDocDialogOpen(true);
    }
  };

  const handleDocumentSaved = (document: AgentDocument) => {
    onDocumentSaved(document);
    setIsEditDocDialogOpen(false);
    setSelectedDocument(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Manage knowledge documents for this AI expert</CardDescription>
          </div>
          <Button onClick={handleNewDocument}>
            <Plus className="mr-2 h-4 w-4" /> Add Document
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading documentation...</p>
          ) : documentation.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No documentation available</p>
              <Button className="mt-4" onClick={handleNewDocument}>
                <Plus className="mr-2 h-4 w-4" /> Create First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documentation.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">{doc.category}</Badge>
                      </div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditDocument(doc.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Edit Dialog */}
      <EditDocumentationDialog
        document={selectedDocument}
        isOpen={isEditDocDialogOpen}
        onClose={() => {
          setIsEditDocDialogOpen(false);
          setSelectedDocument(null);
        }}
        onSaved={handleDocumentSaved}
      />
    </>
  );
};

export default DocumentationTab;
