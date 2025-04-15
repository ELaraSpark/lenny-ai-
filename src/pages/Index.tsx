import React from 'react'; // Import React
import AppLayout from "@/components/layout/AppLayout"; 
import Chat from "./Chat"; 

// This page now represents the main "Ask AI" view within the authenticated app
const Index = () => {
  
  return (
      // AppLayout is handled by the parent route in App.tsx.
      // This div wraps the Chat component, applying padding.
      <div className="h-full p-4 sm:p-6 lg:p-8 flex flex-col"> 
        <Chat /> 
      </div>
  );
};

export default Index;
