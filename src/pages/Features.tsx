
import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  HeartPulse, 
  Users, 
  ShieldCheck, 
  FileText, 
  Phone,
  Bot,
  Microscope,
  BarChart4,
  Zap,
  Clock,
  Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";

// Feature data
const features = [
  {
    title: "AI-Powered Medical Agents",
    description: "Specialized AI assistants with expertise in different medical specialties to provide insights, recommendations, and decision support.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Smart Diagnostic Support",
    description: "Leverage AI to assist in diagnostic processes, identify potential conditions, and suggest relevant follow-up questions.",
    icon: Microscope,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Patient Data Analytics",
    description: "Comprehensive analysis of patient data to identify trends, risks, and potential treatment options based on medical evidence.",
    icon: BarChart4,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Follow-up Scheduler",
    description: "Automated system for scheduling and managing patient follow-ups, with AI-generated questions tailored to each case.",
    icon: Phone,
    color: "text-amber-500", 
    bgColor: "bg-amber-50",
  },
  {
    title: "Comprehensive Medical Records",
    description: "Intuitive electronic health records that organize patient information for easy access and review, with AI-powered insights.",
    icon: FileText,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Healthcare Team Collaboration",
    description: "Secure platform for healthcare professionals to collaborate on cases, share insights, and conduct virtual consultations.",
    icon: Users,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  {
    title: "Real-time Medical Insights",
    description: "Access to up-to-date medical information and research findings, integrated directly into your workflow.",
    icon: Zap,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
  {
    title: "Patient Health Monitoring",
    description: "Track patient health metrics over time with visual indicators of progress and potential areas of concern.",
    icon: HeartPulse,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "24/7 Virtual Assistant",
    description: "Always-available AI support for answering medical questions and providing guidance at any time of day.",
    icon: Bot,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
  },
  {
    title: "Efficient Time Management",
    description: "Streamline administrative tasks and documentation, allowing more time for direct patient care.",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Privacy & Security",
    description: "Enterprise-grade security with end-to-end encryption and HIPAA-compliant data handling to protect sensitive patient information.",
    icon: Lock,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
  },
  {
    title: "Regulatory Compliance",
    description: "Built to meet healthcare regulations and compliance requirements across different jurisdictions.",
    icon: ShieldCheck,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

// Feature section component
const FeatureCard = ({ title, description, icon: Icon, color, bgColor }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow border border-gray-100">
      <CardContent className="p-6">
        <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={`${color} h-6 w-6`} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Powerful Features for Modern Healthcare</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            LENY-AI combines cutting-edge artificial intelligence with medical expertise to enhance 
            your practice and improve patient outcomes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-aida-500 to-medical-purple p-12 rounded-2xl text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to transform your practice?</h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who are already using LENY-AI to enhance patient care and streamline their workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Request a Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
};

export default Features;
