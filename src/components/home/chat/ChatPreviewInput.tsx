
import React from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface ChatPreviewInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const ChatPreviewInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
}: ChatPreviewInputProps) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-2 text-sm text-gray-600 border focus-within:border-medical-purple/50 focus-within:ring-1 focus-within:ring-medical-purple/20">
      <input
        type="text"
        placeholder="Type your next question..."
        className="bg-transparent border-none flex-1 focus:outline-none px-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        size="icon"
        className="h-7 w-7 rounded-full bg-gradient-to-r from-medical-purple to-medical-red text-white hover:opacity-90"
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
      >
        <SendHorizontal className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default ChatPreviewInput;
