import React from 'react';
import { Loader2 } from 'lucide-react';
import { getLoadingMessage, getMedicalFact } from '@/lib/personalityUtils';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';

interface FunLoadingProps {
  message?: string;
  showFact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  illustrationType?: 'brain' | 'healing' | 'stethoscope' | 'chart';
}

/**
 * A fun loading component with personality for medical professionals
 */
export function FunLoading({
  message,
  showFact = false,
  size = 'md',
  className,
  illustrationType = 'brain'
}: FunLoadingProps) {
  // Generate a random loading message if one isn't provided
  const loadingMessage = message || getLoadingMessage();
  
  // Generate a random medical fact if showFact is true
  const medicalFact = showFact ? getMedicalFact() : null;
  
  // Determine size classes
  const sizeClasses = {
    sm: 'max-w-xs p-3 text-sm',
    md: 'max-w-md p-4 text-base',
    lg: 'max-w-lg p-6 text-lg'
  };
  
  // Determine icon size
  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32
  };
  
  // Determine illustration size
  const illustrationSize = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  } as const;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-4 rounded-xl bg-muted/50 border border-muted-foreground/10 shadow-sm',
      sizeClasses[size],
      className
    )}>
      {/* Illustration */}
      <div className="relative">
        <PicassoIllustration
          name={illustrationType}
          size={illustrationSize[size]}
          color="text-primary"
          className="animate-pulse"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
      
      {/* Loading message */}
      <div className="text-center">
        <p className="font-medium text-foreground">{loadingMessage}</p>
        
        {/* Medical fact (optional) */}
        {showFact && medicalFact && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              <span className="font-medium">Did you know?</span> {medicalFact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A smaller inline loading component with personality
 */
export function InlineLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <Loader2 className="h-3 w-3 animate-spin" />
      <span className="animate-pulse">{getLoadingMessage()}</span>
    </div>
  );
}

/**
 * A full-page loading overlay with personality
 */
export function FullPageLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <FunLoading size="lg" showFact={true} />
    </div>
  );
}
