// src/components/MoodIndicator.tsx
import React from 'react';
import { Mood } from '../../types/noteTypes';

interface MoodIndicatorProps {
  mood: Mood;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({ mood }) => {
  const moodColors = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    neutral: 'bg-gray-500',
    excited: 'bg-green-500',
    angry: 'bg-red-500',
  };

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    excited: '😃',
    angry: '😠',
  };

  return (
    <div
      className={`absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white ${moodColors[mood]}`}
      title={mood}
    >
      {moodEmojis[mood]}
    </div>
  );
};

export default MoodIndicator;