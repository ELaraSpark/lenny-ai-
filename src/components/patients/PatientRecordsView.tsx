
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserPlus, FileText, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import components
import PatientCard from "./PatientCard";
import PatientRecordsDialog from "./PatientRecordsDialog";
import NewPatientForm, { NewPatientFormValues } from "./NewPatientForm";
import NewConsultationForm, { NewConsultationFormValues } from "./NewConsultationForm";
import { PatientData, patients as initialPatients } from "./patientTypes";

const PatientRecordsView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  const [viewRecordsDialogOpen, setViewRecordsDialogOpen] = useState(false);
  const [newConsultationDialogOpen, setNewConsultationDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [localPatients, setLocalPatients] = useState(initialPatients);

  const filteredPatients = localPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onNewPatientSubmit = (data: NewPatientFormValues) => {
    // Add a new patient to the local state
    const newPatient: PatientData = {
      id: `p${localPatients.length + 1}`,
      name: data.name,
      age: data.age,
      gender: data.gender,
      condition: data.condition,
      lastVisit: new Date().toISOString().split('T')[0],
      status: data.status,
      doctor: data.doctor,
    };
    
    setLocalPatients([...localPatients, newPatient]);
    setNewPatientDialogOpen(false);
    
    toast({
      title: "Patient Added",
      description: `${data.name} has been added to your patient records.`,
    });
  };

  const onNewConsultationSubmit = (data: NewConsultationFormValues) => {
    if (!selectedPatient) return;
    
    // In a real app, we would add the consultation to the database
    // For now, we'll just show a toast
    
    toast({
      title: "Consultation Scheduled",
      description: `A ${data.consultationType} consultation has been scheduled with ${selectedPatient.name} on ${data.date} at ${data.time}.`,
    });
    
    setNewConsultationDialogOpen(false);
  };

  const handleViewRecords = (patient: PatientData) => {
    setSelectedPatient(patient);
    setViewRecordsDialogOpen(true);
  };

  const handleNewConsultation = (patient: PatientData) => {
    setSelectedPatient(patient);
    setNewConsultationDialogOpen(true);
  };
  
  return (
    // Apply consistent panel styling to the main container
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-6"> 
      {/* Remove panel styling from inner header */}
      <header className="space-y-2"> 
        <motion.h1 
          className="text-3xl font-bold text-gray-900" // Adjusted color for consistency
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Patient Records
        </motion.h1>
        <motion.p 
          className="text-slate-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Manage and view your patient health records
        </motion.p>
      </header>

      {/* Remove panel styling from search/action section */}
      <motion.div
        className="flex items-center justify-between space-y-0" 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
          <Input 
            className="pl-10 border-blue-100 focus:border-blue-300 focus:ring-blue-200" 
            placeholder="Search patients by name or condition..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={newPatientDialogOpen} onOpenChange={setNewPatientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <NewPatientForm 
              onSubmit={onNewPatientSubmit} 
              onCancel={() => setNewPatientDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          // Removed panel styling from TabsList container
        >
          <TabsList className="grid grid-cols-4 md:w-[600px]"> {/* Removed bg-blue-50 */}
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" // Use primary theme colors
            >
              All Patients
            </TabsTrigger>
            <TabsTrigger 
              value="critical"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" // Use primary theme colors
            >
              Critical
            </TabsTrigger>
            <TabsTrigger 
              value="stable"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" // Use primary theme colors
            >
              Stable
            </TabsTrigger>
            <TabsTrigger 
              value="recent"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" // Use primary theme colors
            >
              Recent Visits
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {filteredPatients.map((patient, index) => (
              <PatientCard 
                key={patient.id} 
                patient={patient} 
                delay={0.1 * index}
                onViewRecords={() => handleViewRecords(patient)}
                onNewConsultation={() => handleNewConsultation(patient)}
              />
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-blue-50">
                <FileText className="h-12 w-12 text-blue-200 mx-auto mb-3" />
                <p className="text-slate-500">No patients found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setNewPatientDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add a new patient
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {filteredPatients
              .filter(p => p.status === "Critical")
              .map((patient, index) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  delay={0.1 * index}
                  onViewRecords={() => handleViewRecords(patient)}
                  onNewConsultation={() => handleNewConsultation(patient)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stable" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {filteredPatients
              .filter(p => p.status === "Stable")
              .map((patient, index) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  delay={0.1 * index}
                  onViewRecords={() => handleViewRecords(patient)}
                  onNewConsultation={() => handleNewConsultation(patient)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {filteredPatients
              .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
              .slice(0, 5)
              .map((patient, index) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  delay={0.1 * index}
                  onViewRecords={() => handleViewRecords(patient)}
                  onNewConsultation={() => handleNewConsultation(patient)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Patient Records Dialog */}
      <Dialog open={viewRecordsDialogOpen} onOpenChange={setViewRecordsDialogOpen}>
        <PatientRecordsDialog 
          patient={selectedPatient} 
          onClose={() => setViewRecordsDialogOpen(false)} 
        />
      </Dialog>

      {/* New Consultation Dialog */}
      <Dialog open={newConsultationDialogOpen} onOpenChange={setNewConsultationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <NewConsultationForm 
            onSubmit={onNewConsultationSubmit} 
            onCancel={() => setNewConsultationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRecordsView;
