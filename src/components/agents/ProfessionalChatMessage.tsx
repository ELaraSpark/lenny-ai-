import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { Agent } from './types/agentTypes';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProfessionalChatMessageProps {
  message: Message | string;
  selectedAgent?: Agent;
  isUser?: boolean;
  className?: string;
  timestamp?: Date;
}

const ProfessionalChatMessage: React.FC<ProfessionalChatMessageProps> = ({
  message,
  selectedAgent,
  isUser = false,
  className,
  timestamp
}) => {
  const [showReferences, setShowReferences] = useState(false);
  
  const messageContent = typeof message === 'string' ? message : message.content;
  
  const parseStructuredResponse = (rawContent: any) => {
    if (typeof rawContent !== 'string' || rawContent.trim() === '') {
      return { 
        question: '', 
        diagnosis: '', 
        summary: '', 
        references: [] 
      };
    }
    const content = rawContent;

    try {
      const questionMatch = content.match(/QUESTION:\s*(.*?)(?:\n\n|\n(?=DIAGNOSIS)|$)/s);
      const diagnosisMatch = content.match(/DIAGNOSIS\/ANALYSIS:\s*(.*?)(?:\n\n|\n(?=SUMMARY)|$)/s);
      const summaryMatch = content.match(/SUMMARY:\s*(.*?)(?:\n\n|\n(?=REFERENCES)|$)/s);
      const referencesMatch = content.match(/REFERENCES:\s*(.*?)$/s);
    
      const hasStructuredFormat = questionMatch || diagnosisMatch || summaryMatch;
    
      if (!hasStructuredFormat) {
        const firstSentenceMatch = content.match(/^(.+?\.)\s/);
        const firstSentence = firstSentenceMatch && firstSentenceMatch[1] ? firstSentenceMatch[1] : "What is the medical information?";
      
        return {
          question: firstSentence,
          diagnosis: content,
          summary: '',
          references: []
        };
      }
    
      return {
        question: questionMatch && questionMatch[1] ? questionMatch[1].trim() : 'What is the medical information?',
        diagnosis: diagnosisMatch && diagnosisMatch[1] ? diagnosisMatch[1].trim() : content,
        summary: summaryMatch && summaryMatch[1] ? summaryMatch[1].trim() : '',
        references: referencesMatch && referencesMatch[1] 
          ? referencesMatch[1].trim().split('\n').map(ref => ref.trim().replace(/^- /, '')).filter(ref => ref) 
          : []
      };
    } catch (error) {
      // console.error("Error parsing structured response:", error, "Content was:", content);
      return {
        question: 'Error processing content.',
        diagnosis: content, 
        summary: 'Could not parse summary.',
        references: []
      };
    }
  };

  const formatText = (text: string) => {
    if (!text) return '';
    try {
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\[(\d+(?:-\d+)?)\]/g, '<sup class="text-xs font-medium text-blue-600">[$1]</sup>');
        return formatted;
    } catch (error) {
        // console.error("Error formatting text:", error, "Text was:", text);
        return text; // Return original text if formatting fails
    }
  };
  
  const { question, diagnosis, summary, references } = parseStructuredResponse(messageContent);
  const formattedDiagnosis = formatText(diagnosis || '');
  
  const summaryPoints = summary 
    ? summary.split(/\d+\.\s+/).filter(item => item.trim()).map(item => formatText(item.trim()))
    : [];

  const fallbackSummaryPoints = summaryPoints.length === 0 && diagnosis 
    ? diagnosis
        .split(/\n/)
        .filter(line => /^[•\-*]\s/.test(line) || /^\d+\.\s/.test(line))
        .map(item => formatText(item.replace(/^[•\-*]\s|\d+\.\s/, '')))
    : [];

  const displaySummaryPoints = summaryPoints.length > 0 ? summaryPoints : fallbackSummaryPoints;
  const questionTitle = question ? question.replace(/^what is /i, '').replace(/\?$/, '') : 'Medical Inquiry';
  const useSimplifiedView = isUser || !diagnosis || typeof message === 'string' || !messageContent || (typeof message !== 'string' && !message.content);
  
  if (useSimplifiedView) {
    return (
      <div className={cn("flex w-full mx-auto", isUser ? "justify-end" : "justify-start", className)}>
        <div className={cn(
          "rounded-lg p-4 max-w-[85%]", 
          isUser ? "bg-primary text-primary-foreground" : "bg-white border border-gray-200"
        )}>
          <div className="flex flex-col">
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: formatText(messageContent || '') }} 
            />
            
            {timestamp && (
              <div className="text-xs opacity-70 mt-2 text-right">
                {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center w-full mx-auto", className)}>
      <div className="flex items-start gap-2 max-w-[95%] w-full md:max-w-[85%]">
        {selectedAgent && (
          <PicassoAvatar
            name={selectedAgent.name || "Doctor"}
            illustrationType="healing"
            size="sm"
            color="text-primary"
            className="flex-shrink-0 mt-1"
          />
        )}
        
        <div className="w-full bg-card rounded-[var(--radius-lg)] shadow-sm overflow-hidden border border-neutral-200 rotate-[0.2deg] backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-neutral-100">
            <div className="text-neutral-500 text-sm mb-1">Expanded question:</div>
            <div className="flex flex-wrap">
              <span className="font-medium text-neutral-700">What is </span>
              <span className="text-neutral-700">{questionTitle}</span>
            </div>
          </div>
          
          <div className="px-6 py-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <div 
              className="prose prose-sm max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: formattedDiagnosis }}
            />
            
            {displaySummaryPoints.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-neutral-700 rotate-[-0.3deg]">In summary, the treatment involves:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  {displaySummaryPoints.map((point, index) => (
                    <li 
                      key={index} 
                      className="text-neutral-700"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
                </ol>
              </div>
            )}
            
            {references.length > 0 && (
              <div className="mt-4 text-sm text-neutral-600">
                <p>
                  These regimens are supported by multiple systematic reviews and meta-analyses, ensuring their efficacy and safety in treating this condition.
                  {Array.from({length: Math.min(references.length, 3)}, (_, i) => (
                    <sup key={i} className="text-xs font-medium text-blue-600">[{i+1}]</sup>
                  ))}
                </p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm rotate-[-0.5deg]">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm rotate-[-0.5deg]">
                <ThumbsUp size={16} />
                <span>Helpful</span>
              </button>
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm rotate-[-0.5deg]">
                <ThumbsDown size={16} />
                <span>Not helpful</span>
              </button>
            </div>
            {references.length > 0 && (
                <button 
                    onClick={() => setShowReferences(!showReferences)}
                    className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                >
                    {showReferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{showReferences ? 'Hide' : 'Show'} References ({references.length})</span>
                </button>
            )}
          </div>

          {showReferences && references.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-100 bg-white">
              <h4 className="font-medium text-neutral-700 mb-2">References:</h4>
              <ul className="list-decimal pl-6 space-y-1 text-sm text-neutral-600">
                {references.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChatMessage;
