import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layout/PublicLayout"; // Re-add PublicLayout import
import { 
    Trash2, Upload, Mic, FileText, Search, Copy, Download, Edit, X, 
    FileDown, FileSignature, FileCode, FileBarChart, Languages, Wand2, MicOff 
} from 'lucide-react'; 

// Explicitly declare window properties for SpeechRecognition API
interface WindowWithSpeech extends Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
declare const window: WindowWithSpeech; // Use const instead of var

// Define the structure for an action
interface Action {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode; // Use ReactNode for icons
}

// Define the actions (can be moved to a separate file later)
const actions: Action[] = [
    { id: 'discharge', name: 'Discharge Summary', description: 'Generate a comprehensive discharge summary.', icon: <FileDown size={20} className="text-primary" /> },
    { id: 'soap', name: 'SOAP Note', description: 'Structure notes into Subjective, Objective, Assessment, Plan.', icon: <FileSignature size={20} className="text-primary" /> },
    { id: 'progress', name: 'Progress Note', description: 'Create a standard progress note for follow-up.', icon: <FileSignature size={20} className="text-primary" /> }, // Re-use icon for now
    { id: 'h_and_p', name: 'History & Physical', description: 'Comprehensive patient assessment format.', icon: <FileCode size={20} className="text-primary" /> },
    { id: 'referral', name: 'Referral Letter', description: 'Draft a referral letter to another provider.', icon: <FileText size={20} className="text-primary" /> }, // Re-use icon
    { id: 'summarize', name: 'Summarize Key Points', description: 'Extract the most important findings.', icon: <FileBarChart size={20} className="text-primary" /> },
    { id: 'translate_es', name: 'Translate to Spanish', description: 'Translate the input text into Spanish.', icon: <Languages size={20} className="text-primary" /> },
    // Add more actions here
];

