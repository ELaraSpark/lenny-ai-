import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, Lightbulb, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";
import { Link } from 'react-router-dom';
import { getSpecialtyBasedSuggestions } from '@/lib/personalityUtils'; // Import the suggestions function

// Dialog/Tooltip components for the paperclip popup
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Dropdown menu for the "Clinical Mode" option
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatMode = 'Standard' | 'Quick answers' | 'Research mode';

// This component renders the landing page with the new design
const PublicChat = () => {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // New state variables for the added functionality
    const [showPaperclipDialog, setShowPaperclipDialog] = useState(false);
    const [showLightbulbDialog, setShowLightbulbDialog] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>('Standard');
    
    // Get suggestions using the imported function
    const suggestions = getSpecialtyBasedSuggestions();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            console.log('Submitted:', inputValue);
            // Here you would normally handle the submission
            // For now, we'll just clear the input
            setInputValue('');
            setIsTyping(false);
            // Hide lightbulb dialog if it was showing
            setShowLightbulbDialog(false);
        }
    };

    const handleQuickAction = (query: string) => {
        console.log('Quick action:', query);
        // Here you would normally handle the quick action
        // For demo purposes, we'll just set the input value
        setInputValue(query);
        setIsTyping(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        // Hide lightbulb dialog if it was showing
        setShowLightbulbDialog(false);
    };
    
    // Toggle the lightbulb dialog
    const toggleLightbulbDialog = () => {
        setShowLightbulbDialog(prev => !prev);
    };
    
    // Function to handle setting the chat mode
    const handleSetChatMode = (mode: ChatMode) => {
        setChatMode(mode);
    };

    return (
        <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[5%] right-[-5%] w-[30vw] h-[30vw] bg-tertiary opacity-15 rounded-[40%_60%_65%_35%/40%_45%_55%_60%] z-0" 
                style={{ transform: "rotate(15deg)" }} />
            <div className="absolute bottom-[10%] left-[-5%] w-[25vw] h-[25vw] bg-accent opacity-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] z-0" 
                style={{ transform: "rotate(-5deg)" }} />
            
            {/* Decorative elements */} 
            <div className="absolute top-[15%] left-[5%] w-20 h-20 bg-accent opacity-20 z-0"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)", transform: "rotate(15deg)" }} />
            <div className="absolute bottom-[15%] right-[8%] w-24 h-24 bg-secondary opacity-15 z-0"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", transform: "rotate(-10deg)" }} />
            
            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Header is now provided by PublicLayout */}
                
                <div className="max-w-3xl mx-auto mt-16">
                    {/* Tagline */}
                    <h1 className="font-serif text-5xl md:text-6xl font-bold text-center text-neutral-800 mb-6 transform -rotate-[0.5deg] relative">
                        Doc's Best Friend, Patient's Hero
                        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-40 h-[3px] bg-gradient-to-r from-transparent via-primary to-secondary"></span>
                    </h1>
                    <p className="text-center text-gray-600 text-xl mb-10 font-light">
                        Your pocket clinician: Save time, boost care, go home early
                    </p>
                    
                    {/* Search Box */}
                    <div className="relative mb-10">
                        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="px-5 py-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ask me anything medical..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="w-full border-none outline-none text-gray-700 placeholder:text-gray-500 text-lg"
                                />
                            </div>
                            
                            <div className="px-5 py-3 flex justify-between items-center border-t border-gray-200">
                                {/* Left side icons */}
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPaperclipDialog(true)} 
                                        className="text-gray-500 hover:text-gray-700 p-1.5 rounded transition-colors"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={toggleLightbulbDialog}
                                        className={`p-1.5 rounded transition-colors ${showLightbulbDialog ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Lightbulb size={18} />
                                    </button>
                                </div>
                                
                                {/* Right side controls */}
                                <div className="flex items-center gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="bg-gray-100 text-gray-700 text-base px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                                                {chatMode}
                                                <ChevronDown size={16} className="text-gray-600" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md !rounded-md !p-0 overflow-hidden">
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Standard')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer">
                                                Standard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Quick answers')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer">
                                                Quick answers
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSetChatMode('Research mode')} className="bg-white hover:!bg-blue-500 hover:!text-white !rounded-none !cursor-pointer">
                                                Research mode
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <button 
                                        type="submit" 
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full transform rotate-5 transition-all",
                                            "hover:scale-110 hover:bg-blue-600 hover:shadow-md",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                        disabled={!inputValue.trim()}
                                        style={{ borderRadius: "50% 30% 45% 40%" }}
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Lightbulb Suggestions Dialog - Updated to match screenshot exactly */}
                    <Dialog open={showLightbulbDialog} onOpenChange={setShowLightbulbDialog}>
                        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg border-0">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Lightbulb size={20} className="text-blue-500" />
                                    <span className="font-medium">Try asking about:</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {suggestions.slice(0, 3).map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickAction(suggestion)}
                                        className="w-full text-left py-2 px-3 rounded-md text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                                    >
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">{index + 1}</span>
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Sign-in section at bottom */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="bg-blue-50 rounded-md p-4">
                                    <p className="text-sm text-gray-700 mb-3">
                                        Sign in to access personalized suggestions and upload files for analysis.
                                    </p>
                                    <div className="flex gap-3">
                                        <Link to="/login" className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Sign in
                                        </Link>
                                        <Link to="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
                                            Create account
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    {/* Paperclip Dialog - Updated to match screenshot exactly */}
                    <Dialog open={showPaperclipDialog} onOpenChange={setShowPaperclipDialog}>
                        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg border-0">
                            <div className="mb-2">
                                <h3 className="font-semibold text-lg text-gray-800">Sign in to upload files</h3>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-6">
                                You need to be logged in to upload files for analysis. Sign in or create an account to access all features.
                            </p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowPaperclipDialog(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
                                    Sign in
                                </Link>
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    {/* Quick Actions */}
                    <div className={cn(
                        "flex flex-wrap justify-center gap-4 mb-16 transition-opacity duration-300",
                        isTyping || showLightbulbDialog ? "opacity-0" : "opacity-100"
                    )}>
                        <button 
                            onClick={() => handleQuickAction("What's the latest research on recent medical breakthroughs?")}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 border-l-[3px] border-l-secondary rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform -rotate-1 hover:scale-105 hover:rotate-0"
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Latest Research?
                        </button>
                        <button 
                            onClick={() => handleQuickAction("Help me interpret these lab results")}
                            className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-transparent rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform rotate-1 hover:scale-105 hover:rotate-0"
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Interpret Labs?
                        </button>
                        <button 
                            onClick={() => handleQuickAction("Draft a clinical note about patient with hypertension")}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 border-l-[3px] border-l-tertiary rounded-md text-base font-medium text-neutral-700 shadow-sm hover:border-blue-500 hover:shadow-md transition-all transform -rotate-[0.5deg] translate-y-0.5 hover:scale-105 hover:rotate-0"
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Draft a note
                        </button>
                    </div>
                </div>
                
                {/* Landing Page Sections */}
                <div className="max-w-7xl mx-auto mt-32">
                    <div className="my-12 md:my-16"> 
                        <BenefitsSection />
                    </div>
                    <div className="my-12 md:my-16">
                        <FeaturesSection />
                    </div>
                    <div className="mb-16">
                        <CTASection />
                    </div>
                    <div className="mb-16">
                        <SecurityBanner />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicChat;
