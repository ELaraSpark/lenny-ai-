
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users,
  Calendar,
  Share,
} from "lucide-react";
import CollaborativeConsultation from "./CollaborativeConsultation";
import { colleagues, meetings, sharedCases } from "./data/collaborationData";
import ColleagueCard from "./components/ColleagueCard";
import MeetingCard from "./components/MeetingCard";
import SharedCaseCard from "./components/SharedCaseCard";
import { Agent } from "./types/consultationTypes";

interface CollaborationViewProps {
  initialConsultationId?: string;
  preSelectedAgent?: Agent;
}

const CollaborationView = ({ initialConsultationId, preSelectedAgent }: CollaborationViewProps = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ai-collaboration");

  // Use the initialConsultationId and preSelectedAgent if provided
  useEffect(() => {
    if (initialConsultationId || preSelectedAgent) {
      setActiveTab("ai-collaboration");
    }
  }, [initialConsultationId, preSelectedAgent]);

  const filteredColleagues = colleagues.filter(colleague => 
    colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    colleague.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <motion.h1 
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Collaboration Hub
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Connect with colleagues, AI specialists, and share patient cases
        </motion.p>
      </header>

      <motion.div
        className="flex items-center justify-between gap-4 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Search colleagues, meetings, or cases..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 ml-auto">
          <Button className="font-medium">
            New Collaboration
          </Button>
        </div>
      </motion.div>

      <Tabs 
        defaultValue="ai-collaboration" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <TabsList className="grid grid-cols-3 md:w-[500px] mb-6">
            <TabsTrigger value="ai-collaboration" className="py-3">
              AI Collaboration
            </TabsTrigger>
            <TabsTrigger value="colleagues" className="py-3">
              <Users className="mr-2 h-4 w-4 hidden sm:block" />
              Colleagues
            </TabsTrigger>
            <TabsTrigger value="shared" className="py-3">
              <Share className="mr-2 h-4 w-4 hidden sm:block" />
              Cases
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="ai-collaboration" className="space-y-4">
          <CollaborativeConsultation 
            initialConsultationId={initialConsultationId}
            preSelectedAgent={preSelectedAgent}
          />
        </TabsContent>

        <TabsContent value="colleagues" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Your Colleagues</h2>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredColleagues.map((colleague, index) => (
              <ColleagueCard 
                key={colleague.id} 
                colleague={colleague} 
                delay={0.1 * index}
              />
            ))}
            {filteredColleagues.length === 0 && (
              <div className="text-center py-10 col-span-3">
                <p className="text-muted-foreground">No colleagues found matching your search criteria.</p>
              </div>
            )}
          </div>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Meetings</CardTitle>
              <CardDescription>Your scheduled meetings with colleagues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.slice(0, 2).map((meeting, index) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    delay={0.1 * index}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Shared Patient Cases</h2>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share New Case
            </Button>
          </div>
          
          <div className="grid gap-4">
            {sharedCases.map((sharedCase, index) => (
              <SharedCaseCard 
                key={sharedCase.id} 
                sharedCase={sharedCase} 
                delay={0.1 * index}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationView;
