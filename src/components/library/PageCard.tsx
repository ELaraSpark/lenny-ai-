import React from 'react';
import { FileText } from 'lucide-react';
import { BaseCard, BaseCardProps } from './BaseCard';

export interface PageCardProps extends Omit<BaseCardProps, 'icon'> {
  lastEditor?: string; // Optional: Add specific props for pages
}

export const PageCard = ({
  lastEditor, // Destructure page-specific props
  ...props // Pass remaining props to BaseCard
}: PageCardProps) => {
  // Example: Enhance preview if lastEditor exists
  const enhancedPreview = lastEditor 
    ? `${props.preview} (Last edited by ${lastEditor})`
    : props.preview;

  return (
    <BaseCard
      {...props}
      preview={enhancedPreview} // Use the potentially enhanced preview
      icon={<FileText size={16} className="text-muted-foreground" />} // Use standard muted-foreground
    />
  );
};
