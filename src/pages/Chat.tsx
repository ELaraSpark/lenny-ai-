import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Bot, FileText, Image, ToggleLeft, ToggleRight, ChevronDown, PaperclipIcon, Send, Lightbulb, ArrowRight, X } from 'lucide-react';
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
import QuickActions from '@/components/home/QuickActions';
import { QUICK_ACTIONS } from '@/components/quickActionsData';
import SuggestionsDropdown from '@/components/onboarding/SuggestionsDropdown';
import { createPortal } from 'react-dom';
import { Agent } from '@/components/agents/types/agentTypes';

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    timestamp?: Date;
    attachments?: File[];
}

type ChatMode = 'Standard' | 'Deep Research' | 'Quick Summary' | 'Clinical Guidelines';

// Define a minimal agent object for Deepseek
const deepseekAgent: Agent = {
    id: 'deepseek-agent',
    name: 'Deepseek AI',
    specialty: 'Research',
    description: 'An AI specialized in deep research.',
    icon: () => null, // Placeholder icon
    capabilities: ['research', 'analysis'],
    category: 'general',
};

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
    const { user } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lightbulbRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        setPersonalizedGreeting(getPersonalizedGreeting(user?.name || ""));
        setLoadingMessage(getLoadingMessage());
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, [user]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...newFiles]);
            e.target.value = '';
        }
    };
    
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    const handleLightbulbClick = () => {
        setShowSuggestions(prev => !prev);
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    
    const handleQuickAction = (prompt: string) => {
        setInputValue(prompt);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    
    const handleSendMessage = async (messageText: string, files?: File[]) => {
        if (!messageText.trim() && (!files || files.length === 0)) return;
        
        setIsSending(true);
        
        const userMessage: ChatMessage = { 
            sender: 'user', 
            text: messageText,
            attachments: files,
            timestamp: new Date() // Added timestamp for user message
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        setInputValue('');
        setIsTyping(false);
        setShowSuggestions(false);
        setAttachments([]);
        
        const providerToUse: AIProvider = 'deepseek';

        try {
            const response = await generateAIResponse(
                messageText, 
                deepseekAgent, // Pass the deepseekAgent object
                files,         // Pass attachments
                providerToUse  // Explicitly pass 'deepseek' as the provider
            );
            
            const botMessage: ChatMessage = { 
                sender: 'bot', 
                text: response,
                timestamp: new Date() // Added timestamp for bot message
            };
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error during AI response:", error);
            const errorMessage: ChatMessage = {
                sender: 'bot',
                text: "I'm sorry, I encountered an error while processing your request. Please try again.",
                timestamp: new Date() // Added timestamp for error message
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue, attachments);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    
    const suggestions = getSpecialtyBasedSuggestions();
    const showInitialState = messages.length === 0;
    
    const renderSuggestionsDropdown = () => {
        if (!showSuggestions) return null;
        
        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20">
                <div 
                    className="fixed inset-0 bg-black/20" 
                    onClick={() => setShowSuggestions(false)}
                ></div>
                <div className="relative">
                    <SuggestionsDropdown 
                        isVisible={true} 
                        onSuggestionClick={handleSuggestionClick} 
                        onClose={() => setShowSuggestions(false)}
                        triggerRef={lightbulbRef}
                    />
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {renderSuggestionsDropdown()}
            
            {showInitialState ? (
                <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 overflow-y-auto">
                    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
                        <div className="mb-8 transform -rotate-3">
                            <PicassoIllustration 
                                width={180} 
                                height={180}
                                type="thinking"
                                className="text-primary"
                            />
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">
                            {personalizedGreeting}
                        </h2>
                        <p className="text-center text-gray-500 max-w-md mb-8">
                            I can help with patient cases, research questions, or documentation. What's on your mind?
                        </p>
                        
                        <form 
                            onSubmit={handleSubmit}
                            className="w-full max-w-xl relative"
                        >
                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
                                <textarea
                                    ref={inputRef}
                                    placeholder="Ask me anything medical..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="flex-grow p-3 border-none resize-none focus:outline-none min-h-[60px] max-h-[180px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                />
                                <div className="flex items-center space-x-2 pr-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        title="Upload files"
                                        aria-label="Upload files"
                                    />
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-gray-500 hover:bg-transparent hover:text-gray-700"
                                        onClick={handlePaperclipClick}
                                        aria-label="Attach files" 
                                        title="Attach files"
                                    >
                                        <PaperclipIcon size={16} />
                                    </Button>
                                    
                                    <button 
                                        ref={lightbulbRef}
                                        type="button"
                                        onClick={handleLightbulbClick}
                                        className={`flex items-center p-2 rounded-full transition-colors ${showSuggestions ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                                        aria-label="Show suggestions"
                                        title="Show medical suggestions"
                                    >
                                        <Lightbulb size={18} />
                                        <span className="sr-only">Show suggestions</span>
                                    </button>

                                    <Button 
                                        type="submit" 
                                        size="icon" 
                                        className={cn(
                                            "rounded-full ml-1 h-8 w-8", 
                                            isTyping ? "bg-primary hover:bg-primary/90" : "bg-gray-300"
                                        )}
                                        disabled={!inputValue.trim() && attachments.length === 0}
                                        aria-label="Send message"
                                    >
                                        {isSending ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-white" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {attachments.map((file, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
                                        >
                                            <span className="max-w-[150px] truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="ml-1.5 text-gray-500 hover:text-gray-700"
                                                aria-label={`Remove ${file.name}`}
                                                title={`Remove ${file.name}`}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button 
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        const event = new CustomEvent('toggleQuickAction', { 
                                            detail: { actionId: 'research' } 
                                        });
                                        window.dispatchEvent(event);
                                    }}
                                    aria-label="Latest Research?"
                                >
                                    <span className="text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </span>
                                    <span className="text-gray-700 text-sm">Latest Research?</span>
                                </button>
                                
                                <button 
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        const event = new CustomEvent('toggleQuickAction', { 
                                            detail: { actionId: 'interpret' } 
                                        });
                                        window.dispatchEvent(event);
                                    }}
                                    aria-label="Interpret Labs?"
                                >
                                    <span className="text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                        </svg>
                                    </span>
                                    <span className="text-gray-700 text-sm">Interpret Labs?</span>
                                </button>
                                
                                <button 
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        const event = new CustomEvent('toggleQuickAction', { 
                                            detail: { actionId: 'note' } 
                                        });
                                        window.dispatchEvent(event);
                                    }}
                                    aria-label="Draft a note"
                                >
                                    <span className="text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                    </span>
                                    <span className="text-gray-700 text-sm">Draft a note</span>
                                </button>
                            </div>
                        </form>
                        
                        <div className="relative z-20 w-full max-w-xl mx-auto mt-2">
                            <QuickActions 
                                onSelectPrompt={handleQuickAction}
                                isHidden={false} // This was causing an error in previous diff, ensure it's correct for your logic
                                useCustomButtons={true}
                            />
                        </div>
                        
                        <div className="w-full hidden">
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
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((message, index) => (
                                <ProfessionalChatMessage 
                                    key={index}
                                    message={message.text} // Pass the text content of the message
                                    isUser={message.sender === 'user'}
                                    timestamp={message.timestamp} // Pass the timestamp
                                    selectedAgent={message.sender === 'bot' ? deepseekAgent : undefined} // Example: pass agent if bot message
                                />
                            ))}
                            {isSending && (
                                <div className="flex">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-3 shadow-sm">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-blue-700 rounded-full animate-bounce delay-200" />
                                        </div>
                                        <p className="text-sm text-gray-500">{loadingMessage}</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 bg-white p-4">
                        <form 
                            onSubmit={handleSubmit} 
                            className="max-w-3xl mx-auto relative"
                        >
                            <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                                <textarea 
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Ask me anything medical..."
                                    className="flex-grow px-4 py-3 border-none bg-transparent resize-none focus:outline-none max-h-20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    rows={1}
                                />
                                <div className="flex items-center px-2 gap-1">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        className="hidden"
                                        title="Upload files" 
                                        placeholder="Upload files"
                                        aria-label="Upload files"
                                        multiple
                                    />
                                    <button 
                                        type="button"
                                        onClick={handlePaperclipClick}
                                        className="p-1.5 rounded transition-colors text-gray-500 hover:text-gray-700"
                                        aria-label="Attach files"
                                        title="Attach files"
                                    >
                                        <PaperclipIcon size={18} />
                                    </button>
                                    
                                    <button 
                                        ref={lightbulbRef}
                                        type="button"
                                        onClick={handleLightbulbClick}
                                        className={`flex items-center p-2 rounded-full transition-colors ${showSuggestions ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                                        aria-label="Show suggestions"
                                        title="Show medical suggestions"
                                    >
                                        <Lightbulb size={18} />
                                        <span className="sr-only">Show suggestions</span>
                                    </button>

                                    <button 
                                        type="submit" 
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full transition-all",
                                            "hover:scale-110 hover:bg-blue-600 hover:shadow-md ml-2",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                        disabled={!inputValue.trim() && attachments.length === 0 || isSending}
                                        aria-label="Send message"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                            {attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md flex items-center">
                                            <span className="mr-1 truncate max-w-[160px]">{file.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeAttachment(index)}
                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                                aria-label={`Remove ${file.name}`}
                                                title={`Remove ${file.name}`}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                                {/* Quick Action buttons can be mapped here if needed */}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
