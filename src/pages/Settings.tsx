import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
// Remove AppLayout import as it's already provided by the parent route
import { TabsContainer, TabsList, TabsTrigger } from '@/components/ui/perplexity-tabs'; // Use new tabs
import { User, Palette, Bell, Lock, Cpu } from 'lucide-react'; // Icons for tabs

// Define tabs for settings
const settingsTabs = [
  { id: 'account', label: 'Account', icon: User, path: '/settings/account' },
  { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { id: 'security', label: 'Security', icon: Lock, path: '/settings/security' },
  { id: 'ai-config', label: 'AI Config', icon: Cpu, path: '/settings/ai-config' },
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current URL path segment
  const getCurrentTab = () => {
    const currentPath = location.pathname;
    // Find the tab whose path is the start of the current path
    const active = settingsTabs.find(tab => currentPath.startsWith(tab.path));
    // Default to 'account' if no match or at base '/settings' path
    return active ? active.id : 'account'; 
  };

  const [activeTab, setActiveTab] = useState<string>(getCurrentTab());

  // Update state if URL changes (e.g., browser back/forward)
  React.useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const tab = settingsTabs.find(t => t.id === value);
    if (tab) {
      setActiveTab(value);
      navigate(tab.path); // Navigate to the corresponding route
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Use theme foreground */}
        <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1> 
        
        <TabsContainer value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6"> {/* Add margin below tabs */}
            {settingsTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} icon={<tab.icon size={16} />}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* 
            Instead of using TabsContent, we use React Router's <Outlet /> 
            to render the content based on the nested route.
            The actual tab content components (AccountTab, AppearanceTab, etc.) 
            will be rendered by the nested routes defined in App.tsx 
            (e.g., /settings/account, /settings/appearance).
          */}
          <div className="mt-6"> {/* Add margin for content */}
             <Outlet /> 
          </div>

        </TabsContainer>
      </div>
  );
};

// We also need components for each tab's content, e.g.:
// src/components/settings/tabs/AccountTab.tsx
// src/components/settings/tabs/AppearanceTab.tsx
// etc.

// Example AccountTab component (replace with actual content)
// export const AccountTab = () => <div>Account Settings Content</div>; 

export default Settings;
