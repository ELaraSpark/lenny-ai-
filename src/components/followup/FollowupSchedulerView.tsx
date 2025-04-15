
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useActiveCallContext } from "./context/ActiveCallContext";
import ActiveCallIndicator from "./components/ActiveCallIndicator";
import ScheduleTab from "./tabs/ScheduleTab";
import UpcomingTab from "./tabs/UpcomingTab";
import ReportsTab from "./tabs/ReportsTab";

// Internal component to handle active call display
const ActiveCallManager = () => {
  const { activeCall, endCall } = useActiveCallContext();
  
  return (
    <AnimatePresence>
      {activeCall && (
        <ActiveCallIndicator 
          call={activeCall} 
          onEndCall={endCall} 
        />
      )}
    </AnimatePresence>
  );
};

const FollowupSchedulerView = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const { activeCall } = useActiveCallContext();
  
  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-6"> 
      <header className="space-y-2">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="h1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Patient Follow-up Scheduler
          </motion.h1>
          
          {activeCall && (
            <Link to="/followup-monitoring">
              <Button variant="outline" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Monitor Active Call
              </Button>
            </Link>
          )}
        </div>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Schedule AI agent follow-up calls with patients and generate comprehensive reports
        </motion.p>
      </header>

      <Tabs 
        defaultValue="schedule" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <TabsList className="grid grid-cols-3 md:w-[600px]">
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule New Follow-up
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Clock className="mr-2 h-4 w-4" />
              Upcoming Calls
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" />
              Follow-up Reports
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="schedule" className="space-y-4">
          <ScheduleTab />
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingTab />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ReportsTab />
        </TabsContent>
      </Tabs>
      
      <ActiveCallManager />
    </div>
  );
};

export default FollowupSchedulerView;
