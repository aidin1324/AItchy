import React, { useState, useEffect, useCallback } from "react";

interface EmotionSelectorProps {
  emotions: { emotion_id: number; intensity: number }[];
  onEmotionChange: (emotions: { emotion_id: number; intensity: number }[]) => void;
}

// Сопоставление emotion_id с цветами
const emotionColorClasses: Record<number, string> = {
  1: "bg-yellow-500 text-yellow-900", // Радость
  2: "bg-blue-500 text-blue-900", // Грусть
  3: "bg-red-500 text-red-900", // Гнев
  4: "bg-purple-500 text-purple-900", // Страх
  5: "bg-green-500 text-green-900", // Удивление
  6: "bg-pink-500 text-pink-900", // Отвращение
  7: "bg-orange-500 text-orange-900", // Интерес
  8: "bg-teal-500 text-teal-900", // Спокойствие
};

// Сопоставление emotion_id с названиями эмоций
const emotionNames: Record<number, string> = {
  1: "Радость",
  2: "Грусть",
  3: "Гнев",
  4: "Страх",
  5: "Удивление",
  6: "Отвращение",
  7: "Интерес",
  8: "Спокойствие",
};

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ emotions, onEmotionChange }) => {
  const [selectedEmotions, setSelectedEmotions] = useState(emotions);
  const [activeEmotionId, setActiveEmotionId] = useState<number | null>(null);

  const toggleEmotion = (emotionId: number) => {
    if (selectedEmotions.some((e) => e.emotion_id === emotionId)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e.emotion_id !== emotionId));
      setActiveEmotionId(null);
    } else if (selectedEmotions.length < 5) {
      setActiveEmotionId(emotionId);
    }
  };

  const setIntensity = (intensity: number) => {
    if (activeEmotionId !== null) {
      const newEmotions = [
        ...selectedEmotions.filter((e) => e.emotion_id !== activeEmotionId),
        { emotion_id: activeEmotionId, intensity },
      ];
      setSelectedEmotions(newEmotions);
      setActiveEmotionId(null);
    }
  };

  const handleEmotionChange = useCallback(() => {
    onEmotionChange(selectedEmotions);
  }, [selectedEmotions, onEmotionChange]);

  useEffect(() => {
    handleEmotionChange();
  }, [handleEmotionChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(emotionColorClasses).map((emotionIdStr) => {
          const emotionId = Number(emotionIdStr);
          const isSelected = selectedEmotions.some((e) => e.emotion_id === emotionId);
          return (
            <button
              key={emotionId}
              onClick={() => toggleEmotion(emotionId)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 
                ${isSelected ? `${emotionColorClasses[emotionId]} bg-opacity-50 shadow-md transform scale-105` : `bg-gray-200 bg-opacity-30 text-gray-700 hover:bg-gray-300 hover:bg-opacity-50`}
                ${selectedEmotions.length >= 5 && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={selectedEmotions.length >= 5 && !isSelected}
            >
              {emotionNames[emotionId]} {/* Отображаем настоящее название эмоции */}
              {selectedEmotions.find((e) => e.emotion_id === emotionId)?.intensity && (
                <span className={`ml-1 ${emotionColorClasses[emotionId]} bg-opacity-20 px-1 rounded-full text-xs`}>
                  {selectedEmotions.find((e) => e.emotion_id === emotionId)?.intensity}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {activeEmotionId !== null && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Выберите интенсивность для эмоции {emotionNames[activeEmotionId]} {/* Используем название вместо ID */}
          </p>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((intensity) => (
              <button
                key={intensity}
                onClick={() => setIntensity(intensity)}
                className={`w-8 h-8 rounded-full ${emotionColorClasses[activeEmotionId]} bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center font-semibold transition-colors duration-200`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
