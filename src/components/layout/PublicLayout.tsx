import React, { useState, useEffect } from "react"; // Added useState, useEffect
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext"; // Added useTheme (removed duplicate)
import { 
  User, Settings, LogOut, Clock, Search as SearchIcon, 
  Users as UsersIcon, Bookmark, Zap, List, Gift, Menu, X,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { PicassoAvatar } from "@/components/illustrations/PicassoAvatar";
import { PicassoIllustration } from "@/components/illustrations/PicassoIllustration"; // Added PicassoIllustration

// Moved type definition before component
type PublicLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  forceHideHeader?: boolean;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true, // Keep showFooter prop even if footer not added yet
  forceHideHeader = false 
}) => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for header behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background"> {/* Use default background */}
      
      {/* Conditionally render header */}
      {showHeader && !forceHideHeader && (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${isScrolled ? 'bg-background/90 shadow-md' : 'bg-transparent'}`}>
          <div className="container mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between py-4">
              {/* Logo Link */}
              <Link to="/" className="flex items-center gap-2 text-decoration-none">
                {/* Logo */}
                <img 
                  src="/illustrations/animation.webp"
                  alt="Leny.ai Logo" 
                  className="h-8 w-8 object-contain"
                />
                
                {/* Text */}
                <span className="font-bold text-2xl text-primary">
                  Leny
                </span>
              </Link>
              
              {/* Navigation Menu */}
              <div className="flex items-center gap-2 md:gap-5">
                {/* Ask Leny */}
                <Link
                  to="/public/chat"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/chat' || location.pathname === '/'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <MessageSquare size={18} className={
                      location.pathname === '/public/chat' || location.pathname === '/'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Ask Leny</span>
                </Link>

                {/* AI Agents */}
                <Link
                  to="/public/my-agents"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/my-agents'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <UsersIcon size={18} className={
                      location.pathname === '/public/my-agents'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">AI Agents</span>
                </Link>

                {/* Smart Notes */}
                <Link
                  to="/public/my-templates"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/my-templates'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Zap size={18} className={
                      location.pathname === '/public/my-templates'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Smart Notes</span>
                </Link>

                {/* Expert Panel */}
                <Link
                  to="/public/tumor-board"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/tumor-board'
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <List size={18} className={
                      location.pathname === '/tumor-board'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                  </div>
                  <span className="hidden md:inline">Expert Panel</span>
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <PicassoAvatar
                          email={user?.email || 'User'}
                          size="sm"
                          color="text-primary"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 border border-border shadow-lg rounded-lg">
                      {/* User Info Section */}
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center">
                          <PicassoAvatar
                            email={user?.email || 'User'}
                            size="md"
                            color="text-primary"
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">Medical User</div>
                            <div className="text-xs text-muted-foreground">{user?.email || 'user@hospital.org'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items Section - Restored original */}
                      <div className="py-2">
                        <DropdownMenuItem asChild>
                          <Link to="/recent-chats" className="cursor-pointer">
                            <Clock size={16} className="mr-3 text-muted-foreground" />
                            <span>Recent Chats</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/my-agents" className="cursor-pointer">
                             <UsersIcon size={16} className="mr-3 text-muted-foreground" />
                             <span>My Agents</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/my-templates" className="cursor-pointer">
                             <Bookmark size={16} className="mr-3 text-muted-foreground" />
                             <span>My Templates</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/integrations" className="cursor-pointer">
                             <Zap size={16} className="mr-3 text-muted-foreground" />
                             <span>Integrations</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/tasks" className="cursor-pointer">
                             <List size={16} className="mr-3 text-muted-foreground" />
                             <span>Tasks</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/referrals" className="cursor-pointer">
                             <Gift size={16} className="mr-3 text-muted-foreground" />
                             <span>Referrals</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/settings" className="cursor-pointer">
                            <Settings size={16} className="mr-3 text-muted-foreground" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 focus:bg-red-50">
                          <LogOut size={16} className="mr-3" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link to="/login">
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium rounded-lg px-4 py-2">Sign up</Button>
                    </Link>
                    
                    {/* Mobile menu button REMOVED */}
                    {/* 
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button> 
                    */}
                  </>
                )}
              </div>
            </nav>
          </div>
          
          {/* Mobile Navigation Menu REMOVED */}
          {/* 
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
              >
                <div className="container py-4 px-4 flex flex-col gap-3">
                  <Link
                    to="/public/chat"
                    className={`flex items-center gap-2 py-2 text-sm font-medium rounded-md px-3 transition-colors ${
                      location.pathname === '/public/chat' || location.pathname === '/'
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageSquare size={18} className={
                      location.pathname === '/public/chat' || location.pathname === '/'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                    <span>Ask Leny</span>
                  </Link>
                  <Link
                    to="/public/my-agents"
                    className={`flex items-center gap-2 py-2 text-sm font-medium rounded-md px-3 transition-colors ${
                      location.pathname === '/public/my-agents'
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UsersIcon size={18} className={
                      location.pathname === '/public/my-agents'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                    <span>AI Agents</span>
                  </Link>
                  <Link
                    to="/public/my-templates"
                    className={`flex items-center gap-2 py-2 text-sm font-medium rounded-md px-3 transition-colors ${
                      location.pathname === '/public/my-templates'
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Zap size={18} className={
                      location.pathname === '/public/my-templates'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                    <span>Smart Notes</span>
                  </Link>
                  <Link
                    to="/public/tumor-board"
                    className={`flex items-center gap-2 py-2 text-sm font-medium rounded-md px-3 transition-colors ${
                      location.pathname === '/public/tumor-board'
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <List size={18} className={
                      location.pathname === '/public/tumor-board'
                        ? "text-primary"
                        : "text-muted-foreground"
                    } />
                    <span>Expert Panel</span>
                  </Link>
                  <div className="border-t border-border my-2"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence> 
          */}
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {/* Re-added Footer */}
      {showFooter && (
        <footer className="bg-background/80 backdrop-blur-md border-t border-border pt-10 pb-5 relative z-10"> 
          <div className="container mx-auto px-4 sm:px-6">
            {/* Footer columns */}
            <div className="flex flex-wrap justify-between gap-8 mb-8">
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">Support</h3>
                <ul className="space-y-3">
                  <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                  <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                  <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">Features</h3>
                <ul className="space-y-3">
                  <li><Link to="/features#agents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Agents</Link></li>
                  <li><Link to="/features#transcription" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Medical Transcription</Link></li>
                  <li><Link to="/features#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Research Assistance</Link></li>
                  <li><Link to="/features#analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Healthcare Analytics</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">About</h3>
                <ul className="space-y-3">
                  <li><Link to="/about#story" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
                  <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                  <li><Link to="/press" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Press</Link></li>
                  <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                </ul>
              </div>
            </div>
            {/* Copyright */}
            <div className="border-t border-border pt-6 mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} LENY-AI, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
