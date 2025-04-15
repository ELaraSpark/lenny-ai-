
import React, { useState } from "react";
import { motion } from "framer-motion";
import ChatPreviewMessage from "./chat/ChatPreviewMessage";
import ChatPreviewHeader from "./chat/ChatPreviewHeader";
import ChatPreviewTypingIndicator from "./chat/ChatPreviewTypingIndicator";
import ChatPreviewInput from "./chat/ChatPreviewInput";
import ChatPreviewContinueButton from "./chat/ChatPreviewContinueButton";

const ChatPreview = () => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Can you please prepare a discharge note for John?",
      time: "10:51 AM"
    },
    {
      role: "user",
      content: "Of course. Done and sent to your email!",
      time: "10:57 AM"
    }
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages([...messages, {
      role: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Thanks! Would you like me to help with anything else related to John's discharge?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ChatPreviewHeader />
      
      <div className="p-6 space-y-4">
        {messages.map((message, index) => (
          <ChatPreviewMessage key={index} message={message} />
        ))}
        
        {isTyping && <ChatPreviewTypingIndicator />}
        
        {/* Input Field */}
        <div className="mt-6">
          <ChatPreviewInput 
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
          />
          <ChatPreviewContinueButton />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPreview;
