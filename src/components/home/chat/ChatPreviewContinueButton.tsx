
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ChatPreviewContinueButton = () => {
  return (
    <Link to="/login" className="w-full">
      <Button className="w-full mt-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90 group shadow-lg relative overflow-hidden">
        <span className="relative z-10">Chat With Your Virtual Health Assistant</span>
        <Sparkles className="absolute right-16 h-4 w-4 text-white/40 animate-pulse" />
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
        <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></div>
      </Button>
    </Link>
  );
};

export default ChatPreviewContinueButton;
