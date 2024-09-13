import React from 'react';
import axios from 'axios';

type RussianContextFactor = "Работа" | "Погода" | "Отношения" | "Здоровье" | "Финансы" | "Хобби" | "Семья";

type EnglishContextFactor = "job" | "weather" | "relationships" | "health" | "finance" | "hobby" | "family";

interface ContextFactor {
  name: string;
  id: number;
}

const contextFactorMap: Record<RussianContextFactor, EnglishContextFactor> = {
  "Работа": "job",
  "Погода": "weather",
  "Отношения": "relationships",
  "Здоровье": "health",
  "Финансы": "finance",
  "Хобби": "hobby",
  "Семья": "family"
};

const getContextFactorId = async (russianFactor: RussianContextFactor): Promise<number | null> => {
  try {
    const englishFactor = contextFactorMap[russianFactor];
    
    const response = await axios.get<ContextFactor[]>('http://138.197.30.86:8000/context-factor/all');
    const factors = response.data;
    
    const foundFactor = factors.find(factor => factor.name === englishFactor);
    
    return foundFactor ? foundFactor.id : null;
  } catch (error) {
    console.error('Error fetching context factors:', error);
    return null;
  }
};

const ContextFactorComponent: React.FC = () => {
  const [factorId, setFactorId] = React.useState<number | null>(null);

  const handleFactorSelect = async (factor: RussianContextFactor) => {
    const id = await getContextFactorId(factor);
    setFactorId(id);
  };

  return (
    <div>
      <h1>Выберите контекстный фактор:</h1>
      {Object.keys(contextFactorMap).map((factor) => (
        <button key={factor} onClick={() => handleFactorSelect(factor as RussianContextFactor)}>
          {factor}
        </button>
      ))}
      {factorId !== null && <p>ID контекстного фактора: {factorId}</p>}
    </div>
  );
};

export default ContextFactorComponent;