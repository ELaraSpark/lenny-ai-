import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, MessageSquare, Brain, HeartPulse, Stethoscope, FileText, 
  Globe, Beaker, Calculator, Table, HelpCircle, Pill, Zap, 
  ClipboardList, FileQuestion, BookOpen
} from 'lucide-react';

interface SuggestionItemProps {
  icon?: React.ReactNode;
  text: string;
  onClick: () => void;
  hasArrow?: boolean;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ icon, text, onClick, hasArrow = false }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-primary/5 transition-colors duration-200"
      onClick={onClick}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {icon && (
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          {icon}
        </div>
      )}
      <span className="text-sm text-foreground flex-1">{text}</span>
      {hasArrow && (
        <div className="text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  );
};

interface SuggestionCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{text: string, query: string}>;
  onItemClick: (query: string) => void;
}

const SuggestionCategory: React.FC<SuggestionCategoryProps> = ({ title, icon, items, onItemClick }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-4">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <SuggestionItem
            key={index}
            text={item.text}
            onClick={() => onItemClick(item.query)}
            hasArrow={true}
          />
        ))}
      </div>
    </div>
  );
};

interface SuggestionsDropdownProps {
  isVisible: boolean;
  onSuggestionClick: (searchQuery: string) => void;
  onClose: () => void;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({ 
  isVisible, 
  onSuggestionClick,
  onClose
}) => {
  const categories = [
    {
      title: "Ask about Treatment Options",
      icon: <Pill className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "What are the treatment options for managing chronic heart failure with reduced ejection fraction?",
          query: "treatment options chronic heart failure reduced ejection fraction"
        },
        {
          text: "What are the recommended therapies for a patient with stage 4 non-small cell lung cancer?",
          query: "recommended therapies stage 4 non-small cell lung cancer"
        },
        {
          text: "How can recurrent Clostridioides difficile infection be treated after multiple antibiotic failures?",
          query: "treatment recurrent Clostridioides difficile infection after antibiotic failures"
        }
      ]
    },
    {
      title: "Ask in a Language Other Than English",
      icon: <Globe className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "¿Cómo causa daño pulmonar el PCP en pacientes sin VIH?",
          query: "PCP lung damage non-HIV patients spanish"
        },
        {
          text: "Quelles sont les recommandations de l'ATS et de l'IDSA pour le traitement de l'histoplasmose?",
          query: "ATS IDSA recommendations histoplasmosis treatment french"
        }
      ]
    },
    {
      title: "Ask a Pop-Science Question",
      icon: <Beaker className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "Does long-term use of artificial sweeteners increase the risk of metabolic disorders like diabetes?",
          query: "artificial sweeteners long-term metabolic disorders diabetes risk"
        },
        {
          text: "Do GLP-1 agonists provide renal benefits for diabetic patients?",
          query: "GLP-1 agonists renal benefits diabetic patients"
        },
        {
          text: "Does a ketogenic diet actually improve patient outcomes?",
          query: "ketogenic diet patient outcomes evidence"
        }
      ]
    },
    {
      title: "Double Check with a Quick Curbside Consult",
      icon: <HelpCircle className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "For meniscal tear of the knee, do you order magnetic resonance imaging with or without contrast?",
          query: "meniscal tear knee MRI with without contrast"
        },
        {
          text: "A stroke patient had findings on MRI and CT. Should I still get a CTA?",
          query: "stroke patient MRI CT findings need for CTA"
        },
        {
          text: "In patients who present to the ER with AF RVR, in which the EF is not known, when to avoid diltiazem?",
          query: "AF RVR ER presentation unknown EF diltiazem contraindication"
        }
      ]
    },
    {
      title: "Ask about Drug Side Effects",
      icon: <Zap className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "What are the most common side effects of metformin?",
          query: "common side effects metformin"
        },
        {
          text: "Are there any serious or life-threatening side effects associated with long-term use of lisinopril?",
          query: "serious life-threatening side effects long-term lisinopril"
        },
        {
          text: "What are the known side effects of apixaban, particularly in elderly patients or those with kidney impairment?",
          query: "apixaban side effects elderly kidney impairment"
        }
      ]
    },
    {
      title: "Ask about Guidelines",
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      items: [
        {
          text: "What are the current IDSA recommendations for treating multidrug-resistant Pseudomonas infections?",
          query: "IDSA recommendations multidrug-resistant Pseudomonas infections"
        },
        {
          text: "Summarize the AHA/ACC guidelines for managing hypertension in patients with chronic kidney disease.",
          query: "AHA ACC guidelines hypertension chronic kidney disease"
        },
        {
          text: "What has been updated in the 2024 ADA guidelines?",
          query: "2024 ADA guidelines updates"
        }
      ]
    }
  ];

  // Handle clicking outside to close the dropdown
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-primary/10 rounded-xl shadow-xl z-[9999] overflow-hidden max-h-[80vh] overflow-y-auto w-[90%] max-w-[800px]"
          style={{ 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div className="p-3" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-4 px-4 py-2 border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Medical Suggestions</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
              {categories.map((category, index) => (
                <SuggestionCategory
                  key={index}
                  title={category.title}
                  icon={category.icon}
                  items={category.items}
                  onItemClick={(query) => {
                    onSuggestionClick(query);
                    onClose();
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuggestionsDropdown;
