
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Message, Agent } from "./types/agentTypes";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  selectedAgent?: Agent; // Add selectedAgent prop
  chatStyle?: string; // Add chatStyle prop
}

const ChatMessagesContainer = ({ messages, isLoading, selectedAgent, chatStyle = "Professional" }: ChatMessagesContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change or when loading
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6 pb-3">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            selectedAgent={selectedAgent} // Pass selectedAgent to ChatMessage
            chatStyle={chatStyle} // Pass the selected chat style
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-aida-500" />
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesContainer;
