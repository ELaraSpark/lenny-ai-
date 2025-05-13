
// Component: ChatInterface
// Purpose: Manages the chat view with a selected AI agent, including displaying messages, input, and agent profile.
// Used in: AIAgentsView.

import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Agent } from "./types/agentTypes";
import AgentProfile from "./AgentProfile";
import DropdownSelectors from "./DropdownSelectors";
import ChatHeader from "./ChatHeader";
import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatSelectors } from "./hooks/useChatSelectors";

interface ChatInterfaceProps {
  selectedAgent: Agent;
}

const ChatInterface = ({ selectedAgent }: ChatInterfaceProps) => {
  // State for mobile profile visibility
  const [showProfileOnMobile, setShowProfileOnMobile] = useState(false);
  // State for chat style
  const [chatStyle, setChatStyle] = useState("Professional");
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat 
  } = useChatMessages(selectedAgent);
  
  const {
    selectedPatient,
    setSelectedPatient,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedQuestions,
    setSelectedQuestions,
    clearSelections
  } = useChatSelectors();

  const handleClearChat = () => {
    clearChat();
    clearSelections();
  };

  // Toggle profile visibility on mobile
  const toggleProfileOnMobile = () => {
    setShowProfileOnMobile(prev => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Mobile Agent Toggle Button */}
      <button 
        className="md:hidden flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg mb-2"
        onClick={toggleProfileOnMobile}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 mr-2">
            {selectedAgent.imageUrl ? (
              <img 
                src={selectedAgent.imageUrl} 
                alt={selectedAgent.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          <span className="font-medium">{selectedAgent.name}</span>
        </div>
        {showProfileOnMobile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {/* Agent Profile - Hidden by default on mobile */}
      <div className={`${showProfileOnMobile ? 'block' : 'hidden'} md:block md:w-1/3 lg:w-1/4 flex-shrink-0`}>
        <AgentProfile agent={selectedAgent} />
      </div>
      
      {/* Chat Interface - Takes full width on mobile */}
      <div className="flex-grow">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2 px-3 pt-3">
            <ChatHeader 
              agentName={selectedAgent.name}
              onClearChat={handleClearChat}
              messageCount={messages.length}
            />
          </CardHeader>
          
          {/* Simplified Dropdown Selectors - Collapsible on mobile */}
          <div className="px-3 py-2 border-b border-border">
            <DropdownSelectors 
              onPatientSelect={setSelectedPatient}
              onSymptomsSelect={setSelectedSymptoms}
              onQuestionsSelect={setSelectedQuestions}
            />
          </div>
          
          <CardContent className="flex-grow overflow-y-auto p-3">
            {/* Chat Messages */}
            <ChatMessagesContainer 
              messages={messages}
              isLoading={isLoading}
              selectedAgent={selectedAgent} // Pass selectedAgent to ChatMessagesContainer
              chatStyle={chatStyle} // Pass the selected chat style
            />
          </CardContent>
          
          <CardFooter className="p-3 border-t border-border">
            <ChatInput 
              onSendMessage={sendMessage}
              isLoading={isLoading}
              agentName={selectedAgent.name}
              onStyleChange={setChatStyle} // Handle style changes
              initialStyle={chatStyle} // Pass the current style
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
