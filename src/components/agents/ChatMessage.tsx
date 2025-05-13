
// Component: ChatMessage
// Purpose: Displays a single message within the chat interface, styled based on sender and chat style.
// Used in: ChatMessagesContainer.

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
      return "bg-primary text-white rounded-tr-none rotate-[0.3deg]";
    }
    
    // Apply different styles based on chatStyle
    switch (chatStyle) {
      case 'Professional':
        return `${gradientClass || "bg-card"} rounded-tl-none shadow-sm ${animationClass} rotate-[-0.2deg]`;
      case 'Conversational':
        return `${gradientClass || "bg-primary-light"} rounded-tl-xl rounded-bl-none shadow-md ${animationClass} rotate-[0.3deg]`;
      case 'Minimalist':
        return `${gradientClass || "bg-card"} rounded-[var(--radius-md)] shadow-none ${animationClass}`;
      case 'Playful':
        return `${gradientClass || "bg-primary-light"} rounded-[var(--radius-lg)] shadow-lg ${animationClass} rotate-[-0.5deg]`;
      default:
        return `${gradientClass || "bg-card"} rounded-tl-none shadow-sm ${animationClass} rotate-[-0.2deg]`;
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
          "max-w-[85%] px-5 py-4 transition-all duration-300",
          getMessageBubbleStyle()
        )}
        style={getBorderStyle()}
        title={personalityTooltip}
      >
        {!isUser && selectedAgent?.personality && chatStyle !== 'Minimalist' && (
          <div className={cn(
            "mb-1.5 text-xs italic hidden sm:block",
            chatStyle === 'Playful' ? "text-secondary font-medium" : "text-neutral-500 font-normal"
          )}>
            {selectedAgent.personality.split(',')[0]}
          </div>
        )}
        
        <p className={cn(
          "whitespace-pre-wrap font-sans",
          isUser ? "text-white" : "text-neutral-800",
          chatStyle === 'Minimalist' ? "text-base" : 
          chatStyle === 'Professional' ? "text-base" : 
          chatStyle === 'Conversational' ? "text-lg" : 
          "text-lg font-medium"
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
