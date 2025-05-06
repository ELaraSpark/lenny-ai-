
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Brain,
  Microscope,
  Stethoscope,
  Eye,
  BarChart4,
  Pill,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const agents: Agent[] = [
  {
    id: "cardio",
    name: "CardioAssist",
    specialty: "Cardiology",
    description: "Expert in cardiovascular conditions and treatments",
    icon: Heart,
    color: "medical-red",
  },
  {
    id: "neuro",
    name: "NeuroLogic",
    specialty: "Neurology",
    description: "Specialist in neurological disorders and brain function",
    icon: Brain,
    color: "aida-600",
  },
  {
    id: "path",
    name: "PathInsight",
    specialty: "Pathology",
    description: "Analysis of lab results and diagnostic findings",
    icon: Microscope,
    color: "medical-green",
  },
  {
    id: "gen",
    name: "GeneralMD",
    specialty: "General Medicine",
    description: "Comprehensive primary care expertise",
    icon: Stethoscope,
    color: "muted-foreground",
  },
  {
    id: "opth",
    name: "OptiVision",
    specialty: "Ophthalmology",
    description: "Expert in eye conditions and treatments",
    icon: Eye,
    color: "medical-purple",
  },
  {
    id: "radiology",
    name: "RadAnalytics",
    specialty: "Radiology",
    description: "Interpretation of medical imaging",
    icon: BarChart4,
    color: "slate-700",
  },
  {
    id: "pharma",
    name: "PharmExpert",
    specialty: "Pharmacology",
    description: "Medication advice and drug interactions",
    icon: Pill,
    color: "medical-yellow",
  },
];

type AgentSelectorProps = {
  onSelect?: (agent: Agent) => void;
  className?: string;
};

const AgentSelector = ({ onSelect, className }: AgentSelectorProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    if (onSelect) {
      onSelect(agent);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h2 className="h3">Select AI Agent</h2> {/* Changed Specialist -> Agent */}
        <p className="text-muted-foreground">
          Choose the AI medical agent to assist with this case {/* Changed specialist -> agent */}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: [0.21, 0.45, 0.26, 0.95]
            }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-card hover:border-aida-200",
                selectedAgent?.id === agent.id &&
                  "border-aida-500 ring-1 ring-aida-500 bg-aida-50/50"
              )}
              onClick={() => handleSelect(agent)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      `bg-${agent.color}/10 text-${agent.color}`
                    )}
                  >
                    <agent.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {agent.specialty}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-xl">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelect(agent)}
                >
                  {selectedAgent?.id === agent.id ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgentSelector;
