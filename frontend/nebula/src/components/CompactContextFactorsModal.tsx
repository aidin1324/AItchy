import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

type ContextFactor = {
  context_factor: string;
  effect: string;
};

const factors = [
  "Работа",
  "Погода",
  "Отношения",
  "Здоровье",
  "Финансы",
  "Хобби",
  "Семья",
];

const CompactContextFactorsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (factors: ContextFactor[]) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [selectedFactors, setSelectedFactors] = useState<ContextFactor[]>([]);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) => {
      const exists = prev.find((f) => f.context_factor === factor);
      if (exists) {
        return prev.filter((f) => f.context_factor !== factor);
      } else {
        return [...prev, { context_factor: factor, effect: "" }];
      }
    });
    setExpandedFactor(factor);
  };

  const setEffect = (factor: string, effect: string) => {
    setSelectedFactors((prev) =>
      prev.map((f) => (f.context_factor === factor ? { ...f, effect } : f))
    );
    setExpandedFactor(null);
  };

  const handleSave = () => {
    onSave(selectedFactors);
    onClose();
  };

  const getBackgroundColor = (effect: string) => {
    switch (effect) {
      case "positive":
        return "bg-green-100";
      case "neutral":
        return "bg-gray-100";
      case "negative":
        return "bg-red-100";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Окружающие факторы</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Выберите факторы, повлиявшие на ваше настроение сегодня
          </p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {factors.map((factor) => {
              const selectedFactor = selectedFactors.find(f => f.context_factor === factor);
              const backgroundColor = selectedFactor ? getBackgroundColor(selectedFactor.effect) : "bg-gray-50";
              
              return (
                <div key={factor} className={`rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${backgroundColor}`}>
                  <button
                    className={`w-full px-4 py-2 text-left flex justify-between items-center ${
                      selectedFactor ? "text-gray-800" : "text-gray-700"
                    }`}
                    onClick={() => toggleFactor(factor)}
                  >
                    <span>{factor}</span>
                    {expandedFactor === factor ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedFactor === factor && (
                    <div className="p-2 bg-white flex justify-around">
                      <button
                        className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        onClick={() => setEffect(factor, "positive")}
                      >
                        Позитивно
                      </button>
                      <button
                        className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        onClick={() => setEffect(factor, "neutral")}
                      >
                        Нейтрально
                      </button>
                      <button
                        className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800"
                        onClick={() => setEffect(factor, "negative")}
                      >
                        Негативно
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactContextFactorsModal;