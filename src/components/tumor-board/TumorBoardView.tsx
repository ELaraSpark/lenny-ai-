import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, CheckCircle, Plus, ChevronRight, Send, User, MessageCircle, Clock, AlertTriangle, Save, Users as UsersIcon, FlaskConical, Search as SearchIcon } from 'lucide-react'; // Added UsersIcon, FlaskConical, SearchIcon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ConsensusReportView from './ConsensusReportView';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { toast } from "sonner"; // Assuming sonner is available globally or provided via context if needed here
import { cn } from '@/lib/utils'; // Import cn utility

// --- Helper Data & Functions ---

// Enhanced AI Agents with personalities for the Medical Minds Collective
const allAgentsForPanel = [
  { 
    id: 'oncologist', 
    name: 'Medical Oncology', 
    color: '#4287f5', 
    icon: '👨‍⚕️', 
    description: 'Systemic treatments, chemotherapy',
    personality: 'Compassionate and thorough, with a focus on holistic treatment approaches',
    speechPattern: 'Balances technical terms with patient-friendly explanations',
    gradientColors: 'from-blue-400 to-blue-600',
    animationStyle: 'pulse'
  },
  { 
    id: 'surgeon', 
    name: 'Surgical Oncology', 
    color: '#42c5f5', 
    icon: '🔪', 
    description: 'Surgical resection assessment',
    personality: 'Decisive and direct, with a focus on actionable interventions',
    speechPattern: 'Concise, action-oriented language with clear recommendations',
    gradientColors: 'from-cyan-400 to-blue-500',
    animationStyle: 'bounce'
  },
  { 
    id: 'radiologist', 
    name: 'Radiology', 
    color: '#42f59e', 
    icon: '🔍', 
    description: 'Imaging interpretation',
    personality: 'Detail-oriented and analytical, with a keen eye for subtle findings',
    speechPattern: 'Visual descriptions with precise measurements and comparisons',
    gradientColors: 'from-green-400 to-emerald-500',
    animationStyle: 'pulse'
  },
  { 
    id: 'pathologist', 
    name: 'Pathology', 
    color: '#a142f5', 
    icon: '🔬', 
    description: 'Biopsy analysis, diagnosis confirmation',
    personality: 'Methodical and evidence-based, with a focus on cellular details',
    speechPattern: 'Structured observations moving from microscopic to diagnostic conclusions',
    gradientColors: 'from-purple-400 to-purple-600',
    animationStyle: 'pulse'
  },
  { 
    id: 'radiation', 
    name: 'Radiation Oncology', 
    color: '#f542c8', 
    icon: '☢️', 
    description: 'Radiation therapy planning',
    personality: 'Precise and calculated, with a focus on targeted treatment',
    speechPattern: 'Technical terminology balanced with clear treatment rationales',
    gradientColors: 'from-pink-400 to-pink-600',
    animationStyle: 'pulse'
  },
  { 
    id: 'pulmonologist', 
    name: 'Pulmonology', 
    color: '#6da4d1', 
    icon: '🫁', 
    description: 'Lung function, respiratory issues',
    personality: 'Calm and methodical, with a focus on respiratory patterns',
    speechPattern: 'Clear explanations with breathing metaphors and measured pacing',
    gradientColors: 'from-blue-200 to-blue-400',
    animationStyle: 'breathe'
  },
  { 
    id: 'cardiology', 
    name: 'Cardiology', 
    color: '#d93025', 
    icon: '❤️', 
    description: 'Heart and vascular conditions',
    personality: 'Passionate and rhythmic, with a focus on cardiovascular dynamics',
    speechPattern: 'Uses heart metaphors and emphasizes flow and circulation',
    gradientColors: 'from-red-400 to-red-600',
    animationStyle: 'heartbeat'
  },
];

// Enhanced function with proper type handling
const getAgentById = (id: string): PanelAgent => {
  const agent = allAgentsForPanel.find(s => s.id === id);
  if (agent) {
    return {
      ...agent,
      // Ensure animationStyle is properly typed
      animationStyle: agent.animationStyle as 'pulse' | 'bounce' | 'breathe' | 'heartbeat'
    };
  }
  return { 
    id: 'unknown', 
    name: 'Unknown', 
    color: '#888888', 
    icon: '❓', 
    description: 'Unknown Agent' 
  };
};

