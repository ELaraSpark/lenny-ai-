import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, FileBadge, Info } from 'lucide-react';

interface SecurityBadgeProps {
  icon: React.ReactNode;
  text: string;
  description: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ icon, text, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="flex flex-col items-center gap-2 p-4 rounded-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-1"
        animate={{ 
          rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          size: 24, 
          className: "text-primary" 
        })}
      </motion.div>
      <span className="text-sm font-medium text-gray-800">{text}</span>
      
      {/* Tooltip */}
      <motion.div 
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-white p-3 rounded-lg shadow-lg text-xs text-gray-600 w-48 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
        <div className="relative z-10">
          <Info size={12} className="inline-block mr-1 text-primary" />
          {description}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SecurityBanner = () => {
  const badges = [
    { 
      icon: <ShieldCheck />, 
      text: "HIPAA Compliant", 
      description: "All data is processed in compliance with HIPAA regulations to ensure patient privacy."
    },
    { 
      icon: <Lock />, 
      text: "End-to-End Encryption", 
      description: "Your data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    { 
      icon: <FileBadge />, 
      text: "SOC 2 Certified", 
      description: "Our platform has been audited and certified for security, availability, and confidentiality."
    },
  ];

  return (
    <motion.section 
      className="py-8 md:py-12 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-8 md:mt-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <motion.h3 
          className="text-center text-lg font-medium text-gray-700 mb-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Enterprise-Grade Security You Can Trust
        </motion.h3>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16 md:gap-24">
          {badges.map((badge, index) => (
            <SecurityBadge 
              key={index} 
              icon={badge.icon} 
              text={badge.text} 
              description={badge.description}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SecurityBanner;
