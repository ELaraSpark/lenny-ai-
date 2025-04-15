
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Calendar,
  FileText,
  Plus 
} from "lucide-react";

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

interface PatientCardProps {
  patient: PatientData;
  delay?: number;
  onViewRecords: () => void;
  onNewConsultation: () => void;
}

const PatientCard = ({ patient, delay = 0, onViewRecords, onNewConsultation }: PatientCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "text-medical-red bg-red-50";
      case "stable":
        return "text-medical-green bg-green-50";
      case "improving":
        return "text-aida-600 bg-blue-50";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="card-elevated gradient-card card-hover-lift">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-blue-100">
                <AvatarImage src={`/avatar-placeholder.jpg`} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                  {patient.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{patient.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {patient.age} years • {patient.gender} • Patient ID: {patient.id}
                </div>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(patient.status)}`}>
              {patient.status}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center text-sm">
              <Heart className="mr-2 h-4 w-4 text-medical-red" />
              <span className="font-medium mr-1">Conditions:</span> 
              <span className="text-muted-foreground">{patient.condition}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Last Visit:</span> 
              <span className="text-muted-foreground">{formatDate(patient.lastVisit)}</span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4" />
              <span className="font-medium mr-1">Assigned Doctor:</span> 
              <span className="text-muted-foreground">{patient.doctor}</span>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 border-blue-200 hover:bg-blue-50" onClick={onViewRecords}>
                <FileText className="mr-2 h-4 w-4" />
                View Records
              </Button>
              <Button size="sm" className="flex-1 gradient-btn-blue text-white" onClick={onNewConsultation}>
                <Plus className="mr-2 h-4 w-4" />
                New Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientCard;
