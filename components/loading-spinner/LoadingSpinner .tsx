// components/loading-spinner/LoadingSpinner.tsx
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div
      className="w-16 h-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full h-full border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
    </motion.div>
  );
};

export default LoadingSpinner;