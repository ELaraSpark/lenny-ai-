
import { useState, useEffect } from "react"; // Combined imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
// Import the renamed and merged component
import AccountTab from "./tabs/AccountTab";
import AppearanceTab from "./tabs/AppearanceTab";
import NotificationsTab from "./tabs/NotificationsTab";
import AIConfigTab from "./tabs/AIConfigTab";
import IntegrationsTab from "./tabs/IntegrationsTab"; // Import IntegrationsTab

const SettingsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Default to account tab
  const [activeTab, setActiveTab] = useState("account");

  // Extract the path after /settings/
  const settingsPath = location.pathname.split('/').slice(2)[0] || '';
  
  // Handle specific settings routes
  if (settingsPath === 'ai-experts') {
    return <Navigate to="/settings/ai-experts" replace />;
  }
  
  // Sync activeTab state with URL hash on mount and change
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    // Removed 'security' from validTabs
    const validTabs = ['account', 'appearance', 'notifications', 'ai-config', 'integrations']; 
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    } else {
      // If no hash or invalid hash, set default and update URL
      setActiveTab('account');
      navigate(location.pathname + '#account', { replace: true });
    }
  }, [location.hash, navigate, location.pathname]);


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash when tab changes
    navigate(location.pathname + `#${value}`, { replace: true });
  };

  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Use the activeTab state for value and defaultValue */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Updated grid columns to 5 */}
          <TabsList className="grid w-full grid-cols-5"> 
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="ai-config">AI Config</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <AccountTab />
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsTab />
          </TabsContent>

          {/* Removed Security Content Section */}

          <TabsContent value="ai-config" className="mt-6">
            <AIConfigTab />
          </TabsContent>

          {/* Added Integrations Content Section */}
          <TabsContent value="integrations" className="mt-6">
            <IntegrationsTab />
          </TabsContent>
        </Tabs>
      {/* Removed closing div for flex wrapper */}
    </div>
  );
};

export default SettingsView;
