import React from 'react';
import axios from 'axios';

type RussianEmotion = "Радость" | "Грусть" | "Гнев" | "Страх" | "Удивление" | "Отвращение" | "Интерес" | "Спокойствие";

type EnglishEmotion = "joy" | "sadness" | "anger" | "fear" | "surprise" | "disgust" | "interest" | "calmness";

interface Emotion {
  name: string;
  id: number;
}

const emotionMap: Record<RussianEmotion, EnglishEmotion> = {
  "Радость": "joy",
  "Грусть": "sadness",
  "Гнев": "anger",
  "Страх": "fear",
  "Удивление": "surprise",
  "Отвращение": "disgust",
  "Интерес": "interest",
  "Спокойствие": "calmness"
};

const getEmotionId = async (russianEmotion: RussianEmotion): Promise<number | null> => {
  try {
    const englishEmotion = emotionMap[russianEmotion];
    
    const response = await axios.get<Emotion[]>('http://138.197.30.86:8000/emotion/all');
    const emotions = response.data;
    
    const foundEmotion = emotions.find(emotion => emotion.name === englishEmotion);
    
    return foundEmotion ? foundEmotion.id : null;
  } catch (error) {
    console.error('Error fetching emotions:', error);
    return null;
  }
};

const EmotionComponent: React.FC = () => {
  const [emotionId, setEmotionId] = React.useState<number | null>(null);

  const handleEmotionSelect = async (emotion: RussianEmotion) => {
    const id = await getEmotionId(emotion);
    setEmotionId(id);
  };

  return (
    <div>
      <h1>Выберите эмоцию:</h1>
      {Object.keys(emotionMap).map((emotion) => (
        <button key={emotion} onClick={() => handleEmotionSelect(emotion as RussianEmotion)}>
          {emotion}
        </button>
      ))}
      {emotionId !== null && <p>ID эмоции: {emotionId}</p>}
    </div>
  );
};

export default EmotionComponent;