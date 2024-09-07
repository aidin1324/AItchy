import React, { useState } from "react";
import { Sparkles, PenTool, BarChart2, User } from "lucide-react";
import { motion } from "framer-motion";
import CompactMoodModal from "../components/CompactMoodModal";
import CompactContextFactorsModal from "../components/CompactContextFactorsModal";
import EmotionSelector from "../components/EmotionSelector";
import { ContextFactor, MoodData, MoodEntry } from "../types/moodTypes";
import Modal from "../components/Modal";
import StarryBackground from "../components/StarryBackground";
import { Link } from "react-router-dom";
import Tooltip from "../components/Tooltip";

const HomePage: React.FC = () => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    generalWellbeing: 5,
    energyLevel: 5,
    stressLevel: 5,
    sleepQuality: 5,
    emotions: [],
    contextFactors: [],
  });

  const handleFirstModalSave = (data: MoodData) => {
    setMoodEntry((prev) => ({ ...prev, ...data }));
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  const handleSecondModalSave = () => {
    if (moodEntry.emotions.length < 3) {
      alert("Пожалуйста, выберите как минимум 3 эмоции");
      return;
    }
    setIsSecondModalOpen(false);
    setIsThirdModalOpen(true);
  };

  const handleThirdModalSave = (factors: ContextFactor[]) => {
    setMoodEntry((prev) => ({ ...prev, contextFactors: factors }));
    setIsThirdModalOpen(false);
    console.log("Отправка данных:", { ...moodEntry, contextFactors: factors });
  };

  const updateMoodEntry = (field: keyof MoodEntry, value: any) => {
    setMoodEntry((prev) => ({ ...prev, [field]: value }));
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <StarryBackground />
      <h1 className="select-none text-6xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white-600">
  Nebula
</h1>


      <div className="relative w-80 h-80">
        <div className="absolute inset-0 bg-purple-500 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-6">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsFirstModalOpen(true)}
              className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
            >
              <Sparkles className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Настроение</span>
            </motion.button>
            <Link to="/notes">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  /* navigate to /notes */
                }}
                className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
              >
                <PenTool className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">
                  Заметки
                </span>
              </motion.button>
            </Link>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                /* navigate to /dashboard */
              }}
              className="w-32 h-32 bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
            >
              <BarChart2 className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Статистика</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                /* navigate to /profile */
              }}
              className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
            >
              <User className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Профиль</span>
            </motion.button>
          </div>
        </div>
      </div>

      <CompactMoodModal
        isOpen={isFirstModalOpen}
        onClose={() => setIsFirstModalOpen(false)}
        onSave={handleFirstModalSave}
      />

      <Modal
        isOpen={isSecondModalOpen}
        onClose={() => setIsSecondModalOpen(false)}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Выберите ваши эмоции
        </h2>
        <p className="text-gray-600 mb-4 text-center text-sm">
          Выберите от 3 до 5 эмоций, которые вы испытывали сегодня
        </p>
        <EmotionSelector
          emotions={moodEntry.emotions}
          onEmotionChange={(emotions) => updateMoodEntry("emotions", emotions)}
        />
        <button
          onClick={handleSecondModalSave}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition duration-300 shadow-md"
        >
          Продолжить
        </button>
      </Modal>

      <CompactContextFactorsModal
        isOpen={isThirdModalOpen}
        onClose={() => setIsThirdModalOpen(false)}
        onSave={handleThirdModalSave}
      />

    <Tooltip /> 
    </div>
  );
};

export default HomePage;
