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

  // Parse the structured response
  const parseStructuredResponse = (content: string) => {
    // Extract sections using regex
    const questionMatch = content.match(/QUESTION:\s*(.*?)(?:\n\n|\n(?=DIAGNOSIS))/s);
    const diagnosisMatch = content.match(/DIAGNOSIS\/ANALYSIS:\s*(.*?)(?:\n\n|\n(?=SUMMARY))/s);
    const summaryMatch = content.match(/SUMMARY:\s*(.*?)(?:\n\n|\n(?=REFERENCES))/s);
    const referencesMatch = content.match(/REFERENCES:\s*(.*?)$/s);
    
    return {
      question: questionMatch ? questionMatch[1].trim() : '',
      diagnosis: diagnosisMatch ? diagnosisMatch[1].trim() : '',
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
  
  // Parse summary points
  const summaryPoints = summary.split(/\d+\.\s+/).filter(item => item.trim()).map(item => formatText(item.trim()));

  return (
    <div className={cn("flex justify-start w-full", className)}>
      <div className="flex items-start gap-2 max-w-[90%]">
        <PicassoAvatar
          name={selectedAgent.name}
          illustrationType="healing"
          size="sm"
          color="text-primary"
          className="flex-shrink-0 mt-1"
        />
        
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Expanded Question */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Expanded question:</div>
            <div className="flex">
              <span className="font-medium text-gray-700">What is </span>
              <span className="text-gray-700">{question.replace(/^What is /i, '')}</span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-6 py-4">
            {/* Diagnosis/Analysis */}
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: formattedDiagnosis }}
            />
            
            {/* Summary Points */}
            {summaryPoints.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-gray-700">In summary, the treatment involves:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  {summaryPoints.map((point, index) => (
                    <li 
                      key={index} 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
                </ol>
              </div>
            )}
            
            {/* References Citation */}
            {references.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
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
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                <ThumbsUp size={16} />
                <span>Helpful</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                <ThumbsDown size={16} />
                <span>Not Helpful</span>
              </button>
            </div>
            
            {references.length > 0 && (
              <button 
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                onClick={() => setShowReferences(!showReferences)}
              >
                <span>References</span>
                {showReferences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
          
          {/* References Section */}
          {references.length > 0 && showReferences && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3">References</h3>
              <ol className="list-decimal pl-6 space-y-3 text-sm">
                {references.map((ref, index) => {
                  // Parse reference parts
                  const parts = ref.split('.');
                  const title = parts[0];
                  const authors = parts.length > 1 ? parts[1].trim() : '';
                  const source = parts.length > 2 ? parts.slice(2).join('.').trim() : '';
                  
                  return (
                    <li key={index} className="text-gray-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-700">{title}</div>
                          <div>{authors}</div>
                          <div className="text-gray-500">{source}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
                            <ThumbsUp size={14} />
                          </button>
                          <button className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
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
