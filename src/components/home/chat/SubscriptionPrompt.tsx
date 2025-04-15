
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SubscriptionPrompt = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-4 p-3 bg-gradient-to-r from-medical-teal/10 to-medical-blue/10 rounded-lg"
    >
      <p className="text-sm font-medium mb-2">
        You've reached the preview limit!
      </p>
      <p className="text-xs text-gray-600 mb-3">
        Subscribe to continue chatting with our health assistants and access
        personalized health advice.
      </p>
      <div className="flex gap-2">
        <Link to="/register" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-medical-teal to-medical-blue hover:opacity-90 text-white">
            Subscribe Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default SubscriptionPrompt;
