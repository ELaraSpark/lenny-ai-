import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PicassoIllustration, IllustrationName } from '@/components/illustrations';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';

interface BenefitItemProps {
  illustrationName: IllustrationName;
  title: string;
  description: string;
  colorClass: string;
  delay: number;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ illustrationName, title, description, colorClass, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 ${isHovered ? 'shadow-md transform -translate-y-1' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-14 h-14 rounded-full ${colorClass.replace('text-', 'bg-')}/10 flex items-center justify-center flex-shrink-0 mb-4 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
        <PicassoIllustration name={illustrationName} size="md" className={colorClass} />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

const BenefitsSection = () => {
  const benefits: BenefitItemProps[] = [
    { 
      illustrationName: "healing", 
      title: "Save Time", 
      description: "Reduce documentation time by up to 70% with AI-assisted note taking and automated summaries.", 
      colorClass: "text-primary",
      delay: 0.1
    },
    { 
      illustrationName: "chart", 
      title: "Evidence-Based", 
      description: "Access the latest medical research and clinical guidelines to support your decision-making process.", 
      colorClass: "text-accent",
      delay: 0.2
    },
    { 
      illustrationName: "template", 
      title: "EHR Integration", 
      description: "Seamlessly connect with major electronic health record systems for efficient workflow integration.", 
      colorClass: "text-primary",
      delay: 0.3
    },
    { 
      illustrationName: "dna", 
      title: "HIPAA Compliant", 
      description: "Enterprise-grade security with end-to-end encryption and full HIPAA compliance for patient data.", 
      colorClass: "text-accent",
      delay: 0.4
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden"> 
      <PicassoBackground opacity={5} /> 
      <div className="relative z-10 container mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Why Choose <span className="text-primary">Leny AI</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform is designed specifically for healthcare professionals, with features that streamline your workflow and improve patient care.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitItem 
              key={index} 
              illustrationName={benefit.illustrationName} 
              title={benefit.title}
              description={benefit.description}
              colorClass={benefit.colorClass} 
              delay={benefit.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
