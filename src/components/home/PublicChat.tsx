import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, Lightbulb, ChevronDown, X, Send, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";
import { Link } from 'react-router-dom';
import { getSpecialtyBasedSuggestions } from '@/lib/personalityUtils'; 
import { generateMockResponse } from '@/mock/mockAIResponse';
import { AIProvider, DEFAULT_PROVIDER } from '@/components/agents/services/agentService';
import QuickActions from '@/components/home/QuickActions';

// Dialog/Tooltip components for the paperclip popup
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Dropdown menu for the "Clinical Mode" option
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatMode = 'Standard' | 'Quick answers' | 'Research mode';

// Message type for chat
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

// This component renders the landing page with the new design
const PublicChat = () => {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatInputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const landingFileInputRef = useRef<HTMLInputElement>(null); // New ref for landing page file input
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // New state variables for the added functionality
    const [showLightbulbDialog, setShowLightbulbDialog] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>('Standard');
    const [aiProvider, setAIProvider] = useState<AIProvider>(DEFAULT_PROVIDER);
    const [landingSelectedFiles, setLandingSelectedFiles] = useState<File[]>([]); // New state for landing page file selection
    
    // State for chat modal
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isResponding, setIsResponding] = useState(false);
    const [chatInputValue, setChatInputValue] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    // Get suggestions using the imported function
    const suggestions = getSpecialtyBasedSuggestions();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

    const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChatInputValue(e.target.value);
    };

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Handle submitting the landing page search form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() || landingSelectedFiles.length > 0) {
            // Open chat modal with the query and any files
            startChat(inputValue, landingSelectedFiles);
        }
    };

    // Start a chat with an initial query
    const startChat = (initialQuery: string, initialFiles: File[] = []) => {
        // Reset the chat state and open the modal
        setChatMessages([]);
        setIsChatModalOpen(true);
        
        // Create file attachment names to display
        const attachmentNames = initialFiles.map(file => file.name);
        
        // Create initial user message
        const userMessage = {
            role: 'user',
            content: initialQuery.trim(),
            timestamp: new Date(),
            attachments: attachmentNames.length > 0 ? attachmentNames : undefined
        };
        
        setChatMessages([userMessage]);
        setInputValue('');
        setIsTyping(false);
        setShowLightbulbDialog(false);
        
        // Transfer files from landing to chat modal
        setSelectedFiles(initialFiles);
        setLandingSelectedFiles([]);
        
        // Generate AI response
        handleAIResponse(initialQuery);
    };
    
    // Handle AI response using the mock function
    const handleAIResponse = async (query: string) => {
        setIsResponding(true);
        
        try {
            // Use the selected AI provider rather than determining by chat mode
            const response = await generateMockResponse(query, aiProvider);
            
            // Add AI response to chat
            setChatMessages(prev => [
                ...prev, 
                {
                    role: 'assistant',
                    content: response,
                    timestamp: new Date()
                }
            ]);
            
            // Scroll to see the response
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Error getting AI response:', error);
            // Add error message to chat
            setChatMessages(prev => [
                ...prev, 
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsResponding(false);
        }
    };
    
    // Handle submitting a message in the chat modal
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInputValue.trim() || selectedFiles.length > 0) {
            // Create file attachment names to display
            const attachmentNames = selectedFiles.map(file => file.name);
            
            // Add user message to chat
            const userMessage = {
                role: 'user',
                content: chatInputValue.trim(),
                timestamp: new Date(),
                attachments: attachmentNames.length > 0 ? attachmentNames : undefined
            };
            
            setChatMessages(prev => [...prev, userMessage]);
            
            // Clear input and reset state
            setChatInputValue('');
            setSelectedFiles([]);
            
            // Scroll to see the user message
            setTimeout(scrollToBottom, 100);
            
            // Send for AI response
            await handleAIResponse(userMessage.content);
        }
    };

    const handleQuickAction = (query: string) => {
        // For demo purposes, we'll just set the input value
        setInputValue(query);
        setIsTyping(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // Hide lightbulb dialog if it was showing
        setShowLightbulbDialog(false);
    };
    
    // Toggle the lightbulb dialog
    const toggleLightbulbDialog = () => {
        setShowLightbulbDialog(prev => !prev);
    };
    
    // Function to handle setting the chat mode
    const handleSetChatMode = (mode: ChatMode) => {
        setChatMode(mode);
    };
    
    // Handle file upload in the chat modal
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    // Handle file upload in the landing page
    const handleLandingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setLandingSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    // Open file dialog
    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };
    
    // Open file dialog for landing page
    const handleOpenLandingFileDialog = () => {
        landingFileInputRef.current?.click();
    };
    
    // Remove a file from selected files
    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Remove a file from landing page selected files
    const handleRemoveLandingFile = (index: number) => {
        setLandingSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Format the chat message content with basic markdown-like formatting
    const formatMessage = (content: string) => {
        // Replace ** with bold
        let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace newlines with <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Handle sections like QUESTION:, DIAGNOSIS:, etc.
        formatted = formatted.replace(/(QUESTION:|DIAGNOSIS\/ANALYSIS:|SUMMARY:|REFERENCES:)/g, 
            '<strong class="text-blue-600">$1</strong>');
        
        return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[5%] right-[-5%] w-[30vw] h-[30vw] bg-tertiary opacity-15 rounded-[40%_60%_65%_35%/40%_45%_55%_60%] z-0" 
                style={{ transform: "rotate(15deg)" }} />
            <div className="absolute bottom-[10%] left-[-5%] w-[25vw] h-[25vw] bg-accent opacity-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] z-0" 
                style={{ transform: "rotate(-5deg)" }} />
            
            {/* Decorative elements */} 
            <div className="absolute top-[15%] left-[5%] w-20 h-20 bg-accent opacity-20 z-0"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)", transform: "rotate(15deg)" }} />
            <div className="absolute bottom-[15%] right-[8%] w-24 h-24 bg-secondary opacity-15 z-0"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", transform: "rotate(-10deg)" }} />
            
            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Header is now provided by PublicLayout */}
                
                <div className="max-w-3xl mx-auto mt-8 sm:mt-12 md:mt-16">
                    {/* Tagline */}
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-neutral-800 mb-4 sm:mb-6 transform -rotate-[0.5deg] relative px-3 sm:px-0">
                        Doc's Best Friend, Patient's Hero
                        <span className="absolute bottom-[-6px] sm:bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 sm:w-32 md:w-40 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-primary to-secondary"></span>
                    </h1>
                    <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 font-light px-4 sm:px-6">
                        Your pocket clinician: Save Time, Boost Care, Get Fast Answers
                    </p>
                    
                    {/* Search Box */}
                    <div className="relative mb-10">
                        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="px-3 sm:px-5 py-3 sm:py-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ask me anything medical..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="w-full border-none outline-none text-gray-700 placeholder:text-gray-500 text-base sm:text-lg"
                                />
                            </div>
                            
                            <div className="px-3 sm:px-5 py-2 sm:py-3 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 border-t border-gray-200">
                                {/* Left side icons - paperclip added */}
                                <div className="flex gap-2 sm:gap-3 order-1">
                                    <input
                                        type="file"
                                        ref={landingFileInputRef}
                                        onChange={handleLandingFileChange}
                                        className="hidden"
                                        multiple
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleOpenLandingFileDialog}
                                        className="p-1.5 rounded transition-colors text-gray-500 hover:text-gray-700"
                                        aria-label="Attach files"
                                    >
                                        <Paperclip size={16} className="sm:size-18" />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={toggleLightbulbDialog}
                                        className={`p-1.5 rounded transition-colors ${showLightbulbDialog ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-700'}`}
                                        aria-label="Show suggestions"
                                    >
                                        <Lightbulb size={16} className="sm:size-18" />
                                    </button>
                                </div>
                                
                                {/* Right side controls */}
                                <div className="flex items-center gap-2 sm:gap-4 order-2 ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                                                <span className="truncate max-w-[60px] sm:max-w-none">{chatMode}</span>
                                                <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md !rounded-md !p-0 overflow-hidden min-w-[140px]">
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Standard')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm py-2 sm:py-2.5">
                                                Standard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Quick answers')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm py-2 sm:py-2.5">
                                                Quick answers
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Research mode')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm py-2 sm:py-2.5">
                                                Research mode
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <button 
                                        type="submit" 
                                        className={cn(
                                            "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-500 text-white rounded-full transform rotate-5 transition-all",
                                            "hover:scale-110 hover:bg-blue-600 hover:shadow-md",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                        disabled={!inputValue.trim() && landingSelectedFiles.length === 0}
                                        style={{ borderRadius: "50% 30% 45% 40%" }}
                                        aria-label="Submit query"
                                    >
                                        <ArrowRight size={18} className="sm:size-20" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        {/* Selected files display */}
                        {landingSelectedFiles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {landingSelectedFiles.map((file, index) => (
                                    <div key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md flex items-center">
                                        <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[120px]">{file.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveLandingFile(index)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Lightbulb Suggestions Dialog - Updated to match screenshot exactly */}
                    <Dialog open={showLightbulbDialog} onOpenChange={setShowLightbulbDialog}>
                        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg border-0">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Lightbulb size={20} className="text-blue-500" />
                                    <span className="font-medium">Try asking about:</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {suggestions.slice(0, 3).map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickAction(suggestion)}
                                        className="w-full text-left py-2 px-3 rounded-md text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">{index + 1}</span>
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    {/* Chat Modal */}
                    <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
                        <DialogContent className="w-[95vw] xs:max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-neutral-50 flex flex-col">
                            <DialogHeader className="bg-primary p-2 sm:p-3 md:p-4 text-white">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-white font-semibold text-xs sm:text-sm">L</span>
                                    </div>
                                    <div className="overflow-hidden ml-2">
                                        <DialogTitle className="text-xs sm:text-sm md:text-base truncate">Chat with Leny AI Medical Assistant</DialogTitle>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex items-center text-[10px] sm:text-xs space-x-2">
                                                <span className="font-medium text-white">DeepSeek</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>
                            
                            {/* Chat messages area */}
                            <div 
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6"
                            >
                                {chatMessages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div 
                                            className={cn(
                                                "max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] rounded-lg p-2 xs:p-3 sm:p-4",
                                                msg.role === 'user' 
                                                    ? "bg-blue-500 text-white rounded-tr-none" 
                                                    : "bg-white shadow-sm border border-gray-200 rounded-tl-none"
                                            )}
                                        >
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className="mb-2 flex flex-wrap gap-1 sm:gap-2">
                                                    {msg.attachments.map((fileName, i) => (
                                                        <div 
                                                            key={i} 
                                                            className={`text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full ${msg.role === 'user' ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-700'}`}
                                                        >
                                                            <Paperclip size={8} className="xs:size-10 inline mr-0.5 xs:mr-1" />
                                                            <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[120px] inline-block align-bottom">{fileName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className={`${msg.role === 'assistant' ? 'text-gray-700 prose prose-xs xs:prose-sm max-w-full' : 'text-xs xs:text-sm sm:text-base'}`}>
                                                {formatMessage(msg.content)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Loading indicator */}
                                {isResponding && (
                                    <div className="flex justify-start">
                                        <div className="bg-white shadow-sm border border-gray-200 rounded-lg rounded-tl-none max-w-[80%] p-3 sm:p-4">
                                            <div className="flex space-x-2">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Input area */}
                            <div className="border-t border-gray-200 bg-white p-2 xs:p-3 sm:p-4">
                                <form onSubmit={handleChatSubmit} className="relative">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full">
                                            <div className="flex-1 px-2 xs:px-3 py-1.5 xs:py-2">
                                                <textarea
                                                    ref={chatInputRef}
                                                    placeholder="Ask a follow-up question..."
                                                    value={chatInputValue}
                                                    onChange={handleChatInputChange}
                                                    className="w-full border-none outline-none text-gray-700 placeholder:text-gray-400 resize-none min-h-[36px] xs:min-h-[40px] sm:min-h-[60px] text-xs xs:text-sm sm:text-base"
                                                    rows={1}
                                                />
                                            </div>
                                            
                                            <div className="px-1 xs:px-2 flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    multiple
                                                />
                                                {/* File Upload Button */}
                                                <button 
                                                    type="button" 
                                                    onClick={handleOpenFileDialog} 
                                                    className="text-gray-500 hover:text-gray-700 p-1 xs:p-1.5 rounded transition-colors"
                                                    aria-label="Attach files"
                                                >
                                                    <Paperclip size={14} className="xs:size-16 sm:size-18" />
                                                </button>

                                                {/* Suggestions Button */}
                                                <button 
                                                    type="button" 
                                                    onClick={toggleLightbulbDialog}
                                                    className={`p-1 xs:p-1.5 rounded transition-colors ${showLightbulbDialog ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-700'}`}
                                                    aria-label="Show suggestions"
                                                >
                                                    <Lightbulb size={14} className="xs:size-16 sm:size-18" />
                                                </button>
                                                
                                                <div className="hidden xs:block border-l border-gray-100 h-5 xs:h-6 mx-0.5 xs:mx-1"></div>
                                                
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="bg-gray-100 text-gray-700 text-[10px] xs:text-xs sm:text-sm px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1 sm:py-1.5 rounded-md flex items-center gap-1 cursor-pointer hover:bg-gray-200 transition-colors truncate max-w-[60px] xs:max-w-[80px] sm:max-w-none">
                                                            <span className="truncate">{chatMode}</span>
                                                            <ChevronDown size={12} className="text-gray-600 flex-shrink-0" />
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md !rounded-md !p-0 overflow-hidden">
                                                        <DropdownMenuItem onClick={() => handleSetChatMode('Standard')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm">
                                                            Standard
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSetChatMode('Quick answers')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm">
                                                            Quick answers
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSetChatMode('Research mode')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer text-xs sm:text-sm">
                                                            Research mode
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                
                                                <button 
                                                    type="submit" 
                                                    className={cn(
                                                        "w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 ml-1 flex items-center justify-center bg-blue-500 text-white rounded-full transition-all",
                                                        "hover:bg-blue-600",
                                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                                    )}
                                                    disabled={!chatInputValue.trim() && selectedFiles.length === 0 || isResponding}
                                                    aria-label="Send message"
                                                >
                                                    <Send size={14} className="xs:size-16 sm:size-18" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Selected files display */}
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1 xs:gap-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="bg-gray-100 text-gray-800 text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md flex items-center">
                                                    <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[120px]">{file.name}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                                        aria-label={`Remove ${file.name}`}
                                                    >
                                                        <X size={10} className="xs:size-12" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    {/* Quick Actions */}
                    <QuickActions 
                        onSelectPrompt={handleQuickAction}
                        isHidden={isTyping || showLightbulbDialog}
                    />
                </div>
                
                {/* Landing Page Sections */}
                <div className="max-w-7xl mx-auto mt-32">
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
            </div>
        </div>
    );
};

export default PublicChat;
