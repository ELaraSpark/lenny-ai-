// Remove toast components that show notifications at the bottom right
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // Removed motion import if not used directly here
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Remove toast components that show notifications at the bottom right
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RootHandler } from "@/components/auth/RootHandler"; 
import AppLayout from "@/components/layout/AppLayout"; // Import the main AppLayout
import PublicLayout from "@/components/layout/PublicLayout"; // Import the PublicLayout
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard"; // Removed unused import
import PatientRecords from "./pages/PatientRecords";
// import Agents from "./pages/Agents"; // Removed import
import Collaboration from "./pages/Collaboration";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import SettingsView from "./components/settings/SettingsView";
import FollowupScheduler from "./pages/FollowupScheduler";
// Removed FollowupMonitoring import as the page was deleted
import Features from "./pages/Features";
import AboutUs from "./pages/AboutUs";
import Notifications from "./pages/Notifications";
import AIExpertsSettings from "./pages/AIExpertsSettings";
import EditAIExpert from "./pages/EditAIExpert";
import DocumentTransformer from "./pages/DocumentTransformer";
import CollaborationHub from "./pages/CollaborationHub";
import ExpertPanelView from "@/components/tumor-board/TumorBoardView"; // Updated import name
import Chat from "./pages/Chat";
// Import new placeholder pages
import RecentChats from "./pages/RecentChats";
import RecentSearches from "./pages/RecentSearches"; // This import might be unused now
import MyAgents from "./pages/MyAgents";
import QuickNotes from "./pages/MyTemplates"; // Import as QuickNotes since that's the exported name
import SavedTemplates from "./pages/SavedTemplates"; // Import SavedTemplates component
import Integrations from "./pages/Integrations";
import Tasks from "./pages/Tasks";
import CreateAgentPage from "./pages/CreateAgentPage";
import Referrals from "./pages/Referrals";
import Library from "./pages/Library"; 
import LandingPage from "./pages/LandingPage";
import PublicChat from "@/components/home/PublicChat"; // Import PublicChat component
import AgentDetailPage from "./pages/AgentDetailPage"; 
import CreateTemplatePage from "./pages/CreateTemplatePage"; 
import EditTemplatePage from "./pages/EditTemplatePage"; // Import edit template page
import DoctorsLounge from "./pages/DoctorsLounge"; // Import Doctor's Lounge page
import CardComparisonPage from "./pages/CardComparisonPage"; // Import card comparison page
import CleanChat from "./pages/CleanChat"; // Import the new clean chat interface

// Import the new page for security logs if needed
// import SecurityLogs from "./pages/SecurityLogs";
import AuthCallback from "./pages/AuthCallback"; // Import the new AuthCallback component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Removed toast components that were showing intrusive notifications */}
      {/* <Toaster /> */}
      {/* <Sonner /> */}
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes - Login, Register, etc. */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/features" element={<Features />} /> 
              <Route path="/about" element={<AboutUs />} /> 
              <Route path="/auth/callback" element={<AuthCallback />} /> {/* Add the OAuth callback route */}
              
              {/* Public access to AI agents, smart notes, expert panel, and chat - now with showFooter={false} */}
              {/* === Archived AI Agents routes === */}
              {/* <Route path="/public/my-agents" element={<PublicLayout showFooter={false}><MyAgents isPublicView={true} /></PublicLayout>} /> */}
              <Route path="/public/my-templates" element={<PublicLayout forceHideHeader={true} showFooter={false}><QuickNotes isPublicView={true} /></PublicLayout>} />
              <Route path="/public/tumor-board" element={<PublicLayout showFooter={false}><ExpertPanelView isPublicView={true} /></PublicLayout>} />
              <Route path="/public/chat" element={<PublicLayout showFooter={false}><PublicChat /></PublicLayout>} />
              <Route path="/clean-chat" element={<CleanChat />} />
              
              {/* These routes are now hidden but preserved for future restoration. */}

              {/* Root Route - Now properly handles authentication state using RootHandler */}
              <Route path="/" element={<RootHandler />} />

              {/* Authenticated Routes using AppLayout */}
              <Route 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      {/* Outlet will render child routes */}
                    </AppLayout>
                  </ProtectedRoute>
                }
              >
                {/* Default authenticated route (e.g., redirect '/' here if RootHandler didn't) */}
                {/* <Route index element={<Navigate to="/chat" replace />} /> */} 
                
                {/* Define child routes here. They will render inside AppLayout */}
                <Route path="/patients" element={<PatientRecords />} />
                {/* === Archived AI Agents routes === */}
                {/* <Route path="/agents" element={<Navigate to="/my-agents" replace />} /> */} {/* Redirect */}
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings/*" element={<SettingsView />} />                <Route path="/followup-scheduler" element={<FollowupScheduler />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/tools/document-transformer" element={<DocumentTransformer />} />
                <Route path="/collaboration-hub" element={<CollaborationHub />} />
                {/* Expert Panel needs protection if it's not public */}
                <Route path="/tumor-board" element={<ExpertPanelView />} /> 
                <Route path="/recent-chats" element={<RecentChats />} />
                
                {/* === Archived AI Agents routes === */}
                {/* <Route path="/my-agents" element={<MyAgents />} /> */}
                {/* <Route path="/agents/create" element={<CreateAgentPage />} /> */}
                {/* <Route path="/agents/:agentId" element={<AgentDetailPage />} /> */}
                
                <Route path="/my-templates" element={<PublicLayout forceHideHeader={true} showFooter={false}><QuickNotes /></PublicLayout>} />
                <Route path="/quick-notes" element={<Navigate to="/my-templates" replace />} /> {/* Redirect to MyTemplates */}
                <Route path="/saved-templates" element={<PublicLayout forceHideHeader={true} showFooter={false}><SavedTemplates /></PublicLayout>} /> {/* Add SavedTemplates route */}
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/referrals" element={<Referrals />} />                <Route path="/library" element={<Library />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/templates/create" element={<PublicLayout forceHideHeader={true} showFooter={false}><CreateTemplatePage /></PublicLayout>} /> {/* Added create template route */}
                <Route path="/templates/:templateId/edit" element={<PublicLayout forceHideHeader={true} showFooter={false}><EditTemplatePage /></PublicLayout>} /> {/* Added edit template route */}
                <Route path="/doctors-lounge" element={<DoctorsLounge />} /> {/* Added Doctor's Lounge route */}
                <Route path="/card-comparison" element={<CardComparisonPage />} /> {/* Added Card Comparison route */}
                {/* Add other authenticated routes as needed */}
              </Route>

              {/* These routes are now hidden but preserved for future restoration. */}

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </AnimatePresence>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
