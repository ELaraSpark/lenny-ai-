// Remove toast components that show notifications at the bottom right
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"; // Added Outlet
import { AnimatePresence } from "framer-motion"; // Removed motion import if not used directly here
// AuthProvider is removed
import { ThemeProvider } from "@/contexts/ThemeContext";
import useAuthStore, { initializeAuthListener, cleanupAuthListener } from "@/stores/authStore"; // Import the Zustand store and listeners
import React, { useEffect } from "react"; // Import useEffect

// Remove toast components that show notifications at the bottom right
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RootHandler } from "@/components/auth/RootHandler";
import AppLayout from "@/components/layout/AppLayout"; // Import the main AppLayout
// PublicLayout is no longer needed as RootHandler manages root path redirection
// import PublicLayout from "@/components/layout/PublicLayout";
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
// import AIExpertsSettings from "./pages/AIExpertsSettings"; // Commented out - missing module
// import EditAIExpert from "./pages/EditAIExpert"; // Commented out - missing module
import DocumentTransformer from "./pages/DocumentTransformer";
import CollaborationHub from "./pages/CollaborationHub";
import ExpertPanelView from "@/components/tumor-board/TumorBoardView"; // Updated import name
import Chat from "./pages/Chat";
// Import new placeholder pages
import RecentChats from "./pages/RecentChats";
import RecentSearches from "./pages/RecentSearches"; // This import might be unused now
// import MyAgents from "./pages/MyAgents"; // Commented out - missing module
import QuickNotes from "./pages/MyTemplates"; // Import as QuickNotes since that's the exported name
import Integrations from "./pages/Integrations";
import Tasks from "./pages/Tasks";
// import CreateAgentPage from "./pages/CreateAgentPage"; // Commented out - missing module
import Referrals from "./pages/Referrals";
import Library from "./pages/Library";
import LandingPage from "./pages/LandingPage"; // This might be for /features or /about, or could be removed if not used.
// PublicChat is no longer needed as RootHandler manages root path redirection
// import PublicChat from "@/components/home/PublicChat";
// import AgentDetailPage from "./pages/AgentDetailPage";  // Commented out - missing module
import CreateTemplatePage from "./pages/CreateTemplatePage";
import EditTemplatePage from "./pages/EditTemplatePage"; // Import edit template page
import DoctorsLounge from "./pages/DoctorsLounge"; // Import Doctor's Lounge page
import CardComparisonPage from "./pages/CardComparisonPage"; // Import card comparison page
import CleanChat from "./pages/CleanChat"; // Import the new clean chat interface
import TestChatPage from "./pages/TestChatPage"; // Import the TestChatPage
 
 // Import the new page for security logs if needed
// import SecurityLogs from "./pages/SecurityLogs";
import AuthCallback from "./pages/AuthCallback"; // Import the new AuthCallback component

const queryClient = new QueryClient();

const App = () => {
  // const { checkAuthState } = useAuthStore(); // checkAuthState is now called within initializeAuthListener

  useEffect(() => {
    // checkAuthState(); // No longer needed here, called by initializeAuthListener
    initializeAuthListener();
    return () => {
      cleanupAuthListener();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Removed toast components that were showing intrusive notifications */}
        {/* <Toaster /> */}
        {/* <Sonner /> */}
        <BrowserRouter>
          {/* AuthProvider removed */}
          <ThemeProvider>
            <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes - Login, Register, etc. */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/features" element={<Features />} /> 
              <Route path="/about" element={<AboutUs />} /> 
              <Route path="/auth/callback" element={<AuthCallback />} /> {/* Add the OAuth callback route */}
              
              {/* Public access routes like /public/* and /clean-chat are removed. */}
              {/* RootHandler will now redirect to /login or /chat. */}
              {/* The /features and /about routes remain public. */}
              {/* LandingPage component might be used for /features or /about, or can be removed if not. */}
              
              {/* Root Route - Now properly handles authentication state using RootHandler */}
              <Route path="/" element={<RootHandler />} />

              {/* Authenticated Routes using AppLayout */}
              {/* Authenticated Routes - AppLayout wrapper removed */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Outlet /> {/* Added Outlet for nested routes */}
                    </AppLayout>
                  </ProtectedRoute>
                }
              >
                {/* Define child routes here. They will render without the main AppLayout */}
                <Route path="/patients" element={<PatientRecords />} />
                {/* === Archived AI Agents routes === */}
                {/* <Route path="/agents" element={<Navigate to="/my-agents" replace />} /> */} {/* Redirect */}
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings/*" element={<SettingsView />} />
                <Route path="/followup-scheduler" element={<FollowupScheduler />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/tools/document-transformer" element={<DocumentTransformer />} />
                <Route path="/collaboration-hub" element={<CollaborationHub />} />
                {/* Expert Panel needs protection if it's not public */}
                <Route path="/tumor-board" element={<ExpertPanelView />} /> 
                <Route path="/recent-chats" element={<RecentChats />} />
                
                {/* === Archived AI Agents routes (Commented out due to missing modules) === */}
                {/* <Route path="/my-agents" element={<MyAgents />} /> */}
                {/* <Route path="/agents/create" element={<CreateAgentPage />} /> */}
                {/* <Route path="/agents/:agentId" element={<AgentDetailPage />} /> */}
                
                <Route path="/my-templates" element={<QuickNotes />} /> {/* AppLayout removed, QuickNotes is already blank */}
                <Route path="/quick-notes" element={<Navigate to="/my-templates" replace />} /> {/* Redirect to MyTemplates */}
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/library" element={<Library />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/test-chat" element={<TestChatPage />} /> {/* Added Test Chat Page route */}
                <Route path="/templates/create" element={<CreateTemplatePage />} /> {/* Added create template route */}
                <Route path="/templates/:templateId/edit" element={<EditTemplatePage />} /> {/* Added edit template route */}
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
          {/* AuthProvider removed */}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
