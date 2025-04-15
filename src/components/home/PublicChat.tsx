import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { 
    getPersonalizedGreeting, 
    getMedicalJoke, 
    getMedicalFact, 
    getSpecialtyBasedSuggestions,
    getMedicalQuote,
    getHealthcareTip,
    getLoadingMessage // Import loading message utility
} from '@/lib/personalityUtils';
import { useNavigate } from 'react-router-dom';
import ChatInput from '@/components/agents/ChatInput'; // Import the shared ChatInput
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

// This component renders a simplified version of the chat UI for public users
const PublicChat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [currentJoke, setCurrentJoke] = useState<string>("");
    const [currentFact, setCurrentFact] = useState<string>("");
    const [currentQuote, setCurrentQuote] = useState<string>("");
    const [currentTip, setCurrentTip] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [personalizedGreeting, setPersonalizedGreeting] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Dynamic suggestions based on specialty
    const suggestions = getSpecialtyBasedSuggestions();

    // Refined message handler for public view
    const handleSendMessage = (messageText: string, attachments?: File[]) => { // Match ChatInput signature
        if (!messageText.trim()) {
            return;
        }
        
        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        
        setMessages(prev => [...prev, userMessage]);
        // ChatInput handles clearing its own state via onSendMessage callback
        setIsSending(true);
        setLoadingMessage(getLoadingMessage()); // Show a loading message

        // Simulate a brief "thinking" period
        setTimeout(() => {
            let botResponseText = "";
            // Generate a response based on the user's question
            botResponseText = `Thanks for your question about "${messageText.substring(0, 30)}...". Here's what I can tell you:

Based on medical literature, this is a common question. While I can provide general information, please note that this is not a substitute for professional medical advice.

${getHealthcareTip()}

Is there anything specific about this topic you'd like me to elaborate on?`;

            const botMessage: ChatMessage = { 
                sender: 'bot', 
                text: botResponseText
            };
            setMessages(prev => [...prev, botMessage]);
            setIsSending(false);
        }, 1200 + Math.random() * 600); // Slightly longer delay
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
        setPersonalizedGreeting(getPersonalizedGreeting());
        
        // Auto-focus the textarea when the component mounts
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const showInitialState = messages.length === 0;

    // Enhanced Greeting Component with personality
    const Greeting = () => (
        <div className="mb-12">
            <div className="flex flex-col items-center justify-center">
                {/* Clean, bold title in black */}
                <h1 className="text-center text-[42px] font-bold mb-4 text-gray-900">
                    Medical Genius at Your Fingertips
                </h1>
                
                {/* Simple subtitle */}
                <p className="text-center text-xl text-gray-600 max-w-md">
                    Get trusted answers in seconds
                </p>
            </div>
        </div>
    );

    const MessageDisplay = () => (
    <PicassoBackground
      pattern="abstractArt"
      color="text-primary"
      opacity={5}
      className="w-full h-full flex-1 overflow-y-auto space-y-4 pb-4 bg-[#FFFFFF] flex flex-col justify-center"
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
                       {/* Removed sign-in button */}
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
                     <div className="p-3 rounded-lg bg-muted">
                        <div className="flex justify-center">
                            <PicassoIllustration
                                name="healing"
                                size="sm"
                                color="text-primary"
                                className="w-8 h-8"
                            />
                        </div>
                     </div>
                   </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </PicassoBackground>
    );

    // Use the shared ChatInput component
    const InputArea = ({ isAnchored = false, submitButtonColor = 'primary' }: { isAnchored?: boolean; submitButtonColor?: 'primary' | 'accent' }) => ( // Added prop type definition
       <div className="w-full bg-background">
           <ChatInput
             onSendMessage={handleSendMessage} // Pass the refined handler
             isLoading={isSending}
             agentName="Leny" // Keep agent name consistent
             onTypingChange={setIsTyping}
             isAnchored={isAnchored}
             submitButtonColor={submitButtonColor} // Pass the prop down
             // Note: Attachments are passed to handleSendMessage but not explicitly handled in public view beyond the prompt
           />
       </div>
    );

    // Enhanced Suggestions Component with dynamic content - showing only 3 shortened suggestions
    const Suggestions = () => {
        // Get the original first three suggestions
        const firstThreeSuggestions = suggestions.slice(0, 3);
        
        // Define shortened versions and corresponding original text for illustration mapping
        const shortenedSuggestionsMap = [
            { short: "Latest Research?", original: "What's the latest research", illustration: "chart" },
            { short: "Interpret Labs?", original: "Help me interpret", illustration: "brain" },
            { short: "Draft a note", original: "Draft a clinical note about", illustration: "pencil" }
        ];

        // Ensure we only map if we have enough original suggestions
        const displayedShortenedSuggestions = firstThreeSuggestions.length === 3 ? shortenedSuggestionsMap : [];

        return (
            <div className="mt-6">
                {/* Chat suggestions */}
                <div className="flex flex-wrap justify-center gap-2.5">
                    {displayedShortenedSuggestions.map((item, index) => {
                        // Get the original suggestion text for the onClick handler
                        const originalSuggestionText = firstThreeSuggestions[index]; 

                        return (
                            <div 
                                key={index}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full flex items-center gap-2 cursor-pointer transition-all hover:bg-primary/5 hover:border-primary"
                                onClick={() => handleSendMessage(originalSuggestionText)}
                            >
                                <div className="flex items-center justify-center text-primary">
                                    <PicassoIllustration
                                        name={item.illustration as any}
                                        size="xs"
                                        color="text-primary"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item.short}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col h-full">
                {showInitialState ? (
                    <>
                        <div className="flex flex-1 flex-col items-center justify-center p-5 min-h-screen mt-[-64px]"> {/* Added negative margin to account for header height */}
                            <div className="w-full max-w-[700px] flex flex-col items-center"> {/* Removed pt-16 */}
                                <Greeting />
                                <div className="w-full relative mb-[30px]">
                                    {/* Use the ChatInput component directly and set submit button color to accent */}
                                    <InputArea isAnchored={false} submitButtonColor="accent" />
                                </div>
                                <div className={cn(
                                    "transition-opacity duration-300",
                                    isTyping ? "opacity-0" : "opacity-100"
                                )}>
                                    <Suggestions />
                                </div>
                            </div>
                        </div>
                        
                        {/* Landing Page Sections - Only shown in initial state */}
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-40 mt-40"> {/* Increased spacing to pt-40 and mt-40 */}
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
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center overflow-hidden relative"> 
                        <div className="w-full max-w-3xl flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col">
                            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
                                <MessageDisplay />
                            </div>
                        </div>
                        <div className="w-full max-w-3xl fixed bottom-0 left-0 right-0 mx-auto bg-background p-0 border-t border-border z-10">
                             {/* Pass isAnchored prop and default submit button color */}
                            <InputArea isAnchored={true} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicChat;