// Parameter renamed
const generateSimulatedDiscussion = (panelAgents: PanelAgent[], caseInfo: string) => {
  const agentIds = panelAgents.map(a => a.id);
  let script: { agentId: string; content: string; type?: string }[] = [];

  if (agentIds.includes('radiologist')) {
      script.push({ agentId: 'radiologist', content: `Reviewing imaging for case: ${caseInfo.substring(0, 30)}... Findings indicate ${Math.random() > 0.5 ? 'a suspicious 3cm lesion' : 'potential inflammation'}.` });
  } else if (panelAgents.length > 0) {
      script.push({ agentId: panelAgents[0].id, content: `Initiating review for case: ${caseInfo.substring(0, 30)}...` });
  } else {
       script.push({ agentId: 'system', content: `No AI agents selected for case: ${caseInfo.substring(0, 30)}...` }); // Updated text
  }
  if (agentIds.includes('pathologist')) {
    script.push({ agentId: 'pathologist', content: `Biopsy results pending, morphology ${Math.random() > 0.5 ? 'concerning' : 'atypical'}.` });
  }
  if (agentIds.includes('oncologist')) {
      script.push({ agentId: 'oncologist', content: `Considering presentation, differential includes adenocarcinoma, NET, or pancreatitis. Recommend PET & markers.` });
  }
  if (agentIds.includes('surgeon')) {
    script.push({ agentId: 'surgeon', content: `Assessing surgical candidacy. Need vascular involvement eval.` });
  }
  if (agentIds.includes('radiologist')) {
      script.push({ agentId: 'radiologist', content: `Comparing priors. Attention to SMV/SMA margins.` });
  }
   if (agentIds.includes('radiation')) {
    script.push({ agentId: 'radiation', content: `Evaluating role for neoadjuvant/adjuvant RT.` });
  }
  if (agentIds.includes('oncologist')) {
      script.push({
        agentId: 'oncologist',
        content: `Consensus: Agree on PET & CA 19-9?`,
        type: 'consensus_poll'
      });
  } else if (panelAgents.length > 1) {
       script.push({
           agentId: panelAgents[0].id,
           content: `Next step: Further imaging?`,
           type: 'consensus_poll'
       });
  }
   script.push({
    agentId: 'system',
    content: `Summary: Initial assessment suggests [Condition]. Next steps: [Actions]. Awaiting results.`,
    type: 'summary'
  });

  const filteredScript = script.filter(msg => msg.agentId === 'system' || agentIds.includes(msg.agentId));
  const consensusData = extractConsensusFromScript(filteredScript, panelAgents); // Pass renamed parameter
  return { script: filteredScript, consensusData };
};

export interface ConsensusItem {
    topic: string;
    status: 'Discussed' | 'Proposed' | 'Pending' | 'Agreed' | 'Confirmed';
    details: string;
    agents: { id: string; color: string; initial: string }[];
}

