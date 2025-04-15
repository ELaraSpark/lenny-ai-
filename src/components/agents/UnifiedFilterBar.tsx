import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GraduationCap, FlaskConical, Stethoscope, Star } from 'lucide-react';
import { AgentCategory } from './AgentCategoryFilters';

interface UnifiedFilterBarProps {
  selectedCategory: AgentCategory;
  onSelectCategory: (category: AgentCategory) => void;
  className?: string;
}

const categories: { value: AgentCategory; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Star },
  { value: 'med_student', label: 'Med Students', icon: GraduationCap },
  { value: 'research', label: 'Research Mode', icon: FlaskConical },
  { value: 'nursing', label: 'Nursing', icon: Stethoscope },
];

export const UnifiedFilterBar = ({
  selectedCategory,
  onSelectCategory,
  className,
}: UnifiedFilterBarProps) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(category.value)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm", // Rounded pill shape
              selectedCategory === category.value
                ? "bg-perplexity-teal text-white hover:bg-perplexity-teal-dark" // Active state
                : "bg-background border-perplexity-border text-perplexity-text-secondary hover:bg-perplexity-bg-hover hover:border-perplexity-border" // Inactive state
            )}
          >
            <category.icon size={16} className="mr-1.5" />
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default UnifiedFilterBar;
