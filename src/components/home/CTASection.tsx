import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PicassoIllustration } from '@/components/illustrations';
import { PicassoBackground } from '@/components/illustrations/PicassoBackground';
import { ArrowRight, Check } from 'lucide-react';

const CTASection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleDemoClick = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-6 text-center overflow-hidden">
      <PicassoBackground opacity={8} /> 
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-8 flex justify-center"
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <PicassoIllustration name="chat" size="xl" className="text-accent" /> 
        </motion.div>
        
        <motion.h2 
          className="text-4xl font-bold mb-6 leading-tight text-gray-900"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Ready to transform your healthcare experience?
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-600 mb-10 leading-relaxed font-handwritten"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Our AI agents are available 24/7 to assist with your medical questions and needs.
        </motion.p>
        
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-lg px-8 py-4 shadow-lg"> 
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
          
          <AnimatePresence>
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-100 text-green-800 px-6 py-4 rounded-lg flex items-center"
              >
                <Check className="mr-2 h-5 w-5" />
                <span>Demo request sent!</span>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="text-base font-semibold rounded-lg px-8 py-4 border-2"
                  onClick={handleDemoClick}
                > 
                  Request Demo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="mt-10 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          No credit card required • Free 14-day trial • Cancel anytime
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
