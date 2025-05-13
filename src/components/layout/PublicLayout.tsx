import React, { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore"; // Import the Zustand store
import { useTheme } from "@/contexts/ThemeContext";
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
import { PicassoIllustration } from "@/components/illustrations/PicassoIllustration"; 

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
  showFooter = true,
  forceHideHeader = false
}) => {
  const { user, signOut } = useAuthStore(); // Use Zustand store
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
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden"> {/* Added overflow-x-hidden */}
      
      {/* Conditionally render header */}
      {showHeader && !forceHideHeader && (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${isScrolled ? 'bg-background/90 shadow-md' : 'bg-transparent'}`}>
          <div className="container mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between py-4">
              {/* Playful Logo/Accent - Using the landing page style */}
              <Link to="/" className="text-2xl font-semibold text-neutral-900 flex items-center transform -rotate-1 mr-8">
                <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full mr-2 transform -translate-y-1"></span>
                Leny<span className="text-primary">.ai</span>
              </Link>
              
              {/* Navigation Menu */}
              <div className="flex items-center gap-2 md:gap-5">
                {/* Ask Leny */}
                <Link
                  to="/public/chat"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/chat' || location.pathname === '/'
                      ? "bg-teal-100 text-teal-900"
                      : "bg-teal-100/70 text-teal-900/70 hover:bg-teal-100 hover:text-teal-900"
                  }`}
                >
                  <MessageSquare size={16} className="mr-1" />
                  <span>Ask Leny</span>
                </Link>
                
                {/* Smart Notes */}
                <Link
                  to="/public/my-templates"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/my-templates'
                      ? "bg-teal-100 text-teal-900"
                      : "bg-teal-100/70 text-teal-900/70 hover:bg-teal-100 hover:text-teal-900"
                  }`}
                >
                  <Zap size={16} className="mr-1" />
                  <span>Smart Notes</span>
                </Link>

                {/* Expert Panel */}
                <Link
                  to="/public/tumor-board"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-200 text-sm font-medium ${
                    location.pathname === '/public/tumor-board'
                      ? "bg-teal-100 text-teal-900"
                      : "bg-teal-100/70 text-teal-900/70 hover:bg-teal-100 hover:text-teal-900"
                  }`}
                >
                  <List size={16} className="mr-1" />
                  <span>Expert Panel</span>
                </Link>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <PicassoAvatar
                          email={user?.name || user?.email || 'User'} // Prefer user.name
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
                            email={user?.name || user?.email || 'User'} // Prefer user.name
                            size="md"
                            color="text-primary"
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium text-sm">{user?.name || 'Medical User'}</div> {/* Display user.name or fallback */}
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
                           <Link to="/my-templates" className="cursor-pointer">
                             <Bookmark size={16} className="mr-3 text-muted-foreground" />
                             <span>My Templates</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/settings" className="cursor-pointer">
                            <Settings size={16} className="mr-3 text-muted-foreground" />
                            <span>Account Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link to="/referrals" className="cursor-pointer">
                             <Gift size={16} className="mr-3 text-muted-foreground" />
                             <span>Rewards & Referrals</span>
                           </Link>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator />
                      
                      {/* Logout Option */}
                      <div className="py-2">
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
                          <LogOut size={16} className="mr-3" />
                          <span>Log Out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button className="bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg px-5 py-1.5">
                      Sign In
                    </Button>
                  </Link>
                )}
                
                {/* Mobile menu button - removed, simplified for this component */}
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
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* Main content with scrollable area */}
      <main className="flex-1 overflow-y-auto scrollable-container">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-background/80 backdrop-blur-md border-t border-border pt-10 pb-5 relative z-10"> 
          <div className="container mx-auto px-4 sm:px-6">
            {/* Footer columns */}
            <div className="flex flex-wrap justify-between gap-8 mb-8">
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">Support</h3>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                  <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">Features</h3>
                <ul className="space-y-3">
                  <li><Link to="/features#ai-chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Chat</Link></li>
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
                  <li><Link to="/about#team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Team</Link></li>
                  <li><Link to="/about#mission" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Mission</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <h3 className="text-base font-semibold mb-5 text-foreground">Legal</h3>
                <ul className="space-y-3">
                  <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                  <li><Link to="/compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compliance</Link></li>
                </ul>
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center mb-4 md:mb-0">
                <Link to="/" className="flex items-center text-foreground">
                  <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-2"></span>
                  <span className="font-semibold">Leny</span>
                  <span className="text-primary font-semibold">.ai</span>
                </Link>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">© 2025 Leny AI. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </Link>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
