import React, { useState } from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import MyAgents from "./MyAgents";
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";
import { 
  GraduationCap, 
  FlaskConical, 
  Stethoscope, 
  Sparkles,
  ClipboardList,
  Zap
} from 'lucide-react';
import { AgentCategory } from '@/components/agents/AgentCategoryFilters'; 
import PublicChat from "@/components/home/PublicChat";
import ExpertPanelView from "@/components/tumor-board/TumorBoardView";
import { Skeleton } from "@/components/ui/skeleton";
import LandingHero from "@/components/home/LandingHero";

// Define type for filter/tool items
type FilterItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  type: 'filter' | 'tool'; 
};

// Filter/tool data
const filterCategories: FilterItem[] = [
  { id: 'all', label: 'All Specialists', icon: Sparkles, type: 'filter' },
  { id: 'expert_panel', label: 'Expert Panel', icon: ClipboardList, type: 'tool' },
  { id: 'quick_notes', label: 'Quick Notes', icon: Zap, type: 'tool' },
  { id: 'cardiology', label: 'Cardiology', icon: GraduationCap, type: 'filter' },
  { id: 'neurology', label: 'Neurology', icon: Stethoscope, type: 'filter' },
  { id: 'oncology', label: 'Oncology', icon: FlaskConical, type: 'filter' },
];

const LandingPage = () => {
  const [activeFilter, setActiveFilter] = useState<AgentCategory | 'all'>('all'); 
  const [activeTool, setActiveTool] = useState<string | null>('ask_ai'); // Default to 'ask_ai'
  const [isToolLoading, setIsToolLoading] = useState(false); 

  const handleFilterClick = (item: FilterItem) => {
    if (item.type === 'filter') {
      setActiveFilter(item.id as AgentCategory | 'all'); 
      setActiveTool(null); 
      setIsToolLoading(false); 
    } else if (item.type === 'tool') {
      const newTool = activeTool === item.id ? null : item.id;
      setActiveTool(newTool);
      setActiveFilter('all'); 
      if (newTool) { 
        setIsToolLoading(true);
        setTimeout(() => setIsToolLoading(false), 300); 
      } else {
        setIsToolLoading(false);
      }
    }
  };

  // Conditionally render main content
  const renderMainContent = () => {
    if (isToolLoading) {
       return (
         <div className="space-y-4 w-full mt-8">
           <Skeleton className="h-12 w-1/2" />
           <Skeleton className="h-[400px] w-full" />
         </div>
       );
    }
    
    switch (activeTool) {
      case 'quick_notes':
        return <MyTemplates />;
      case 'expert_panel':
        return <ExpertPanelView isPublicView={true} />;
      case 'ask_ai':
        // Render our updated PublicChat component
        return <PublicChat />;
      default: // activeTool is null, show Specialists/MyAgents
        return <MyAgents isPublicView={true} />; 
    }
  };

  return (
    <PublicLayout showHeader={true} showFooter={true}>
      <LandingHero />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col flex-1">
        {/* Main Content Area with Visual Container - Explicitly White Background */}
        <div className="bg-[#FFFFFF] shadow-md rounded-lg border border-border/30 p-6">
          <div className="w-full">
            {renderMainContent()}
          </div>
        </div>
      </div>
      
      {/* Other Landing Page Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
    </PublicLayout>
  );
};

// This component should be imported from its own file, but for simplicity we're adding it inline
// This would typically be in its own file
const MyTemplates = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700">Quick Notes Feature Coming Soon</h2>
    </div>
  );
};

export default LandingPage;
