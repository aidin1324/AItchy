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
import AIGradient from "../components/AIGradient";
import Notification from "../components/Notification";
import AITooltip from "../components/AITooltip";

const HomePage: React.FC = () => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    general_well_being: 5,
    energy_level: 5,
    stress_level: 5,
    sleep_quality: 5,
    mood_emotions: [],
    mood_contexts: [],
  });
  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const handleFirstModalSave = (data: MoodData) => {
    setMoodEntry((prev) => ({ ...prev, ...data }));
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  const handleSecondModalSave = () => {
    if (moodEntry.mood_emotions.length < 3) {
      alert("Пожалуйста, выберите как минимум 3 эмоции");
      return;
    }
    setIsSecondModalOpen(false);
    setIsThirdModalOpen(true);
  };

  const handleThirdModalSave = async (
    factors: Omit<ContextFactor, "name">[]
  ) => {
    setMoodEntry((prev) => ({ ...prev, mood_contexts: factors }));
    setIsThirdModalOpen(false);

    // Преобразование данных перед отправкой
    const dataToSend = {
      general_well_being: moodEntry.general_well_being,
      energy_level: moodEntry.energy_level,
      stress_level: moodEntry.stress_level,
      sleep_quality: moodEntry.sleep_quality,
      mood_emotions: moodEntry.mood_emotions,
      mood_contexts: factors,
    };

    console.log("Отправка данных:", dataToSend);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен не найден в localStorage");
      }

      const response = await fetch("http://127.0.0.1:8000/mood-entry/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        console.log(response);
        if (response.status === 400) {
          // Если ошибка дублирования, выводим всплывающее окно с ошибкой
          setShowErrorNotification(true);
          setTimeout(() => setShowErrorNotification(false), 4000); // Убираем через 3 секунды
        } else {
          throw new Error(`Ошибка при отправке данных: ${response.statusText}`);
        }
      } else {
        const result = await response.json();
        console.log("Ответ от сервера:", result);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000); // Убираем через 3 секунды
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  const updateMoodEntry = (field: keyof MoodEntry, value: any) => {
    setMoodEntry((prev) => ({ ...prev, [field]: value }));
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <StarryBackground />
      <AIGradient />

      <Notification
        isVisible={showNotification}
        message="Опрос успешно отправлен!"
      />

      <Notification
        isVisible={showErrorNotification}
        message="Заполнять данные можно только раз в день!"
        isError={true}
      />

      <motion.div
        className="relative w-80 h-80"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-purple-500 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-6">
            <motion.button
              variants={{ ...itemVariants, ...buttonVariants }}
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
                variants={{ ...itemVariants, ...buttonVariants }}
                whileHover="hover"
                whileTap="tap"
                className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
              >
                <PenTool className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Заметки</span>
              </motion.button>
            </Link>
            <Link to="/stats">
              <motion.button
                variants={{ ...itemVariants, ...buttonVariants }}
                whileHover="hover"
                whileTap="tap"
                className="w-32 h-32 bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
              >
                <BarChart2 className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Статистика</span>
              </motion.button>
            </Link>
            <Link to="/profile">
              <motion.button
                variants={{ ...itemVariants, ...buttonVariants }}
                whileHover="hover"
                whileTap="tap"
                className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transform transition-all duration-300 hover:rotate-6"
              >
                <User className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Профиль</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

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
          emotions={moodEntry.mood_emotions}
          onEmotionChange={(emotions) =>
            updateMoodEntry("mood_emotions", emotions)
          }
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
