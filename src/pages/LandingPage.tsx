import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from "@/components/layout/PublicLayout";
import MyAgents from "./MyAgents";
import BenefitsSection from "@/components/home/BenefitsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import SecurityBanner from "@/components/home/SecurityBanner"; 
import CTASection from "@/components/home/CTASection";
import { cn } from '@/lib/utils';
import { 
  GraduationCap, 
  FlaskConical, 
  Stethoscope, 
  Sparkles,
  ClipboardList,
  NotebookPen,
  MessageCircle,
  Search as SearchIcon,
  X,
  ArrowRight,
  ChevronRight,
  Users as UsersIcon,
  Zap
} from 'lucide-react';
import { AgentCategory } from '@/components/agents/AgentCategoryFilters'; 
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import MyTemplates from "./MyTemplates";
import PublicChat from "@/components/home/PublicChat";
import ExpertPanelView from "@/components/tumor-board/TumorBoardView";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from 'react-router-dom';
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { useTheme } from '@/contexts/ThemeContext';

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
  const navigate = useNavigate();
  const { colorTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<AgentCategory | 'all'>('all'); 
  const [activeTool, setActiveTool] = useState<string | null>('ask_ai'); // Default to 'ask_ai'
  const [isToolLoading, setIsToolLoading] = useState(false); 
  const [landingSearchTerm, setLandingSearchTerm] = useState(''); 
  const [showPreview, setShowPreview] = useState(false);

  // Always use classic theme gradient
  const getGradientClass = () => {
    return 'bg-gradient-green';
  };

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
        // Don't render PublicChat here since we render it in the full-page view
        return null;
      default: // activeTool is null, show Specialists/MyAgents
        return <MyAgents isPublicView={true} />; 
    }
  };

  // Check if we should show the full-page chat
  const showFullPageChat = activeTool === 'ask_ai';

  return (
    <PublicLayout showHeader={true} showFooter={!showFullPageChat}>
      
      {/* Navigation menu is now in the PublicLayout header */}

      {showFullPageChat ? (
        // Full-page chat view - render PublicChat directly without containers
        <div className="flex-1">
          <PublicChat />
        </div>
      ) : (
        // Regular landing page view with containers and other sections
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col flex-1">
            {/* Main Content Area with Visual Container - Explicitly White Background */}
            <div className="bg-[#FFFFFF] shadow-md rounded-lg border border-border/30 p-6">
              <div className={`w-full ${activeTool === null ? 'mb-6' : ''}`}>
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
        </>
      )}
    </PublicLayout>
  );
};

export default LandingPage;
