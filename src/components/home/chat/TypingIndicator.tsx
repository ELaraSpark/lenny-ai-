
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2 text-gray-400 text-sm ml-10"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-teal opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-medical-teal"></span>
      </span>
      <p>Typing...</p>
    </motion.div>
  );
};

export default TypingIndicator;
