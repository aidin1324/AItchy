// src/components/PageHeader.tsx
import React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, BarChart2, User } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  onCreateNote: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onCreateNote }) => {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onCreateNote}
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-full flex items-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Новая запись
      </motion.button>

      <div className="flex space-x-4">
        <div className="relative group">
          <Link to="/home">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-full"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Home
          </span>
        </div>

        <div className="relative group">
          <Link to="/stats">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-4 rounded-full"
            >
              <BarChart2 className="w-5 h-5" />
            </motion.button>
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Dashboard
          </span>
        </div>

        <div className="relative group">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-full"
          >
            <User className="w-5 h-5" />
          </motion.button>
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Profile
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
