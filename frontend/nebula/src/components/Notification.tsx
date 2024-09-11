import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface NotificationProps {
  isVisible: boolean;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ isVisible, message }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <CheckCircle size={20} />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;