// Parameter renamed
const extractConsensusFromScript = (script: { agentId: string; content: string; type?: string }[], panelAgents: PanelAgent[]): ConsensusItem[] => {
    const items: ConsensusItem[] = [];
    const agentMap = new Map(panelAgents.map(a => [a.id, a])); // Renamed specialistMap -> agentMap
    const topics: { [key: string]: { keywords: string[], status: ConsensusItem['status'], agents: Set<string>, details: string[] } } = { // Renamed specialists -> agents
        'Imaging Findings': { keywords: ['imaging', 'scan', 'lesion', 'margins'], status: 'Discussed', agents: new Set(), details: [] },
        'Pathology Report': { keywords: ['biopsy', 'morphology', 'stains', 'malignancy'], status: 'Pending', agents: new Set(), details: [] },
        'Treatment Plan': { keywords: ['chemotherapy', 'radiation', 'neoadjuvant', 'adjuvant', 'regimen'], status: 'Proposed', agents: new Set(), details: [] },
        'Surgical Assessment': { keywords: ['surgical', 'resection', 'resectability', 'vascular'], status: 'Discussed', agents: new Set(), details: [] },
        'Next Steps': { keywords: ['next step', 'recommend', 'consensus point', 'marker'], status: 'Proposed', agents: new Set(), details: [] },
    };
    script.forEach(msg => {
        if (msg.agentId === 'system') return;
        let assigned = false;
        Object.entries(topics).forEach(([topicName, topicData]) => {
            if (topicData.keywords.some(kw => msg.content.toLowerCase().includes(kw))) {
                topicData.agents.add(msg.agentId); // Use agents set
                topicData.details.push(msg.content);
                if (msg.type === 'consensus_poll') topicData.status = 'Proposed';
                assigned = true;
            }
        });
        if (!assigned && msg.type === 'consensus_poll') {
             topics['Next Steps'].agents.add(msg.agentId); // Use agents set
             topics['Next Steps'].details.push(msg.content);
             topics['Next Steps'].status = 'Proposed';
        }
    });
    Object.entries(topics).forEach(([topicName, topicData]) => {
        if (topicData.agents.size > 0) { // Check agents set size
            items.push({
                topic: topicName,
                status: topicData.status,
                details: topicData.details.length > 0 ? topicData.details.join(' | ') : 'No specific details captured.',
                agents: Array.from(topicData.agents).map(id => { // Use agents set
                    const agent = agentMap.get(id) || getAgentById(id); // Use agentMap and getAgentById
                    return { id: agent.id, color: agent.color, initial: agent.name.substring(0, 2).toUpperCase() };
                })
            });
        }
    });
    // Simplified placeholder return for brevity
    return items.length > 0 ? items : [{ topic: 'General Discussion', status: 'Discussed', details: 'Consultation held.', agents: panelAgents.map(a => ({ id: a.id, color: a.color, initial: a.name.substring(0, 2).toUpperCase() })) }]; // Use agents and panelAgents
};


// --- Component Types ---
interface PanelAgent { // Enhanced with personality traits
    id: string;
    name: string;
    color: string;
    icon: string;
    description: string;
    personality?: string;
    speechPattern?: string;
    gradientColors?: string;
    animationStyle?: 'pulse' | 'bounce' | 'breathe' | 'heartbeat';
}
interface Message {
    agentId: string;
    content: string;
    type?: 'consensus_poll' | 'summary';
}
// Add isPublicView prop
interface ConsultationSetupProps {
    onStart: (agents: PanelAgent[], caseInfo: string) => void; 
    isPublicView?: boolean;
}
interface ConsultationViewProps {
    agents: PanelAgent[]; // Use PanelAgent
    caseInfo: string;
    onGoBack: () => void;
    onProceed: (data: ConsensusItem[]) => void;
}
interface ParticipantListHeaderProps {
    agents: PanelAgent[]; // Use PanelAgent
    activeAgentId: string | null;
}
interface MessageItemProps {
    message: Message;
}
interface TypingIndicatorProps {
    agentId: string | null;
}

// --- Components ---

