import React from 'react';
import { cn } from '@/lib/utils';
import { PicassoIllustration } from './PicassoIllustration';
import { IllustrationName } from './illustrations';

export interface PicassoAvatarProps {
  name?: string;
  email?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  className?: string;
  illustrationType?: IllustrationName;
  color?: string;
  onClick?: () => void;
}

/**
 * PicassoAvatar component for displaying Picasso-style avatars
 * 
 * @param name - User's name (used for initials if no illustration is provided)
 * @param email - User's email (used for initials if no name is provided)
 * @param size - The size of the avatar (xs, sm, md, lg, xl)
 * @param variant - The shape of the avatar (circle, rounded, square)
 * @param className - Additional classes to apply
 * @param illustrationType - The type of illustration to use
 * @param color - Optional color class (e.g., 'text-medical-red', 'text-perplexity-teal')
 * @param onClick - Optional click handler
 */
export const PicassoAvatar: React.FC<PicassoAvatarProps> = ({
  name,
  email,
  size = 'md',
  variant = 'circle',
  className,
  illustrationType,
  color = 'text-primary', // Default to primary theme color
  onClick,
}) => {
  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  // Variant mappings
  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  // Get initials from name or email
  const getInitials = (): string => {
    if (name) {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Determine which illustration to use
  const getIllustration = (): IllustrationName => {
    if (illustrationType) {
      return illustrationType;
    }
    
    // If no illustration type is provided, use a default based on the first letter of the name or email
    const initial = getInitials()[0];
    
    // Map initials to illustrations
    const initialMap: Record<string, IllustrationName> = {
      'A': 'agent',
      'B': 'brain',
      'C': 'chat',
      'D': 'doctor',
      'E': 'empty',
      'F': 'empty',
      'G': 'empty',
      'H': 'heart',
      'I': 'empty',
      'J': 'empty',
      'K': 'empty',
      'L': 'empty',
      'M': 'microscope',
      'N': 'empty',
      'O': 'empty',
      'P': 'empty',
      'Q': 'empty',
      'R': 'empty',
      'S': 'stethoscope',
      'T': 'template',
      'U': 'empty',
      'V': 'empty',
      'W': 'empty',
      'X': 'empty',
      'Y': 'empty',
      'Z': 'empty',
    };
    
    return initialMap[initial] || 'empty';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-muted', // Use standard muted background
        sizeClasses[size],
        variantClasses[variant],
        'overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {illustrationType || (name || email) ? (
        <PicassoIllustration
          name={getIllustration()}
          size={size}
          color={color}
          className="transform scale-75"
        />
      ) : (
        <span className="font-medium">{getInitials()}</span>
      )}
    </div>
  );
};
