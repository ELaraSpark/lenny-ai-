
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const AnalyticsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="md:flex items-center">
          <motion.div 
            className="md:w-1/2 md:pr-12 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-medical-green/10 text-medical-green mb-4">
              Data Insights
            </span>
            <h2 className="text-3xl font-bold mb-4">
              Powerful Analytics
            </h2>
            <p className="text-muted-foreground mb-6">
              Track patient outcomes, monitor clinical patterns, and gain valuable insights with our comprehensive analytics tools.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-medical-green mr-3" />
                <span>Patient outcome tracking</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-medical-green mr-3" />
                <span>Consultation analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-medical-green mr-3" />
                <span>Condition trends and insights</span>
              </li>
            </ul>
            <Link to="/analytics">
              <Button className="bg-medical-green hover:bg-medical-green/90">
                <span>Explore Analytics</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <img 
                src="/placeholder.svg" 
                alt="Analytics Dashboard" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
