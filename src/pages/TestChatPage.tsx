import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Bot, User as UserIcon, AlertTriangle, Loader2, PlusCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import useAuthStore from '@/stores/authStore';
import ChatHistorySidebar from '@/components/home/ChatHistorySidebar';
import * as chatService from '@/services/chatService';
// import { generateMockResponse } from '@/mock/mockAIResponse'; // No longer needed

// Types for client-side representation, compatible with ChatHistorySidebar
// This ChatSession type is what ChatHistorySidebar expects (from LandingPage.tsx)
export interface ClientChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date; // Date object
}

export interface ClientChatSession {
  id: string;
  title: string;
  messages: ClientChatMessage[]; // Array of ClientChatMessage
  createdAt: Date;     // Date object
  // Include other fields from chatService.ChatSession if needed for display or logic
  user_id?: string;
  updated_at?: string; // Store original string for reference if needed
}


// This is the type for messages fetched from the service for the active chat
// No need for a separate ServiceChatMessage if it's identical to chatService.ChatMessage
// We can directly use chatService.ChatMessage for `currentMessages` state.
// If client-specific fields were ever needed for messages in the main chat area,
// then a distinct type would be useful. For now, it's redundant.


const TestChatPage: React.FC = () => {
    const { user } = useAuthStore(); // isAuthenticated can be derived from user !== null
    const navigate = useNavigate();
    const isAuthenticated = user !== null; // Derived authentication status

    const [chatSessions, setChatSessions] = useState<ClientChatSession[]>([]); // Use ClientChatSession for sidebar
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [currentMessages, setCurrentMessages] = useState<chatService.ChatMessage[]>([]); // Use chatService.ChatMessage directly
    const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newMessageText, setNewMessageText] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch chat sessions on mount or when user changes
    useEffect(() => {
        if (user?.id) {
            const fetchSessions = async () => {
                setIsLoadingSessions(true);
                setError(null);
                try {
                    const serviceSessions = await chatService.getChatSessions(user.id);
                    // Transform serviceSessions to ClientChatSession for the sidebar
                    const clientSessions: ClientChatSession[] = serviceSessions.map(s => ({
                        id: s.id,
                        user_id: s.user_id,
                        title: s.title,
                        createdAt: new Date(s.updated_at), // Use updated_at for sorting, map to sidebar's createdAt
                        updated_at: s.updated_at,
                        messages: [], // Initialize with empty messages; sidebar might show last message from a different source or not at all
                    }));
                    setChatSessions(clientSessions);
                    if (clientSessions.length > 0 && !activeChatId) {
                        // Optionally select the most recent chat
                        // setActiveChatId(transformedSessions[0].id);
                    }
                } catch (err) {
                    console.error("Failed to fetch chat sessions:", err);
                    setError("Failed to load chat sessions. Please try again.");
                } finally {
                    setIsLoadingSessions(false);
                }
            };
            fetchSessions();
        }
    }, [user?.id]);

    // Fetch messages when activeChatId changes
    useEffect(() => {
        if (activeChatId) {
            const fetchMessages = async () => {
                setIsLoadingMessages(true);
                setError(null);
                try {
                    const serviceMessages = await chatService.getChatMessages(activeChatId);
                    setCurrentMessages(serviceMessages); // No need to cast if state type matches
                } catch (err) {
                    console.error(`Failed to fetch messages for session ${activeChatId}:`, err);
                    setError("Failed to load messages. Please try again.");
                    setCurrentMessages([]);
                } finally {
                    setIsLoadingMessages(false);
                }
            };
            fetchMessages();
        } else {
            setCurrentMessages([]); // Clear messages if no active chat
        }
    }, [activeChatId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages]);


    const handleSelectChat = (chatId: string) => {
        setActiveChatId(chatId);
    };

    const handleNewChat = async () => {
        if (!user?.id) return;
        setIsSendingMessage(true); // Use general sending state
        setError(null);
        try {
            // For a truly new chat, we might not send a message immediately,
            // but create an empty session and set it active.
            // Or, the first message creates the session.
            // For now, let's set activeChatId to a special value or null
            // to indicate "new chat mode" if the input is empty.
            // If input is not empty, we'll create session then message.
            
            // For simplicity, "New Chat" button will just clear activeChatId
            // and message sending will handle creation if activeChatId is null.
            setActiveChatId(null);
            setCurrentMessages([]);
            setNewMessageText('');
            inputRef.current?.focus();

        } catch (err) {
            console.error("Failed to start new chat:", err);
            setError("Could not start a new chat. Please try again.");
        } finally {
            setIsSendingMessage(false);
        }
    };
    
    const refreshChatSessions = async () => {
        if (user?.id) {
            try {
                const serviceSessions = await chatService.getChatSessions(user.id);
                const clientSessions: ClientChatSession[] = serviceSessions.map(s => ({
                    id: s.id,
                    user_id: s.user_id,
                    title: s.title,
                    createdAt: new Date(s.updated_at),
                    updated_at: s.updated_at,
                    messages: [], // Add missing messages property
                }));
                setChatSessions(clientSessions);
            } catch (err) {
                console.error("Failed to refresh chat sessions:", err);
                // Potentially set an error, but avoid disrupting user flow too much
            }
        }
    };


    const handleSendMessage = async () => {
        if (!newMessageText.trim() || !user?.id) return;

        setIsSendingMessage(true);
        setError(null);
        const messageToSend = newMessageText;
        setNewMessageText(''); // Clear input immediately

        let currentChatId = activeChatId;

        try {
            // If no active chat, create a new one
            if (!currentChatId) {
                // Derive title from first message or use "New Chat"
                const newSessionTitle = messageToSend.substring(0, 30) + (messageToSend.length > 30 ? "..." : "");
                const newSession = await chatService.createChatSession(user.id, newSessionTitle || "New Chat");
                currentChatId = newSession.id;
                setActiveChatId(newSession.id); // Set new session as active
                await refreshChatSessions(); // Refresh session list
            }

            if (!currentChatId) { // Should not happen if creation was successful
                throw new Error("Failed to obtain a chat session ID.");
            }

            // Add user message
            const userMessageService = await chatService.addChatMessage(currentChatId, 'user', messageToSend);
            setCurrentMessages(prev => [...prev, userMessageService]);
            
            // Get AI response from DeepSeek
            // The currentMessages state already holds the history in chatService.ChatMessage format
            const aiResponseText = await chatService.getDeepSeekResponse(
                [...currentMessages, userMessageService], // Pass the full history including the latest user message
                messageToSend // This parameter in getDeepSeekResponse is actually the latest user message text,
                               // which is already part of the history passed above.
                               // Let's adjust getDeepSeekResponse or how we call it.
                               // For now, assuming getDeepSeekResponse correctly handles the last message from the array.
                               // Re-reading getDeepSeekResponse, it takes history AND currentMessageText.
                               // So, we pass currentMessages (which doesn't include userMessageService yet)
                               // and then messageToSend as currentMessageText.
            );

            const aiMessageService = await chatService.addChatMessage(currentChatId, 'ai', aiResponseText);
            setCurrentMessages(prev => [...prev, aiMessageService]);

            await refreshChatSessions(); // Refresh to update 'updated_at' for sorting

        } catch (err) {
            console.error("Failed to send message or get AI response:", err);
            let errorMessage = "Failed to send message or get AI response. Please try again.";

            interface CustomError {
              message?: string;
              details?: string;
              error?: string | { message?: string };
              context?: { errorMessage?: string };
              [key: string]: unknown;
            }

            if (typeof err === 'object' && err !== null) {
                const customError = err as CustomError;
                if (typeof customError.error === 'object' && customError.error !== null && customError.error.message) {
                    errorMessage = `Error: ${customError.error.message}`;
                } else if (typeof customError.error === 'string') {
                    errorMessage = `Error: ${customError.error}`;
                } else if (customError.details) {
                    errorMessage = `Error: ${customError.details}`;
                } else if (customError.context?.errorMessage) {
                    errorMessage = `Error: ${customError.context.errorMessage}`;
                } else if (customError.message) {
                    errorMessage = `Error: ${customError.message}`;
                }
            } else if (err instanceof Error) {
                 errorMessage = `Error: ${err.message}`;
            }
            setError(errorMessage);
            // Optionally add the typed message back to input or a temporary "failed to send" state
            // setNewMessageText(messageToSend); // This might be confusing if AI part failed.
        } finally {
            setIsSendingMessage(false);
            inputRef.current?.focus();
        }
    };


    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Chat History Sidebar */}
            <div className="w-1/4 min-w-[280px] max-w-[350px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {isLoadingSessions ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading chats...</span>
                    </div>
                ) : (
                    <ChatHistorySidebar
                        chatSessions={chatSessions.map(s => ({ // Ensure it matches sidebar's expected ChatSession type
                            id: s.id,
                            title: s.title,
                            createdAt: s.createdAt || new Date(s.updated_at), // Fallback for createdAt
                            messages: s.messages || (currentMessages.length > 0 && s.id === activeChatId ? [{id: 'last', sender: currentMessages[currentMessages.length-1].sender, text: currentMessages[currentMessages.length-1].text, timestamp: new Date(currentMessages[currentMessages.length-1].timestamp)}] : []), // Provide last message if available
                        }))}
                        activeChatId={activeChatId}
                        onSelectChat={handleSelectChat}
                        onNewChat={handleNewChat}
                    />
                )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {error && (
                    <div className="p-3 bg-red-100 border-b border-red-300 text-red-700 flex items-center">
                        <AlertTriangle size={18} className="mr-2" />
                        {error}
                    </div>
                )}
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoadingMessages && activeChatId && (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading messages...</span>
                        </div>
                    )}
                    {!activeChatId && !isLoadingMessages && currentMessages.length === 0 && (
                         <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <Bot size={48} className="mb-4" />
                            <p className="text-lg">Select a chat or start a new one.</p>
                            <Button onClick={handleNewChat} variant="ghost" className="mt-4 text-primary">
                                <PlusCircle size={18} className="mr-2" />
                                New Chat
                            </Button>
                        </div>
                    )}
                    {currentMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-end space-x-2",
                                msg.sender === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <Bot size={18} className="text-gray-600 dark:text-gray-300" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[70%] p-3 rounded-lg shadow",
                                    msg.sender === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none"
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                             {msg.sender === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <UserIcon size={18} />
                                </div>
                            )}
                        </div>
                    ))}
                    {isSendingMessage && currentMessages.length > 0 && currentMessages[currentMessages.length -1].sender === 'user' && (
                         <div className="flex items-end space-x-2 justify-start">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Bot size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="max-w-[70%] p-3 rounded-lg shadow bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none">
                                <div className="flex space-x-1">
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-center space-x-3"
                    >
                        <Textarea
                            ref={inputRef}
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            placeholder={activeChatId ? "Type your message..." : "Start a new chat by typing a message..."}
                            className="flex-1 resize-none min-h-[40px] max-h-[120px] rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-primary focus:border-primary"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={1}
                            disabled={isSendingMessage || (!user?.id)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                            disabled={isSendingMessage}
                            onClick={() => alert("File attachment not yet implemented in this view.")} // Placeholder
                        >
                            <Paperclip size={20} />
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            className="bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex-shrink-0"
                            disabled={!newMessageText.trim() || isSendingMessage || (!user?.id)}
                        >
                            {isSendingMessage ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestChatPage;