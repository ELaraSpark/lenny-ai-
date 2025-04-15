
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowRight, Clock } from "lucide-react";
import { Agent, Message } from "../types/consultationTypes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConsultationChatProps {
  messages: Message[];
  agents: Agent[];
  onSendMessage: (message: string, turnBased: boolean) => void;
  currentTurn?: string | null;
  isTurnBasedMode: boolean;
  onToggleTurnBasedMode: (enabled: boolean) => void;
  isProcessing: boolean;
}

const ConsultationChat = ({ 
  messages, 
  agents, 
  onSendMessage, 
  currentTurn, 
  isTurnBasedMode, 
  onToggleTurnBasedMode,
  isProcessing 
}: ConsultationChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage, isTurnBasedMode);
    setNewMessage("");
  };
  
  // Find the current specialist name based on currentTurn
  const currentSpecialist = currentTurn 
    ? agents.find(a => a.id === currentTurn)?.name || "Unknown Specialist" 
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Collaborative Consultation
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch 
              id="turn-based-mode" 
              checked={isTurnBasedMode}
              onCheckedChange={onToggleTurnBasedMode}
            />
            <Label htmlFor="turn-based-mode">Turn-based Mode</Label>
          </div>
        </div>
        <CardDescription>
          {isTurnBasedMode && currentSpecialist ? (
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4 mr-1" />
              Waiting for {currentSpecialist} to respond...
            </div>
          ) : (
            "Discussing with specialists"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.isDoctor ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isDoctor && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={message.senderId === "system" ? "bg-slate-500" : "bg-aida-500"}>
                    {message.sender.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.isDoctor 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : message.senderId === "system"
                      ? 'bg-slate-100 dark:bg-slate-800' 
                      : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <div className="font-medium text-sm mb-1">
                  {message.sender}
                </div>
                <div className="text-sm">{message.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.isDoctor && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary">
                    Dr
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {/* Show "Typing" indicator when processing */}
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-aida-500">
                  {currentSpecialist ? currentSpecialist.charAt(0) : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-slate-100 dark:bg-slate-800">
                <div className="font-medium text-sm mb-1">
                  {currentSpecialist || "AI Assistant"}
                </div>
                <div className="text-sm flex items-center space-x-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse animation-delay-300">•</span>
                  <span className="animate-pulse animation-delay-600">•</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        <Textarea 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            isTurnBasedMode && currentTurn && !currentTurn.includes("doctor") 
              ? `Waiting for ${currentSpecialist} to respond...` 
              : "Ask a follow-up question or provide additional information..."
          }
          className="min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isTurnBasedMode && currentTurn && !currentTurn.includes("doctor")}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={(isTurnBasedMode && currentTurn && !currentTurn.includes("doctor")) || !newMessage.trim() || isProcessing}
          className="ml-2"
        >
          <span className="mr-2">Send</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConsultationChat;
