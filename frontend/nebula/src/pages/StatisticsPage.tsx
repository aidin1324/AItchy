import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmotionLineChart from "../components/EmotionLineChart";

const emotionTranslations: { [key: string]: string } = {
  joy: "Радость",
  sadness: "Грусть",
  anger: "Гнев",
  fear: "Страх",
  surprise: "Удивление",
  disgust: "Отвращение",
  interest: "Интерес",
  calmness: "Спокойствие",
};

const contextFactorTranslations: { [key: string]: string } = {
  job: "Работа",
  relationships: "Отношения",
  weather: "Погода",
  health: "Здоровье",
  finance: "Финансы",
  hobby: "Хобби",
  family: "Семья",
};

const generalStateTranslations: { [key: string]: string } = {
  general_well_being: "Состояние в целом",
  energy_level: "Энергия",
  stress_level: "Стресс",
  sleep_quality: "Качество сна",
};

// Обновленные интерфейсы
interface MoodEntryStats {
  name: string;
  mean: number;
}

interface ContextFactor {
  name: string;
  mean: number;
}

interface EmotionLineChart {
  date: string;
  [key: string]: number | string; // Позволяет иметь любые эмоции как ключи
}

interface EmotionRadarChart {
  name: string;
  value: number;
}

interface DashboardData {
  mood_entry_stats_chart: MoodEntryStats[];
  context_factor_chart: ContextFactor[];
  emotion_line_chart: EmotionLineChart[];
  emotion_radar_chart: EmotionRadarChart[];
}

const getMoodEmoji = (mean: number) => {
  if (mean <= 2) return { emoji: "😞", description: "Плохое настроение" };
  if (mean <= 4) return { emoji: "😐", description: "Нейтральное настроение" };
  if (mean <= 6) return { emoji: "🙂", description: "Хорошее настроение" };
  if (mean <= 8)
    return { emoji: "😊", description: "Очень хорошее настроение" };
  return { emoji: "😁", description: "Отличное настроение" };
};