// 1. Consultation Setup Component - Redesigned with Two Columns
const ConsultationSetup: React.FC<ConsultationSetupProps> = ({ onStart, isPublicView = false }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Introduction for new users
  const introductionText = "Welcome to the Expert Panel! This tool allows you to collaborate with AI specialists to review and discuss complex medical cases. Enter a case summary to get started.";
  const [caseDetails, setCaseDetails] = useState("55-year-old male experiencing chest pain radiating to the left arm for the past hour, with mild shortness of breath and dizziness. BP 145/90, P 92. Hx of hypertension, no prior cardiac history reported.");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PanelAgent[]>([]); 
  const [localSelectedAgents, setLocalSelectedAgents] = useState<PanelAgent[]>([]); // Use PanelAgent
  const [analysisPerformed, setAnalysisPerformed] = useState(false);

  const handleAnalyze = useCallback(() => {
    setIsLoading(true);
    setAnalysisPerformed(false);
    setSuggestions([]);
    setLocalSelectedAgents([]);
    setTimeout(() => {
      const suggestedIds = new Set<string>();
      const caseLower = caseDetails.toLowerCase();
      if (caseLower.includes('cancer') || caseLower.includes('tumor') || caseLower.includes('malignancy') || caseLower.includes('chemo')) suggestedIds.add('oncologist');
      if (caseLower.includes('surgery') || caseLower.includes('resection') || caseLower.includes('mass')) suggestedIds.add('surgeon');
      if (caseLower.includes('image') || caseLower.includes('scan') || caseLower.includes('ct') || caseLower.includes('mri') || caseLower.includes('x-ray')) suggestedIds.add('radiologist');
      if (caseLower.includes('biopsy') || caseLower.includes('pathology') || caseLower.includes('cells')) suggestedIds.add('pathologist');
      if (caseLower.includes('radiation') || caseLower.includes('radiotherapy')) suggestedIds.add('radiation');
      if (caseLower.includes('lung') || caseLower.includes('breath') || caseLower.includes('pulmonary')) suggestedIds.add('pulmonologist');
      if (caseLower.includes('heart') || caseLower.includes('cardiac') || caseLower.includes('chest pain')) suggestedIds.add('cardiology');
      if (suggestedIds.size === 0) { suggestedIds.add('oncologist'); suggestedIds.add('radiologist'); }
      // Filter and properly type the agents
      const suggestedAgents = allAgentsForPanel
        .filter(s => suggestedIds.has(s.id))
        .map(agent => ({
          ...agent,
          // Ensure animationStyle is properly typed
          animationStyle: agent.animationStyle as 'pulse' | 'bounce' | 'breathe' | 'heartbeat'
        }));
      
      setSuggestions(suggestedAgents);
      if (suggestedAgents.length > 0) { 
        setLocalSelectedAgents(suggestedAgents.slice(0, Math.min(suggestedAgents.length, 2))); 
      }
      setIsLoading(false);
      setAnalysisPerformed(true);
    }, 1500);
  }, [caseDetails]);

  const toggleAgent = (agent: PanelAgent) => { // Use PanelAgent
    // Only allow toggling if analysis is performed and not loading
    if (!analysisPerformed || isLoading) return;
    setLocalSelectedAgents(prev => prev.some(a => a.id === agent.id) ? prev.filter(a => a.id !== agent.id) : [...prev, agent]);
  };

  const canStart = localSelectedAgents.length > 0 && analysisPerformed;

  return (
    // Main container for the setup view - Using flex column
    <div className="flex flex-col h-full bg-background p-4 rounded-lg shadow-lg"> {/* Changed shadow-sm to shadow-lg */}
      {/* Introduction Removed */}

      {/* Two-column layout for medium screens and up */}
      {/* Adjusted padding here since the outer div now has padding */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-6 md:gap-8"> 

        {/* Left Column: Intro, Case Summary, Analyze Button */}
        <div className="flex flex-col md:w-1/2 lg:w-7/12 overflow-y-auto pr-0 md:pr-4">
          {/* Header with Icon and Title Inline */}
          <div className="flex items-center gap-3 mb-6">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
               <UsersIcon size={24} strokeWidth={1.5} />
             </div>
             <h1 className="text-xl md:text-2xl font-semibold text-gray-900">AI Expert Panel Setup</h1> {/* Updated Title */}
           </div>

          <div className="flex flex-col flex-grow mb-4">
            {/* Removed Label and description paragraph */}
            {/* Apply wrapper style similar to ChatInput */}
            <div className="relative rounded-xl border-2 border-gray-500 bg-white shadow-sm transition-colors duration-200 flex-grow min-h-[250px] md:min-h-[300px]"> {/* Changed border, bg */}
              <Textarea
                id="case-summary"
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                placeholder="Got a patient puzzle? Plug in the details and let our AI form the ultimate medical think tank."
                className="absolute inset-0 w-full h-full resize-none text-sm p-3 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0" // Remove default border/ring, adjust padding
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !caseDetails}
            className="w-full mt-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Case...
              </>
            ) : (
              <>
                <FlaskConical size={16} className="mr-2" />
                Analyze & Suggest AI Agents {/* Updated text */}
              </>
            )}
          </Button>
        </div>

        {/* Right Column: AI Agent Suggestions / Preview */}
        <div className="flex flex-col md:w-1/2 lg:w-5/12 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex-shrink-0">
            {isLoading ? 'Analyzing...' : (analysisPerformed && suggestions.length > 0 ? 'Suggested AI Agents' : 'Available AI Agents (Preview)')} {/* Updated text */}
          </h2>
          <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-1"> {/* Added padding-right for scrollbar */}
            {isLoading ? (
              // Loading Skeleton
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : analysisPerformed ? (
              // Post-Analysis: Show Suggestions or "No Suggestions"
              suggestions.length > 0 ? (
                suggestions.map((agent, index) => {
                  const isSelected = localSelectedAgents.some(a => a.id === agent.id);
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 shadow-sm ${ // Added border-2, shadow-sm
                        isSelected ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/30' : 'bg-white border-gray-500 hover:bg-gray-50 hover:border-gray-400' // Changed border colors
                      }`}
                      style={{ animationDelay: `${index * 0.05}s`, opacity: 1, animationFillMode: 'forwards', animationName: 'fadeInUp' }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center mr-3 text-base shrink-0"
                        style={{ backgroundColor: `${agent.color}10`, color: agent.color }}
                        title={agent.name}
                      >
                        {agent.icon || agent.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{agent.name}</div>
                        <div className="text-xs text-gray-500 truncate">{agent.description}</div>
                      </div>
                      <div className="pl-3">
                        {isSelected ? <CheckCircle size={20} className="text-primary" /> : <Plus size={20} className="text-gray-400" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-gray-500 pt-10">
                  No specific AI agents suggested based on the summary. {/* Updated text */}
                </div>
              )
            ) : (
              // Pre-Analysis: Show all agents grayed out
              allAgentsForPanel.map((agent, index) => ( // Use allAgentsForPanel
                <div
                  key={agent.id}
                  className={`flex items-center p-3 rounded-lg border-2 border-gray-500 bg-white shadow-sm cursor-not-allowed`} // Removed opacity-50
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mr-3 text-base shrink-0 bg-gray-200 text-gray-500" // Gray avatar
                    title={agent.name}
                  >
                    {agent.icon || agent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-500 truncate">{agent.name}</div>
                    <div className="text-xs text-gray-400 truncate">{agent.description}</div>
                  </div>
                  <div className="pl-3">
                    <Plus size={20} className="text-gray-300" /> {/* Gray plus icon */}
                  </div>
                </div>
              ))
            )}
          </div>
           {/* Only show Add/Search button if analysis is done */}
           {analysisPerformed && (
             <Button variant="outline" className="mt-auto w-full flex-shrink-0"> 
               <SearchIcon size={16} className="mr-2" /> Add / Search More
             </Button>
           )}
        </div>
      </div>

      {/* Footer Section */}
      {analysisPerformed && (
        <div className="p-4 mt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          {localSelectedAgents.length > 0 && (
            <div className="mb-3 flex items-center flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-600 mr-1">Selected:</span>
              {localSelectedAgents.map(agent => (
                <div key={agent.id} className="flex items-center bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                  <span className="mr-1 opacity-80" style={{color: agent.color}}>{agent.icon}</span>
                  {agent.name}
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={() => onStart(localSelectedAgents, caseDetails)}
            disabled={!canStart}
            className="w-full" // Use default primary variant
          >
            Start AI Consultation ({localSelectedAgents.length})
            <ChevronRight size={18} className="ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
};


// --- Real-time Consultation Components ---

const ParticipantListHeader: React.FC<ParticipantListHeaderProps> = ({ agents, activeAgentId }) => { // agents prop is PanelAgent[]
  if (!agents || agents.length === 0) return null;
  return (
    <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-3 py-2 sticky top-0 z-10">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-pattern-dots"></div>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 relative z-10">
             <span className="text-xs font-medium text-gray-500 shrink-0 mr-2">Participants:</span>
            {agents.map(agent => (
                <div
                    key={agent.id}
                    title={agent.name}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300 shrink-0 ${
                        activeAgentId === agent.id ? 'border-primary scale-110' : 'border-transparent scale-100'
                    }`}
                    style={{ 
                        backgroundColor: `${agent.color}10`, 
                        color: agent.color,
                        boxShadow: activeAgentId === agent.id ? `0 0 0 2px white, 0 0 0 4px ${agent.color}15` : 'none'
                    }}
                >
                    {agent.icon || agent.name.substring(0,1)}
                     {activeAgentId === agent.id && (
                         <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                     )}
                </div>
            ))}
        </div>
    </div>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const [selectedAction, setSelectedAction] = useState<'agree' | 'disagree' | 'more' | null>(null);
    const agent = getAgentById(message.agentId);
    const isSystem = message.agentId === 'system';
    const isConsensus = message.type === 'consensus_poll';
    const isSummary = message.type === 'summary';
    
    // Base classes
    let containerClass = 'flex justify-start mb-4';
    let bubbleClass = 'p-3 rounded-lg shadow-sm max-w-[85%] border-l-4 relative overflow-hidden';
    let bgColor = 'bg-white';
    let textColor = 'text-gray-800';
    let borderColor = agent.color || '#cccccc';
    
    // Animation class based on agent's style
    let animationClass = '';
    if (!isSystem && agent.animationStyle) {
        switch (agent.animationStyle) {
            case 'pulse':
                animationClass = 'animate-pulse-subtle';
                break;
            case 'bounce':
                animationClass = 'hover:animate-bounce-subtle';
                break;
            case 'breathe':
                animationClass = 'animate-breathe';
                break;
            case 'heartbeat':
                animationClass = 'animate-heartbeat';
                break;
        }
    }
    
    // Gradient background for agents
    let gradientBg = '';
    if (!isSystem && agent.gradientColors) {
        gradientBg = `bg-gradient-to-br ${agent.gradientColors} bg-opacity-10`;
    }
    
    // Special styling for system or summary messages
    if (isSystem || isSummary) {
        containerClass = 'flex justify-center mb-4';
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-800';
        borderColor = '#60a5fa';
        bubbleClass = 'p-3 rounded-lg max-w-[85%] border border-blue-200 text-center italic relative overflow-hidden';
        gradientBg = ''; // No gradient for system messages
        animationClass = ''; // No animation for system messages
    } else if (isConsensus) {
        bgColor = 'bg-yellow-50';
        borderColor = '#fbbf24';
    }
    
    const fadeInAnimation = { animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 };
    
    // Add personality tooltip if available
    const personalityTooltip = agent.personality ? agent.personality : '';
    
    return (
        <div className={containerClass} style={fadeInAnimation}>
            <div 
                className={`${bubbleClass} ${bgColor} ${textColor} ${animationClass} ${gradientBg} transition-all duration-300`} 
                style={{ borderLeftColor: isSystem ? 'transparent' : borderColor, borderColor: isSystem ? borderColor : '' }}
                title={personalityTooltip}
            >
                {/* Add subtle background pattern based on agent specialty */}
                {!isSystem && (
                    <div className="absolute inset-0 opacity-5">
                        <div className="h-full w-full bg-pattern-dots"></div>
                    </div>
                )}
                
                {/* Content with improved visual hierarchy */}
                <div className="relative z-10">
                    {!isSystem && (
                        <div className="flex items-center mb-1.5">
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs shrink-0 ${animationClass}`}
                                style={{ 
                                    backgroundColor: `${agent.color}10`, 
                                    color: agent.color,
                                    boxShadow: `0 0 0 1px white, 0 0 0 2px ${agent.color}10`
                                }}
                                title={agent.name}
                            >
                                {agent.icon || agent.name.substring(0,1)}
                            </div>
                            <span className="text-xs font-semibold tracking-wide" style={{ color: agent.color }}>
                                {agent.name}
                            </span>
                            {agent.personality && (
                                <span className="ml-2 text-xs text-gray-400 italic truncate hidden sm:inline-block">
                                    {agent.personality.split(',')[0]}
                                </span>
                            )}
                        </div>
                    )}
                    <p className={`text-sm leading-relaxed ${isSystem ? '' : 'pl-7'}`}>
                        {isSummary && <FileText size={14} className="inline mr-1 mb-0.5 opacity-70"/> }
                        {message.content}
                    </p>
                    {isConsensus && (
                        <div className="mt-2.5 pl-7 flex flex-wrap gap-2">
                            <Button 
                                variant={selectedAction === 'agree' ? 'default' : 'outline'} 
                                size="sm" 
                                className={cn("h-auto px-2.5 py-1 text-xs", 
                                    selectedAction === 'agree' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800'
                                )}
                                onClick={() => setSelectedAction('agree')}
                            >Agree</Button>
                            <Button 
                                variant={selectedAction === 'disagree' ? 'destructive' : 'outline'} 
                                size="sm" 
                                className={cn("h-auto px-2.5 py-1 text-xs",
                                    selectedAction === 'disagree' ? '' : 'border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800'
                                )}
                                onClick={() => setSelectedAction('disagree')}
                            >Disagree</Button>
                            <Button 
                                variant={selectedAction === 'more' ? 'secondary' : 'outline'} 
                                size="sm" 
                                className="h-auto px-2.5 py-1 text-xs"
                                onClick={() => setSelectedAction('more')}
                            >More Info</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MessageStream: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agentId }) => {
  if (!agentId) return null;
  const agent = getAgentById(agentId); // Use getAgentById
  const animationStyle = { animation: 'fadeInUp 0.3s ease-out forwards', opacity: 0 };
  return (
    <div className="flex justify-start p-4 pt-1 pb-2" style={animationStyle}>
       <div className="flex items-center p-2 rounded-lg bg-white shadow-sm border-l-4" style={{ borderLeftColor: agent.color || '#cccccc' }}>
            <div
                className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs shrink-0"
                        style={{ backgroundColor: `${agent.color}10`, color: agent.color }}
                title={agent.name}
            >
                 {agent.icon || agent.name.substring(0,1)}
            </div>
            <div className="flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
       </div>
    </div>
  );
};

// 2. Real-time Consultation View Component
const ConsultationView: React.FC<ConsultationViewProps> = ({ agents, caseInfo, onGoBack, onProceed }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingAgentId, setTypingAgentId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState('Initializing...');
  const [generatedConsensusData, setGeneratedConsensusData] = useState<ConsensusItem[] | null>(null); // Type uses agents property
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!agents || agents.length === 0) {
        setSessionStatus('Error: No AI agents selected.'); // Updated text
        return;
    }
    setMessages([]);
    setTypingAgentId(null);
    setGeneratedConsensusData(null);
    setSessionStatus('Running consultation...');
    const { script: discussionScript, consensusData } = generateSimulatedDiscussion(agents, caseInfo);
    let messageIndex = 0;
    const processNextMessage = () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
      if (messageIndex >= discussionScript.length) {
        setTypingAgentId(null);
        setSessionStatus('Consultation complete.');
        setGeneratedConsensusData(consensusData);
        return;
      }
      const nextMessage = discussionScript[messageIndex];
      const isSystemMessage = nextMessage.agentId === 'system';
      timeoutRef.current = setTimeout(() => {
          if (!isSystemMessage) { setTypingAgentId(nextMessage.agentId); }
          else { setTypingAgentId(null); }
          const messageDelay = isSystemMessage ? 1500 : (1200 + Math.random() * 1800);
          timeoutRef.current = setTimeout(() => {
            setMessages(prev => [...prev, nextMessage as Message]);
            if (!isSystemMessage) { setTypingAgentId(null); }
            messageIndex++;
            processNextMessage();
          }, messageDelay);
      }, isSystemMessage ? 500 : 700);
    };
    timeoutRef.current = setTimeout(processNextMessage, 1000);
    return () => {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
      setTypingAgentId(null);
    };
  }, [agents, caseInfo]);

  return (
    // Apply more pronounced styling - Removed fixed height
    <div className="flex flex-col bg-gray-100 max-w-4xl mx-auto shadow-xl rounded-xl border border-gray-400 overflow-hidden"> 
      <ParticipantListHeader agents={agents} activeAgentId={typingAgentId} />
      <MessageStream messages={messages} />
      <div className="bg-gray-100 h-10 flex items-center">
           <TypingIndicator agentId={typingAgentId} />
      </div>
      <div className="bg-white border-t border-gray-200 p-3 sticky bottom-0">
          <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">{sessionStatus}</span>
               {sessionStatus === 'Consultation complete.' && generatedConsensusData && (
                   <div className="flex gap-2">
                        <Button
                           onClick={() => onProceed(generatedConsensusData)}
                           size="sm" // Changed from xs to sm
                           className="font-medium" // Use default primary variant
                       >
                           <Save size={12} className="mr-1"/>
                           Proceed
                       </Button>
                       <Button
                           onClick={onGoBack}
                           size="sm" // Changed from xs to sm
                           variant="secondary" // Use secondary variant
                           className="font-medium" 
                       >
                           New Consultation
                       </Button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

// Add isPublicView prop
interface ExpertPanelViewProps {
  isPublicView?: boolean;
}

// --- Main App Component (Entry Point) ---
const ExpertPanelView: React.FC<ExpertPanelViewProps> = ({ isPublicView = false }) => { 
  const navigate = useNavigate(); // Initialize navigate
  const [currentView, setCurrentView] = useState<'setup' | 'consultation' | 'report'>('setup');
  const [selectedAgents, setSelectedAgents] = useState<PanelAgent[]>([]); 
  const [caseDetails, setCaseDetails] = useState('');
  const [consensusData, setConsensusData] = useState<ConsensusItem[] | null>(null); // Type uses agents property

  const handleStartConsultation = useCallback((agents: PanelAgent[], caseInfo: string) => { // Use PanelAgent
    setSelectedAgents(agents);
    setCaseDetails(caseInfo);
    setCurrentView('consultation');
  }, []);

   const handleGoBackToSetup = () => {
       setCurrentView('setup');
       setSelectedAgents([]);
   }

   const handleProceedToReport = (generatedData: ConsensusItem[]) => {
       if (isPublicView) {
           navigate('/login');
           toast.info('Please sign in to view the full report.');
           return;
       }
       console.log("Proceeding to report with data:", generatedData);
       setConsensusData(generatedData);
       setCurrentView('report');
   }

   const handleCloseReport = () => {
       console.log("Closing report view");
       handleGoBackToSetup();
   }

  const renderView = () => {
    console.log("Current view:", currentView);
    console.log("Consensus data:", consensusData);
    
    switch (currentView) {
      case 'setup':
        // Pass isPublicView to ConsultationSetup
        return <ConsultationSetup onStart={handleStartConsultation} isPublicView={isPublicView} />; 
      case 'consultation':
        // Consultation view likely doesn't need major changes for public, 
        // as the restriction happens at the start/proceed steps.
        return (
          <ConsultationView
            agents={selectedAgents}
            caseInfo={caseDetails}
            onGoBack={handleGoBackToSetup}
            onProceed={handleProceedToReport} // Proceed action is handled within the function now
          />
        );
      case 'report':
         // This view should ideally not be reachable in public mode due to the check in handleProceedToReport
        if (isPublicView) {
             // Fallback redirect if somehow reached
             navigate('/login');
             return null; 
        }
        if (!consensusData) {
          console.error("No consensus data available for report view");
          return <div>Error: No consensus data available</div>;
        }
        return (
          <ConsensusReportView
            consensusData={consensusData}
            onClose={handleCloseReport}
          />
        );
      default:
        console.warn("Unknown view:", currentView);
        return <ConsultationSetup onStart={handleStartConsultation} />;
    }
  };

  // Removed PublicLayout wrapper and container div
  return (
    <> 
      {renderView()}
      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.02); }
          20% { transform: scale(1.04); }
          40%, 60% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        .hover\:animate-bounce-subtle:hover { animation: bounce-subtle 1s ease-in-out infinite; }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
      `}</style>
    </> // Close fragment
  );
}

export default ExpertPanelView; // Renamed export
