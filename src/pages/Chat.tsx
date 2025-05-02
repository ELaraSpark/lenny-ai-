import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Bot, FileText, Image, ToggleLeft, ToggleRight, ChevronDown, PaperclipIcon, Send, Lightbulb } from 'lucide-react';
import ChatInput from '@/components/agents/ChatInput';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalChatMessage from '@/components/agents/ProfessionalChatMessage';
import { 
    getPersonalizedGreeting, 
    getLoadingMessage, 
    getSpecialtyBasedSuggestions,
} from '@/lib/personalityUtils';
import { generateAIResponse, AIProvider, DEFAULT_PROVIDER } from '@/components/agents/services/agentService';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    attachments?: File[];
}

// Define chat style options
type ChatMode = 'Standard' | 'Deep Research' | 'Quick Summary' | 'Clinical Guidelines';

// This component renders the core chat UI
const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [personalizedGreeting, setPersonalizedGreeting] = useState<string>("");
    const [chatMode, setChatMode] = useState<ChatMode>('Standard');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    
    // AI provider state with toggle UI
    const [aiProvider, setAIProvider] = useState<AIProvider>(DEFAULT_PROVIDER);
    
    // Toggle AI provider
    const toggleAIProvider = () => {
        setAIProvider(prev => prev === 'deepseek' ? 'deepseek' : 'deepseek');
    };
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };
    
    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };
    
    // Remove attachment
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    // Open file dialog
    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };
    
    // Toggle suggestions popover
    const handleLightbulbClick = () => {
        setShowSuggestions(prev => !prev);
    };
    
    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    
    // Handle sending messages with attachments
    const handleSendMessage = async (messageText: string, files?: File[]) => {
        if (!messageText.trim() && (!files || files.length === 0) && attachments.length === 0) {
            return;
        }
        
        const allAttachments = [...(attachments || []), ...(files || [])];
        
        // Create user message with attachments
        const userMessage: ChatMessage = { 
            sender: 'user', 
            text: messageText,
            attachments: allAttachments.length > 0 ? allAttachments : undefined
        };
        
        try {
            setMessages(prev => [...prev, userMessage]);
            setIsSending(true);
            setLoadingMessage(getLoadingMessage());
            setInputValue("");
            setAttachments([]);
            
            // Create a mock agent for now
            const mockAgent = {
                id: "leny",
                name: "Leny",
                specialty: "General Medicine",
                description: "AI medical assistant",
                icon: () => null,
                capabilities: []
            };
            
            // Call the AI service with the message and attachments
            const response = await generateAIResponse(
                messageText,
                mockAgent,
                allAttachments,
                aiProvider
            );
            
            // Create bot message with the response
            const botMessage: ChatMessage = { 
                sender: 'bot', 
                text: response 
            };
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error during AI response:", error);
            // Add error message to chat
            const errorMessage: ChatMessage = {
                sender: 'bot',
                text: "I'm sorry, I encountered an error while processing your request. Please try again."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue, attachments);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Initialize personalized greeting on first load
    useEffect(() => {
        setPersonalizedGreeting(getPersonalizedGreeting(getUserFirstName())); 
    }, []);

    // Get user's first name from email
    const getUserFirstName = () => {
        if (!user?.email) return undefined;
        const emailName = user.email.split('@')[0].split('.')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    };

    // Dynamic suggestions
    const suggestions = getSpecialtyBasedSuggestions();

    const showInitialState = messages.length === 0;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {showInitialState ? (
                // Initial state with centered content
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 overflow-y-auto">
                    <div className="max-w-[600px] w-full flex flex-col items-center">
                        {/* Logo Icon */}
                        <div className="mb-6 text-primary">
                            <PicassoIllustration
                                name="healing"
                                size="md"
                                color="text-primary"
                            />
                        </div>
                        
                        {/* Title with gradient */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-1">
                            <span className="bg-gradient-to-r from-teal-500 to-amber-400 bg-clip-text text-transparent">
                                Find clinical answers instantly
                            </span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-lg text-gray-500 text-center mb-10">
                            Your friendly AI medical assistant is here to help
                        </p>
                        
                        {/* Input Form */}
                        <form 
                            onSubmit={handleSubmit} 
                            className="w-full relative mb-8 group"
                        >
                            <div className="relative flex items-center w-full">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Ask me anything medical..."
                                    className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full resize-none overflow-hidden min-h-[50px] max-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    rows={1}
                                />
                                
                                <Button 
                                    type="submit" 
                                    disabled={!inputValue.trim() && attachments.length === 0} 
                                    className="absolute right-2 rounded-full h-8 w-8 flex items-center justify-center bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                            
                            {/* Attachments display */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 px-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="bg-gray-100 rounded-md px-2 py-1 flex items-center text-xs">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button 
                                                type="button" 
                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                                onClick={() => removeAttachment(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex items-center mt-2 px-2">
                                {/* Hidden file input */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                    multiple
                                />
                                
                                {/* Paperclip button */}
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:bg-transparent hover:text-gray-700"
                                    onClick={handlePaperclipClick}
                                >
                                    <PaperclipIcon size={16} />
                                </Button>
                                
                                {/* Lightbulb button */}
                                <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-gray-500 hover:bg-transparent hover:text-gray-700 ml-1"
                                            onClick={handleLightbulbClick}
                                        >
                                            <Lightbulb size={16} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0">
                                        <div className="p-3 border-b border-gray-100">
                                            <h3 className="font-medium">Try asking about:</h3>
                                        </div>
                                        <div className="p-3 max-h-60 overflow-y-auto">
                                            {suggestions.slice(0, 5).map((suggestion, index) => (
                                                <div 
                                                    key={index} 
                                                    className="py-1.5 px-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                
                                {/* Standard dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-gray-500 hover:bg-transparent hover:text-gray-700 ml-1 flex items-center"
                                        >
                                            <span className="text-xs">{chatMode}</span>
                                            <ChevronDown size={14} className="ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setChatMode('Standard')}>
                                            Standard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Deep Research')}>
                                            Deep Research
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Quick Summary')}>
                                            Quick Summary
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Clinical Guidelines')}>
                                            Clinical Guidelines
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </form>
                        
                        {/* Suggestion buttons */}
                        <div className="w-full">
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestions.slice(0, 3).map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="rounded-full border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                                    >
                                        {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Message conversation view
                <div className="flex flex-1 flex-col h-full w-full">
                    {/* Messages container */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="max-w-3xl mx-auto">
                            {messages.map((msg, index) => {
                                if (msg.sender === 'user') {
                                    return (
                                        <div key={index} className="flex justify-end mb-4">
                                            <div className="max-w-[80%] bg-primary text-white py-2 px-4 rounded-l-lg rounded-tr-lg">
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {msg.attachments.map((file, fileIndex) => (
                                                            <div key={fileIndex} className="bg-white/20 rounded-md px-2 py-1 text-xs flex items-center">
                                                                <span className="truncate max-w-[120px]">{file.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index} className="flex mb-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                                                <PicassoAvatar
                                                    name="Leny"
                                                    illustrationType="healing"
                                                    size="xs"
                                                    color="text-primary"
                                                />
                                            </div>
                                            <div className="max-w-[80%] bg-gray-100 py-2 px-4 rounded-r-lg rounded-bl-lg">
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                            {isSending && (
                                <div className="flex mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                                        <PicassoAvatar
                                            name="Leny"
                                            illustrationType="healing"
                                            size="xs"
                                            color="text-primary"
                                        />
                                    </div>
                                    <div className="max-w-[80%] bg-gray-100 py-2 px-4 rounded-r-lg rounded-bl-lg">
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    
                    {/* Input form at bottom */}
                    <div className="border-t border-gray-200 p-4">
                        <form 
                            onSubmit={handleSubmit} 
                            className="max-w-3xl mx-auto relative"
                        >
                            <div className="relative flex items-center w-full">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Ask me anything medical..."
                                    className="w-full py-3 px-4 pr-12 border border-gray-200 rounded-full resize-none overflow-hidden min-h-[50px] max-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    rows={1}
                                />
                                
                                <Button 
                                    type="submit" 
                                    disabled={(!inputValue.trim() && attachments.length === 0) || isSending} 
                                    className="absolute right-2 rounded-full h-8 w-8 flex items-center justify-center bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                            
                            {/* Attachments display */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 px-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="bg-gray-100 rounded-md px-2 py-1 flex items-center text-xs">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button 
                                                type="button" 
                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                                onClick={() => removeAttachment(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex items-center mt-2 px-2">
                                {/* Hidden file input */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                    multiple
                                />
                                
                                {/* Paperclip button */}
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:bg-transparent hover:text-gray-700"
                                    onClick={handlePaperclipClick}
                                >
                                    <PaperclipIcon size={16} />
                                </Button>
                                
                                {/* Lightbulb button */}
                                <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-gray-500 hover:bg-transparent hover:text-gray-700 ml-1"
                                            onClick={handleLightbulbClick}
                                        >
                                            <Lightbulb size={16} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0">
                                        <div className="p-3 border-b border-gray-100">
                                            <h3 className="font-medium">Try asking about:</h3>
                                        </div>
                                        <div className="p-3 max-h-60 overflow-y-auto">
                                            {suggestions.slice(0, 5).map((suggestion, index) => (
                                                <div 
                                                    key={index} 
                                                    className="py-1.5 px-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                
                                {/* Standard dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-gray-500 hover:bg-transparent hover:text-gray-700 ml-1 flex items-center"
                                        >
                                            <span className="text-xs">{chatMode}</span>
                                            <ChevronDown size={14} className="ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setChatMode('Standard')}>
                                            Standard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Deep Research')}>
                                            Deep Research
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Quick Summary')}>
                                            Quick Summary
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setChatMode('Clinical Guidelines')}>
                                            Clinical Guidelines
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
