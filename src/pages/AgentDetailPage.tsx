import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgentProfile from '@/components/agents/AgentProfile';
import { Agent } from '@/components/agents/types/agentTypes'; // Assuming type definition location
// Import the actual agent data source
import { agents as allAgentsData } from '@/components/agents/data/agentsData'; 
import { LoadingIllustration } from '@/components/illustrations/AnimatedIllustration'; // Import LoadingIllustration

const AgentDetailPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch agent data by ID
    setLoading(true);
    setError(null);
    console.log("Fetching agent with ID:", agentId); 
    // Find the agent in the imported data source
    const foundAgent = allAgentsData.find(a => a.id === agentId); 
    
    // Simulate API delay
    setTimeout(() => {
      if (foundAgent) {
        // The foundAgent should already conform to the Agent type
        setAgent(foundAgent); 
      } else {
        setError(`Agent with ID ${agentId} not found.`);
        console.error(`Agent with ID ${agentId} not found.`);
      }
      setLoading(false);
    }, 500); 

  }, [agentId]);

  if (loading) {
    // Use LoadingIllustration
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingIllustration type="ai" size="lg" />
      </div>
    );
  }

  if (error) {
    // TODO: Replace with a proper error component
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!agent) {
    // Should ideally be handled by the error state, but as a fallback
    return <div className="p-8 text-center">Agent not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      {/* Render the AgentProfile component with the fetched agent data */}
      <AgentProfile agent={agent} />
      {/* You might add more sections here later, e.g., recent activity, configuration */}
    </div>
  );
};

export default AgentDetailPage;
