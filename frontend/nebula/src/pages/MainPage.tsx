import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Info } from "lucide-react";
import StarryBackground from "../components/StarryBackground";
import AIGradient from "../components/AIGradient";
import Tooltip from "../components/Tooltip";
import RegisterModal from "../components/main/RegisterModal";

const MainPage: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const descriptionTexts = [
    "Отслеживайте настроение",
    "Анализируйте эмоции",
    "Улучшайте самочувствие",
    "AI-инсайты",
    "Персонализация",
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-between p-8 overflow-hidden relative">
      <StarryBackground />

      {/* Floating description texts */}
      {descriptionTexts.map((text, index) => (
        <motion.div
          key={index}
          className="absolute text-white text-opacity-10 pointer-events-none select-none text-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 0.5,
            scale: 1,
            x: `${Math.random() * 100 - 50}vw`,
            y: `${Math.random() * 100 - 50}vh`,
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        >
          {text}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-white flex items-center"
        >
          <AIGradient />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white text-center text-lg"
        >
          Ваш AI-помощник для отслеживания настроения и улучшения эмоционального
          благополучия
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 w-full"
        >
          <div className="grid grid-cols-1 gap-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center text-white transform transition-all duration-300"
              >
                <UserPlus className="mr-2" size={24} />
                <span className="text-lg font-medium">Регистрация</span>
              </motion.button>
            <Link to="/login" className="w-full">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg flex items-center justify-center text-white transform transition-all duration-300"
              >
                <LogIn className="mr-2" size={24} />
                <span className="text-lg font-medium">Вход</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-auto pt-8"
      >
        <Link to="/about">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="text-white opacity-80 hover:opacity-100 transition-opacity duration-300 flex items-center"
          >
            <Info className="mr-2" size={18} />
            <span>Узнать больше о AItchy</span>
          </motion.button>
        </Link>
      </motion.div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default MainPage;
