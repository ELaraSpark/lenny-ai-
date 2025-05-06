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
import { useAuth } from "@/contexts/AuthContext";
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
interface MyTemplatesProps {
  isPublicView?: boolean;
}

const QuickNotes: React.FC<MyTemplatesProps> = ({ isPublicView = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State for template functions
  const [templates, setTemplates] = useState<Template[]>(exampleTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  
  // Input/Output state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [outputTitle, setOutputTitle] = useState('Generated Document');
  const [showOutput, setShowOutput] = useState(false);
  const [isOutputEditable, setIsOutputEditable] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [outputStyle, setOutputStyle] = useState<string>('default');
  
  // Output style options
  const styleOptions = [
    { id: 'default', name: 'Default', icon: <Check size={14} /> },
    { id: 'professional', name: 'Professional', icon: <FileText size={14} /> },
    { id: 'friendly', name: 'Friendly', icon: <Users size={14} /> },
    { id: 'print', name: 'Print-friendly', icon: <FileText size={14} /> },
    { id: 'contrast', name: 'High Contrast', icon: <Monitor size={14} /> },
  ];
  
  // Style class mapping
  const getStyleClass = (style: string) => {
    switch(style) {
      case 'professional':
        return 'font-serif text-gray-800 leading-relaxed';
      case 'friendly':
        return 'font-sans text-gray-700 leading-loose rounded-xl bg-blue-50/50';
      case 'print':
        return 'font-mono text-black leading-snug';
      case 'contrast':
        return 'font-sans text-white bg-gray-900 leading-relaxed text-lg';
      default:
        return '';
    }
  };
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Common commands/prompts that can be suggested
  const suggestedCommands = [
    "Translate to Spanish",
    "Translate to French",
    "Summarize",
    "Simplify language",
    "Format as bullet points",
    "Convert to patient-friendly language",
    "Extract medication list",
    "Extract diagnoses",
    "Format as SOAP note"
  ];
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCommand, setIsCommand] = useState(false);
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  
  // Filter templates based on search term or handle as command
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle command execution
  const executeCommand = (command: string) => {
    if (!inputText.trim()) {
      toast.error('Please enter some text in the input document first.');
      return;
    }
    
    setLoadingText(`Processing: ${command}...`);
    setIsLoading(true);
    setIsCommand(true);
    
    // Simulate processing the command
    setTimeout(() => {
      try {
        let processedText = '';
        let title = '';
        
        // Handle different commands
        if (command.toLowerCase().includes('translate to spanish')) {
          title = 'Spanish Translation';
          // This is a mock implementation - in a real app, you'd call a translation API
          processedText = `<h3>Original Text:</h3>
${inputText}

<h3>Spanish Translation:</h3>
[This is where the Spanish translation would appear. In a real implementation, 
this would be translated using a service like Google Translate API.]`;
        } 
        else if (command.toLowerCase().includes('translate to french')) {
          title = 'French Translation';
          processedText = `<h3>Original Text:</h3>
${inputText}

<h3>French Translation:</h3>
[This is where the French translation would appear. In a real implementation, 
this would be translated using a service like Google Translate API.]`;
        }
        else if (command.toLowerCase().includes('summarize')) {
          title = 'Summary';
          processedText = `<h3>Original Text:</h3>
${inputText}

<h3>Summary:</h3>
[This is where a summary of the text would appear. In a real implementation, 
this would use an AI service to generate a concise summary.]`;
        }
        else if (command.toLowerCase().includes('simplify')) {
          title = 'Simplified Text';
          processedText = `<h3>Original Text:</h3>
${inputText}

<h3>Simplified Version:</h3>
[This is where a simplified version of the text would appear. In a real implementation, 
this would use an AI service to generate text with simpler language.]`;
        }
        else if (command.toLowerCase().includes('bullet')) {
          title = 'Bullet Point Format';
          // Simple mock implementation
          const lines = inputText.split('\n').filter(line => line.trim());
          const bulletPoints = lines.map(line => `• ${line}`).join('\n');
          processedText = `<h3>Bullet Point Format:</h3>
${bulletPoints}`;
        }
        else if (command.toLowerCase().includes('patient-friendly')) {
          title = 'Patient-Friendly Version';
          processedText = `<h3>Original Text:</h3>
${inputText}

<h3>Patient-Friendly Version:</h3>
[This is where a patient-friendly version would appear. In a real implementation, 
this would use an AI service to translate medical jargon into plain language.]`;
        }
        else if (command.toLowerCase().includes('medication')) {
          title = 'Medication List';
          processedText = `<h3>Extracted Medication List:</h3>
[This is where an extracted medication list would appear. In a real implementation, 
this would use NLP to identify and list all medications mentioned in the text.]`;
        }
        else if (command.toLowerCase().includes('diagnoses')) {
          title = 'Diagnoses List';
          processedText = `<h3>Extracted Diagnoses:</h3>
[This is where extracted diagnoses would appear. In a real implementation, 
this would use NLP to identify and list all diagnoses mentioned in the text.]`;
        }
        else if (command.toLowerCase().includes('soap')) {
          title = 'SOAP Note Format';
          processedText = `<h3>SOAP Note:</h3>

<h4>Subjective:</h4>
[Patient complaints and history extracted from the text]

<h4>Objective:</h4>
[Examination findings and test results extracted from the text]

<h4>Assessment:</h4>
[Diagnoses and clinical impressions extracted from the text]

<h4>Plan:</h4>
[Treatment plans and follow-up instructions extracted from the text]`;
        }
        else {
          // Generic command handling
          title = 'Processed Text';
          processedText = `<h3>Command: ${command}</h3>
<p>Applied to:</p>
${inputText}

<p>[This is a placeholder for the actual implementation of "${command}"]</p>`;
        }
        
        setOutputText(processedText);
        setOutputTitle(title);
        setShowOutput(true);
        setIsOutputEditable(true);
        setIsLoading(false);
        toast.success(`Command "${command}" executed successfully.`);
      } catch (error) {
        console.error("Error executing command:", error);
        setIsLoading(false);
        toast.error('Failed to execute command.');
      }
    }, 1500);
  };

  // --- Template Actions ---
  const handleTemplateClick = useCallback((template: Template) => {
    setSelectedTemplate(template);
    
    if (inputText.trim()) {
      // If there's input text, apply the template to it
      setLoadingText('Applying template...');
      setIsLoading(true);
      
      // Simulate processing
      setTimeout(() => {
        try {
          // This is a simplified example - in a real app, you'd have more sophisticated template application logic
          const processedText = `<h2>${template.title}</h2>
          
${template.content}

<h3>Applied to Input:</h3>
${inputText}`;
          
          setOutputText(processedText);
          setOutputTitle(template.title);
          setShowOutput(true);
          setIsOutputEditable(true);
          setIsLoading(false);
          toast.success('Template applied successfully.');
        } catch (error) {
          console.error("Error applying template:", error);
          setIsLoading(false);
          toast.error('Failed to apply template.');
        }
      }, 1000);
    } else {
      // If no input text, just show the template content
      setOutputText(template.content);
      setOutputTitle(template.title);
      setShowOutput(true);
      setIsOutputEditable(true); // Enable editing by default for templates
    }
  }, [inputText]);

  const handleCreateTemplate = () => {
    navigate('/templates/create');
  };
  
  const handleEditTemplate = (templateId: string) => {
    navigate(`/templates/${templateId}/edit`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully.');
      
      // Clear output if the deleted template was selected
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setShowOutput(false);
      }
    }
  };

  const handleSaveTemplate = () => {
    if (!outputText.trim()) {
      toast.error('Cannot save empty template.');
      return;
    }
    
    if (selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? {...t, content: outputText, date: new Date()} 
          : t
      ));
      toast.success('Template updated successfully.');
    } else {
      // Create new template
      const title = prompt('Enter a title for your template:', outputTitle || 'New Template');
      if (title) {
        const newTemplate: Template = {
          id: `tpl${Date.now()}`,
          title,
          content: outputText,
          date: new Date(),
          category: 'Custom'
        };
        setTemplates(prev => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate);
        toast.success('Template saved successfully.');
      }
    }
  };

  // --- Input Actions ---
  const handleClearInput = () => {
    setInputText('');
    toast.info('Input cleared.');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setInputText(e.target.result as string);
          toast.success(`File "${file.name}" loaded.`);
        } else {
          toast.error(`Error reading file content from "${file.name}".`);
        }
      };
      reader.onerror = () => {
        toast.error(`Error reading file "${file.name}".`);
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Output Actions ---
  const handleClearOutput = () => {
    setOutputText('');
    setShowOutput(false);
    toast.info('Output cleared.');
  };
  
  const handleCopyOutput = () => {
    if (outputRef.current?.innerText && navigator.clipboard) {
      navigator.clipboard.writeText(outputRef.current.innerText)
        .then(() => toast.success('Output copied to clipboard.'))
        .catch(err => toast.error('Failed to copy output.'));
    } else {
      toast.info('Nothing to copy.');
    }
  };

  const handleDownloadOutput = () => {
    if (!outputRef.current?.innerText) {
      toast.info('Nothing to download.');
      return;
    }
    try {
      const textContent = outputRef.current.innerText;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = (outputTitle || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.href = url;
      link.download = `${filename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Downloading as text file.');
    } catch (err) {
      console.error("Download failed:", err);
      toast.error('Failed to initiate download.');
    }
  };

  const handleToggleEditOutput = () => {
    setIsOutputEditable(prev => {
      if (outputRef.current) {
        outputRef.current.contentEditable = String(!prev);
        if (!prev) {
          outputRef.current.focus();
          toast.info('Output editing enabled.');
        } else {
          toast.info('Output editing disabled.');
          // Save changes
          setOutputText(outputRef.current.innerHTML);
        }
      }
      return !prev;
    });
  };

  // Apply template to input text
  const handleApplyToInput = () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text in the input document.');
      return;
    }
    
    if (!outputText.trim()) {
      toast.error('No template selected.');
      return;
    }
    
    setLoadingText('Applying template...');
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      try {
        // This is a simplified example - in a real app, you'd have more sophisticated template application logic
        const processedText = `<h2>${outputTitle}</h2>
        
${outputText}

<h3>Applied to Input:</h3>
${inputText}`;
        
        setOutputText(processedText);
        setIsLoading(false);
        toast.success('Template applied successfully.');
      } catch (error) {
        console.error("Error applying template:", error);
        setIsLoading(false);
        toast.error('Failed to apply template.');
      }
    }, 1000);
  };

  // Scroll to output when it appears
  useEffect(() => {
    if (showOutput) {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showOutput]);

  // Track scroll position for header behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    navigate("/");
  };

  return (
    <>
      {/* Add top navigation bar */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${isScrolled ? 'bg-background/90 shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between py-4">
            {/* Logo and Nav Items */}
            <div className="flex items-center gap-8">
              {/* Playful Logo/Accent - Using the landing page style */}
              <Link to="/" className="text-2xl font-semibold text-neutral-900 flex items-center transform -rotate-1 mr-8">
                <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full mr-2 transform -translate-y-1"></span>
                Leny<span className="text-primary">.ai</span>
              </Link>
              
              {/* Navigation Menu */}
              <div className="flex items-center gap-2 md:gap-5">
                {/* Ask Leny */}
                <Link
                  to="/public/chat"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/chat' || location.pathname === '/'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <MessageSquare size={18} className={
                      location.pathname === '/public/chat' || location.pathname === '/'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Ask Leny</span>
                </Link>
                
                {/* Smart Notes */}
                <Link
                  to="/public/my-templates"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/my-templates'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Zap size={18} className={
                      location.pathname === '/public/my-templates'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Smart Notes</span>
                </Link>

                {/* Expert Panel */}
                <Link
                  to="/public/tumor-board"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/tumor-board'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <List size={18} className={
                      location.pathname === '/tumor-board'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Expert Panel</span>
                </Link>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <PicassoAvatar
                        email={user?.email || 'User'}
                        size="sm"
                        color="text-primary"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 border border-border shadow-lg rounded-lg bg-white">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-border bg-white">
                      <div className="flex items-center">
                        <PicassoAvatar
                          email={user?.email || 'User'}
                          size="md"
                          color="text-primary"
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-sm">Medical User</div>
                          <div className="text-xs text-muted-foreground">{user?.email || 'user@hospital.org'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items Section */}
                    <div className="py-2 bg-white">
                      <DropdownMenuItem asChild className="bg-white hover:bg-primary/5">
                        <Link to="/recent-chats" className="cursor-pointer">
                          <Clock size={16} className="mr-3 text-muted-foreground" />
                          <span>Recent Chats</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="bg-white hover:bg-primary/5">
                         <Link to="/my-agents" className="cursor-pointer">
                           <Users size={16} className="mr-3 text-muted-foreground" />
                           <span>My Agents</span>
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="bg-white hover:bg-primary/5">
                         <Link to="/my-templates" className="cursor-pointer">
                           <FileText size={16} className="mr-3 text-muted-foreground" />
                           <span>My Templates</span>
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="bg-white hover:bg-primary/5">
                        <Link to="/settings" className="cursor-pointer">
                          <Settings size={16} className="mr-3 text-muted-foreground" />
                          <span>Account Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-border" />
                    
                    {/* Logout Option */}
                    <div className="py-2 bg-white">
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 font-medium bg-white">
                        <LogOut size={16} className="mr-3" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="font-medium">
                    <User size={16} className="mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main layout - Maximizing screen usage with a flexible grid */}
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        {/* No top bar - functionality integrated into panels */}
        
        {/* Main content area - Flexible layout with input first, then templates */}
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
          {/* Left area - Input */}
          <div className={`${showOutput ? 'col-span-3 bg-background/80' : 'col-span-7 bg-background'} rounded-xl shadow-lg p-3 flex flex-col transition-all duration-300`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium">Tell me what you're working on...</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  // Clear input text
                  setInputText('');
                  // Clear output and hide output panel
                  setOutputText('');
                  setShowOutput(false);
                  // Reset selected template
                  setSelectedTemplate(null);
                  // Reset search term
                  setSearchTerm('');
                  // Show success message
                  toast.info('Starting fresh!');
                }} 
                className="text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1.5" /> Start Fresh
              </Button>
            </div>
            <div className="flex-1 flex flex-col"> {/* Re-added flex-1 */}
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your medical text here..."
                className="flex-1 resize-none text-base p-4 focus:ring-2 focus:ring-primary focus:border-primary min-h-[150px]" // Removed shadow-sm, border, rounded-lg
                autoFocus
              />
              
              {/* Empty state guidance removed as requested */}
              
              {/* Quick action buttons at bottom with sparkle emoji */}
              <div className="flex flex-wrap gap-2 mt-3 mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => executeCommand('Summarize')}
                  className="bg-white hover:bg-primary/5 border-gray-300"
                >
                  <span className="text-primary mr-1">✨</span> Summarize
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => executeCommand('Simplify')}
                  className="bg-white hover:bg-primary/5 border-gray-300"
                >
                  <span className="text-primary mr-1">✨</span> Simplify
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => executeCommand('Translate')}
                  className="bg-white hover:bg-primary/5 border-gray-300"
                >
                  <span className="text-primary mr-1">✨</span> Translate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => executeCommand('Format as Bullets')}
                  className="bg-white hover:bg-primary/5 border-gray-300"
                >
                  <span className="text-primary mr-1">✨</span> Format as Bullets
                </Button>
              </div>
              
              {/* Removed Upload File button and input */}
            </div>
          </div>
          
          {/* Center area - Templates - Always visible */}
          <div className={`${showOutput ? 'col-span-3 bg-background/80' : 'col-span-5 bg-background'} rounded-xl shadow-lg p-3 flex flex-col transition-all duration-300`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium">Leny's Magic Templates</h3>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreateTemplate}
              >
                <Plus size={14} className="mr-1" />
                Create
              </Button>
            </div>
            
            {/* Search Bar with Suggestions */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search templates or type a command..."
                className="pl-9 pr-3 py-1.5 text-sm w-full" // Removed shadow-sm
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow clicking suggestions
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    // Check if it's a command (not matching any template)
                    const isCommand = !filteredTemplates.some(t => 
                      t.title.toLowerCase() === searchTerm.toLowerCase() ||
                      t.category?.toLowerCase() === searchTerm.toLowerCase()
                    );
                    
                    if (isCommand) {
                      executeCommand(searchTerm);
                      setSearchTerm('');
                    }
                  }
                }}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {suggestedCommands.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                        Magic Phrases ✨
                      </div>
                      {suggestedCommands.map((command, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-primary/5 flex items-center"
                          onClick={() => {
                            setSearchTerm(command);
                            executeCommand(command);
                          }}
                        >
                          <Languages size={14} className="mr-2 text-primary" />
                          {command}
                        </div>
                      ))}
                      
                      {filteredTemplates.length > 0 && (
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 mt-1">
                          Matching Templates
                        </div>
                      )}
                    </>
                  )}
                  
                  {filteredTemplates.length === 0 && searchTerm && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Press Enter to execute "{searchTerm}" as a command
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Templates List - Vertical for better visibility */}
            <div className="templates-list flex-1 space-y-2 pr-1 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`template-card text-left bg-white border-2 border-gray-500 rounded-lg p-3 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:border-primary w-full flex flex-col ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="template-card-header flex items-center gap-2 mb-1">
                    <div className="template-icon w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{template.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{template.content.replace(/<[^>]*>/g, ' ').substring(0, 60)}...</p>
                  <div className="template-footer flex justify-between items-center mt-1 pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{template.category}</span>
                    <div className="template-actions flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template.id);
                        }}
                        className="p-1 text-gray-400 hover:text-primary"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Add a "More" card at the end */}
              <button
                onClick={() => navigate('/my-templates')}
                className="template-card text-left bg-primary/5 border border-dashed border-primary/30 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary w-full flex items-center justify-center gap-2 h-12"
              >
                <MoreHorizontal className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-primary">More Templates</p>
              </button>
            </div>
            
            {/* No Apply Template button needed - templates apply automatically when clicked */}
          </div>
          
          {/* Right area - Output (only shown when there's output) */}
          {showOutput && (
            <div className="col-span-6 bg-gradient-to-br from-background to-primary/5 rounded-xl shadow-lg p-4 flex flex-col animate-fadeIn">
              <div className="mb-3">
                <h3 className="text-lg font-medium text-primary">Here's what I've created for you ✨</h3>
              </div>
              
              <div className="output-header flex justify-between items-center mb-3 bg-white/80 p-2 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-primary">{outputTitle}</h4>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 flex items-center gap-1"
                      onClick={() => setShowStyleOptions(prev => !prev)}
                    >
                      <Palette size={14} />
                      <span className="text-xs">Style</span>
                    </Button>
                    
                    {/* Style Options Dropdown */}
                    {showStyleOptions && (
                      <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200 w-48">
                        <div className="py-1">
                          {styleOptions.map(style => (
                            <button
                              key={style.id}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 ${
                                outputStyle === style.id ? 'bg-primary/5 text-primary' : ''
                              }`}
                              onClick={() => {
                                setOutputStyle(style.id);
                                setShowStyleOptions(false);
                                toast.success(`Style changed to ${style.name}`);
                              }}
                            >
                              <span className="flex items-center gap-2">
                                {style.icon}
                                {style.name}
                              </span>
                              {outputStyle === style.id && <Check size={14} className="text-primary" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="output-actions flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      // Open a prompt to allow the user to make changes
                      const userPrompt = prompt("What changes would you like to make to your document?");
                      if (userPrompt && userPrompt.trim()) {
                        setLoadingText(`Updating: ${userPrompt.substring(0, 20)}${userPrompt.length > 20 ? '...' : ''}`);
                        setIsLoading(true);
                        
                        // Simulate processing the changes
                        setTimeout(() => {
                          // In a real implementation, this would call an AI service
                          // For now, we'll just append the request to the document
                          const updatedText = `${outputText}\n\n<div class="p-3 bg-primary/10 rounded-lg mt-4 border border-primary/20">
<p class="font-medium text-primary">Requested changes: "${userPrompt}"</p>
<p class="text-sm mt-2">Changes applied! (This is a simulation - in a real implementation, the AI would actually modify the document based on your request)</p>
</div>`;
                          
                          setOutputText(updatedText);
                          setIsLoading(false);
                          toast.success("Document updated based on your request!");
                        }, 1500);
                      }
                    }}
                    disabled={!outputText}
                    className="h-7 px-2 text-primary group relative"
                    title="AI Modify (Ctrl+M)"
                  >
                    <span className="text-xl">✨</span>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      AI Modify (Ctrl+M)
                    </span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleToggleEditOutput}>
                    {isOutputEditable ? 'Stop Editing' : 'Edit'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearOutput}>
                    <Trash2 size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCopyOutput}>
                    <Copy size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownloadOutput}>
                    <Download size={14} />
                  </Button>
                </div>
              </div>
              <div 
                ref={outputRef} 
                className={`flex-1 overflow-y-auto prose lg:prose-lg ${getStyleClass(outputStyle)}`} 
                dangerouslySetInnerHTML={{ __html: outputText }} 
              />
            </div>
          )} {/* End of right area - Output */}
        </div>
      </div>
    </>
  );
};

export default QuickNotes;