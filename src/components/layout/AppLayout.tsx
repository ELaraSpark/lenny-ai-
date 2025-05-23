import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React from "react"; // Import React

import Sidebar from "./Sidebar";
import Header from "./Header";
import { ActiveCallProvider } from "@/components/followup/context/ActiveCallContext";

interface AppLayoutProps {
  hideHeader?: boolean;
  children?: React.ReactNode; // Added children prop
}

const AppLayout: React.FC<AppLayoutProps> = ({ hideHeader, children }) => { // Added children to props
  const location = useLocation();
  
  // State for sidebar toggle in mobile and desktop
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(true);
  
  // Toggle desktop sidebar function
  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarCollapsed(prev => !prev);
  }, []);

  // Toggle mobile sidebar function
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    console.log('%c[AppLayout] Component instance MOUNTED. Path: ' + location.pathname, 'color: green; font-weight: bold;');
    const instanceId = Math.random().toString(36).substring(2, 8); // Unique ID for this instance
    console.log(`%c[AppLayout] Mounted Instance ID: ${instanceId}`, 'color: green;');
    return () => {
      console.log('%c[AppLayout] Component instance UNMOUNTED. Path: ' + location.pathname + ` (Instance ID: ${instanceId})`, 'color: red; font-weight: bold;');
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  useEffect(() => {
    console.log('[AppLayout] States updated: isMobileSidebarOpen:', isMobileSidebarOpen, 'isDesktopSidebarCollapsed:', isDesktopSidebarCollapsed);
  }, [isMobileSidebarOpen, isDesktopSidebarCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileSidebarOpen) { // 1024px is a common breakpoint for 'lg'
        console.log('[AppLayout] Window resized to desktop width with mobile sidebar open. Closing mobile sidebar.');
        setIsMobileSidebarOpen(false);
      } else {
        // Optionally, you can keep a log for other resize events if needed
        // console.log('[AppLayout] Window resized. Width:', window.innerWidth, 'Current isMobileSidebarOpen:', isMobileSidebarOpen);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]); // Re-run if isMobileSidebarOpen changes to log its current value correctly

  // Handle click on main content area to collapse desktop sidebar
  const handleContentClick = useCallback(() => {
    if (!isDesktopSidebarCollapsed) {
      setIsDesktopSidebarCollapsed(true);
    }
    // Close mobile sidebar if clicking outside
    if (isMobileSidebarOpen) {
       setIsMobileSidebarOpen(false);
    }
  }, [isDesktopSidebarCollapsed, isMobileSidebarOpen]);
  
  return (
    <ActiveCallProvider>
      {/* Main flex container - explicit height and overflow settings */}
      <div className="flex h-screen overflow-hidden relative bg-background font-sans" style={{ fontFamily: "var(--font-sans)" }}>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {console.log('[AppLayout] Rendering mobile sidebar because isMobileSidebarOpen is true.')}
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-modal lg:hidden"
                onClick={toggleMobileSidebar} // Close on backdrop click
              />
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-full z-active lg:hidden" // Using z-active class
              >
                <Sidebar
                  className="h-full" // Ensure sidebar takes full height
                  isCollapsed={false} // Mobile sidebar is never collapsed
                  onToggle={toggleMobileSidebar} // Use mobile toggle
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar (conditionally hidden on mobile) */}
        <Sidebar
          className="hidden lg:flex relative z-base" // Using z-base class
          isCollapsed={isDesktopSidebarCollapsed}
          onMouseEnter={() => setIsDesktopSidebarCollapsed(false)}
          onToggle={toggleDesktopSidebar}
        />

        {/* Main content area */}
        <div
          className="flex-1 flex flex-col overflow-hidden relative z-base"
          style={{ background: "var(--background)", fontFamily: "var(--font-sans)" }}
          onClick={handleContentClick}
        >
          {/* Pass mobile toggle to Header */}
          <Header
            className="tab-nav-bg border-none shadow-none relative z-dropdown"
            onMobileMenuToggle={toggleMobileSidebar}
          />
          
          {/* Content with scrolling enabled */}
          <main className="flex-1 page-container overflow-y-auto">
            <div className="relative z-base h-full max-w-5xl mx-auto p-4 md:p-8 bg-background rounded-lg shadow-sm border border-border/30 panel-wrapper">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {children ? children : <Outlet />} {/* Render children if provided, otherwise Outlet */}
              </motion.div>
            </div>
          </main>
        </div>
        
      </div>
    </ActiveCallProvider>
  );
};

export default AppLayout;
