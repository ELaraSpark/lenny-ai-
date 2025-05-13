import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Using installed sonner library for toasts
import { useToast } from "@/hooks/use-toast"; // Added missing import for useToast
import {
    Trash2, Upload, Mic, ClipboardList, Search, Copy, Download, Edit, FileText, 
    Users, Brain, Microscope, Phone, Monitor, Bell, Save, SlidersHorizontal, 
    NotebookPen, FileSignature, ListChecks, Languages, RotateCcw, Send, Plus,
    MoreHorizontal, Palette, Check, MessageSquare, Zap, List, User, LogOut, Clock,
    Settings
} from 'lucide-react';
import useAuthStore from "@/stores/authStore"; // Import the Zustand store
import { PicassoAvatar } from "@/components/illustrations/PicassoAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define Template Type
interface Template {
  id: string;
  title: string;
  content: string;
  category?: string;
  date: Date;
}

// Example Template Data (replace with actual data fetching)
const exampleTemplates: Template[] = [
  { 
    id: 'tpl1', 
    title: 'SOAP Note Template', 
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
Follow-up:`, 
    category: 'Clinical Notes', 
    date: new Date('2025-03-15') 
  },
  { 
    id: 'tpl2', 
    title: 'Discharge Summary Template', 
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
[Name and credentials]`, 
    category: 'Reports', 
    date: new Date('2025-03-10') 
  },
  { 
    id: 'tpl3', 
    title: 'Consultation Request Template', 
    content: `<h3>Consultation Request</h3>

<h4>Requesting Provider:</h4>
Name: [Your Name]
Contact: [Your Contact Information]

<h4>Patient Information:</h4>
Name: [Patient Name]
DOB: [Date of Birth]
MRN: [Medical Record Number]

<h4>Reason for Consultation:</h4>
[Specific question or concern to be addressed]

<h4>Relevant History:</h4>
[Brief summary of relevant medical history]

<h4>Current Medications:</h4>
[List of current medications]

<h4>Recent Investigations:</h4>
[Summary of relevant test results]

<h4>Urgency:</h4>
[Routine/Urgent/Emergency]`, 
    category: 'Referrals', 
    date: new Date('2025-03-05') 
  },
  { 
    id: 'tpl4', 
    title: 'Patient History Intake Form', 
    content: `<h3>Patient History Intake Form</h3>

<h4>Personal Information:</h4>
Name:
Date of Birth:
Gender:
Contact Information:

<h4>Chief Complaint:</h4>
[Reason for visit]

<h4>Medical History:</h4>
Past Medical Conditions:
Surgical History:
Family Medical History:
Allergies:

<h4>Current Medications:</h4>
[Include prescription, OTC, supplements]

<h4>Social History:</h4>
Smoking Status:
Alcohol Use:
Occupation:
Exercise Habits:

<h4>Review of Systems:</h4>
[Systematic review of body systems]`, 
    category: 'Forms', 
    date: new Date('2025-02-28') 
  },
];

// Define props to accept isPublicView
interface MyTemplatesPageProps {
  isPublicView?: boolean; // Add isPublicView as an optional prop
}

