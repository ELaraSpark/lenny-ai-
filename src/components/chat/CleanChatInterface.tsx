import React, { useState, useRef, useEffect } from 'react';
import { Search, Send } from 'lucide-react';
import { generateAIResponse } from '@/components/agents/services/agentService';

interface Citation {
  id: string;
  title: string;
  authors: string;
  source: string;
  year: string;
  url?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: {
    name: string;
    logo?: string;
  };
  citations?: Citation[];
}

const CleanChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submission triggered");
    e.preventDefault();
    
    if (!inputValue.trim()) {
      console.log("Input is empty, not submitting");
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    console.log("Adding user message:", userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Create a mock agent for now
      const mockAgent = {
        id: "leny",
        name: "Leny",
        specialty: "General Medicine",
        description: "AI medical assistant",
        icon: () => null,
        capabilities: []
      };
      
      console.log("Calling generateAIResponse with:", userMessage.content);
      
      // Call the AI service
      const response = await generateAIResponse(
        userMessage.content,
        mockAgent
      );
      
      console.log("Raw AI response:", response);
      
      // Parse the response to extract structured data
      const parsedResponse = parseStructuredResponse(response);
      console.log("Parsed response:", parsedResponse);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        source: parsedResponse.source,
        citations: parsedResponse.citations
      };
      
      console.log("Adding assistant message:", assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse structured response from AI
  const parseStructuredResponse = (content: string) => {
    console.log("Parsing structured response:", content);
    
    // Extract sections using regex
    const sourceMatch = content.match(/SOURCE:\s*(.*?)(?:\n\n|\n(?=CONTENT))/s);
    console.log("Source match:", sourceMatch);
    
    const citationsMatch = content.match(/CITATIONS:\s*(.*?)$/s);
    console.log("Citations match:", citationsMatch);
    
    // Parse source
    const source = sourceMatch ? {
      name: sourceMatch[1].trim()
    } : undefined;
    
    // Parse citations
    const citationsText = citationsMatch ? citationsMatch[1].trim() : '';
    const citations: Citation[] = [];
    
    if (citationsText) {
      const citationItems = citationsText.split('\n').filter(line => line.trim());
      
      citationItems.forEach((citation, index) => {
        // Remove the number prefix (e.g., "1. ")
        const citationText = citation.replace(/^\d+\.\s*/, '');
        
        // Try to parse the citation into components
        const parts = citationText.split('.');
        const title = parts[0].trim();
        const authors = parts.length > 1 ? parts[1].trim() : '';
        const source = parts.length > 2 ? parts[2].trim() : '';
        const yearMatch = citationText.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : '';
        
        citations.push({
          id: `citation-${index + 1}`,
          title,
          authors,
          source,
          year
        });
      });
    }
    
    return {
      source,
      citations
    };
  };


  // Format text with citations and bold text
  const formatTextWithCitations = (text: string) => {
    // Replace [1] with superscript
    let formatted = text.replace(/\[(\d+)\]/g, '<sup class="text-primary text-xs font-medium">[<a href="#citation-$1" class="no-underline">$1</a>]</sup>');
    
    // Replace **bold** with <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return formatted;
  };

  // Extract question from message
  const extractQuestion = (message: Message) => {
    if (message.role === 'user') {
      return message.content;
    }
    
    const questionMatch = message.content.match(/QUESTION:\s*(.*?)(?:\n\n|\n(?=SOURCE|CONTENT))/s);
    return questionMatch ? questionMatch[1].trim() : '';
  };

  // Extract content from message
  const extractContent = (message: Message) => {
    if (message.role === 'user') {
      return message.content;
    }
    
    const contentMatch = message.content.match(/CONTENT:\s*(.*?)(?:\n\n|\n(?=CITATIONS))/s);
    return contentMatch ? contentMatch[1].trim() : message.content;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 panel-wrapper">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Medical AI Assistant</h1>
        <p className="text-gray-600 mt-2">Ask any medical question and get evidence-based answers</p>
      </div>
      
      {/* Search form */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex overflow-hidden rounded-full border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="What is the treatment of asthma?"
              className="flex-1 px-6 py-4 text-lg focus:outline-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="button"
              className="bg-primary text-white p-4 flex items-center justify-center"
              disabled={isLoading || !inputValue.trim()}
              onClick={(e) => {
                console.log("Send button clicked");
                handleSubmit(e);
              }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages - with no-nested-scroll to prevent nested scrollbars */}
      <div className="space-y-8 no-nested-scroll">
        {messages.map((message) => (
          <div key={message.id} className="animate-fade-in">
            {message.role === 'user' ? (
              /* User message */
              <div className="mb-2">
                <div className="text-gray-500 text-sm mb-1">Your question:</div>
                <div className="text-gray-800 text-lg">{message.content}</div>
              </div>
            ) : (
              /* Assistant message */
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Expanded question */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="text-gray-500 text-sm mb-1">Expanded question:</div>
                  <div className="text-gray-800">
                    <span className="font-medium">What is </span>
                    <span>{extractQuestion(message).replace(/^What is /i, '')}</span>
                  </div>
                </div>
                
                {/* Source header - Using semitransparent background */}
                {message.source && (
                  <div className="px-6 py-3 tab-nav-bg border-b flex justify-between items-center">
                    <div className="text-amber-700 font-medium">{message.source.name}</div>
                  </div>
                )}
                
                {/* Main content */}
                <div className="px-6 py-4">
                  <div 
                    className="prose prose-sm max-w-none no-nested-scroll"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTextWithCitations(extractContent(message)) 
                    }}
                  />
                </div>
                
                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="px-6 py-4 border-t tab-nav-bg">
                    <div className="text-sm font-medium mb-2">References</div>
                    <ol className="text-sm text-gray-600 pl-5 space-y-2">
                      {message.citations.map((citation, index) => (
                        <li key={citation.id} id={citation.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-700">{citation.title}</div>
                              <div>{citation.authors}</div>
                              <div className="text-gray-500">{citation.source} {citation.year}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start by typing a medical question above. You'll get evidence-based answers with citations.
            </p>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default CleanChatInterface;
