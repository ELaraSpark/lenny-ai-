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
  message: Message;
  selectedAgent: Agent;
  className?: string;
}

const ProfessionalChatMessage: React.FC<ProfessionalChatMessageProps> = ({
  message,
  selectedAgent,
  className
}) => {
  const [showReferences, setShowReferences] = useState(false);

  // Parse the structured response with improved handling for different formats
  const parseStructuredResponse = (content: string) => {
    // Extract sections using regex with fallbacks for different formats
    const questionMatch = content.match(/QUESTION:\s*(.*?)(?:\n\n|\n(?=DIAGNOSIS)|$)/s);
    const diagnosisMatch = content.match(/DIAGNOSIS\/ANALYSIS:\s*(.*?)(?:\n\n|\n(?=SUMMARY)|$)/s);
    const summaryMatch = content.match(/SUMMARY:\s*(.*?)(?:\n\n|\n(?=REFERENCES)|$)/s);
    const referencesMatch = content.match(/REFERENCES:\s*(.*?)$/s);
    
    // If structured sections aren't found, we'll create a basic structure
    const hasStructuredFormat = questionMatch || diagnosisMatch || summaryMatch;
    
    if (!hasStructuredFormat) {
      // Create fallback sections for unstructured content
      // Extract the first sentence as a question if possible
      const firstSentenceMatch = content.match(/^(.+?\.)\s/);
      const firstSentence = firstSentenceMatch ? firstSentenceMatch[1] : "What is the medical information?";
      
      return {
        question: firstSentence,
        diagnosis: content,
        summary: '',
        references: []
      };
    }
    
    return {
      question: questionMatch ? questionMatch[1].trim() : 'What is the medical information?',
      diagnosis: diagnosisMatch ? diagnosisMatch[1].trim() : content,
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      references: referencesMatch ? referencesMatch[1].trim().split('\n').map(ref => ref.trim()) : []
    };
  };

  // Format text with markdown-like syntax
  const formatText = (text: string) => {
    // Replace **bold** with <strong>bold</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace [n] citations with superscript
    formatted = formatted.replace(/\[(\d+(?:-\d+)?)\]/g, '<sup class="text-xs font-medium text-blue-600">[$1]</sup>');
    
    return formatted;
  };

  // Parse the message content
  const { question, diagnosis, summary, references } = parseStructuredResponse(message.content);

  // Format the diagnosis text
  const formattedDiagnosis = formatText(diagnosis);
  
  // Parse summary points with improved handling
  const summaryPoints = summary 
    ? summary.split(/\d+\.\s+/).filter(item => item.trim()).map(item => formatText(item.trim()))
    : [];

  // If no structured summary points but we have diagnosis text, try to extract key points
  const fallbackSummaryPoints = summaryPoints.length === 0 && diagnosis 
    ? diagnosis
        .split(/\n/)
        .filter(line => /^[•\-*]\s/.test(line) || /^\d+\.\s/.test(line))
        .map(item => formatText(item.replace(/^[•\-*]\s|\d+\.\s/, '')))
    : [];

  // Use either the structured summary points or fallback points
  const displaySummaryPoints = summaryPoints.length > 0 ? summaryPoints : fallbackSummaryPoints;

  // Extract a title from the question for display
  const questionTitle = question.replace(/^what is /i, '').replace(/\?$/, '');

  return (
    <div className={cn("flex justify-center w-full mx-auto", className)}>
      <div className="flex items-start gap-2 max-w-[95%] w-full md:max-w-[85%]">
        <PicassoAvatar
          name={selectedAgent.name}
          illustrationType="healing"
          size="sm"
          color="text-primary"
          className="flex-shrink-0 mt-1"
        />
        
        <div className="w-full bg-card rounded-[var(--radius-lg)] shadow-sm overflow-hidden border border-neutral-200 rotate-[0.2deg] backdrop-blur-sm">
          {/* Expanded Question */}
          <div className="px-6 py-4 border-b border-neutral-100">
            <div className="text-neutral-500 text-sm mb-1">Expanded question:</div>
            <div className="flex flex-wrap">
              <span className="font-medium text-neutral-700">What is </span>
              <span className="text-neutral-700">{questionTitle}</span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
            {/* Diagnosis/Analysis */}
            <div 
              className="prose prose-sm max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: formattedDiagnosis }}
            />
            
            {/* Summary Points */}
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
            
            {/* References Citation */}
            {references.length > 0 && (
              <div className="mt-4 text-sm text-neutral-600">
                <p>
                  These regimens are supported by multiple systematic reviews and meta-analyses, ensuring their efficacy and safety in treating this condition.
                  {Array.from({length: Math.min(references.length, 4)}, (_, i) => (
                    <sup key={i} className="text-xs font-medium text-blue-600">[{i+1}]</sup>
                  ))}
                </p>
              </div>
            )}
          </div>
          
          {/* Feedback and References Toggle */}
          <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm rotate-[-0.5deg]">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm">
                <ThumbsUp size={16} />
                <span>Helpful</span>
              </button>
              <button className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm rotate-[0.5deg]">
                <ThumbsDown size={16} />
                <span>Not Helpful</span>
              </button>
            </div>
            
            {references.length > 0 && (
              <button 
                className="text-neutral-500 hover:text-primary flex items-center gap-1 text-sm ml-auto"
                onClick={() => setShowReferences(!showReferences)}
              >
                <span>References</span>
                {showReferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
          
          {/* References Section */}
          {references.length > 0 && showReferences && (
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 overflow-y-auto max-h-[30vh] custom-scrollbar">
              <h3 className="font-medium text-neutral-700 mb-3 rotate-[-0.3deg]">References</h3>
              <ol className="list-decimal pl-6 space-y-3 text-sm">
                {references.map((ref, index) => {
                  // Parse reference parts
                  const parts = ref.split('.');
                  const title = parts[0];
                  const authors = parts.length > 1 ? parts[1].trim() : '';
                  const source = parts.length > 2 ? parts.slice(2).join('.').trim() : '';
                  
                  return (
                    <li key={index} className="text-neutral-600">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-neutral-700">{title}</div>
                          <div>{authors}</div>
                          <div className="text-neutral-500">{source}</div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="h-7 w-7 p-0 text-neutral-400 hover:text-primary">
                            <ThumbsUp size={14} />
                          </button>
                          <button className="h-7 w-7 p-0 text-neutral-400 hover:text-primary">
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChatMessage;
