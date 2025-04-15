
import { motion } from "framer-motion";
import { MessageType } from "./types";

interface ChatMessageProps {
  message: MessageType;
  agentName: string;
}

const ChatMessage = ({ message, agentName }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-teal to-medical-blue flex-shrink-0 flex items-center justify-center mr-2">
          <span className="text-white font-semibold text-xs">
            {agentName.charAt(0)}
          </span>
        </div>
      )}
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-gray-100 text-gray-800 rounded-tr-none"
            : "bg-gradient-to-r from-medical-teal/10 to-medical-blue/10 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span
          className={`text-xs block mt-1 text-gray-500`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center ml-2">
          <span className="text-gray-600 font-semibold text-xs">
            You
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
