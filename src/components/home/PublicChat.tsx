import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Paperclip, Lightbulb, ChevronDown, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";
import { Link } from 'react-router-dom';
import { getSpecialtyBasedSuggestions } from '@/lib/personalityUtils';
// import { generateMockResponse } from '@/mock/mockAIResponse'; // No longer needed
import { getDeepSeekResponse } from '@/services/chatService'; // Import the new service
import { AIProvider, DEFAULT_PROVIDER } from '@/components/agents/services/agentService';
import QuickActions from '@/components/home/QuickActions';
import SuggestionsDropdown from '@/components/onboarding/SuggestionsDropdown';

// Dropdown menu for the "Clinical Mode" option
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatMode = 'Standard' | 'Quick answers' | 'Research mode';

// Message type for chat (can be imported from LandingPage or defined locally if preferred)
export interface ChatMessage { // Exporting for potential use in LandingPage if it imports this type
  id: string; // Added id
  sender: 'user' | 'ai'; // Changed role to sender
  text: string; // Changed content to text
  timestamp: Date;
  attachments?: string[]; // Kept attachments for local UI handling if needed
}

interface PublicChatProps {
  isChatActive: boolean;
  toggleChatActive: (active?: boolean) => void;
  messages: ChatMessage[]; // Messages from LandingPage
  onNewMessage: (messageContent: { text: string; attachments?: string[] }, sender: 'user' | 'ai') => void; // Callback to LandingPage
}

