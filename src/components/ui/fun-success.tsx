import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { getMedicalJoke, getMedicalFact, getMedicalQuote, getHealthcareTip } from '@/lib/personalityUtils';
import { cn } from '@/lib/utils';
import { CheckCircle2, Sparkles, Brain, Coffee, FileText, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

type ContentType = 'joke' | 'fact' | 'quote' | 'tip';

interface FunSuccessProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  illustrationType?: 'brain' | 'healing' | 'stethoscope' | 'chart';
  contentType?: ContentType;
  className?: string;
  showRefreshButton?: boolean;
}

/**
 * An enhanced success state component with personality for medical professionals
 */
export function FunSuccess({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  illustrationType = 'healing',
  contentType = 'fact',
  className,
  showRefreshButton = true,
}: FunSuccessProps) {
  const [content, setContent] = useState<string>('');
  
  // Get content based on type
  const refreshContent = () => {
    switch (contentType) {
      case 'joke':
        setContent(getMedicalJoke());
        break;
      case 'fact':
        setContent(getMedicalFact());
        break;
      case 'quote':
        setContent(getMedicalQuote());
        break;
      case 'tip':
        setContent(getHealthcareTip());
        break;
      default:
        setContent(getMedicalFact());
    }
  };
  
  // Initialize content on mount
  useEffect(() => {
    refreshContent();
  }, [contentType]);
  
  // Get icon based on content type
  const getIcon = () => {
    switch (contentType) {
      case 'joke':
        return <Sparkles className="h-4 w-4" />;
      case 'fact':
        return <Brain className="h-4 w-4" />;
      case 'quote':
        return <FileText className="h-4 w-4" />;
      case 'tip':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  
  // Get background color based on content type
  const getBgColor = () => {
    switch (contentType) {
      case 'joke':
        return 'bg-amber-50 border-amber-100';
      case 'fact':
        return 'bg-blue-50 border-blue-100';
      case 'quote':
        return 'bg-purple-50 border-purple-100';
      case 'tip':
        return 'bg-green-50 border-green-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };
  
  // Get text color based on content type
  const getTextColor = () => {
    switch (contentType) {
      case 'joke':
        return 'text-amber-700';
      case 'fact':
        return 'text-blue-700';
      case 'quote':
        return 'text-purple-700';
      case 'tip':
        return 'text-green-700';
      default:
        return 'text-blue-700';
    }
  };
  
  // Get title based on content type
  const getContentTitle = () => {
    switch (contentType) {
      case 'joke':
        return 'Medical Humor';
      case 'fact':
        return 'Did You Know?';
      case 'quote':
        return 'Words of Wisdom';
      case 'tip':
        return 'Healthcare Pro Tip';
      default:
        return 'Did You Know?';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 shadow-lg',
        className
      )}
    >
      {/* Success icon with animation */}
      <motion.div 
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
        className="relative"
      >
        <div className="bg-green-100 rounded-full p-4 text-green-700">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-green-100 rounded-full opacity-50 -z-10"
        />
      </motion.div>
      
      {/* Illustration */}
      <div className="relative">
        <PicassoIllustration
          name={illustrationType}
          size="md"
          color="text-primary"
          className="animate-float"
        />
      </div>
      
      {/* Main content */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-semibold text-green-800">{title}</h3>
        {description && (
          <p className="text-green-700">{description}</p>
        )}
      </div>
      
      {/* Action buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actionLabel && (
            <Button onClick={onAction} className="rounded-full bg-green-600 hover:bg-green-700">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline" onClick={onSecondaryAction} className="rounded-full border-green-200 text-green-700 hover:bg-green-50">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
      
      {/* Fun content card */}
      <div className={cn(
        'rounded-xl border p-4 max-w-md shadow-sm',
        getBgColor()
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            'rounded-full p-2 flex-shrink-0',
            getBgColor().replace('50', '100').replace('border-', ''),
            getTextColor()
          )}>
            {getIcon()}
          </div>
          <div>
            <h4 className={cn('text-sm font-medium mb-1', getTextColor().replace('700', '800'))}>
              {getContentTitle()}
            </h4>
            <p className={cn('text-sm', getTextColor())}>
              {content}
            </p>
            
            {/* Refresh button */}
            {showRefreshButton && (
              <div className="mt-2 text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn('text-xs p-1 h-auto', getTextColor(), 'hover:' + getTextColor().replace('700', '900'))}
                  onClick={refreshContent}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New {contentType}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * A fun success state with a random content type
 */
export function RandomFunSuccess(props: Omit<FunSuccessProps, 'contentType'>) {
  const contentTypes: ContentType[] = ['joke', 'fact', 'quote', 'tip'];
  const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
  
  return <FunSuccess {...props} contentType={randomType} />;
}

/**
 * A modal overlay version of the fun success component
 */
export function FunSuccessModal(props: FunSuccessProps & { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose, ...rest } = props;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-lg w-full">
        <FunSuccess 
          {...rest} 
          secondaryActionLabel={props.secondaryActionLabel || "Close"}
          onSecondaryAction={props.onSecondaryAction || onClose}
        />
      </div>
    </div>
  );
}
