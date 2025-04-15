import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Bot, Clock, FileText, Search as SearchIcon, Pill, Sparkles, Coffee, Brain } from 'lucide-react'; // Added more icons
import ChatInput from '@/components/agents/ChatInput'; // Assuming this is styled appropriately or needs update
import { cn } from '@/lib/utils'; // Import cn
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { AnimatedIllustration, LoadingIllustration } from '@/components/illustrations/AnimatedIllustration';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to get user info
import { 
    getPersonalizedGreeting, 
    getMedicalJoke, 
    getLoadingMessage, 
    getMedicalFact, 
    getSpecialtyBasedSuggestions,
    getMedicalQuote,
    getHealthcareTip
} from '@/lib/personalityUtils'; // Import our new personality utilities

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
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

    // Get user's first name from email (temporary until we have proper user profiles)
    const getUserFirstName = () => {
        if (!user?.email) return undefined;
        // Extract name from email (e.g., john.doe@example.com -> John)
        const emailName = user.email.split('@')[0].split('.')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    };

    // Dynamic suggestions based on specialty (could be expanded to use user's actual specialty)
    const suggestions = getSpecialtyBasedSuggestions();

    // Restore original handleSendMessage logic with added logging
    const handleSendMessage = (messageText: string, attachments?: File[]) => {
        console.log("[Chat.tsx] handleSendMessage START", { messageText, attachments });
        if (!messageText.trim() && (!attachments || attachments.length === 0)) {
            console.log("[Chat.tsx] handleSendMessage: Empty message, returning.");
            return;
        }
        
        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        
        console.log("[Chat.tsx] handleSendMessage: Setting user message and isSending=true");
        try {
            setMessages(prev => [...prev, userMessage]);
            setIsSending(true);
            // Set a random loading message (already using the function)
            setLoadingMessage(getLoadingMessage()); 
        } catch (error) {
            console.error("[Chat.tsx] handleSendMessage: Error during initial state update:", error);
            // Optionally add user feedback here if state update fails
            return; // Stop processing if initial state update fails
        }

        console.log("[Chat.tsx] handleSendMessage: Simulating bot response with setTimeout...");
        // Simulate bot response
        setTimeout(() => {
            console.log("[Chat.tsx] handleSendMessage: setTimeout callback START");
            try {
                const botResponseText = `Simulated response for: "${userMessage.text}"`;
                const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
                
                console.log("[Chat.tsx] handleSendMessage: Setting bot message and isSending=false");
                setMessages(prev => [...prev, botMessage]);
                setIsSending(false);
                console.log("[Chat.tsx] handleSendMessage: setTimeout callback END");
            } catch (error) {
                 console.error("[Chat.tsx] handleSendMessage: Error during bot response state update:", error);
                 setIsSending(false); // Ensure loading state is reset even on error
            }
        }, 1000 + Math.random() * 500);
        console.log("[Chat.tsx] handleSendMessage END (after setTimeout setup)");
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
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2.5 max-w-[85%]`}>
                   {msg.sender === 'bot' && (
                     <PicassoAvatar
                        name="Leny"
                        illustrationType="healing"
                        size="sm"
                        color="text-primary"
                        className="flex-shrink-0"
                     />
                   )}
                   <div className={cn(
                     "p-3 rounded-lg text-base",
                     msg.sender === 'user'
                       ? 'bg-primary text-primary-foreground rounded-br-none'
                       : 'bg-muted text-foreground rounded-bl-none'
                   )}>
                       <p className="leading-relaxed">{msg.text}</p>
                   </div>
                    </div>
                </div>
            ))}
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
                    {/* Message display area: centered, takes up space, scrolls, has bottom padding */}
                    <div className="w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col"> 
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
