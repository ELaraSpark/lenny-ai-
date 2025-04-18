
import { Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface ChatHeaderProps {
  agentName: string;
  onClearChat: () => void;
  messageCount: number;
}

const ChatHeader = ({ agentName, onClearChat, messageCount }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl flex items-center">
        <Bot className="mr-3 h-6 w-6 text-aida-500" />
        Chat with {agentName}
      </CardTitle>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearChat}
        disabled={messageCount <= 1}
        className="text-base px-4 py-2"
      >
        <RefreshCw className="h-5 w-5 mr-2" />
        Clear Chat
      </Button>
    </div>
  );
};

export default ChatHeader;
