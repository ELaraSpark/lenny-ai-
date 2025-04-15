import React from 'react';
import { Button } from "@/components/ui/button";
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { FunEmptyState, RandomFunEmptyState } from '@/components/ui/fun-empty-state';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  illustrationType?: 'empty' | 'chat' | 'search' | 'document' | 'agent' | 'template' | 'task' | 'notification';
}

/**
 * Empty state component for when there's no content to display
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  illustrationType = 'empty',
}: EmptyStateProps) {
  // Map our illustration types to the PicassoIllustration types
  const illustrationTypeMap: Record<string, 'brain' | 'healing' | 'stethoscope' | 'chart' | 'empty'> = {
    'empty': 'empty',
    'chat': 'healing',
    'search': 'brain',
    'document': 'chart',
    'agent': 'healing',
    'template': 'chart',
    'task': 'stethoscope',
    'notification': 'brain',
  };
  
  // Use our new FunEmptyState component
  return (
    <RandomFunEmptyState
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
      secondaryActionLabel={secondaryActionLabel}
      onSecondaryAction={onSecondaryAction}
      illustrationType={illustrationTypeMap[illustrationType] || 'empty'}
    />
  );
}
