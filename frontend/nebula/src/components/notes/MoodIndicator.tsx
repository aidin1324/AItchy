// src/components/MoodIndicator.tsx
import React from 'react';
import { Mood, MoodType } from '../../types/moodTypes';

interface MoodIndicatorProps {
  mood: string;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ mood }) => {
  const moodColors: Record<MoodType, string> = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    neutral: 'bg-gray-500',
    anxious: 'bg-green-500',
    angry: 'bg-red-500',
  };

  const moodEmojis: Record<MoodType, string> = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    anxious: '😰',
    angry: '😠',
  };

  // Утверждение типа для mood.type
  const moodType = mood as MoodType;

  return (
    <div
      className={`absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white ${moodColors[moodType]}`}
      title={mood}
    >
      {moodEmojis[moodType]}
    </div>
  );
};

export default MoodIndicator;
