
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { predefinedSymptoms, predefinedQuestions } from '../utils/predefinedData';

interface AddToChatButtonProps {
  selectedPatient: any;
  selectedSymptoms: string[];
  selectedQuestions: string[];
  onAddToChat: () => void;
}

const AddToChatButton: React.FC<AddToChatButtonProps> = ({
  selectedPatient,
  selectedSymptoms,
  selectedQuestions,
  onAddToChat
}) => {
  const shouldShow = selectedSymptoms.length > 0 || selectedQuestions.length > 0 || selectedPatient;
  
  if (!shouldShow) return null;
  
  return (
    <Button 
      onClick={onAddToChat}
      className="mt-2"
      size="sm"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add to Chat
    </Button>
  );
};

export default AddToChatButton;
