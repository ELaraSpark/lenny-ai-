
import React from "react";
import { 
  UserPlus, 
  Users, 
  Heart,
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../StatsCard";

const PatientsTab = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="New Patients (30 days)" 
          value="124" 
          change={"+8.3%"} 
          trend="up"
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatsCard 
          title="Returning Patients" 
          value="876" 
          change={"+3.2%"} 
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard 
          title="Patient Satisfaction" 
          value="94%" 
          change={"+1.5%"} 
          trend="up"
          icon={<Heart className="h-5 w-5" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
          <CardDescription>Age distribution of patients</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              { age: '0-18', male: 65, female: 85 },
              { age: '19-35', male: 125, female: 168 },
              { age: '36-50', male: 187, female: 205 },
              { age: '51-65', male: 156, female: 148 },
              { age: '66+', male: 95, female: 107 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" name="Male" fill="#3b82f6" />
              <Bar dataKey="female" name="Female" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsTab;
