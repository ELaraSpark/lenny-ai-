
import React from "react";
import { Sparkles } from "lucide-react";

const ChatPreviewTypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-md">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-3 rounded-2xl rounded-tl-none w-16 shadow-sm">
        <div className="flex space-x-1 justify-center items-center">
          <div
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreviewTypingIndicator;
