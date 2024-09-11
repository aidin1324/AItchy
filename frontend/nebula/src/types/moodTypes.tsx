// src/types/moodTypes.ts
export type Emotion = {
  name: string;
  intensity: number;
  emotion_id: number;
};

export interface MoodData {
  general_well_being: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
}

export type ContextFactor = {
  name: string;
  effect_id: number;
  context_factor_id: number;
};

export type MoodEntry = {
  general_well_being: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
  mood_emotions: { intensity: number; emotion_id: number }[];
  mood_contexts: { context_factor_id: number; effect_id: number }[];
};


export type MoodType = 'happy' | 'sad' | 'neutral' | 'anxious' | 'angry';

export type Mood = {
  type: string;  // Например: 'happy', 'sad', и т.д.
  id: number;    // ID эмоции
}

export const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  anxious: '😰',
  angry: '😠',
};