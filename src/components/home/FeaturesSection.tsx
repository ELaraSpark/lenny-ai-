
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Activity, Users, CheckCircle, ArrowRight, Play, X } from "lucide-react";
import { PicassoIllustration } from "@/components/illustrations";

const FeatureCard = ({ 
  icon, 
  iconBgClass, 
  title, 
  description, 
  items, 
  linkTo, 
  delay,
  demoVideo
}: {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  description: string;
  items: string[];
  linkTo: string;
  delay: number;
  demoVideo?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <motion.div 
      className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 ${isHovered ? 'shadow-lg transform -translate-y-1' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className={`w-14 h-14 ${iconBgClass} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
        
        {demoVideo && (
          <motion.button
            className="absolute top-0 right-0 bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-1.5 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowVideo(true)}
          >
            <Play size={16} />
          </motion.button>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm">
        {description}
      </p>
      
      <ul className="space-y-2 mb-6">
        {items.map((item, i) => (
          <motion.li 
            key={i} 
            className="flex items-center text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + (i * 0.1) }}
          >
            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <span className="text-gray-700">{item}</span>
          </motion.li>
        ))}
      </ul>
      
      <Link to={linkTo}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </Link>
      
      {/* Demo Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1"
                onClick={() => setShowVideo(false)}
              >
                <X size={20} className="text-gray-800" />
              </button>
              
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {/* This would be a real video in production */}
                <div className="text-center p-8">
                  <PicassoIllustration name="chart" size="lg" className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">{title} Demo</h3>
                  <p className="text-gray-600">Video demonstration would play here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-medical-red" />,
      iconBgClass: "bg-medical-red/10",
      title: "Medical Documentation",
      description: "Generate discharge summaries, op notes, and clinical documentation with AI assistance.",
      items: ["Discharge Summaries", "Operative Notes", "Clinical Documentation"],
      linkTo: "/agents",
      delay: 0.1,
      demoVideo: "documentation-demo.mp4" // This would be a real video path in production
    },
    {
      icon: <Activity className="h-6 w-6 text-medical-purple" />,
      iconBgClass: "bg-medical-purple/10",
      title: "Follow-up Monitoring",
      description: "Automated follow-up calls and monitoring for patients with voice AI technology.",
      items: ["Voice AI Calling", "Patient Scheduling", "Live Call Monitoring"],
      linkTo: "/followup-scheduler",
      delay: 0.2,
      demoVideo: "followup-demo.mp4"
    },
    {
      icon: <Users className="h-6 w-6 text-medical-green" />,
      iconBgClass: "bg-medical-green/10",
      title: "Collaborative Consultation",
      description: "Collaborate with colleagues and AI Agents on complex cases and consultations.",
      items: ["AI Agent Consultation", "Case Sharing", "Diagnostic Assistance"],
      linkTo: "/collaboration",
      delay: 0.3,
      demoVideo: "collaboration-demo.mp4"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
          </motion.div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools designed specifically for healthcare professionals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
