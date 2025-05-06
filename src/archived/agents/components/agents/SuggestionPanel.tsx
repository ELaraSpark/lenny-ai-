import React from 'react';
import { Button } from '@/components/ui/button';
import { Agent } from '@/components/agents/types/agentTypes';
import { motion } from 'framer-motion';

export interface Task {
  id: string;
  title: string;
  description: string;
  agentId: string | null;
}

interface AgentWithScore extends Agent {
  matchScore: number;
}

interface SuggestionPanelProps {
  query: string;
  matchingAgents: AgentWithScore[];
  suggestedTasks: Task[];
  onCreateAgent: () => void;
  onSelectAgent: (agent: Agent) => void;
  onSelectTask: (task: Task) => void;
  className?: string;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  query,
  matchingAgents,
  suggestedTasks,
  onCreateAgent,
  onSelectAgent,
  onSelectTask,
  className = '',
}) => {
  return (
    <div className={`w-full p-4 animate-in fade-in slide-in-from-top-4 duration-300 ${className}`}>
      {/* Matching Agents Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recommended Agents</h2>
        {matchingAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchingAgents.map((agent, index) => (
              <AgentSuggestion 
                key={agent.id}
                agent={agent}
                matchConfidence={agent.matchScore}
                onClick={() => onSelectAgent(agent)}
                delay={index * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground mb-2">No matching agents found for this task</p>
            <Button onClick={onCreateAgent}>Create Specialized Agent</Button>
          </div>
        )}
      </div>
      
      {/* Suggested Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Suggested Workflows</h2>
        <div className="space-y-2">
          {suggestedTasks.length > 0 ? (
            suggestedTasks.map((task, index) => (
              <TaskSuggestion 
                key={task.id}
                task={task}
                onClick={() => onSelectTask(task)}
                delay={index * 0.05}
              />
            ))
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">No suggested workflows available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AgentSuggestionProps {
  agent: Agent;
  matchConfidence: number;
  onClick: () => void;
  delay?: number;
}

const AgentSuggestion: React.FC<AgentSuggestionProps> = ({ 
  agent, 
  matchConfidence,
  onClick,
  delay = 0
}) => {
  // Format match confidence as percentage
  const confidencePercent = Math.round(matchConfidence * 100);
  
  // Determine confidence level color
  const getConfidenceColor = () => {
    if (confidencePercent >= 80) return 'text-green-600';
    if (confidencePercent >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="border border-border rounded-lg p-3 hover:border-primary hover:shadow-sm cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {agent.imageUrl ? (
          <img 
            src={agent.imageUrl} 
            alt={agent.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            {agent.name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground truncate">{agent.name}</h3>
            <span className={`text-xs font-medium ${getConfidenceColor()}`}>
              {confidencePercent}% match
            </span>
          </div>
          
          {agent.specialty && (
            <p className="text-xs text-muted-foreground mt-0.5">{agent.specialty}</p>
          )}
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
          
          {agent.capabilities && agent.capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {agent.capabilities.slice(0, 3).map((capability, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-muted text-xs rounded-full"
                >
                  {capability}
                </span>
              ))}
              {agent.capabilities.length > 3 && (
                <span className="px-2 py-0.5 bg-muted text-xs rounded-full">
                  +{agent.capabilities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TaskSuggestionProps {
  task: Task;
  onClick: () => void;
  delay?: number;
}

const TaskSuggestion: React.FC<TaskSuggestionProps> = ({ 
  task, 
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="border border-border rounded-lg p-3 hover:border-primary hover:bg-muted/30 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <h3 className="font-medium text-foreground">{task.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
    </motion.div>
  );
};

export default SuggestionPanel;
