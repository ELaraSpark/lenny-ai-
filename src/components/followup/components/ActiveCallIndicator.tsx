
import { Phone, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { Call } from '../types/callTypes';

interface ActiveCallIndicatorProps {
  call: Call;
  onEndCall: () => void;
}

const ActiveCallIndicator = ({ call, onEndCall }: ActiveCallIndicatorProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalSeconds = (call.duration || 5) * 60; // Use default of 5 minutes if not specified
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - call.startTime.getTime()) / 1000);
      setElapsedSeconds(elapsed);
      
      const progressValue = Math.min((elapsed / totalSeconds) * 100, 100);
      setProgress(progressValue);
      
      if (elapsed >= totalSeconds) {
        onEndCall();
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [call, totalSeconds, onEndCall]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-4 right-4 max-w-sm w-full bg-background border rounded-lg shadow-lg p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <Phone className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Active Follow-up Call</h3>
            <p className="text-xs text-muted-foreground">{call.patient.name}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEndCall}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2 mt-2">
        <div className="flex justify-between text-xs">
          <span>AI Agent: {call.agentName}</span>
          <span>{formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </motion.div>
  );
};

export default ActiveCallIndicator;
