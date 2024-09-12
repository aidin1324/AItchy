import React, { useState } from 'react';
import Select from 'react-select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Определяем тип для записи эмоций
interface EmotionEntry {
  date: string;
  [key: string]: number | string; // Позволяет иметь любые эмоции как ключи
}

// Определяем пропсы для нашего компонента
interface EmotionLineChartProps {
  data: EmotionEntry[];
}

// Определяем типичные цвета для эмоций
const emotionColorMap: { [key: string]: string } = {
  sadness: '#0000FF', // Синий для грусти
  anger: '#FF0000', // Красный для злости
  joy: '#FFFF00', // Желтый для радости
  surprise: '#FF00FF', // Фиолетовый для удивления
  fear: '#000000', // Черный для страха
  disgust: '#008000', // Зеленый для отвращения
  interest: '#FFA500', // Оранжевый для интереса
  calmness: '#00FFFF', // Голубой для спокойствия
};

const EmotionLineChart: React.FC<EmotionLineChartProps> = ({ data }) => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  
  // Получаем все уникальные эмоции из данных
  const allEmotions: string[] = Array.from(
    new Set(
      data.flatMap(entry => 
        Object.keys(entry).filter(key => key !== 'date')
      )
    )
  );

  // Создаем опции для react-select
  const emotionOptions = allEmotions.map(emotion => ({
    value: emotion,
    label: emotion.charAt(0).toUpperCase() + emotion.slice(1)
  }));

  // Используем типичные цвета для эмоций
  const emotionColors: { [key: string]: string } = selectedEmotions.reduce((acc, emotion) => {
    acc[emotion] = emotionColorMap[emotion] || '#000000'; // Используем черный цвет по умолчанию, если нет в мапе
    return acc;
  }, {} as { [key: string]: string });

  // Обработка данных для заполнения пропущенных значений
  const processedData: EmotionEntry[] = data.map(entry => {
    const newEntry: EmotionEntry = { ...entry };
    selectedEmotions.forEach(emotion => {
      if (!(emotion in newEntry)) {
        newEntry[emotion] = null as any; // Используем null вместо 0, приводим к any для совместимости
      }
    });
    return newEntry;
  });

  return (
    <div className="">
      <div className="mb-4">
        <label className="block text-white mb-2">Выберите эмоции:</label>
        <Select
          isMulti
          options={emotionOptions}
          onChange={(selectedOptions) => 
            setSelectedEmotions(
              selectedOptions ? (selectedOptions as any).map((option: any) => option.value) : []
            )
          }
          className="basic-single"
          classNamePrefix="select"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              color: '#fff',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#333',
              borderRadius: '8px',
              color: '#fff',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#555' : '#333',
              color: '#fff',
              ':hover': {
                backgroundColor: '#444',
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: '#fff',
            }),
            placeholder: (provided) => ({
              ...provided,
              color: '#aaa',
            }),
          }}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" domain={[0, 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
          />
          <Legend />
          {selectedEmotions.map(emotion => (
            <Line 
              key={emotion}
              type="monotone" 
              dataKey={emotion} 
              stroke={emotionColors[emotion]} 
              name={emotion}
              connectNulls={true}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionLineChart;
