import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type TabsValue = string;

interface TabsContextValue {
  value: TabsValue;
  onValueChange: (value: TabsValue) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a TabsContainer');
  }
  return context;
}

interface TabsContainerProps {
  value: TabsValue;
  onValueChange: (value: TabsValue) => void;
  children: React.ReactNode;
  className?: string;
}

export function TabsContainer({
  value,
  onValueChange,
  children,
  className,
}: TabsContainerProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn(
      "flex border-b border-perplexity-border overflow-x-auto scrollbar-hide", // Added responsive overflow
      className
    )}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: TabsValue;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function TabsTrigger({
  value,
  children,
  className,
  icon,
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => onValueChange(value)}
      className={cn(
        "flex items-center px-3 sm:px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap", // Adjusted padding for mobile
        isActive
          ? "border-perplexity-teal text-perplexity-text-primary"
          : "border-transparent text-perplexity-text-secondary hover:text-perplexity-text-primary hover:border-perplexity-border",
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: TabsValue;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className,
}: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <motion.div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn("mt-4", className)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
