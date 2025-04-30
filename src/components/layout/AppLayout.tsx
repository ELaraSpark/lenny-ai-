import { ReactNode, useState, useEffect, useCallback } from "react"; // Added useCallback
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ActiveCallProvider } from "@/components/followup/context/ActiveCallContext";
import { cn } from '@/lib/utils';
import { Outlet, useLocation } from "react-router-dom"; // Import Outlet and useLocation
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme

interface AppLayoutProps {}

const AppLayout = () => {
  const { colorTheme } = useTheme();
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar
  const location = useLocation();
  const isAgentsPage = location.pathname === '/agents' || location.pathname === '/my-agents';

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
      {/* Main flex container */}
      <div className="flex h-screen overflow-hidden relative bg-background font-sans" style={{ fontFamily: "var(--font-sans)" }}>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
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
          {isAgentsPage ? (
            // Structure for Agents page
            <main className="flex-1 page-container">
              <div className="relative z-base h-full panel-wrapper">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </div>
            </main>
          ) : (
            // Structure for other pages
            <>
              {/* Pass mobile toggle to Header */}
              <Header
                className="tab-nav-bg border-none shadow-none relative z-dropdown"
                onMobileMenuToggle={toggleMobileSidebar}
              />
              <main className="flex-1 page-container pt-16">
                <div className="relative z-base h-full max-w-5xl mx-auto p-4 md:p-8 bg-background rounded-lg shadow-sm border border-border/30 panel-wrapper">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Outlet />
                  </motion.div>
                </div>
              </main>
            </>
          )}
        </div>
        
      </div>
    </ActiveCallProvider>
  );
};

export default AppLayout;
