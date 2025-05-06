import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define window with SpeechRecognition
interface WindowWithSpeech extends Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
declare const window: WindowWithSpeech;

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check for browser support
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const browserSupportsSpeech = !!SpeechRecognitionAPI;

  const handleToggleListen = () => {
    if (disabled) return;
    
    if (!browserSupportsSpeech) {
      toast({ 
        title: "Voice input not supported", 
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive" 
      });
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
    } else {
      // Start listening
      if (!SpeechRecognitionAPI) return;
      
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast({ 
          title: "Voice input active", 
          description: "Start speaking..."
        });
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Send final transcript to parent component
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        let errorMsg = "Voice input error";
        let description = "";
        
        if (event.error === 'no-speech') {
          errorMsg = "No speech detected";
          description = "Please try speaking again or use text input.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Microphone error";
          description = "Please check your microphone permissions.";
        } else if (event.error === 'not-allowed') {
          errorMsg = "Microphone access denied";
          description = "Please allow microphone access to use voice input.";
        }
        
        toast({ 
          title: errorMsg, 
          description,
          variant: "destructive" 
        });
        
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        toast({ 
          title: "Voice input error", 
          description: "Could not start speech recognition.",
          variant: "destructive" 
        });
        setIsListening(false);
        recognitionRef.current = null;
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return (
    <Button 
      variant="ghost"
      size="sm"
      className={cn(
        "text-gray-500 p-1 h-8 w-8 rounded-full transition-colors",
        isListening && "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 relative"
      )}
      onClick={handleToggleListen}
      disabled={disabled || !browserSupportsSpeech}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></span>
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInput;
