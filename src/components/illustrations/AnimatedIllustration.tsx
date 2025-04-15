import React from 'react';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from './PicassoIllustration';
import { IllustrationName } from './illustrations';

export interface AnimatedIllustrationProps {
  name: IllustrationName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  animation?: 'pulse' | 'spin' | 'bounce' | 'morph';
  className?: string;
}

/**
 * AnimatedIllustration component for displaying animated Picasso-style medical illustrations
 * 
 * @param name - The name of the illustration to display
 * @param size - The size of the illustration (sm, md, lg, xl)
 * @param color - Optional color class (e.g., 'text-medical-red', 'text-perplexity-teal')
 * @param animation - The type of animation to apply (pulse, spin, bounce, morph)
 * @param className - Additional classes to apply
 */
export const AnimatedIllustration: React.FC<AnimatedIllustrationProps> = ({
  name,
  size = 'md',
  color = 'text-perplexity-teal',
  animation = 'pulse',
  className,
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    morph: 'animate-morph', // Custom animation defined in tailwind.config.ts
  };

  return (
    <div className={cn(
      sizeClasses[size], 
      color, 
      animationClasses[animation], 
      className
    )}>
      <PicassoIllustration 
        name={name} 
        size={size} 
        className="w-full h-full"
      />
    </div>
  );
};

/**
 * LoadingIllustration component for displaying a loading state with appropriate medical illustration
 * 
 * @param type - The type of content being loaded (patient, chat, data, ai)
 * @param size - The size of the illustration (sm, md, lg, xl)
 * @param className - Additional classes to apply
 */
export const LoadingIllustration: React.FC<{
  type?: 'patient' | 'chat' | 'data' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({
  type = 'data',
  size = 'md',
  className,
}) => {
  // Map content types to appropriate illustrations
  const illustrationMap: Record<string, IllustrationName> = {
    patient: 'heart',
    chat: 'chat',
    data: 'chart',
    ai: 'brain',
  };

  // Map content types to appropriate animations
  const animationMap: Record<string, 'pulse' | 'spin' | 'bounce' | 'morph'> = {
    patient: 'pulse',
    chat: 'bounce',
    data: 'spin',
    ai: 'pulse',
  };

  const illustration = illustrationMap[type];
  const animation = animationMap[type];
  
  // Size mappings for the Picasso illustration
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      {/* Use PicassoIllustration with animation instead of webp */}
      <div className={cn(sizeClasses[size], `animate-${animation}`)}>
        <PicassoIllustration 
          name={illustration}
          size={size}
          color="text-primary"
          className="w-full h-full"
        />
      </div>
      {/* More engaging loading text */}
      <p className="mt-4 text-sm text-muted-foreground animate-pulse"> 
        {type === 'patient' && 'Accessing patient records...'}
        {type === 'chat' && 'Loading conversation history...'}
        {type === 'data' && 'Analyzing data points...'}
        {type === 'ai' && 'Consulting knowledge base...'} 
      </p>
    </div>
  );
};
