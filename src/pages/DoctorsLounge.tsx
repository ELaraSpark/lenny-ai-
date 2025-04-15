import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration';
import { PicassoAvatar } from '@/components/illustrations/PicassoAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { funToasts } from '@/components/ui/fun-toast';
import { 
  getMedicalJoke, 
  getMedicalFact, 
  getMedicalQuote, 
  getHealthcareTip 
} from '@/lib/personalityUtils';
import { 
  Coffee, 
  Brain, 
  Sparkles, 
  FileText, 
  Award, 
  Trophy, 
  Star, 
  Calendar, 
  RefreshCw,
  Share2,
  BookOpen,
  MessageSquare,
  Users,
  Lightbulb,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Define achievement types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  date?: Date;
}

// Define meme type
interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: number;
  date: Date;
}

/**
 * Doctor's Lounge - A fun, relaxing space for healthcare professionals
 */
const DoctorsLounge = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('daily');
  const [joke, setJoke] = useState('');
  const [fact, setFact] = useState('');
  const [quote, setQuote] = useState('');
  const [tip, setTip] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get user's first name from email (temporary until we have proper user profiles)
  const getUserFirstName = () => {
    if (!user?.email) return 'Doctor';
    // Extract name from email (e.g., john.doe@example.com -> John)
    const emailName = user.email.split('@')[0].split('.')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };
  
  // Mock achievements data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Consultation',
      description: 'Completed your first AI consultation',
      icon: <MessageSquare className="h-5 w-5" />,
      unlocked: true,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Read 10 medical articles',
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Team Player',
      description: 'Collaborated with 5 other healthcare professionals',
      icon: <Users className="h-5 w-5" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: '4',
      title: 'Innovator',
      description: 'Created your first custom AI agent',
      icon: <Lightbulb className="h-5 w-5" />,
      unlocked: false
    },
    {
      id: '5',
      title: 'Efficiency Expert',
      description: 'Saved 10 hours using AI assistance',
      icon: <Zap className="h-5 w-5" />,
      unlocked: false,
      progress: 6,
      maxProgress: 10
    }
  ]);
  
  // Mock memes data
  const [memes, setMemes] = useState<Meme[]>([
    {
      id: '1',
      title: 'When the patient says they Googled their symptoms',
      description: 'We all know that feeling...',
      imageUrl: 'https://placehold.co/400x300/png?text=Medical+Meme+1',
      likes: 42,
      comments: 7,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'EHR System: "I\'m about to end this doctor\'s whole career"',
      description: 'Why are they never user-friendly?',
      imageUrl: 'https://placehold.co/400x300/png?text=Medical+Meme+2',
      likes: 128,
      comments: 23,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'That moment when your differential diagnosis was right',
      description: 'The satisfaction is real!',
      imageUrl: 'https://placehold.co/400x300/png?text=Medical+Meme+3',
      likes: 87,
      comments: 12,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ]);
  
  // Initialize content on mount
  useEffect(() => {
    refreshContent();
  }, []);
  
  // Refresh all content
  const refreshContent = () => {
    setJoke(getMedicalJoke());
    setFact(getMedicalFact());
    setQuote(getMedicalQuote());
    setTip(getHealthcareTip());
  };
  
  // Trigger confetti animation
  const triggerAnimation = () => {
    setShowConfetti(true);
    
    // Launch confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4A9270', '#6AB187', '#E09F5A', '#2D3C35'],
      disableForReducedMotion: true
    });
    
    setTimeout(() => setShowConfetti(false), 2000);
  };
  
  // Like a meme
  const likeMeme = (id: string) => {
    setMemes(prev => prev.map(meme => 
      meme.id === id ? { ...meme, likes: meme.likes + 1 } : meme
    ));
    triggerAnimation();
    // Removed toast notification that was intrusive
    // funToasts.showJoke(toast);
  };
  
  // Unlock a locked achievement (for demo purposes)
  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === id ? { ...achievement, unlocked: true, date: new Date() } : achievement
    ));
    triggerAnimation();
    // Removed toast notification that was intrusive
    // funToasts.showFact(toast);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Doctor's Lounge</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={refreshContent}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Content
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PicassoAvatar
                name={getUserFirstName()}
                illustrationType="healing"
                size="sm"
                color="text-primary"
              />
              Welcome, Dr. {getUserFirstName()}!
            </CardTitle>
            <CardDescription>
              Take a break and enjoy some content curated just for healthcare professionals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              "{quote}"
            </p>
          </CardContent>
        </Card>
        
        {/* Daily Tip Card */}
        <Card className="bg-green-100 border-green-200 shadow-md">
          <CardHeader className="pb-2 bg-green-200 border-b border-green-300">
            <CardTitle className="text-base flex items-center gap-2 text-green-800">
              <Coffee className="h-5 w-5 text-green-700" />
              Healthcare Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-sm text-green-800 font-medium">{tip}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-green-700 hover:text-green-900 hover:bg-green-200 ml-auto"
              onClick={() => setTip(getHealthcareTip())}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              New Tip
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="daily" className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Daily Content</span>
            <span className="sm:hidden">Daily</span>
          </TabsTrigger>
          <TabsTrigger value="memes" className="flex items-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:shadow-md">
            <Sparkles className="h-4 w-4" />
            <span>Memes</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:shadow-md">
            <Trophy className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-md">
            <Users className="h-4 w-4" />
            <span>Community</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Daily Content Tab */}
        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical Fact Card */}
            <Card className="bg-blue-100 border-blue-200 shadow-md">
              <CardHeader className="pb-2 bg-blue-200 border-b border-blue-300">
                <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                  <Brain className="h-5 w-5 text-blue-700" />
                  Did You Know?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-blue-800 font-medium">{fact}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-200 ml-auto"
                  onClick={() => setFact(getMedicalFact())}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Fact
                </Button>
              </CardFooter>
            </Card>
            
            {/* Medical Joke Card */}
            <Card className="bg-amber-100 border-amber-200 shadow-md">
              <CardHeader className="pb-2 bg-amber-200 border-b border-amber-300">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <Sparkles className="h-5 w-5 text-amber-700" />
                  Medical Humor
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-amber-800 font-medium">{joke}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-200 ml-auto"
                  onClick={() => setJoke(getMedicalJoke())}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Joke
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Featured Content */}
          <Card className="bg-purple-50 border-purple-100 shadow-md">
            <CardHeader className="bg-purple-100 border-b border-purple-200">
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-700" />
                Featured Article
              </CardTitle>
              <CardDescription className="text-purple-700">
                Latest research and insights for healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-purple-100 rounded-md w-full md:w-1/3 h-40 flex items-center justify-center shadow-sm">
                  <PicassoIllustration
                    name="brain"
                    size="md"
                    color="text-purple-700"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-lg font-medium mb-2 text-purple-900">Advances in AI-Assisted Diagnostics</h3>
                  <p className="text-purple-800 text-sm mb-4">
                    Recent developments in machine learning are revolutionizing how physicians approach complex cases, 
                    with new models showing unprecedented accuracy in early detection.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 border-purple-300 text-purple-800 hover:bg-purple-100 hover:text-purple-900">
                    <BookOpen className="h-4 w-4" />
                    Read Article
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Memes Tab */}
        <TabsContent value="memes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memes.map(meme => (
              <Card key={meme.id} className="overflow-hidden bg-amber-50 border-amber-100 shadow-md">
                <div className="bg-amber-100 h-48 flex items-center justify-center">
                  <img 
                    src={meme.imageUrl} 
                    alt={meme.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2 border-b border-amber-200">
                  <CardTitle className="text-base text-amber-900">{meme.title}</CardTitle>
                  <CardDescription className="text-amber-700">{meme.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between bg-amber-50 pt-3">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                      onClick={() => likeMeme(meme.id)}
                    >
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{meme.likes}</span>
                    </Button>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{meme.comments}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 hover:text-amber-900">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900">
              <Sparkles className="h-4 w-4" />
              Load More Memes
            </Button>
          </div>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-green-50 border-green-100 shadow-md">
            <CardHeader className="bg-green-100 border-b border-green-200">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-700" />
                Your Achievements
              </CardTitle>
              <CardDescription className="text-green-700">
                Track your progress and earn recognition for your work
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`flex items-start gap-4 p-3 rounded-lg border shadow-sm ${
                      achievement.unlocked 
                        ? 'bg-green-100 border-green-200' 
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className={`rounded-full p-2 ${
                      achievement.unlocked 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-green-900' : 'text-gray-700'
                        }`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && achievement.date && (
                          <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            {achievement.date.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.description}
                      </p>
                      
                      {/* Progress bar for achievements with progress */}
                      {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                        <div className="mt-2">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${achievement.unlocked ? 'bg-green-500' : 'bg-green-300'}`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                            {!achievement.unlocked && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 text-xs py-0 px-2 text-green-700 hover:bg-green-100"
                                onClick={() => unlockAchievement(achievement.id)}
                              >
                                Unlock (Demo)
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Community Tab */}
        <TabsContent value="community" className="space-y-4">
          <Card className="bg-blue-50 border-blue-100 shadow-md">
            <CardHeader className="bg-blue-100 border-b border-blue-200">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-700" />
                Healthcare Community
              </CardTitle>
              <CardDescription className="text-blue-700">
                Connect with other healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-blue-100 p-6 rounded-full mb-4 shadow-inner">
                  <PicassoIllustration
                    name="healing"
                    size="lg"
                    color="text-blue-700"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2 text-blue-900">Coming Soon!</h3>
                <p className="text-blue-800 max-w-md mb-4">
                  We're building a community platform for healthcare professionals to connect, 
                  share insights, and collaborate on complex cases.
                </p>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="h-4 w-4" />
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorsLounge;
