import React from 'react';
import { cn } from '@/lib/utils';
import { illustrationMap, IllustrationName } from './illustrations';

export interface PicassoIllustrationProps {
  name: IllustrationName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: string;
  className?: string;
}

/**
 * PicassoIllustration component for displaying Picasso-style medical illustrations
 * 
 * @param name - The name of the illustration to display
 * @param size - The size of the illustration (xs, sm, md, lg, xl, 2xl)
 * @param color - Optional color class (e.g., 'text-medical-red', 'text-perplexity-teal')
 * @param className - Additional classes to apply
 */
export const PicassoIllustration: React.FC<PicassoIllustrationProps> = ({
  name,
  size = 'md',
  color,
  className,
}) => {
  const IllustrationComponent = illustrationMap[name];

  if (!IllustrationComponent) {
    console.warn(`Illustration "${name}" not found`);
    return null;
  }

  // Size mappings
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  // Color classes
  const colorClass = color || 'text-current';

  return (
    <div className={cn(sizeClasses[size], colorClass, className)}>
      <IllustrationComponent className="w-full h-full" />
    </div>
  );
};
