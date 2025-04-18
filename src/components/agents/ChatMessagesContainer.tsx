
import { useEffect, useRef, useState } from "react";
import { Loader2, Layout, LayoutGrid } from "lucide-react";
import { Message, Agent } from "./types/agentTypes";
import ChatMessage from "./ChatMessage";
import ProfessionalChatMessage from "./ProfessionalChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  selectedAgent?: Agent;
  chatStyle?: string;
}

const ChatMessagesContainer = ({ messages, isLoading, selectedAgent, chatStyle = "Professional" }: ChatMessagesContainerProps) => {
  // State to track whether to use the professional message format
  const [useProfessionalFormat, setUseProfessionalFormat] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change or when loading
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-[600px] pr-4">
      {/* View toggle buttons */}
      {messages.length > 0 && (
        <div className="flex justify-end mb-4 px-2">
          <TooltipProvider>
            <div className="bg-card border border-neutral-200 rounded-[var(--radius-md)] flex overflow-hidden shadow-sm rotate-[0.3deg]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={useProfessionalFormat ? "ghost" : "outline"}
                    size="sm"
                    className={`rounded-none border-0 ${useProfessionalFormat ? 'bg-primary/10 text-primary rotate-[-0.5deg]' : ''}`}
                    onClick={() => setUseProfessionalFormat(true)}
                  >
                    <Layout size={16} className="mr-1" />
                    <span className="text-xs">Professional</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Structured, professional format</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={!useProfessionalFormat ? "ghost" : "outline"}
                    size="sm"
                    className={`rounded-none border-0 ${!useProfessionalFormat ? 'bg-primary/10 text-primary rotate-[0.5deg]' : ''}`}
                    onClick={() => setUseProfessionalFormat(false)}
                  >
                    <LayoutGrid size={16} className="mr-1" />
                    <span className="text-xs">Standard</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Standard chat format</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}
      
      <div className="space-y-6 pb-3">
        {messages.map((message) => (
          useProfessionalFormat ? (
            <ProfessionalChatMessage
              key={message.id}
              message={message}
              selectedAgent={selectedAgent}
            />
          ) : (
            <ChatMessage 
              key={message.id} 
              message={message} 
              selectedAgent={selectedAgent}
              chatStyle={chatStyle}
            />
          )
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesContainer;
