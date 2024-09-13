import React from "react";
import axios from "axios";

export type RussianEmotion =
  | "Радость"
  | "Грусть"
  | "Гнев"
  | "Страх"
  | "Удивление"
  | "Отвращение"
  | "Интерес"
  | "Спокойствие";

export type EnglishEmotion =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "surprise"
  | "disgust"
  | "interest"
  | "calmness";

export interface Emotion {
  name: string;
  id: number;
}

export const emotionMap: Record<RussianEmotion, EnglishEmotion> = {
  Радость: "joy",
  Грусть: "sadness",
  Гнев: "anger",
  Страх: "fear",
  Удивление: "surprise",
  Отвращение: "disgust",
  Интерес: "interest",
  Спокойствие: "calmness",
};

export type RussianContextFactor =
  | "Работа"
  | "Погода"
  | "Отношения"
  | "Здоровье"
  | "Финансы"
  | "Хобби"
  | "Семья";

export type EnglishContextFactor =
  | "job"
  | "weather"
  | "relationships"
  | "health"
  | "finance"
  | "hobby"
  | "family";

export interface ContextFactor {
  name: string;
  id: number;
}

export type RussianEffect = "Позитивно" | "Негативно" | "Нейтрально";

export type EnglishEffect = "positive" | "negative" | "neutral";

export interface Effect {
  name: string;
  id: number;
}

export const effectMap: Record<RussianEffect, EnglishEffect> = {
  Позитивно: "positive",
  Негативно: "negative",
  Нейтрально: "neutral",
};

export const contextFactorMap: Record<
  RussianContextFactor,
  EnglishContextFactor
> = {
  Работа: "job",
  Погода: "weather",
  Отношения: "relationships",
  Здоровье: "health",
  Финансы: "finance",
  Хобби: "hobby",
  Семья: "family",
};

export const getEmotionId = async (
  russianEmotion: RussianEmotion
): Promise<number | null> => {
  try {
    const englishEmotion = emotionMap[russianEmotion];

    const response = await axios.get<Emotion[]>(
      "http://138.197.30.86:8000/emotion/all"
    );
    const emotions = response.data;

    const foundEmotion = emotions.find(
      (emotion) => emotion.name === englishEmotion
    );

    return foundEmotion ? foundEmotion.id : null;
  } catch (error) {
    console.error("Error fetching emotions:", error);
    return null;
  }
};

export const getContextFactorId = async (
  russianFactor: RussianContextFactor
): Promise<number | null> => {
  try {
    const englishFactor = contextFactorMap[russianFactor];

    const response = await axios.get<ContextFactor[]>(
      "http://138.197.30.86:8000/context-factor/all"
    );
    const factors = response.data;

    const foundFactor = factors.find((factor) => factor.name === englishFactor);

    return foundFactor ? foundFactor.id : null;
  } catch (error) {
    console.error("Error fetching context factors:", error);
    return null;
  }
};

export const getEffectId = async (
  russianEffect: RussianEffect
): Promise<number | null> => {
  try {
    const englishEffect = effectMap[russianEffect];

    const response = await axios.get<Effect[]>(
      "http://138.197.30.86:8000/effect/all"
    );
    const effects = response.data;

    const foundEffect = effects.find((effect) => effect.name === englishEffect);

    return foundEffect ? foundEffect.id : null;
  } catch (error) {
    console.error("Error fetching effects:", error);
    return null;
  }
};
