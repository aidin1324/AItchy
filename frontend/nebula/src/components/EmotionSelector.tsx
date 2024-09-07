import { useCallback, useEffect, useState } from "react";
import { Emotion } from "../types/moodTypes";

interface EmotionSelectorProps {
    emotions: Emotion[];
    onEmotionChange: (emotions: Emotion[]) => void;
  }
  
  // Определяем типы ключей, которые будут использоваться в объекте
  type EmotionName = "Радость" | "Грусть" | "Гнев" | "Страх" | "Удивление" | "Отвращение" | "Интерес" | "Спокойствие";
  
  const emotionColorClasses: Record<EmotionName, string> = {
    Радость: "bg-yellow-500 text-yellow-900",
    Грусть: "bg-blue-500 text-blue-900",
    Гнев: "bg-red-500 text-red-900",
    Страх: "bg-purple-500 text-purple-900",
    Удивление: "bg-green-500 text-green-900",
    Отвращение: "bg-pink-500 text-pink-900",
    Интерес: "bg-orange-500 text-orange-900",
    Спокойствие: "bg-teal-500 text-teal-900",
  };
  
  const EmotionSelector: React.FC<EmotionSelectorProps> = ({
    emotions,
    onEmotionChange,
  }) => {
    const allEmotions = [
      { name: "Радость", color: "yellow" },
      { name: "Грусть", color: "blue" },
      { name: "Гнев", color: "red" },
      { name: "Страх", color: "purple" },
      { name: "Удивление", color: "green" },
      { name: "Отвращение", color: "pink" },
      { name: "Интерес", color: "orange" },
      { name: "Спокойствие", color: "teal" },
    ];
  
    const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(emotions);
    const [activeEmotion, setActiveEmotion] = useState<string | null>(null);
  
    const toggleEmotion = (emotion: string) => {
      if (selectedEmotions.some((e) => e.emotion === emotion)) {
        setSelectedEmotions(
          selectedEmotions.filter((e) => e.emotion !== emotion)
        );
        setActiveEmotion(null);
      } else if (selectedEmotions.length < 5) {
        setActiveEmotion(emotion);
      }
    };
  
    const setIntensity = (intensity: number) => {
      if (activeEmotion) {
        const newEmotions = [
          ...selectedEmotions.filter((e) => e.emotion !== activeEmotion),
          { emotion: activeEmotion, intensity },
        ];
        setSelectedEmotions(newEmotions);
        setActiveEmotion(null);
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
          {allEmotions.map(({ name, color }) => {
            const isSelected = selectedEmotions.some((e) => e.emotion === name);
            const bgColor = isSelected ? `bg-${color}-500` : "bg-gray-200";
            const textColor = isSelected ? `text-${color}-900` : "text-gray-700";
            const hoverBgColor = isSelected
              ? `hover:bg-${color}-600`
              : "hover:bg-gray-300";
  
            return (
              <button
                key={name}
                onClick={() => toggleEmotion(name)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 
                  ${isSelected ? `${emotionColorClasses[name as EmotionName]} bg-opacity-50 shadow-md transform scale-105` : `bg-gray-200 bg-opacity-30 text-gray-700 hover:bg-gray-300 hover:bg-opacity-50`}
                  ${selectedEmotions.length >= 5 && !isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={
                  selectedEmotions.length >= 5 &&
                  !selectedEmotions.some((e) => e.emotion === name)
                }
              >
                {name}
                {selectedEmotions.find((e) => e.emotion === name)?.intensity && (
                  <span
                    className={`ml-1 ${emotionColorClasses[name as EmotionName]} bg-opacity-20 px-1 rounded-full text-xs`}
                  >
                    {selectedEmotions.find((e) => e.emotion === name)?.intensity}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {activeEmotion && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Выберите интенсивность для "{activeEmotion}"
            </p>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setIntensity(intensity)}
                  className={`w-8 h-8 rounded-full ${emotionColorClasses[activeEmotion as EmotionName]} bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center font-semibold transition-colors duration-200`}
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