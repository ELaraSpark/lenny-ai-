import { motion } from 'framer-motion';
import React from 'react'; // Import React for FC type
import { PicassoIllustration } from '@/components/illustrations/PicassoIllustration'; // Use named import
import { PicassoBackground } from '@/components/illustrations/PicassoBackground'; // Use named import

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  const variants = {
    visible: { opacity: 1, maxHeight: '500px' }, // Target height (adjust if needed)
    hidden: { opacity: 0, maxHeight: 0 }
  };

  return (
    // Apply motion directly to the section, control animation via 'animate' prop
    <motion.section 
      // Removed padding from motion.section
      variants={variants}
      animate={isVisible ? "visible" : "hidden"} // Control state via prop
      transition={{ duration: 0.4, ease: "easeOut" }} // Keep adjusted duration/easing
      className="relative" // Add relative positioning for background
      style={{ overflow: 'hidden' }} 
    >
      {/* Add Picasso Background with white background */}
      <PicassoBackground className="bg-[#FFFFFF]" /> 
      
      {/* Add subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-pattern-dots"></div>
      </div>
      
      {/* Apply padding to this inner container instead */}
      <div className="relative z-10 py-12 md:py-16 container mx-auto px-6 text-center max-w-4xl"> 
        {/* Inner content div */}
        <div className="mb-8">
          {/* Title with inline icon */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/illustrations/animation.webp" 
              alt="Animation" 
              className="h-24 w-24 object-contain"
            />
            {/* Adjusted font size for mobile */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-primary">
              Be Free Again.
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-6 leading-relaxed font-handwritten"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Get an AI Sidekick. Work Like a Superhuman.
          </motion.p>
        </div>
        
        {/* Removed large illustration from here */}
      </div>
    </motion.section>
  );
};

export default HeroSection;
