
import { useState } from "react";
import { format } from "date-fns";
import { FileText, Download, Eye, ArrowUpDown, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for reports
const mockReports = [
  {
    id: "rep1",
    patientId: "p1",
    patientName: "Jane Doe",
    agentId: "cardio",
    agentName: "CardioAssist",
    callDate: new Date(Date.now() - 86400000), // yesterday
    callTime: "10:00",
    reportDate: new Date(Date.now() - 84600000), // yesterday + 30 min
    purpose: "Post-surgery check-in",
    summary: "Patient reports mild pain at incision site but otherwise recovering well. Following medication schedule appropriately. No concerns about wound healing.",
    recommendations: "Continue current medication regimen. Schedule in-person follow-up in 2 weeks. Patient should continue to monitor incision site for any changes.",
    sentiment: "positive",
  },
  {
    id: "rep2",
    patientId: "p4",
    patientName: "Robert Chen",
    agentId: "neuro",
    agentName: "NeuroLogic",
    callDate: new Date(Date.now() - 172800000), // two days ago
    callTime: "14:30",
    reportDate: new Date(Date.now() - 171000000), // two days ago + 30 min
    purpose: "Medication follow-up",
    summary: "Patient reports headache frequency has decreased from daily to 2-3 times per week. Some mild dizziness as a side effect of medication but patient considers this manageable.",
    recommendations: "Continue current medication for another week. If dizziness worsens or does not improve, consider dosage adjustment at next appointment.",
    sentiment: "neutral",
  },
  {
    id: "rep3",
    patientId: "p3",
    patientName: "Maria Garcia",
    agentId: "path",
    agentName: "PathInsight",
    callDate: new Date(Date.now() - 432000000), // five days ago
    callTime: "11:15",
    reportDate: new Date(Date.now() - 430200000), // five days ago + 30 min
    purpose: "Lab results discussion",
    summary: "Patient expressed concern about elevated cholesterol levels. Has not been following dietary recommendations consistently. Reports difficulty adjusting to new diet plan.",
    recommendations: "Schedule nutrition consultation. Provide additional educational materials on heart-healthy diets. Consider follow-up lipid panel in 3 months.",
    sentiment: "negative",
  },
];

const ReportsTab = () => {
  const [reports, setReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredReports = reports.filter(report => 
    report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === "date") {
      return sortDirection === "asc" 
        ? a.callDate.getTime() - b.callDate.getTime()
        : b.callDate.getTime() - a.callDate.getTime();
    }
    
    if (sortField === "patient") {
      return sortDirection === "asc"
        ? a.patientName.localeCompare(b.patientName)
        : b.patientName.localeCompare(a.patientName);
    }
    
    if (sortField === "agent") {
      return sortDirection === "asc"
        ? a.agentName.localeCompare(b.agentName)
        : b.agentName.localeCompare(a.agentName);
    }
    
    return 0;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "negative": return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
      default: return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Reports</CardTitle>
          <CardDescription>
            Review AI-generated reports from patient follow-up calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-medium"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-medium text-left"
                      onClick={() => handleSort("patient")}
                    >
                      Patient
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-medium text-left"
                      onClick={() => handleSort("agent")}
                    >
                      AI Agent
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReports.length > 0 ? (
                  sortedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {format(report.callDate, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {report.patientName}
                      </TableCell>
                      <TableCell>{report.agentName}</TableCell>
                      <TableCell>{report.purpose}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            getSentimentColor(report.sentiment)
                          )}
                        >
                          {report.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View report</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Follow-up Report</DialogTitle>
                              <DialogDescription>
                                {report.agentName}'s report for {report.patientName} on {format(report.callDate, "PPP")}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] rounded-md border p-4">
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-medium">Patient Information</h3>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                                      <p>{report.patientName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Patient ID</p>
                                      <p>{report.patientId}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Call Date & Time</p>
                                      <p>{format(report.callDate, "PPP")} at {report.callTime}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">AI Agent</p>
                                      <p>{report.agentName}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-medium">Follow-up Purpose</h3>
                                  <p className="mt-2">{report.purpose}</p>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-medium">Summary</h3>
                                  <p className="mt-2">{report.summary}</p>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-medium">Recommendations</h3>
                                  <p className="mt-2">{report.recommendations}</p>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-medium">Patient Sentiment Analysis</h3>
                                  <div className="mt-2">
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "text-sm px-2 py-1",
                                        getSentimentColor(report.sentiment)
                                      )}
                                    >
                                      {report.sentiment.charAt(0).toUpperCase() + report.sentiment.slice(1)}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-2">
                                      This sentiment analysis is based on the patient's tone, language, and overall disposition during the call.
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-medium">Report Details</h3>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Report ID</p>
                                      <p>{report.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Generated On</p>
                                      <p>{format(report.reportDate, "PPP 'at' h:mm a")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ScrollArea>
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" className="mr-2">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                              <Button>
                                Add to Patient Record
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download report</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for conditional classnames
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export default ReportsTab;
