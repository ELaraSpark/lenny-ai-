
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Activity, Pill } from "lucide-react";

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  status: string;
  doctor: string;
}

interface PatientRecordsDialogProps {
  patient: PatientData | null;
  onClose: () => void;
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PatientRecordsDialog = ({ patient, onClose }: PatientRecordsDialogProps) => {
  if (!patient) return null;

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Patient Records: {patient.name}</DialogTitle>
        <DialogDescription>
          Complete medical history and records
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {patient.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-muted-foreground">
              {patient.age} years • {patient.gender} • Patient ID: {patient.id}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-medical-red mr-2" />
                      <span>{patient.condition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Care Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>DC</AvatarFallback>
                      </Avatar>
                      <span>{patient.doctor} (Primary)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-medical-green pl-4 pb-4 relative">
                    <div className="w-3 h-3 rounded-full bg-medical-green absolute -left-[7px] top-0"></div>
                    <p className="font-medium">{formatDate(patient.lastVisit)}</p>
                    <p className="text-sm text-muted-foreground">Regular check-up with {patient.doctor}</p>
                    <p className="text-sm mt-1">
                      Blood pressure: 130/85 mmHg, Heart rate: 72 bpm
                    </p>
                  </div>
                  <div className="border-l-2 border-muted pl-4 relative">
                    <div className="w-3 h-3 rounded-full bg-muted absolute -left-[7px] top-0"></div>
                    <p className="font-medium">{formatDate(new Date(new Date(patient.lastVisit).getTime() - 30*24*60*60*1000).toISOString())}</p>
                    <p className="text-sm text-muted-foreground">Follow-up with {patient.doctor}</p>
                    <p className="text-sm mt-1">
                      Discussed medication adjustments and symptom management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vitals" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs History</CardTitle>
                <DialogDescription>
                  Recent measurements and trends
                </DialogDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Blood Pressure
                    </h3>
                    <div className="h-[200px] mt-2">
                      {/* Placeholder for blood pressure chart */}
                      <div className="w-full h-full bg-slate-100 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Blood pressure chart will be displayed here
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Heart Rate
                    </h3>
                    <div className="h-[200px] mt-2">
                      {/* Placeholder for heart rate chart */}
                      <div className="w-full h-full bg-slate-100 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Heart rate chart will be displayed here
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medications" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
                <DialogDescription>
                  Active prescriptions and dosage
                </DialogDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 border rounded-md">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lisinopril</h3>
                      <p className="text-sm text-muted-foreground">10mg, once daily</p>
                      <p className="text-xs mt-1">For hypertension management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-3 border rounded-md">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Pill className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Metformin</h3>
                      <p className="text-sm text-muted-foreground">500mg, twice daily</p>
                      <p className="text-xs mt-1">For diabetes management</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lab-results" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
                <DialogDescription>
                  Latest diagnostic findings
                </DialogDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Complete Blood Count (CBC)</h3>
                    <p className="text-xs text-muted-foreground">Performed on {formatDate(patient.lastVisit)}</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>White Blood Cells (WBC)</span>
                        <span>8.3 x10^9/L</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Red Blood Cells (RBC)</span>
                        <span>4.9 x10^12/L</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Hemoglobin (Hgb)</span>
                        <span>13.2 g/dL</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium">Lipid Panel</h3>
                    <p className="text-xs text-muted-foreground">Performed on {formatDate(new Date(new Date(patient.lastVisit).getTime() - 5*24*60*60*1000).toISOString())}</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Total Cholesterol</span>
                        <span>195 mg/dL</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>HDL Cholesterol</span>
                        <span>45 mg/dL</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>LDL Cholesterol</span>
                        <span>125 mg/dL</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Triglycerides</span>
                        <span>150 mg/dL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
          Generate Report
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PatientRecordsDialog;
