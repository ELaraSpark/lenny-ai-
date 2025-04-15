
import { useRef, useEffect } from "react";
import { Undo, Headphones, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import MessageBubble from "./MessageBubble";
import { ConversationMessage, ActiveCall } from "../../types/callTypes";

interface ConversationPanelProps {
  activeCall: ActiveCall;
  conversation: ConversationMessage[];
  message: string;
  setMessage: (value: string) => void;
  isTakingOver: boolean;
  toggleTakeover: () => void;
  sendMessage: () => void;
  editingQuestion: string | null;
  modifiedQuestion: string;
  setModifiedQuestion: (value: string) => void;
  startEditQuestion: (questionId: string) => void;
  saveEditedQuestion: () => void;
  cancelEditing: () => void;
  formatTime: (date: Date) => string;
}

const ConversationPanel = ({
  activeCall,
  conversation,
  message,
  setMessage,
  isTakingOver,
  toggleTakeover,
  sendMessage,
  editingQuestion,
  modifiedQuestion,
  setModifiedQuestion,
  startEditQuestion,
  saveEditedQuestion,
  cancelEditing,
  formatTime
}: ConversationPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Conversation</CardTitle>
          <Button
            variant={isTakingOver ? "default" : "outline"}
            size="sm"
            onClick={toggleTakeover}
            aria-pressed={isTakingOver}
            aria-label={isTakingOver ? "Return control to AI" : "Take over conversation"}
          >
            {isTakingOver ? (
              <>
                <Undo className="h-4 w-4 mr-2" />
                Return to AI
              </>
            ) : (
              <>
                <Headphones className="h-4 w-4 mr-2" />
                Take Over
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          {isTakingOver ? 
            "You are directly communicating with the patient" : 
            "The AI agent is handling the conversation"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {conversation.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                activeCallAgentName={activeCall.agentName}
                activeCallPatientName={activeCall.patient.name}
                editingQuestion={editingQuestion}
                modifiedQuestion={modifiedQuestion}
                setModifiedQuestion={setModifiedQuestion}
                startEditQuestion={startEditQuestion}
                saveEditedQuestion={saveEditedQuestion}
                cancelEditing={cancelEditing}
                formatTime={formatTime}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            ref={textareaRef}
            placeholder={
              isTakingOver 
                ? "Type a message to the patient..." 
                : "Suggest a response for the AI agent..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            id="conversation-message-input"
            aria-label={isTakingOver ? "Message to patient" : "Suggestion for AI agent"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage}
            aria-label="Send message"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConversationPanel;