const DocumentTransformer: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('');
    const [outputTitle, setOutputTitle] = useState<string>('Generated Document');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Processing...');
    const [showOutput, setShowOutput] = useState<boolean>(false);
    const [isOutputEditable, setIsOutputEditable] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false); // State for dictation
    // Correct type annotation using the installed types
    const recognitionRef = useRef<SpeechRecognition | null>(null); 
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    // --- Speech Recognition Setup ---
    // Check for browser support using the declared window type
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const browserSupportsSpeech = !!SpeechRecognitionAPI;

    // Filter actions based on search term
    const filteredActions = actions.filter(action =>
        searchTerm === '' ||
        action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Event Handlers ---

    const handleClearInput = () => {
        setInputText('');
        setShowOutput(false);
        toast({ title: "Input cleared." }); // Use default variant
    };

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInputText(e.target?.result as string);
                setShowOutput(false);
                toast({ title: `File "${file.name}" loaded.` }); // Use default variant
            };
            reader.onerror = () => {
                toast({ title: `Error reading file "${file.name}".`, variant: "destructive" });
            };
            reader.readAsText(file);
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDictate = () => {
        if (!browserSupportsSpeech) {
            toast({ title: "Dictation not supported in this browser.", variant: "destructive" });
            return;
        }

        if (isListening) {
            // Stop listening
            recognitionRef.current?.stop();
            // No need to manually set isListening to false here, onend handler will do it.
            // toast({ title: "Dictation stopped." }); // onend can handle this if needed
        } else {
            // Start listening
            if (!SpeechRecognitionAPI) return; // Should not happen if browserSupportsSpeech is true, but good check
            recognitionRef.current = new SpeechRecognitionAPI();
            recognitionRef.current.continuous = true; // Keep listening even after pauses
            recognitionRef.current.interimResults = true; // Get results as they come

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                toast({ title: "Dictation started. Start speaking..." });
            };

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                // Append final transcript to the input text
                if (finalTranscript) {
                    setInputText(prev => prev + finalTranscript + ' '); // Add space after final segment
                }
                // Optionally display interim results somewhere if needed
                // console.log("Interim:", interimTranscript); 
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                let errorMsg = "Dictation error.";
                if (event.error === 'no-speech') {
                    errorMsg = "No speech detected. Stopping dictation.";
                } else if (event.error === 'audio-capture') {
                    errorMsg = "Microphone error. Check permissions.";
                } else if (event.error === 'not-allowed') {
                    errorMsg = "Microphone permission denied.";
                }
                toast({ title: errorMsg, variant: "destructive" });
                setIsListening(false); // Ensure listening state is reset on error
            };

            recognitionRef.current.onend = () => {
                // Only show stopped message if it wasn't stopped manually by error or button
                if (isListening && recognitionRef.current) { 
                   // It might stop automatically after a long pause, depending on browser
                   // We could potentially restart it here if desired, but for now, just update state
                   // recognitionRef.current.start(); // Example: auto-restart (might need more logic)
                }
                 setIsListening(false); // Ensure state is false when it ends
                 recognitionRef.current = null; // Clean up instance
            };

            try {
                recognitionRef.current.start();
            } catch (error) {
                 console.error("Failed to start recognition:", error);
                 toast({ title: "Could not start dictation.", variant: "destructive" });
                 setIsListening(false);
                 recognitionRef.current = null;
            }
        }
    };

    const handleUseTemplate = () => {
        toast({ title: "Template feature not implemented yet." }); // Use default variant
    };

    const handleActionClick = (actionId: string, actionName: string) => {
        if (!inputText.trim()) {
            toast({ title: "Please enter some text in the input document.", variant: "destructive" });
            return;
        }
        // Simulate transformation
        setIsLoading(true);
        setLoadingMessage(`Processing: ${actionName}...`);
        setShowOutput(false); // Hide previous output

        setTimeout(() => {
            // Simulate success
            const simulatedOutput = generateSimulatedOutput(actionId, actionName, inputText);
            setOutputTitle(actionName);
            setOutputText(simulatedOutput); // Store as HTML string
            setShowOutput(true);
            setIsOutputEditable(false); // Reset editable state
            setIsLoading(false);
            toast({ title: `${actionName} generated successfully.` }); // Use default variant
            
            // Scroll output into view if needed
             if (window.innerWidth < 992 && outputRef.current) {
                  outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }

        }, 1500 + Math.random() * 1000);
    };
    
    const handleCustomAction = () => {
        if (!inputText.trim()) {
            toast({ title: "Please enter some text in the input document.", variant: "destructive" });
            return;
        }
         if (!searchTerm.trim()) {
            toast({ title: "Please enter a custom instruction in the search bar.", variant: "destructive" });
            return;
        }
        const customInstruction = searchTerm.trim();
        handleActionClick('custom', `Custom: ${customInstruction}`);
        setSearchTerm(''); // Clear search after execution
    };

    const handleCopyOutput = () => {
        if (outputRef.current?.innerText && navigator.clipboard) {
            navigator.clipboard.writeText(outputRef.current.innerText)
                .then(() => toast({ title: "Output copied to clipboard." })) // Use default variant
                .catch(err => {
                    console.error('Clipboard copy failed:', err);
                    toast({ title: "Failed to copy output.", variant: "destructive" });
                });
        } else {
            toast({ title: "Nothing to copy.", variant: "default" });
        }
    };

    const handleDownloadOutput = () => {
         const textContent = outputRef.current?.innerText;
         if (!textContent) {
             toast({ title: "Nothing to download.", variant: "default" });
             return;
         }
         try {
             const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
             const url = URL.createObjectURL(blob);
             const link = document.createElement('a');
             const filename = (outputTitle || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
             link.href = url;
             link.download = `${filename}.txt`;
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             URL.revokeObjectURL(url); // Clean up
             toast({ title: 'Downloading as text file.' }); // Use default variant
         } catch (err) {
             console.error("Download failed:", err);
             toast({ title: 'Failed to initiate download.', variant: 'destructive' });
         }
    };

    const handleToggleEditOutput = () => {
        setIsOutputEditable(!isOutputEditable);
        if (!isOutputEditable && outputRef.current) {
            outputRef.current.focus();
            toast({ title: "Output editing enabled." }); // Use default variant
        } else {
            toast({ title: "Output editing disabled." }); // Use default variant
        }
    };
    
    // Simulate Output Generation
     function generateSimulatedOutput(type: string, name: string, input: string): string {
         let content = `This is a simulated <strong>${name}</strong> based on the input provided.<br><br>
                         <em>Input snippet:</em> ${input.substring(0, 200).replace(/\n/g, '<br>')}${input.length > 200 ? '...' : ''}<br><br>`;
         switch(type) {
             case 'discharge': content += `<h3>Patient Information:</h3> [Details...] <br><h3>Hospital Course:</h3> [Details...] <br><h3>Discharge Plan:</h3> [Details...]`; break;
             case 'soap': content += `<h3>Subjective:</h3> [Details...] <br><h3>Objective:</h3> [Details...] <br><h3>Assessment:</h3> [Details...] <br><h3>Plan:</h3> [Details...]`; break;
             case 'summarize': content += `<h3>Key Points:</h3> <ul><li>Point 1...</li><li>Point 2...</li></ul>`; break;
             case 'translate_es': content += `<h3>Traducción (Simulada):</h3> Este es un texto simulado traducido al español basado en la entrada.`; break;
             default: content += `(Standard structured content for ${name} would appear here)`;
         }
         return `<h2>${name.toUpperCase().replace('CUSTOM: ','')}</h2><br>${content}`;
     }


    return (
        // Re-add PublicLayout wrapper
        <PublicLayout showHeader={true} showFooter={true}> 
            {/* Adjust height calculation based on header/footer */}
            <div className="p-5 h-[calc(100vh-160px)] overflow-hidden"> 
                <div className="grid lg:grid-cols-2 gap-6 h-full">
                    {/* Input Panel */}
                    <Card className="flex flex-col h-full overflow-hidden">
                    <CardHeader className="flex-shrink-0 border-b">
                        <div className="flex justify-between items-center">
                            <CardTitle>Input Document</CardTitle>
                            <Button variant="ghost" size="sm" onClick={handleClearInput} title="Clear Input">
                                <Trash2 size={16} className="mr-1 text-red-500" /> Clear
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col flex-grow overflow-hidden">
                        <Textarea
                            id="documentInput"
                            placeholder="Paste or type your medical text here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-grow resize-none text-base h-full" // Ensure textarea fills space
                        />
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t flex-shrink-0">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.md" style={{ display: 'none' }} />
                            <Button variant="outline" size="sm" onClick={handleFileUploadClick} title="Upload text file">
                                <Upload size={16} className="mr-1" /> Upload File
                            </Button>
                            {/* Updated Dictate Button */}
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleDictate} 
                                title={isListening ? "Stop Dictation" : "Start Dictation"}
                                className={cn(isListening && "bg-red-100 border-red-300 text-red-700 hover:bg-red-200")}
                                disabled={!browserSupportsSpeech}
                            >
                                {isListening ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
                                {isListening ? 'Stop Dictating' : 'Dictate'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleUseTemplate} title="Use a template (Placeholder)">
                                <FileText size={16} className="mr-1" /> Use Template
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions & Output Panel */}
                <Card className="flex flex-col h-full overflow-hidden">
                    <CardHeader className="flex-shrink-0 border-b">
                        <CardTitle>Actions & Output</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col flex-grow overflow-y-auto"> {/* Allow scrolling */}
                        {/* Action Search */}
                        <div className="relative mb-4 flex-shrink-0">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                id="actionSearchInput"
                                placeholder="Search actions or type custom instruction + Enter..."
                                title="Search actions or type custom instruction" // Ensure title is present
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomAction()}
                                className="pl-10"
                                aria-label="Search actions or type custom instruction" // Ensure aria-label is present
                            />
                        </div>

                        {/* Actions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-shrink-0">
                            {filteredActions.map(action => (
                                <Card 
                                    key={action.id} 
                                    className="p-3 cursor-pointer hover:shadow-md hover:border-primary transition-all flex flex-col min-h-[100px]"
                                    onClick={() => handleActionClick(action.id, action.name)}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                                            {action.icon}
                                        </div>
                                        <h4 className="font-semibold text-sm">{action.name}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 flex-grow">{action.description}</p>
                                </Card>
                            ))}
                             {/* Custom Action Card */}
                             <Card 
                                className="p-3 cursor-pointer hover:shadow-md hover:border-primary transition-all flex flex-col min-h-[100px] border-dashed"
                                onClick={() => document.getElementById('actionSearchInput')?.focus()}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                                        <Wand2 size={20} className="text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Custom Action</h4>
                                </div>
                                <p className="text-xs text-gray-500 flex-grow">Enter your instruction in the search bar above and press Enter.</p>
                            </Card>
                        </div>

                        {/* Output Section */}
                        {showOutput && (
                            <div ref={outputRef} className="border-t pt-4 mt-4 flex flex-col flex-grow min-h-[200px]"> {/* Ensure min height */}
                                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                                    <h3 className="font-semibold">{outputTitle}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCopyOutput} title="Copy Output">
                                            <Copy size={14} className="mr-1" /> Copy
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadOutput} title="Download Output">
                                            <Download size={14} className="mr-1" /> Download
                                        </Button>
                                        <Button 
                                            variant={isOutputEditable ? "default" : "secondary"} 
                                            size="sm" 
                                            onClick={handleToggleEditOutput} 
                                            title={isOutputEditable ? "Disable Editing" : "Enable Editing"}
                                        >
                                            <Edit size={14} className="mr-1" /> {isOutputEditable ? 'Save' : 'Edit'}
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    id="documentOutput"
                                    contentEditable={isOutputEditable}
                                    dangerouslySetInnerHTML={{ __html: outputText }} // Render simulated HTML
                                    className={`border rounded p-4 flex-grow overflow-y-auto bg-white text-sm ${isOutputEditable ? 'ring-2 ring-primary focus:outline-none' : ''}`}
                                    // Add suppression for contentEditable warning if needed: suppressContentEditableWarning={true}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                    <p className="font-medium">{loadingMessage}</p>
                </div>
            )}
            </div>
        </PublicLayout> 
    );
};

export default DocumentTransformer;
