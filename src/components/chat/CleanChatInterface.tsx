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
  const containerRef = useRef<HTMLDivElement>(null); // Add ref for container

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add scroll event listener to close dropdowns when scrolling outside container
  useEffect(() => {
    const handleScroll = (e: Event) => {
      // Check if the scroll event is coming from outside our container
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Close any open dropdowns or popups here
        // If you have specific dropdown state like showLightbulbDialog, set it to false here
      }
    };

    // Add event listener to the window
    window.addEventListener('scroll', handleScroll, true);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

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
    <div className="flex flex-col h-screen bg-gray-100" ref={containerRef}> {/* Changed to flex-col and h-screen */}
      {/* Header - Optional, can be removed or restyled */}
      <div className="p-4 border-b bg-white shadow-sm text-center">
        <h1 className="text-xl font-semibold text-gray-800">Public Medical Chat</h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((message) => (
            <div key={message.id} className={`flex mb-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                  {/* Placeholder for bot avatar, e.g., an icon or image */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                </div>
              )}
              <div
                className={`py-2.5 px-4 rounded-xl shadow-md max-w-[90%] md:max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-base leading-relaxed">{message.content}</p>
                ) : (
                  <>
                    {/* Optional: Display expanded question or source if available */}
                    {extractQuestion(message) && extractQuestion(message) !== extractContent(message) && (
                       <div className="text-sm text-gray-500 mb-1 italic">
                         Re: {extractQuestion(message)}
                       </div>
                    )}
                    {message.source && (
                      <div className="text-xs text-primary mb-1 font-medium">{message.source.name}</div>
                    )}
                    <div
                      className="prose prose-sm max-w-none" /* Removed no-nested-scroll as it might not be needed here */
                      dangerouslySetInnerHTML={{ __html: formatTextWithCitations(extractContent(message)) }}
                    />
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="text-xs font-semibold mb-1 text-gray-600">References:</div>
                        <ol className="text-xs text-gray-500 pl-4 space-y-1 list-decimal">
                          {message.citations.map((citation) => (
                            <li key={citation.id} id={`public-${citation.id}`}> {/* Added prefix to id */}
                              <span className="font-medium text-gray-600">{citation.title}.</span> {citation.authors}. {citation.source} {citation.year}.
                              {citation.url && <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Link</a>}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                </div>
                <div className="bg-white py-3 px-4 rounded-xl rounded-bl-none shadow-md">
                    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form at bottom */}
      <div className="border-t border-gray-200 bg-white p-3 md:p-4 sticky bottom-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative"
        >
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Send a message..."
              className="w-full py-3.5 px-5 pr-14 border border-gray-300 rounded-xl shadow-sm resize-none overflow-hidden min-h-[56px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg h-9 w-9 flex items-center justify-center bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:bg-gray-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CleanChatInterface;
