// src/types/moodTypes.ts
export type Emotion = {
  emotion: string;
  intensity: number;
};

export interface MoodData {
  generalWellbeing: number;
  energyLevel: number;
  stressLevel: number;
  sleepQuality: number;
}

export type ContextFactor = {
  context_factor: string;
  effect: string;
};

export type MoodEntry = {
  generalWellbeing: number;
  energyLevel: number;
  stressLevel: number;
  sleepQuality: number;
  emotions: Emotion[];
  contextFactors: ContextFactor[];
};
