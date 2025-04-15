import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "./chat/ChatMessage";
import TypingIndicator from "./chat/TypingIndicator";
import SubscriptionPrompt from "./chat/SubscriptionPrompt";
import ChatInput from "./chat/ChatInput";
import { MessageType } from "./chat/types";
import { generateAIResponse } from "@/components/agents/services/agentService";
import { agents } from "@/components/agents/data/agentsData";
interface PreviewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentSpecialty: string;
  agentId: string;
}
const PreviewChatModal = ({
  isOpen,
  onClose,
  agentName,
  agentSpecialty,
  agentId
}: PreviewChatModalProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [promptCount, setPromptCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPromptCount(0);
      setShowSubscribePrompt(false);
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: `Hello, I'm ${agentName}, an AI assistant specializing in ${agentSpecialty}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, agentName, agentSpecialty]);
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Increment prompt count
    const newPromptCount = promptCount + 1;
    setPromptCount(newPromptCount);
    try {
      // If we've hit the limit, show subscription message
      if (newPromptCount >= 2) {
        const limitMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'd be happy to continue our conversation! To access unlimited assistance from our AI specialists, please subscribe to our service.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, limitMessage]);
        setShowSubscribePrompt(true);
      } else {
        // Find the actual agent from our data
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
          // Use the real agent service to generate a response
          const responseText = await generateAIResponse(inputValue, agent);
          const response: MessageType = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseText,
            timestamp: new Date()
          };

          // Add AI response
          setMessages(prev => [...prev, response]);
        } else {
          // Fallback if agent not found
          const fallbackResponse: MessageType = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `I can help you with questions related to ${agentSpecialty}. What specific information are you looking for?`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, fallbackResponse]);
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getInputPlaceholder = () => {
    return showSubscribePrompt ? "Subscribe to continue chatting..." : `Ask ${agentName.split(' ')[0]} a question...`;
  };
  return <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-medical-green to-medical-blue p-4 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {agentName.charAt(0)}
                </span>
              </div>
              <div>
                <DialogTitle className="text-white">{agentName}</DialogTitle>
                <p className="text-xs text-white/80">{agentSpecialty}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[50vh]">
          <AnimatePresence initial={false}>
            {messages.map(message => <ChatMessage key={message.id} message={message} agentName={agentName} />)}
          </AnimatePresence>
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <DialogFooter className="flex flex-col w-full p-4 border-t">
          {showSubscribePrompt && <SubscriptionPrompt />}

          <ChatInput onSendMessage={handleSendMessage} isDisabled={showSubscribePrompt || isLoading} placeholderText={getInputPlaceholder()} />
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default PreviewChatModal;