import React from 'react';
import axios from 'axios';

type RussianEffect = "Позитивно" | "Негативно" | "Нейтрально";

type EnglishEffect = "positive" | "negative" | "neutral";

interface Effect {
  name: string;
  id: number;
}

const effectMap: Record<RussianEffect, EnglishEffect> = {
  "Позитивно": "positive",
  "Негативно": "negative",
  "Нейтрально": "neutral"
};

const getEffectId = async (russianEffect: RussianEffect): Promise<number | null> => {
  try {
    const englishEffect = effectMap[russianEffect];
    
    const response = await axios.get<Effect[]>('http://138.197.30.86:8000/effect/all');
    const effects = response.data;
    
    const foundEffect = effects.find(effect => effect.name === englishEffect);
    
    return foundEffect ? foundEffect.id : null;
  } catch (error) {
    console.error('Error fetching effects:', error);
    return null;
  }
};

const EffectComponent: React.FC = () => {
  const [effectId, setEffectId] = React.useState<number | null>(null);

  const handleEffectSelect = async (effect: RussianEffect) => {
    const id = await getEffectId(effect);
    setEffectId(id);
  };

  return (
    <div>
      <h1>Выберите эффект:</h1>
      {Object.keys(effectMap).map((effect) => (
        <button key={effect} onClick={() => handleEffectSelect(effect as RussianEffect)}>
          {effect}
        </button>
      ))}
      {effectId !== null && <p>ID эффекта: {effectId}</p>}
    </div>
  );
};

export default EffectComponent;