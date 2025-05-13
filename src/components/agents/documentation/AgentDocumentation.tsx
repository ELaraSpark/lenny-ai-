
// Component: AgentDocumentation
// Purpose: Displays documentation and reference materials for a specific AI agent.
// Used in: AgentProfile.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Bookmark, ChevronRight, Edit, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AgentDocument, getAgentDocumentation } from "../services/documentationService";
import EditDocumentationDialog from "./EditDocumentationDialog";
import { Agent } from "../types/agentTypes";
import { cn } from "@/lib/utils";

interface AgentDocumentationProps {
  agent: Agent;
  onScheduleConsultation?: () => void;
}

const AgentDocumentation = ({ agent, onScheduleConsultation }: AgentDocumentationProps) => {
  const [documents, setDocuments] = useState<AgentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<AgentDocument | null>(null);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("clinical");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<AgentDocument | null>(null);
  
  const categoryTabs = {
    "clinical": ["Clinical Guidelines", "Assessment Protocols"],
    "diagnostic": ["Diagnostic Resources"],
    "treatment": ["Treatment Resources", "Medication Resources", "Prevention Resources"]
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getAgentDocumentation(agent.id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documentation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [agent.id]);
  
  const openDocument = (doc: AgentDocument) => {
    setSelectedDocument(doc);
    setIsDocumentOpen(true);
  };
  
  const getCategoryDocuments = (categories: string[]) => {
    return documents.filter(doc => categories.includes(doc.category));
  };

  const handleEditDocument = (doc: AgentDocument) => {
    setDocumentToEdit(doc);
    setIsEditDialogOpen(true);
  };

  const handleAddNewDocument = () => {
    const newDocument: AgentDocument = {
      id: "",
      agent_id: agent.id,
      title: "",
      content: "",
      category: Object.values(categoryTabs)[
        Object.keys(categoryTabs).indexOf(activeTab)
      ][0]
    };
    setDocumentToEdit(newDocument);
    setIsEditDialogOpen(true);
  };

  const handleDocumentSaved = (savedDoc: AgentDocument) => {
    fetchDocuments();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{agent.name} Documentation</CardTitle>
              <CardDescription>Reference materials and guidelines</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNewDocument}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Document
              </Button>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  `bg-${agent.color}/10 text-${agent.color}`
                )}
              >
                <agent.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aida-500"></div>
            </div>
          ) : (
            <>
              <Tabs defaultValue="clinical" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="clinical">Clinical</TabsTrigger>
                  <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                </TabsList>
                
                {Object.entries(categoryTabs).map(([tabId, categories]) => (
                  <TabsContent key={tabId} value={tabId} className="space-y-3">
                    {getCategoryDocuments(categories).length > 0 ? (
                      getCategoryDocuments(categories).map((doc) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <div 
                              className="flex items-center space-x-3 cursor-pointer flex-1"
                              onClick={() => openDocument(doc)}
                            >
                              <FileText className="h-5 w-5 text-aida-500" />
                              <div>
                                <p className="font-medium">{doc.title}</p>
                                <p className="text-xs text-muted-foreground">{doc.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDocument(doc);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No {tabId} documentation available
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  onClick={onScheduleConsultation}
                >
                  Schedule Consultation with {agent.name}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDocumentOpen} onOpenChange={setIsDocumentOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>{selectedDocument?.category}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedDocument?.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-sm">{paragraph}</p>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsDocumentOpen(false)}
            >
              Close
            </Button>
            <Button onClick={() => {
              setIsDocumentOpen(false);
              if (selectedDocument) {
                handleEditDocument(selectedDocument);
              }
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button className="ml-2">
              <Bookmark className="mr-2 h-4 w-4" />
              Save Reference
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EditDocumentationDialog
        document={documentToEdit}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSaved={handleDocumentSaved}
      />
    </div>
  );
};

export default AgentDocumentation;
