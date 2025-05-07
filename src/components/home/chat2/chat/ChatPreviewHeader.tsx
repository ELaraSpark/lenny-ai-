
import React from "react";
import { Sparkles } from "lucide-react";

const ChatPreviewHeader = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <span className="text-white font-semibold text-xs">LA</span>
        </div>
        <span className="font-medium text-sm">Leny AI Medical Assistant</span>
      </div>
      <Sparkles className="h-4 w-4 text-white/80" />
    </div>
  );
};

export default ChatPreviewHeader;
