
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, Calendar, Heart } from "lucide-react";

// Import the tab content components
import OverviewTab from "./tabs/OverviewTab";
import PatientsTab from "./tabs/PatientsTab";
import ConsultationsTab from "./tabs/ConsultationsTab";
import ConditionsTab from "./tabs/ConditionsTab";

const AnalyticsView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <motion.h1 
          className="h1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Detailed Analytics
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Comprehensive data insights for your medical practice
        </motion.p>
      </header>

      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="mr-2 h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="consultations">
              <Calendar className="mr-2 h-4 w-4" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="conditions">
              <Heart className="mr-2 h-4 w-4" />
              Medical Conditions
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="patients" className="space-y-4">
          <PatientsTab />
        </TabsContent>
        
        <TabsContent value="consultations" className="space-y-4">
          <ConsultationsTab />
        </TabsContent>
        
        <TabsContent value="conditions" className="space-y-4">
          <ConditionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