const getContextEmoji = (mean: number) => {
  if (mean <= -0.5)
    return { emoji: "😟", description: "Сильное негативное влияние" };
  if (mean <= 0)
    return { emoji: "😕", description: "Небольшое негативное влияние" };
  if (mean <= 0.5)
    return { emoji: "😊", description: "Небольшое позитивное влияние" };
  return { emoji: "😁", description: "Сильное позитивное влияние" };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white bg-opacity-80 p-2 rounded shadow">
        <p className="text-sm font-semibold">{`${label}: ${payload[0].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

interface EmojiTooltipProps {
  emoji: string;
  description: string;
}

const EmojiTooltip: React.FC<EmojiTooltipProps> = ({ emoji, description }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block mx-1">
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help text-2xl"
      >
        {emoji}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded shadow-lg text-sm whitespace-nowrap z-10">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};
const StatisticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2024-09-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const moodColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731"];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Токен не найден. Пожалуйста, войдите в систему.");
      }

      if (!startDate || !endDate) {
        throw new Error("Пожалуйста, выберите корректные даты");
      }

      const response = await axios.get<DashboardData>(
        "http://127.0.0.1:8000/analytics/by-date",
        {
          params: {
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Произошла неизвестная ошибка");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return <div className="text-white text-center">Загрузка...</div>;
  }

  if (error || !data) {
    return <div className="text-white text-center">Ошибка: {error}</div>;
  }

  // Получаем все уникальные эмоции из данных
  const emotions = Array.from(
    new Set(
      data.emotion_line_chart.flatMap((entry) =>
        Object.keys(entry).filter((key) => key !== "date")
      )
    )
  );

  // Генерируем случайный цвет для каждой эмоции
  const emotionColors = emotions.reduce((acc, emotion) => {
    acc[emotion] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return acc;
  }, {} as { [key: string]: string });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Дашборд настроения
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-300 mb-1 text-sm">Дата начала:</label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="dd.MM.yyyy"
              className="w-full py-2 px-3 pl-8 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-gray-300 mb-1 text-sm">Дата конца:</label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="dd.MM.yyyy"
              className="w-full py-2 px-3 pl-8 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl md:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Статистика настроения
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.mood_entry_stats_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis
                dataKey="name"
                stroke="#fff"
                tickFormatter={(state) =>
                  generalStateTranslations[state] || state
                }
              />

              <YAxis stroke="#fff" domain={[1, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mean">
                {data.mood_entry_stats_chart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={moodColors[index % moodColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center mt-4">
            {data.mood_entry_stats_chart.map((entry, index) => {
              const { emoji, description } = getMoodEmoji(entry.mean);
              return (
                <EmojiTooltip
                  key={`emoji-${index}`}
                  emoji={emoji}
                  description={`${entry.name}: ${description}`}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Влияние контекстных факторов
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={data.context_factor_chart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis type="number" stroke="#fff" domain={[-1, 1]} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#fff"
                tickFormatter={(factor) =>
                  contextFactorTranslations[factor] || factor
                }
              />

              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#fff" />
              <Bar dataKey="mean">
                {data.context_factor_chart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.mean >= 0 ? "#4CAF50" : "#FF5252"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center mt-4">
            {data.context_factor_chart.map((entry, index) => {
              const { emoji, description } = getContextEmoji(entry.mean);
              return (
                <EmojiTooltip
                  key={`context-emoji-${index}`}
                  emoji={emoji}
                  description={`${entry.name}: ${description}`}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Динамика эмоций
          </h2>
          <EmotionLineChart data={data.emotion_line_chart} />
        </div>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Радар эмоций
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.emotion_radar_chart}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="name"
                tickFormatter={(emotion) =>
                  emotionTranslations[emotion] || emotion
                }
              />
              <PolarRadiusAxis />
              <Radar
                name="Эмоции"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Интерпретация данных
          </h2>
          <p className="text-white text-base md:text-lg leading-relaxed">
            {interpretData(data)}
          </p>
        </div>
      </div>
      <Link
        to="/home"
        className="mt-6 md:mt-8 text-white bg-emerald-500 hover:bg-emerald-600 rounded px-4 py-2 transition duration-300"
      >
        Вернуться на главную
      </Link>
    </div>
  );
};

const interpretData = (data: DashboardData): string => {
  let interpretation = "";

  // Интерпретация статистики настроения
  const averageMood =
    data.mood_entry_stats_chart.reduce((sum, item) => sum + item.mean, 0) /
    data.mood_entry_stats_chart.length;
  interpretation += `В среднем, ваше настроение за этот период можно охарактеризовать как ${getMoodDescription(
    averageMood
  )}. `;

  // Интерпретация контекстных факторов
  const positiveFactors = data.context_factor_chart.filter(
    (factor) => factor.mean > 0
  );
  const negativeFactors = data.context_factor_chart.filter(
    (factor) => factor.mean < 0
  );

  if (positiveFactors.length > 0) {
    interpretation += `Положительное влияние на ваше настроение оказывают: ${positiveFactors
      .map((f) => f.name)
      .join(", ")}. `;
  }
  if (negativeFactors.length > 0) {
    interpretation += `Негативное влияние на ваше настроение оказывают: ${negativeFactors
      .map((f) => f.name)
      .join(", ")}. `;
  }

  // Интерпретация динамики эмоций
  const lastEmotionEntry =
    data.emotion_line_chart[data.emotion_line_chart.length - 1];
  interpretation += `На последнюю дату (${lastEmotionEntry.date}) уровень радости составил ${lastEmotionEntry.joy}, а уровень грусти - ${lastEmotionEntry.sadness}. `;

  // Интерпретация радара эмоций
  const dominantEmotion = data.emotion_radar_chart.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );
  interpretation += `Доминирующей эмоцией является ${
    dominantEmotion.name
  } с интенсивностью ${(dominantEmotion.value * 100).toFixed(0)}%.`;

  return interpretation;
};

const getMoodDescription = (average: number): string => {
  if (average <= 2) return "плохое";
  if (average <= 4) return "ниже среднего";
  if (average <= 6) return "среднее";
  if (average <= 8) return "хорошее";
  return "отличное";
};

export default StatisticsPage;