const MyTemplatesPage: React.FC<MyTemplatesPageProps> = ({ isPublicView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore(); // Use Zustand store
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false); // Keep for potential future use with sticky headers etc.

  // State for AI Template Generation
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedTemplateContent, setGeneratedTemplateContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // State for existing user templates (can be refined later)
  const [userTemplates, setUserTemplates] = useState<Template[]>(exampleTemplates);
  const [searchTermExisting, setSearchTermExisting] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null); // For editing existing templates

  // Refs
  const generatedTemplateOutputRef = useRef<HTMLTextAreaElement>(null);


  // Mock AI Template Generation Logic
  const handleGenerateTemplate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a description for the template you want to generate.");
      return;
    }
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    let mockContent = `// Default generated template for: "${aiPrompt}"\n\nYour content here.`;
    const lowerCasePrompt = aiPrompt.toLowerCase();

    if (lowerCasePrompt.includes("soap note")) {
      mockContent = exampleTemplates.find(t => t.id === 'tpl1')?.content || `<h3>SOAP Note for ${aiPrompt}</h3>\n<p>Details...</p>`;
      toast.success("SOAP Note template generated!");
    } else if (lowerCasePrompt.includes("referral letter")) {
      mockContent = `<h3>Referral Letter</h3>
<h4>Dear Specialist,</h4>
<p>I am referring [Patient Name] for consultation regarding ${aiPrompt}.</p>
<p>Relevant history includes...</p>
<p>Thank you for your attention to this matter.</p>
<h4>Sincerely,</h4>
<p>${user?.name || 'Healthcare Provider'}</p>`; {/* Use user.name from Zustand store */}
    toast.success("Referral letter template generated!");
  } else if (lowerCasePrompt.includes("discharge summary")) {
        mockContent = exampleTemplates.find(t => t.id === 'tpl2')?.content || `<h3>Discharge Summary for ${aiPrompt}</h3>\n<p>Details...</p>`;
        toast.success("Discharge summary template generated!");
    } else {
      toast.info("Generated a generic template based on your request.");
    }

    setGeneratedTemplateContent(mockContent);
    setIsGenerating(false);
  };

  // --- Existing Template Actions (to be reviewed and integrated) ---
  const handleEditExistingTemplate = (template: Template) => {
    // For now, let's just log or set it to a state.
    // In a full implementation, this might open a modal or an inline editor.
    setEditingTemplate(template);
    // For simplicity, we can load its content into the AI generation output for editing
    setGeneratedTemplateContent(template.content);
    toast.info(`Editing template: ${template.title}. Modify in the 'Generated Template' area and save.`);
  };

  const handleDeleteExistingTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setUserTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully.');
      if (editingTemplate?.id === templateId) {
        setEditingTemplate(null);
        setGeneratedTemplateContent(''); // Clear if the deleted template was being "edited"
      }
    }
  };
  
  const handleSaveGeneratedTemplate = () => {
    if (!generatedTemplateContent.trim()) {
      toast.error("Cannot save an empty template.");
      return;
    }
    const title = prompt("Enter a title for your new template:", editingTemplate?.title || "New AI Generated Template");
    if (title) {
      if (editingTemplate) {
        // Update existing template
        setUserTemplates(prev => prev.map(t =>
          t.id === editingTemplate.id
            ? { ...t, title, content: generatedTemplateContent, date: new Date() }
            : t
        ));
        toast.success(`Template "${title}" updated!`);
        setEditingTemplate(null);
      } else {
        // Create new template
        const newTemplate: Template = {
          id: `user_tpl_${Date.now()}`,
          title,
          content: generatedTemplateContent,
          category: 'AI Generated',
          date: new Date(),
        };
        setUserTemplates(prev => [newTemplate, ...prev]);
        toast.success(`Template "${title}" saved!`);
      }
      setGeneratedTemplateContent(''); // Clear the generation area
      setAiPrompt(''); // Clear the prompt
    }
  };


  // Filter existing templates
  const filteredExistingTemplates = userTemplates.filter(template =>
    template.title.toLowerCase().includes(searchTermExisting.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTermExisting.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500">
          My Templates & AI Generator
        </h1>
        <p className="text-slate-400 mt-1">
          Craft new templates with AI or manage your existing ones.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Template Generation Section */}
        <section className="bg-slate-800/50 p-6 rounded-xl shadow-2xl flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300 flex items-center">
            <Brain size={28} className="mr-3 text-pink-400" />
            AI-Powered Template Generation
          </h2>
          
          <div className="flex-1 flex flex-col space-y-4">
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the template you need (e.g., 'SOAP note for lower back pain', 'Referral to cardiologist for palpitations')..."
              className="bg-slate-700 border-slate-600 placeholder-slate-500 text-white resize-none focus:ring-pink-500 focus:border-pink-500 min-h-[100px] text-base"
              rows={4}
            />
            <Button
              onClick={handleGenerateTemplate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-base transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RotateCcw size={20} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  Generate Template
                </>
              )}
            </Button>

            { (generatedTemplateContent || isGenerating) && (
              <div className="mt-4 flex-1 flex flex-col">
                <label htmlFor="generatedTemplateOutput" className="block text-sm font-medium text-slate-300 mb-1">
                  Generated Template (Editable)
                </label>
                <Textarea
                  id="generatedTemplateOutput"
                  ref={generatedTemplateOutputRef}
                  value={generatedTemplateContent}
                  onChange={(e) => setGeneratedTemplateContent(e.target.value)}
                  placeholder="AI will generate content here..."
                  className="bg-slate-700/80 border-slate-600 placeholder-slate-500 text-white resize-none focus:ring-blue-500 focus:border-blue-500 flex-1 min-h-[200px] text-sm"
                  readOnly={isGenerating}
                />
                {!isGenerating && generatedTemplateContent && (
                    <Button
                        onClick={handleSaveGeneratedTemplate}
                        className="mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 text-sm"
                    >
                        <Save size={18} className="mr-2" />
                        Save This Template
                    </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Existing User Templates Section */}
        <section className="bg-slate-800/50 p-6 rounded-xl shadow-2xl flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300 flex items-center">
            <ListChecks size={28} className="mr-3 text-green-400" />
            Your Saved Templates
          </h2>
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search your templates..."
              value={searchTermExisting}
              onChange={(e) => setSearchTermExisting(e.target.value)}
              className="bg-slate-700 border-slate-600 placeholder-slate-500 text-white focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 custom-scrollbar">
            {filteredExistingTemplates.length > 0 ? (
              filteredExistingTemplates.map((template) => (
                <div key={template.id} className="bg-slate-700/70 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-100">{template.title}</h3>
                      <p className="text-xs text-slate-400 mb-1">
                        Category: {template.category || 'Uncategorized'} | Last Updated: {template.date.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {template.content.replace(/<[^>]*>/g, ' ').substring(0, 100)}...
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-600">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-700 border-slate-600 text-white">
                        <DropdownMenuItem
                          onClick={() => handleEditExistingTemplate(template)}
                          className="hover:bg-slate-600 cursor-pointer"
                        >
                          <Edit size={16} className="mr-2" /> Edit / View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(template.content)
                              .then(() => toast.success(`Copied "${template.title}" to clipboard!`))
                              .catch(() => toast.error("Failed to copy template."));
                          }}
                          className="hover:bg-slate-600 cursor-pointer"
                        >
                          <Copy size={16} className="mr-2" /> Copy Content
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-600"/>
                        <DropdownMenuItem
                          onClick={() => handleDeleteExistingTemplate(template.id)}
                          className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">
                {searchTermExisting ? "No templates match your search." : "You haven't saved any templates yet."}
              </p>
            )}
          </div>
           <Button
              onClick={() => {
                setAiPrompt('');
                setGeneratedTemplateContent('');
                setEditingTemplate(null);
                toast.info("Cleared AI generator. Describe a new template!");
              }}
              variant="outline"
              className="mt-4 w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            >
              <Plus size={18} className="mr-2" /> Create New with AI
            </Button>
        </section>
      </div>
      <footer className="mt-8 text-center text-sm text-slate-500">
        Powered by Leny AI ✨
      </footer>
    </div>
  );
};

export default MyTemplatesPage;