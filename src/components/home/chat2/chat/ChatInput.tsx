
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
  placeholderText: string;
}

const ChatInput = ({ onSendMessage, isDisabled, placeholderText }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim() || isDisabled) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <textarea
        className="flex-1 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-purple/50 min-h-[40px] max-h-[120px] resize-none"
        placeholder={placeholderText}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={!inputValue.trim() || isDisabled}
        className={`bg-gradient-to-r from-medical-purple to-medical-red text-white hover:opacity-90 ${
          (!inputValue.trim() || isDisabled) &&
          "opacity-50 cursor-not-allowed"
        }`}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
