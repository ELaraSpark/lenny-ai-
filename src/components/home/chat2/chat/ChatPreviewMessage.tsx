
import React from "react";

interface ChatPreviewMessageProps {
  message: {
    role: string;
    content: string;
    time: string;
  };
}

const ChatPreviewMessage = ({ message }: ChatPreviewMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {message.role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex-shrink-0 flex items-center justify-center">
          <span className="text-white font-semibold text-xs">LA</span>
        </div>
      )}

      <div
        className={`p-3 rounded-2xl max-w-[85%] ${
          message.role === "assistant"
            ? "bg-gradient-to-r from-teal-500/90 to-blue-500/90 text-white rounded-tl-none"
            : "bg-gray-100 rounded-tr-none"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs block mt-1 ${
            message.role === "assistant" ? "text-white/80" : "text-gray-500"
          }`}
        >
          {message.time}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img src="/placeholder.svg" alt="User" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default ChatPreviewMessage;
