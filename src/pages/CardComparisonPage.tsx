import React from 'react';
import { agents } from '@/components/agents/data/agentsData';
import ConversationalCard from '@/components/agents/card-variants/ConversationalCard';
import ProfessionalCard from '@/components/agents/card-variants/ProfessionalCard';
import PlayfulCard from '@/components/agents/card-variants/PlayfulCard';
import MinimalistCard from '@/components/agents/card-variants/MinimalistCard';

const CardComparisonPage = () => {
  // Get a sample agent to display in all card variants
  const sampleAgent = agents[0];
  
  // Handle card selection
  const handleSelect = () => {
    console.log('Card selected');
  };
  
  // Handle consultation
  const handleConsultation = () => {
    console.log('Consultation requested');
  };
  
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Agent Card Design Comparison</h1>
        <p className="text-muted-foreground">
          Four different card designs with distinct personalities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Conversational Card */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Conversational</h2>
          <div className="flex-1">
            <ConversationalCard 
              agent={sampleAgent} 
              onSelect={handleSelect} 
            />
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Personality:</h3>
            <p className="text-sm text-muted-foreground">
              Friendly and approachable with a chat-like interface. Focuses on direct communication with the user.
            </p>
          </div>
        </div>
        
        {/* Professional Card */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Professional</h2>
          <div className="flex-1">
            <ProfessionalCard 
              agent={sampleAgent} 
              onSelect={handleSelect} 
              onConsultation={handleConsultation}
            />
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Personality:</h3>
            <p className="text-sm text-muted-foreground">
              Formal and structured with clear expertise areas. Emphasizes credentials and professional capabilities.
            </p>
          </div>
        </div>
        
        {/* Playful Card */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Playful</h2>
          <div className="flex-1">
            <PlayfulCard 
              agent={sampleAgent} 
              onSelect={handleSelect} 
            />
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Personality:</h3>
            <p className="text-sm text-muted-foreground">
              Fun and colorful with emojis and casual language. Uses animations and playful descriptions.
            </p>
          </div>
        </div>
        
        {/* Minimalist Card */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Minimalist</h2>
          <div className="flex-1">
            <MinimalistCard 
              agent={sampleAgent} 
              onSelect={handleSelect} 
            />
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Personality:</h3>
            <p className="text-sm text-muted-foreground">
              Clean and simple with focus on essential information. Elegant design with minimal distractions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Design Considerations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Emphasis on Tasks/Capabilities</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Each card design emphasizes the agent's capabilities differently:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Conversational:</span> Shows capabilities as quick action buttons in a chat interface</li>
              <li><span className="font-medium text-foreground">Professional:</span> Lists capabilities as formal "Areas of Expertise" with checkmarks</li>
              <li><span className="font-medium text-foreground">Playful:</span> Presents capabilities as fun "Super Powers" with sparkle emojis</li>
              <li><span className="font-medium text-foreground">Minimalist:</span> Focuses on just the primary capability for simplicity</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">User Interaction Style</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The interaction style varies to match each personality:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Conversational:</span> Chat input with send button, mimicking messaging apps</li>
              <li><span className="font-medium text-foreground">Professional:</span> Clear action buttons with descriptive labels</li>
              <li><span className="font-medium text-foreground">Playful:</span> Bold, colorful button with friendly call-to-action</li>
              <li><span className="font-medium text-foreground">Minimalist:</span> Subtle ghost button with hover effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComparisonPage;
