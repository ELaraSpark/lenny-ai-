import React from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle, Brain, Coffee, Sparkles, FileText } from 'lucide-react';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { getMedicalJoke, getMedicalFact, getMedicalQuote, getHealthcareTip } from '@/lib/personalityUtils';

// Define custom toast types
type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';
type ToastContentType = 'default' | 'fact' | 'joke' | 'tip' | 'quote';

// Extend the toast props to include our custom types
interface FunToastProps {
  variant?: ToastVariant;
  contentType?: ToastContentType; // Renamed from 'type' to 'contentType' to avoid conflict
  [key: string]: any;
}

/**
 * Enhanced toast component with personality for medical professionals
 */
export function FunToast() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Extract variant and contentType from props with proper typing
        const customProps = props as unknown as FunToastProps;
        const variant = customProps.variant || 'default';
        const contentType = customProps.contentType || 'default';
        
        // Determine icon based on variant
        let Icon = Info;
        if (variant === 'success') Icon = CheckCircle2;
        else if (variant === 'destructive') Icon = XCircle;
        else if (variant === 'warning') Icon = AlertCircle;
        
        // Determine illustration type based on content type
        let illustrationType: 'brain' | 'healing' | 'stethoscope' | 'chart' = 'brain';
        if (contentType === 'fact') illustrationType = 'brain';
        else if (contentType === 'joke') illustrationType = 'healing';
        else if (contentType === 'tip') illustrationType = 'stethoscope';
        else if (contentType === 'quote') illustrationType = 'chart';
        
        // Determine background color based on content type
        let bgColor = 'bg-background';
        let borderColor = 'border-border';
        if (contentType === 'fact') {
          bgColor = 'bg-blue-50';
          borderColor = 'border-blue-100';
        } else if (contentType === 'joke') {
          bgColor = 'bg-amber-50';
          borderColor = 'border-amber-100';
        } else if (contentType === 'tip') {
          bgColor = 'bg-green-50';
          borderColor = 'border-green-100';
        } else if (contentType === 'quote') {
          bgColor = 'bg-purple-50';
          borderColor = 'border-purple-100';
        }
        
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              'group flex flex-row items-start gap-3 rounded-xl border shadow-lg',
              bgColor,
              borderColor,
              props.className
            )}
          >
            {/* Icon or Illustration */}
            {contentType !== 'default' ? (
              <div className="flex-shrink-0 pt-2 pl-2">
                <PicassoIllustration
                  name={illustrationType}
                  size="xs"
                  color="text-primary"
                  className="group-hover:animate-pulse"
                />
              </div>
            ) : (
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                variant === 'success' && "bg-green-100 text-green-700",
                variant === 'destructive' && "bg-red-100 text-red-700",
                variant === 'warning' && "bg-amber-100 text-amber-700",
                variant === 'default' && "bg-blue-100 text-blue-700",
              )}>
                <Icon className="h-4 w-4" />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 pt-1.5">
              {title && <ToastTitle className="text-sm font-medium">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm">
                  {description}
                </ToastDescription>
              )}
              {action}
            </div>
            
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

/**
 * Helper functions to show fun toasts with personality
 */
export const funToasts = {
  /**
   * Show a random medical fact toast
   */
  showFact: (toast: any) => {
    toast({
      title: "Did You Know?",
      description: getMedicalFact(),
      contentType: 'fact' as ToastContentType,
      duration: 5000,
    });
  },
  
  /**
   * Show a random medical joke toast
   */
  showJoke: (toast: any) => {
    toast({
      title: "Medical Humor",
      description: getMedicalJoke(),
      contentType: 'joke' as ToastContentType,
      duration: 5000,
    });
  },
  
  /**
   * Show a random healthcare tip toast
   */
  showTip: (toast: any) => {
    toast({
      title: "Healthcare Pro Tip",
      description: getHealthcareTip(),
      contentType: 'tip' as ToastContentType,
      duration: 5000,
    });
  },
  
  /**
   * Show a random medical quote toast
   */
  showQuote: (toast: any) => {
    toast({
      title: "Words of Wisdom",
      description: getMedicalQuote(),
      contentType: 'quote' as ToastContentType,
      duration: 5000,
    });
  },
  
  /**
   * Show a random fun toast (randomly selects between fact, joke, tip, or quote)
   */
  showRandom: (toast: any) => {
    const types: ToastContentType[] = ['fact', 'joke', 'tip', 'quote'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    if (randomType === 'fact') funToasts.showFact(toast);
    else if (randomType === 'joke') funToasts.showJoke(toast);
    else if (randomType === 'tip') funToasts.showTip(toast);
    else if (randomType === 'quote') funToasts.showQuote(toast);
  },
  
  /**
   * Show a welcome back toast with personality
   */
  showWelcomeBack: (toast: any, userName?: string) => {
    const hour = new Date().getHours();
    let greeting = "Welcome back";
    
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    
    if (userName) greeting += `, Dr. ${userName}`;
    
    toast({
      title: greeting,
      description: "Ready to make a difference today?",
      variant: 'default' as ToastVariant,
      duration: 3000,
    });
  },
};
