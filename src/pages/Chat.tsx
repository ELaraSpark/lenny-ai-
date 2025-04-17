import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Bot, Clock, FileText, Search as SearchIcon, Pill, Sparkles, Coffee, Brain, Image, ToggleLeft, ToggleRight, Layout, LayoutGrid } from 'lucide-react';
import ChatInput from '@/components/agents/ChatInput';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { AnimatedIllustration, LoadingIllustration } from '@/components/illustrations/AnimatedIllustration';
import { useAuth } from '@/contexts/AuthContext';
import ProfessionalChatMessage from '@/components/agents/ProfessionalChatMessage';
import { 
    getPersonalizedGreeting, 
    getMedicalJoke, 
    getLoadingMessage, 
    getMedicalFact, 
    getSpecialtyBasedSuggestions,
    getMedicalQuote,
    getHealthcareTip
} from '@/lib/personalityUtils';
import { generateAIResponse, AIProvider, DEFAULT_PROVIDER } from '@/components/agents/services/agentService';

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    attachments?: File[];
}

// This component now renders the core chat UI, assuming parent handles layout
const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [showJoke, setShowJoke] = useState<boolean>(false);
    const [currentJoke, setCurrentJoke] = useState<string>("");
    const [currentFact, setCurrentFact] = useState<string>("");
    const [currentQuote, setCurrentQuote] = useState<string>("");
    const [currentTip, setCurrentTip] = useState<string>("");
    // This state is only used to control the visibility of suggestions, not the greeting
    const [isTyping, setIsTyping] = useState<boolean>(false);
    // Store the personalized greeting in state so it doesn't change during the session
    const [personalizedGreeting, setPersonalizedGreeting] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); // Get user from auth context
    
    // State for message format toggle
    const [useProfessionalFormat, setUseProfessionalFormat] = useState<boolean>(true);

    // Get user's first name from email (temporary until we have proper user profiles)
    const getUserFirstName = () => {
        if (!user?.email) return undefined;
        // Extract name from email (e.g., john.doe@example.com -> John)
        const emailName = user.email.split('@')[0].split('.')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    };

    // Dynamic suggestions based on specialty (could be expanded to use user's actual specialty)
    const suggestions = getSpecialtyBasedSuggestions();

    // AI provider state with toggle UI
    const [aiProvider, setAIProvider] = useState<AIProvider>(DEFAULT_PROVIDER);
    
    // Toggle AI provider
    const toggleAIProvider = () => {
        setAIProvider(prev => prev === 'gemini' ? 'deepseek' : 'gemini');
    };
    
    // Handle sending messages with attachments
    const handleSendMessage = async (messageText: string, attachments?: File[]) => {
        console.log("[Chat.tsx] handleSendMessage START", { messageText, attachments });
        if (!messageText.trim() && (!attachments || attachments.length === 0)) {
            console.log("[Chat.tsx] handleSendMessage: Empty message, returning.");
            return;
        }
        
        // Create user message with attachments
        const userMessage: ChatMessage = { 
            sender: 'user', 
            text: messageText,
            attachments 
        };
        
        console.log("[Chat.tsx] handleSendMessage: Setting user message and isSending=true");
        try {
            setMessages(prev => [...prev, userMessage]);
            setIsSending(true);
            setLoadingMessage(getLoadingMessage());
            
            // Create a mock agent for now (in a real app, this would be the selected agent)
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
                attachments,
                aiProvider
            );
            
            // Create bot message with the response
            const botMessage: ChatMessage = { 
                sender: 'bot', 
                text: response 
            };
            
            console.log("[Chat.tsx] handleSendMessage: Setting bot message and isSending=false");
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("[Chat.tsx] handleSendMessage: Error during AI response:", error);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize random content and personalized greeting on first load
    useEffect(() => {
        setCurrentJoke(getMedicalJoke());
        setCurrentFact(getMedicalFact());
        setCurrentQuote(getMedicalQuote());
        setCurrentTip(getHealthcareTip());
        // Set the personalized greeting once on component mount (already using the function)
        setPersonalizedGreeting(getPersonalizedGreeting(getUserFirstName())); 
    }, []); // Added user dependency to update greeting if user logs in/out during session

    const showInitialState = messages.length === 0;

    // Enhanced Greeting Component with personality
    const Greeting = () => (
        <div className="mb-12"> {/* Removed text-center */}
            {/* Flex container to place illustration next to text */}
            <div className="flex items-center justify-center gap-4"> {/* Added flex container */}
                {/* Decorative element */}
                <div className="text-primary"> {/* Use new primary color */}
                    <PicassoIllustration
                        name="healing"
                        size="lg"
                        color="text-primary"
                    />
                 </div>
                  {/* Changed to "Find clinical answers instantly" with larger, bold font - Added responsive size */}
                  <h1 className="text-3xl sm:text-[42px] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center"> 
                      Find clinical answers instantly
                      <span className="block text-lg font-normal text-muted-foreground mt-2">Your friendly AI medical assistant is here to help</span>
                  </h1>
             </div>
        </div>
    );

    const MessageDisplay = () => (
        <PicassoBackground
            pattern="abstractArt" // Use the new Picasso-style pattern
            color="text-primary"
            opacity={5}
            className="w-full h-full flex-1 overflow-y-auto space-y-4 pb-4 flex flex-col justify-center"
        >
            {/* Format toggle buttons */}
            {messages.length > 0 && (
                <div className="flex justify-end mb-4 px-2">
                    <div className="bg-white border rounded-lg flex overflow-hidden">
                        <Button
                            variant={useProfessionalFormat ? "ghost" : "outline"}
                            size="sm"
                            className={`rounded-none border-0 ${useProfessionalFormat ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setUseProfessionalFormat(true)}
                        >
                            <Layout size={16} className="mr-1" />
                            <span className="text-xs">Professional</span>
                        </Button>
                        
                        <Button
                            variant={!useProfessionalFormat ? "ghost" : "outline"}
                            size="sm"
                            className={`rounded-none border-0 ${!useProfessionalFormat ? 'bg-primary/10 text-primary' : ''}`}
                            onClick={() => setUseProfessionalFormat(false)}
                        >
                            <LayoutGrid size={16} className="mr-1" />
                            <span className="text-xs">Standard</span>
                        </Button>
                    </div>
                </div>
            )}
            
            {messages.map((msg, index) => {
                // For user messages, always use the standard format
                if (msg.sender === 'user') {
                    return (
                        <div key={index} className="flex justify-end">
                            <div className="max-w-[85%] px-4 py-3 bg-primary text-primary-foreground rounded-lg rounded-br-none">
                                {/* Attachments display */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {msg.attachments.map((file, fileIndex) => (
                                            <div 
                                                key={fileIndex} 
                                                className="relative group overflow-hidden rounded-lg border border-border"
                                            >
                                                {file.type.startsWith('image/') ? (
                                                    <div className="w-24 h-24 relative">
                                                        <img 
                                                            src={URL.createObjectURL(file)} 
                                                            alt={file.name}
                                                            className="w-full h-full object-cover"
                                                            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Image className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 bg-muted flex items-center justify-center">
                                                        <FileText className="w-8 h-8 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground mt-1 px-2 truncate max-w-full">
                                                            {file.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    );
                }
                
                // For bot messages, use either professional or standard format based on the toggle
                return useProfessionalFormat ? (
                    <ProfessionalChatMessage
                        key={index}
                        message={{
                            id: `msg-${index}`,
                            role: 'assistant',
                            content: msg.text,
                            timestamp: new Date()
                        }}
                        selectedAgent={{
                            id: "leny",
                            name: "Leny",
                            specialty: "General Medicine",
                            description: "AI medical assistant",
                            icon: () => null,
                            capabilities: []
                        }}
                    />
                ) : (
                    <div key={index} className="flex justify-start">
                        <div className="flex items-start gap-2.5 max-w-[85%]">
                            <PicassoAvatar
                                name="Leny"
                                illustrationType="healing"
                                size="sm"
                                color="text-primary"
                                className="flex-shrink-0"
                            />
                            <div className="p-3 rounded-lg text-base bg-muted text-foreground rounded-bl-none">
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            {isSending && (
                 <div className="flex justify-start">
                   <div className="flex items-start gap-2.5">
                     <PicassoAvatar
                        name="Leny"
                        illustrationType="brain"
                        size="sm"
                        color="text-primary"
                        className="flex-shrink-0"
                     />
                     {/* Display the random loading message */}
                     <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground italic">
                        {loadingMessage}
                     </div>
                   </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </PicassoBackground>
    );

    const InputArea = ({ isAnchored = false }) => (
        <div className="w-full bg-background">
           <ChatInput
             onSendMessage={handleSendMessage}
             isLoading={isSending}
             agentName="Leny"
             onTypingChange={setIsTyping}
             isAnchored={isAnchored}
           />
       </div>
    );

    // Enhanced Suggestions Component with dynamic content and "More" button
    const Suggestions = () => {
        const [showAllSuggestions, setShowAllSuggestions] = useState(false);
        const initialSuggestionsCount = 8; // Show approximately 2 lines of suggestions initially
        
        const displayedSuggestions = showAllSuggestions 
            ? suggestions 
            : suggestions.slice(0, initialSuggestionsCount);
            
        return (
            <div className="space-y-6 mt-6">
                {/* Chat suggestions */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-3 max-h-[88px] overflow-hidden">
                        {displayedSuggestions.map((suggestion, index) => {
                            const illustrationMap: Record<string, string> = {
                                "What's the latest research": "chart",
                                "Help me interpret": "brain",
                                "What are the side effects": "stethoscope",
                                "Differential diagnosis": "healing",
                            };
                            
                            // Find the matching illustration based on text content
                            let illustrationType = "empty";
                            for (const [key, value] of Object.entries(illustrationMap)) {
                                if (suggestion.includes(key)) {
                                    illustrationType = value;
                                    break;
                                }
                            }

                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    // Make default border more visible (primary with 50% opacity) and darken on hover
                                    className="rounded-full px-4 py-2 text-sm font-medium text-foreground bg-background border-primary/50 hover:bg-primary/5 hover:border-primary hover:text-foreground group transition-colors duration-200" 
                                    onClick={() => handleSendMessage(suggestion)}
                                >
                                    <div className="mr-2 w-4 h-4">
                                        <PicassoIllustration
                                            name={illustrationType as any}
                                            size="xs"
                                            color="text-primary"
                                            className=""
                                        />
                                    </div>
                                    {suggestion}
                                </Button>
                            );
                        })}
                    </div>
                    
                    {/* More/Less button */}
                    {suggestions.length > initialSuggestionsCount && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                        >
                            {showAllSuggestions ? "Show Less" : "More Suggestions"}
                        </Button>
                    )}
                </div>
                
                {/* Fun content cards REMOVED */}
                
                {/* Refresh button for fun content REMOVED */}
                {/* Refresh button was here */}
            </div> // This closes the main div for Suggestions
        );
    };

    return (
        <div className="flex flex-col h-full">
            {showInitialState ? (
                // Re-applying flex properties to center content vertically and horizontally
                <div className="flex flex-1 flex-col items-center justify-center p-5 mt-24"> 
                    {/* Background is handled by AppLayout */}
                    <div className="w-full max-w-[700px] flex flex-col items-center"> 
                        <Greeting />
                        
                        {/* AI Provider Toggle */}
                        <div className="mb-4 flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-sm"
                                onClick={toggleAIProvider}
                            >
                                <span className={aiProvider === 'gemini' ? 'font-bold text-primary' : 'text-muted-foreground'}>
                                    Gemini
                                </span>
                                {aiProvider === 'gemini' ? (
                                    <ToggleLeft className="h-5 w-5 text-primary" />
                                ) : (
                                    <ToggleRight className="h-5 w-5 text-primary" />
                                )}
                                <span className={aiProvider === 'deepseek' ? 'font-bold text-primary' : 'text-muted-foreground'}>
                                    DeepSeek
                                </span>
                            </Button>
                        </div>
                        
                        <div className="w-full relative mb-[30px]">
                            <InputArea isAnchored={false} />
                        </div>
                        {/* Only fade out suggestions, not the greeting */}
                        <div className={cn(
                            "transition-opacity duration-300",
                            isTyping ? "opacity-0" : "opacity-100"
                        )}>
                            <Suggestions />
                        </div>
                    </div>
                </div>
            ) : (
                // Apply centering to the parent flex container for the active chat state
                <div className="flex flex-1 flex-col items-center justify-center overflow-hidden h-full"> 
                    {/* AI Provider Toggle for active chat */}
                    <div className="w-full max-w-3xl flex justify-center py-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-sm"
                            onClick={toggleAIProvider}
                        >
                            <span className={aiProvider === 'gemini' ? 'font-bold text-primary' : 'text-muted-foreground'}>
                                Gemini
                            </span>
                            {aiProvider === 'gemini' ? (
                                <ToggleLeft className="h-5 w-5 text-primary" />
                            ) : (
                                <ToggleRight className="h-5 w-5 text-primary" />
                            )}
                            <span className={aiProvider === 'deepseek' ? 'font-bold text-primary' : 'text-muted-foreground'}>
                                DeepSeek
                            </span>
                        </Button>
                    </div>
                    
                    {/* Message display area: centered, takes up space, scrolls, has bottom padding */}
                    <div className="w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-2 pb-24 flex flex-col"> 
                        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
                            <MessageDisplay />
                        </div>
                    </div>
                    {/* Input area: sticky to bottom, centered */}
                    <div className="w-full max-w-3xl sticky bottom-4 bg-background p-0 border-t border-border"> 
                        <InputArea isAnchored={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
