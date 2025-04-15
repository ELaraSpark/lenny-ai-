
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Activity,
  Brain,
  ClipboardList,
  UserCircle,
  BarChart2,
  Clock,
  Zap
} from "lucide-react";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  colorClass: string;
  delay: number;
}

const QuickActionButton = ({ icon, label, to, colorClass, delay }: QuickActionButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col items-center"
    >
      <Link to={to} className="group">
        <motion.div 
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-sm group-hover:shadow-md bg-${colorClass}/10 text-${colorClass} border border-${colorClass}/20 group-hover:bg-${colorClass}/20`}
          whileHover={{ scale: 1.05, y: -3 }}
        >
          {icon}
        </motion.div>
        <p className="text-xs text-center font-medium text-gray-700">{label}</p>
      </Link>
    </motion.div>
  );
};

const RoundQuickActions = () => {
  const actions = [
    {
      icon: <Brain className="h-6 w-6" />,
      label: "AI Consult",
      to: "/agents",
      colorClass: "medical-purple",
      delay: 0.1
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Time Saver",
      to: "/features",
      colorClass: "medical-yellow",
      delay: 0.15
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: "Document",
      to: "/features",
      colorClass: "medical-green",
      delay: 0.2
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      label: "Schedule",
      to: "/followup-scheduler",
      colorClass: "medical-red",
      delay: 0.25
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      label: "Patient Records",
      to: "/patient-records",
      colorClass: "medical-purple",
      delay: 0.3
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      label: "Collaborate",
      to: "/collaboration",
      colorClass: "medical-green",
      delay: 0.35
    },
    {
      icon: <Activity className="h-6 w-6" />,
      label: "Monitor",
      to: "/followup-monitoring",
      colorClass: "medical-red",
      delay: 0.4
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      label: "Analytics",
      to: "/analytics",
      colorClass: "medical-yellow",
      delay: 0.45
    }
  ];

  return (
    <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-5 border border-blue-50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
            {actions.map((action, index) => (
              <QuickActionButton
                key={index}
                icon={action.icon}
                label={action.label}
                to={action.to}
                colorClass={action.colorClass}
                delay={action.delay}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoundQuickActions;
