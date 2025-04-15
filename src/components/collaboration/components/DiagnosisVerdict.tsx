
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Diagnosis, Message } from "../types/consultationTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisVerdictProps {
  diagnoses: Diagnosis[];
  messages: Message[];
  patientSymptoms: string;
  refreshVerdict: () => void;
  isRefreshing: boolean;
}

interface AIVerdict {
  fullText: string;
  consensusDiagnosis: string;
  agreementAnalysis: string;
  recommendations: string;
  nextSteps: string;
  timestamp: string;
}

const DiagnosisVerdict = ({ diagnoses, messages, patientSymptoms, refreshVerdict, isRefreshing }: DiagnosisVerdictProps) => {
  const [loading, setLoading] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<AIVerdict | null>(null);
  
  // Track unique specialists by ID
  const uniqueSpecialists = [...new Set(diagnoses.map(d => d.agentId))];
  
  // Group diagnoses by specialist to show most recent opinion per specialist
  const specialistLatestDiagnoses = uniqueSpecialists.map(specialistId => {
    const specialistDiagnoses = diagnoses.filter(d => d.agentId === specialistId);
    return specialistDiagnoses[specialistDiagnoses.length - 1]; // Get most recent
  });
  
  // Generate AI verdict when diagnoses change
  useEffect(() => {
    const generateVerdict = async () => {
      if (diagnoses.length === 0 || loading) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-consultation-verdict', {
          body: {
            diagnoses: specialistLatestDiagnoses,
            messages,
            symptoms: patientSymptoms
          }
        });
        
        if (error) throw error;
        
        setAiVerdict(data);
      } catch (error) {
        console.error("Error generating AI verdict:", error);
      } finally {
        setLoading(false);
      }
    };
    
    generateVerdict();
  }, [diagnoses.length, messages.length]);
  
  // Handler for manual refresh
  const handleRefreshVerdict = () => {
    refreshVerdict();
    setLoading(true);
    
    // Re-generate verdict
    supabase.functions.invoke('generate-consultation-verdict', {
      body: {
        diagnoses: specialistLatestDiagnoses,
        messages,
        symptoms: patientSymptoms
      }
    }).then(({ data, error }) => {
      if (error) {
        console.error("Error refreshing verdict:", error);
      } else {
        setAiVerdict(data);
      }
      setLoading(false);
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Collaborative Diagnosis
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshVerdict}
            disabled={loading || isRefreshing || diagnoses.length === 0}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading || isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Verdict
          </Button>
        </div>
        <CardDescription>
          Integrated diagnosis from {uniqueSpecialists.length} specialist{uniqueSpecialists.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Verdict Section */}
        {(loading || isRefreshing) ? (
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ) : aiVerdict ? (
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI-Synthesized Verdict</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-base mb-1">Consensus Diagnosis</h3>
                <p className="text-sm">{aiVerdict.consensusDiagnosis}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base mb-1">Agreement Analysis</h3>
                <p className="text-sm">{aiVerdict.agreementAnalysis}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base mb-1">Integrated Recommendations</h3>
                <p className="text-sm">{aiVerdict.recommendations}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base mb-1">Suggested Next Steps</h3>
                <p className="text-sm">{aiVerdict.nextSteps}</p>
              </div>
            </CardContent>
          </Card>
        ) : diagnoses.length > 0 ? (
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardContent className="py-6 text-center">
              <p>Loading AI verdict...</p>
            </CardContent>
          </Card>
        ) : null}
        
        {/* Individual Specialist Opinions */}
        <h3 className="font-medium text-lg mt-6 mb-4">Individual Specialist Opinions</h3>
        <div className="space-y-4">
          {specialistLatestDiagnoses.map((diagnosis, index) => (
            <Card key={`${diagnosis.agentId}-${index}`} className="bg-slate-50 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{diagnosis.agentName}</CardTitle>
                  <Badge variant="outline">{diagnosis.specialty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3 pt-0">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Diagnosis:</span> {diagnosis.diagnosis}
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span> {diagnosis.confidence}%
                  </div>
                  <div>
                    <span className="font-medium">Recommendation:</span> {diagnosis.recommendation}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisVerdict;
