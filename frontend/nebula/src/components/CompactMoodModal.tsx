import React, { useState } from "react";
import {
  X,
  Sun,
  Moon,
  Thermometer,
  Battery,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";


type MoodCategory =
  | "general_well_being"
  | "energy_level"
  | "stress_level"
  | "sleep_quality";

interface MoodData {
  general_well_being: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
}

const categories: {
  key: MoodCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "general_well_being",
    label: "Общее состояние",
    icon: <Sun className="text-yellow-500" size={24} />,
  },
  {
    key: "energy_level",
    label: "Уровень энергии",
    icon: <Battery className="text-green-500" size={24} />,
  },
  {
    key: "stress_level",
    label: "Уровень стресса",
    icon: <Thermometer className="text-red-500" size={24} />,
  },
  {
    key: "sleep_quality",
    label: "Качество сна",
    icon: <Moon className="text-blue-500" size={24} />,
  },
];

const CompactMoodModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MoodData) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(0);
  const [moodData, setMoodData] = useState<MoodData>({
    general_well_being: 5,
    energy_level: 5,
    stress_level: 5,
    sleep_quality: 5,
  });

  if (!isOpen) return null;

  const currentCategory = categories[step];

  const handleChange = (value: number) => {
    setMoodData((prev) => ({ ...prev, [currentCategory.key]: value }));
  };

  const handleNext = () => {
    if (step < categories.length - 1) {
      setStep(step + 1);
    } else {
      onSave(moodData);
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-2xl">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700">
              Как прошел день?
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6 flex items-center">
            {currentCategory.icon}
            <span className="ml-2 text-lg font-medium text-gray-700">
              {currentCategory.label}
            </span>
          </div>

          <div className="mb-6">
            <input
              type="range"
              min="1"
              max="10"
              value={moodData[currentCategory.key]}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-center text-3xl font-bold text-blue-600">
              {moodData[currentCategory.key]}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className={`flex items-center px-4 py-2 rounded-lg ${
                step === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white"
              }`}
            >
              <ArrowLeft size={20} className="mr-2" /> Назад
            </button>
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {step === categories.length - 1 ? "Сохранить" : "Далее"}{" "}
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactMoodModal;
