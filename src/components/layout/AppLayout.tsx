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
  const getGradientClass = () => {
    return 'bg-gradient-green'; // Keep this if needed elsewhere, or remove
  };
  
  return (
    <ActiveCallProvider> {/* Keep context provider if still relevant */}
      {/* Main flex container */}
      <div className="flex h-screen overflow-hidden relative"> {/* Added relative back */} 
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={toggleMobileSidebar} // Close on backdrop click
              />
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-full z-40 lg:hidden" // Position fixed for overlay
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
          className="hidden lg:flex relative z-10" // Hide on mobile, flex on desktop
          isCollapsed={isDesktopSidebarCollapsed}
          onMouseEnter={() => setIsDesktopSidebarCollapsed(false)}
          onToggle={toggleDesktopSidebar}
        />

        {/* Main content area */}
        <div
          className="flex-1 flex flex-col overflow-hidden relative z-10"
          onClick={handleContentClick} // Collapses desktop sidebar, closes mobile
        >
          {isAgentsPage ? (
            // Structure for Agents page
            <main className="flex-1 overflow-y-auto relative">
              <div className="relative z-10 h-full">
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
                className="bg-transparent border-none shadow-none relative z-20"
                onMobileMenuToggle={toggleMobileSidebar}
              />
              <main className="flex-1 overflow-y-auto relative pt-16">
                <div className="relative z-10 h-full">
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
// Removed duplicated code below this line