// This component renders the landing page with the new design and integrated chat
const PublicChat: React.FC<PublicChatProps> = ({ isChatActive, toggleChatActive, messages, onNewMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Refs for lightbulb buttons
    const lightbulbRef = useRef<HTMLButtonElement>(null);
    
    // State variables for functionality
    const [showLightbulbDialog, setShowLightbulbDialog] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>('Standard');
    const [aiProvider, setAIProvider] = useState<AIProvider>(DEFAULT_PROVIDER);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    // Removed local chatMessages state, using props.messages instead
    const [isResponding, setIsResponding] = useState(false); // Keep for UI feedback during AI response
    
    // Get suggestions using the imported function
    const suggestions = getSpecialtyBasedSuggestions();

    // Scroll to bottom of chat when messages prop changes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };
    
    // Handle key press in the textarea - with direct form submission
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift key)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default to avoid new line
            
            // Only submit if there's content or files and we're not already responding
            if ((inputValue.trim() || selectedFiles.length > 0) && !isResponding) {
                // Call handleSubmit directly with a synthetic event
                handleSubmit(new Event('submit') as unknown as React.FormEvent);
            }
        }
    };

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Handle submitting the chat form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (trimmedInput || selectedFiles.length > 0) {
            const attachmentNames = selectedFiles.map(file => file.name);
            const messageContent = {
                text: trimmedInput,
                attachments: attachmentNames.length > 0 ? attachmentNames : undefined,
            };

            onNewMessage(messageContent, 'user'); // Send user message to LandingPage

            // Clear input and files
            setInputValue('');
            setSelectedFiles([]); // Clear selected files after sending
            setIsTyping(false);
            setShowLightbulbDialog(false);

            if (!isChatActive) {
              toggleChatActive(true);
            }
            
            // Simulate AI response and send it to LandingPage
            await handleAIResponse(trimmedInput);

            // Ensure input field regains focus after sending a message and getting a response
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };
    
    // Handle AI response using the new getDeepSeekResponse service
    const handleAIResponse = async (query: string) => {
        setIsResponding(true);
        try {
            // Prepare the conversation history for the API
            // The 'messages' prop already contains the history.
            // We need to ensure it's in the format expected by getDeepSeekResponse if it's different
            // from the ChatMessage type defined in chatService.ts.
            // For now, assuming 'messages' prop is compatible or can be mapped.
            // The getDeepSeekResponse function expects ChatMessage[] from chatService.ts
            // The PublicChat component uses its own ChatMessage interface. Let's map it.
            const serviceChatMessages = messages.map(m => ({
                id: m.id,
                session_id: '', // session_id is not directly relevant for this proxy call context
                sender: m.sender,
                text: m.text,
                timestamp: m.timestamp.toISOString(), // Convert Date to string
            }));

            const responseText = await getDeepSeekResponse(serviceChatMessages, query);
            onNewMessage({ text: responseText }, 'ai'); // Send AI message to LandingPage
            
            setTimeout(scrollToBottom, 100); // Scroll after state update in parent
        } catch (error) {
            console.error('Error getting AI response from DeepSeek:', error);
            let errorMessage = 'Sorry, I encountered an error. Please try again.';

            // Type guard for Supabase Function errors or custom errors
            interface CustomError {
              message?: string;
              details?: string;
              error?: string | { message?: string }; // Edge function might return { error: "message" } or { error: { message: "..." } }
              context?: { errorMessage?: string };
              // Allow other properties, using unknown for better type safety than any
              [key: string]: unknown;
            }

            if (typeof error === 'object' && error !== null) {
                const customError = error as CustomError;
                if (typeof customError.error === 'object' && customError.error !== null && customError.error.message) {
                    errorMessage = `Error: ${customError.error.message}`;
                } else if (typeof customError.error === 'string') {
                    errorMessage = `Error: ${customError.error}`;
                } else if (customError.details) {
                    errorMessage = `Error: ${customError.details}`;
                } else if (customError.context?.errorMessage) {
                    errorMessage = `Error: ${customError.context.errorMessage}`;
                } else if (customError.message) {
                    errorMessage = `Error: ${customError.message}`;
                }
            } else if (error instanceof Error) {
                 errorMessage = `Error: ${error.message}`;
            }

            onNewMessage({ text: errorMessage }, 'ai');
        } finally {
            setIsResponding(false);
        }
    };

    const handleQuickAction = (query: string) => {
        // Set the input value
        setInputValue(query);
        setIsTyping(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        
        // Hide lightbulb dialog if it was showing
        setShowLightbulbDialog(false);
    };
    
    // Handle suggestion click from the suggestions modal
    const handleSuggestionClick = (query: string) => {
        setInputValue(query);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        
        // Hide modal
        setShowLightbulbDialog(false);
    };
    
    // Function to handle setting the chat mode
    const handleSetChatMode = (mode: ChatMode) => {
        setChatMode(mode);
    };
    
    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    // Remove a file from the selected files
    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Open file dialog
    const handleOpenFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    // Toggle the lightbulb dialog
    const toggleLightbulb = () => {
        setShowLightbulbDialog(prev => !prev);
    };
    
    // Format message with basic markdown
    const formatMessage = (content: string) => {
        let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace newlines with <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Handle sections like QUESTION:, DIAGNOSIS:, etc.
        formatted = formatted.replace(/(QUESTION:|DIAGNOSIS\/ANALYSIS:|SUMMARY:|REFERENCES:)/g, 
            '<strong class="text-blue-600">$1</strong>');
        
        return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <div className={cn(
            "flex flex-col",
            isChatActive ? "h-full w-full" : "min-h-screen bg-neutral-50 relative overflow-hidden"
        )}>
            {!isChatActive && (
                <>
                    {/* Background decorative elements */}
                    <div className="absolute top-[5%] right-[-5%] w-[30vw] h-[30vw] bg-tertiary opacity-15 rounded-[40%_60%_65%_35%/40%_45%_55%_60%] z-0"
                        style={{ transform: "rotate(20deg)" }} />
                    <div className="absolute bottom-[18%] left-[-10%] w-[40vw] h-[40vw] bg-primary opacity-10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0"
                        style={{ transform: "rotate(-15deg)" }} />
                    <div className="absolute bottom-[15%] right-[8%] w-24 h-24 bg-secondary opacity-15 z-0"
                        style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", transform: "rotate(-10deg)" }} />
                </>
            )}
            
            <div className={cn(
                "relative z-10 flex flex-col flex-1",
                isChatActive ? "h-full" : "container mx-auto px-4 py-16"
            )}>
                {!isChatActive && (
                    <div className="max-w-3xl mx-auto mt-8 sm:mt-12 md:mt-16">
                        {/* Tagline */}
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-neutral-800 mb-4 sm:mb-6 transform -rotate-[0.5deg] relative px-3 sm:px-0">
                            Doc's Best Friend, Patient's Hero
                            <span className="absolute bottom-[-6px] sm:bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 sm:w-32 md:w-40 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-primary to-secondary"></span>
                        </h1>
                        <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 font-light px-4 sm:px-6">
                            Your pocket clinician: Save Time, Boost Care, Get Fast Answers
                        </p>
                    </div>
                )}
                
                {/* Integrated Chat Interface - takes full height in active chat mode */}
                <div className={cn(
                    "flex flex-col flex-1", // Ensures it takes available space
                    isChatActive
                        ? "h-full w-full" // Full height and width when chat is active
                        : "bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mb-10 max-w-3xl mx-auto" // Original styling
                )}>
                    {/* Chat History Section */}
                    <div
                        ref={chatContainerRef}
                        className={cn(
                            "overflow-y-auto p-4 space-y-4 flex-1", // flex-1 to grow and take space
                            isChatActive ? "h-0" : "max-h-[400px] border-b border-gray-100" // h-0 with flex-1 allows it to grow
                        )}
                    >
                        {messages.map((msg) => ( // Use messages from props
                            <div
                                key={msg.id} // Use message id as key
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-lg p-3",
                                        msg.sender === 'user'
                                            ? "bg-blue-500 text-white rounded-tr-none"
                                            : "bg-gray-100 text-gray-700 rounded-tl-none dark:bg-gray-700 dark:text-gray-200"
                                    )}
                                >
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mb-2 flex flex-wrap gap-1">
                                            {msg.attachments.map((fileName, i) => (
                                                <div
                                                    key={i}
                                                    className={`text-xs px-2 py-1 rounded-full ${msg.sender === 'user' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-100'}`}
                                                >
                                                    <Paperclip size={10} className="inline mr-1" />
                                                    <span className="truncate max-w-[120px] inline-block align-bottom">{fileName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className={`${msg.sender === 'ai' ? 'prose prose-sm max-w-full dark:prose-invert' : ''}`}>
                                        {formatMessage(msg.text)} {/* Use msg.text */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isResponding && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Input Form - fixed at bottom in active chat mode */}
                    <form onSubmit={handleSubmit} className={cn(
                        "p-3",
                        isChatActive ? "mt-auto border-t border-gray-200 bg-white" : "" // mt-auto pushes to bottom, add bg for visibility
                    )}>
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex-1 px-3 py-2">
                                <textarea
                                    ref={inputRef}
                                    placeholder="Ask me anything medical..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border-none outline-none text-gray-700 placeholder:text-gray-500 resize-none min-h-[60px]"
                                    rows={1}
                                />
                            </div>
                            <div className="px-2 flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple
                                    aria-label="Upload files"
                                />
                                <button
                                    type="button"
                                    onClick={handleOpenFileDialog}
                                    className="p-1.5 rounded transition-colors text-gray-500 hover:text-gray-700"
                                    aria-label="Attach files"
                                >
                                    <Paperclip size={18} />
                                </button>
                                <button
                                    type="button"
                                    ref={lightbulbRef}
                                    onClick={toggleLightbulb}
                                    className={`p-1.5 rounded transition-colors ${showLightbulbDialog ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-700'}`}
                                    aria-label="Show suggestions"
                                >
                                    <Lightbulb size={18} />
                                </button>
                                <div className="border-l border-gray-200 h-6 mx-1"></div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                                            <span>{chatMode}</span>
                                            <ChevronDown size={14} className="text-gray-600" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md !rounded-md !p-0 overflow-hidden min-w-[140px]">
                                        <DropdownMenuItem onClick={() => handleSetChatMode('Standard')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-sm py-2.5">Standard</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSetChatMode('Quick answers')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-sm py-2.5">Quick answers</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSetChatMode('Research mode')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-sm py-2.5">Research mode</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button
                                    type="submit"
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full transform rotate-5 transition-all",
                                        "hover:scale-110 hover:bg-blue-600 hover:shadow-md",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                    disabled={!inputValue.trim() && selectedFiles.length === 0 || isResponding}
                                    aria-label="Send message"
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md flex items-center">
                                        <span className="mr-1">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
                
                {!isChatActive && (
                    <>
                        {/* Suggestions Dropdown */}
                        <SuggestionsDropdown
                            isVisible={showLightbulbDialog}
                            onSuggestionClick={handleSuggestionClick}
                            onClose={() => setShowLightbulbDialog(false)}
                            triggerRef={lightbulbRef}
                        />
                        {/* Quick Actions */}
                        <QuickActions
                            onSelectPrompt={handleQuickAction}
                            isHidden={isTyping || showLightbulbDialog}
                        />
                    </>
                )}
            </div>
            
            {!isChatActive && (
                <div className="max-w-7xl mx-auto mt-32 container px-4"> {/* Ensure container padding for sections below chat */}
                    <div className="my-12 md:my-16">
                        <BenefitsSection />
                    </div>
                    <div className="my-12 md:my-16">
                        <FeaturesSection />
                    </div>
                    <div className="mb-16">
                        <CTASection />
                    </div>
                    <div className="mb-16">
                        <SecurityBanner />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicChat;
