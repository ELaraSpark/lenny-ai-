
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./types/agentTypes";
import { Agent } from "./types/agentTypes";
import { agents } from "./data/agentsData";

interface ChatMessageProps {
  message: Message;
  selectedAgent?: Agent;
  chatStyle?: string;
}

const ChatMessage = ({ message, selectedAgent, chatStyle = "Professional" }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const [animationClass, setAnimationClass] = useState<string>("");
  const [gradientClass, setGradientClass] = useState<string>("");
  
  // Apply styling based on selected chat style and agent
  useEffect(() => {
    if (!isUser) {
      // Set animation and gradient based on chat style
      switch (chatStyle) {
        case 'Professional':
          setAnimationClass("");
          setGradientClass("bg-slate-100 dark:bg-slate-800");
          break;
        case 'Conversational':
          setAnimationClass("hover:animate-pulse-subtle");
          setGradientClass("bg-blue-50 dark:bg-blue-900/20");
          break;
        case 'Minimalist':
          setAnimationClass("");
          setGradientClass("bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700");
          break;
        case 'Playful':
          setAnimationClass("hover:animate-bounce-subtle");
          setGradientClass("bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20");
          break;
        default:
          // Default to Professional style
          setAnimationClass("");
          setGradientClass("bg-slate-100 dark:bg-slate-800");
      }
      
      // Override with agent-specific styling if available
      if (selectedAgent) {
        // Set animation class based on agent's style if available
        if (selectedAgent.animationStyle) {
          switch (selectedAgent.animationStyle) {
            case 'pulse':
              setAnimationClass("animate-pulse-subtle");
              break;
            case 'bounce':
              setAnimationClass("hover:animate-bounce-subtle");
              break;
            case 'breathe':
              setAnimationClass("animate-breathe");
              break;
            case 'heartbeat':
              setAnimationClass("animate-heartbeat");
              break;
          }
        }
        
        // Set gradient class if available
        if (selectedAgent.gradientColors) {
          setGradientClass(`bg-gradient-to-br ${selectedAgent.gradientColors} bg-opacity-10`);
        }
      }
    }
  }, [isUser, selectedAgent, chatStyle]);
  
  // Get agent color for styling
  const agentColor = !isUser && selectedAgent?.color ? selectedAgent.color : "#4287f5";
  
  // Get personality tooltip if available
  const personalityTooltip = !isUser && selectedAgent?.personality ? selectedAgent.personality : "";
  
  // Get message bubble style based on chat style
  const getMessageBubbleStyle = () => {
    if (isUser) {
      return "bg-aida-500 text-white rounded-tr-none";
    }
    
    // Apply different styles based on chatStyle
    switch (chatStyle) {
      case 'Professional':
        return `${gradientClass} rounded-tl-none shadow-sm ${animationClass}`;
      case 'Conversational':
        return `${gradientClass} rounded-tl-xl rounded-bl-none shadow-md ${animationClass}`;
      case 'Minimalist':
        return `${gradientClass} rounded-lg shadow-none ${animationClass}`;
      case 'Playful':
        return `${gradientClass} rounded-2xl shadow-lg ${animationClass}`;
      default:
        return `${gradientClass || "bg-slate-100 dark:bg-slate-800"} rounded-tl-none shadow-sm ${animationClass}`;
    }
  };
  
  // Get border style based on chat style
  const getBorderStyle = () => {
    if (isUser || !selectedAgent?.color) return {};
    
    switch (chatStyle) {
      case 'Professional':
        return { borderLeftColor: agentColor, borderLeftWidth: '4px' };
      case 'Conversational':
        return { borderBottomColor: agentColor, borderBottomWidth: '3px' };
      case 'Minimalist':
        return { borderColor: `${agentColor}33`, borderWidth: '1px' };
      case 'Playful':
        return { 
          boxShadow: `0 4px 14px 0 ${agentColor}33`,
          borderColor: `${agentColor}33`,
          borderWidth: '2px'
        };
      default:
        return { borderLeftColor: agentColor, borderLeftWidth: '4px' };
    }
  };

  return (
    <div 
      className={cn(
        "flex w-full animate-fadeIn", 
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] px-4 py-3 transition-all duration-300",
          getMessageBubbleStyle()
        )}
        style={getBorderStyle()}
        title={personalityTooltip}
      >
        {!isUser && selectedAgent?.personality && chatStyle !== 'Minimalist' && (
          <div className={cn(
            "mb-1.5 text-xs italic hidden sm:block",
            chatStyle === 'Playful' ? "text-purple-500 font-medium" : "text-gray-500 font-normal"
          )}>
            {selectedAgent.personality.split(',')[0]}
          </div>
        )}
        
        <p className={cn(
          "whitespace-pre-wrap",
          isUser ? "text-white" : "text-foreground",
          chatStyle === 'Minimalist' ? "text-sm" : 
          chatStyle === 'Professional' ? "text-sm" : 
          chatStyle === 'Conversational' ? "text-base" : 
          "text-base font-medium"
        )}>
          {message.content}
        </p>
        
        <p className={cn(
          "text-xs mt-2",
          isUser ? "text-white/70" : "text-muted-foreground",
          chatStyle === 'Minimalist' ? "text-right" : 
          chatStyle === 'Professional' ? "text-right" : 
          chatStyle === 'Conversational' ? "text-left" : 
          "text-center"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
