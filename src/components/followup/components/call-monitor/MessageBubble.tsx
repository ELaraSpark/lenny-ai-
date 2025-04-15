
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConversationMessage } from "../../types/callTypes";

interface MessageBubbleProps {
  message: ConversationMessage;
  activeCallAgentName: string;
  activeCallPatientName: string;
  editingQuestion: string | null;
  modifiedQuestion: string;
  setModifiedQuestion: (value: string) => void;
  startEditQuestion: (questionId: string) => void;
  saveEditedQuestion: () => void;
  cancelEditing: () => void;
  formatTime: (date: Date) => string;
}

const MessageBubble = ({
  message,
  activeCallAgentName,
  activeCallPatientName,
  editingQuestion,
  modifiedQuestion,
  setModifiedQuestion,
  startEditQuestion,
  saveEditedQuestion,
  cancelEditing,
  formatTime
}: MessageBubbleProps) => {
  const isAgent = message.sender === 'agent';
  const isPatient = message.sender === 'patient';
  const isDoctor = message.sender === 'doctor';
  const isEditing = editingQuestion === message.id;
  
  // Determine name to display
  const getSenderName = () => {
    if (isAgent) return activeCallAgentName || 'AI Agent';
    if (isPatient) return activeCallPatientName || 'Patient';
    return 'Doctor';
  };
  
  return (
    <div className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium">{getSenderName()}</span>
        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
        {message.isEdited && <span className="text-xs text-muted-foreground italic">(edited)</span>}
      </div>
      
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isAgent 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100' 
            : isPatient 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100'
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={modifiedQuestion}
              onChange={(e) => setModifiedQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={cancelEditing}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={saveEditedQuestion}
              >
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {isAgent && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => startEditQuestion(message.id)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
