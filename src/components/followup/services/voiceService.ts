
import { useCallback, useState } from 'react';

interface VoiceServiceOptions {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
}

interface SpeechOptions {
  text: string;
  voiceId?: string;
}

export function useVoiceService(options: VoiceServiceOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const apiKey = options.apiKey || localStorage.getItem('elevenLabsApiKey');
  const defaultVoiceId = options.voiceId || 'pNInz6obpgDQGcFmaJgB'; // Default ElevenLabs voice ID
  const modelId = options.modelId || 'eleven_monolingual_v1';
  
  const textToSpeech = useCallback(async ({ 
    text, 
    voiceId = defaultVoiceId 
  }: SpeechOptions) => {
    if (!apiKey) {
      setError('API key not provided');
      return null;
    }
    
    if (!text.trim()) {
      setError('No text provided');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      setAudio(audioElement);
      return audioElement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Text-to-speech error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, defaultVoiceId, modelId]);
  
  const playAudio = useCallback(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);
  
  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio]);
  
  const setApiKey = useCallback((key: string) => {
    localStorage.setItem('elevenLabsApiKey', key);
  }, []);
  
  return {
    textToSpeech,
    playAudio,
    stopAudio,
    setApiKey,
    isLoading,
    error,
    hasApiKey: !!apiKey
  };
}
