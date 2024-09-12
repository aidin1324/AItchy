import React, { useState } from "react";
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
} from "recharts";
import { Link } from "react-router-dom";

// Mock data and helper functions remain the same
const mockData = {
  mood_entry_stats_chart: [
    { name: "Общее самочувствие", mean: 3.46, color: "#FF6B6B" },
    { name: "Уровень энергии", mean: 2.59, color: "#4ECDC4" },
    { name: "Уровень стресса", mean: 1.35, color: "#45B7D1" },
    { name: "Качество сна", mean: 1.3, color: "#F7B731" },
  ],
  context_factor_chart: [
    { name: "home", mean: -0.25 },
    { name: "work", mean: -0.6666666666666666 },
  ],
  emotion_detail:
    "В этом месяце наблюдается тенденция к улучшению общего самочувствия. Уровень энергии остается стабильным, в то время как уровень стресса немного снизился. Качество сна показывает небольшое улучшение. Контекстные факторы указывают на небольшое негативное влияние домашней обстановки и более значительное негативное влияние рабочей среды.",
};

const getMoodEmoji = (mean: number) => {
  if (mean <= 2) return { emoji: "😞", description: "Плохое настроение" };
  if (mean <= 4) return { emoji: "😐", description: "Нейтральное настроение" };
  if (mean <= 6) return { emoji: "🙂", description: "Хорошее настроение" };
  if (mean <= 8) return { emoji: "😊", description: "Очень хорошее настроение" };
  return { emoji: "😁", description: "Отличное настроение" };
};

const getContextEmoji = (mean: number) => {
  if (mean <= -0.5) return { emoji: "😟", description: "Сильное негативное влияние" };
  if (mean <= 0) return { emoji: "😕", description: "Небольшое негативное влияние" };
  if (mean <= 0.5) return { emoji: "😊", description: "Небольшое позитивное влияние" };
  return { emoji: "😁", description: "Сильное позитивное влияние" };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white bg-opacity-80 p-2 rounded shadow">
        <p className="text-sm font-semibold">{`${label}: ${payload[0].value.toFixed(2)}`}</p>
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Дашборд настроения</h1>

      <div className="w-full max-w-3xl md:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Статистика настроения
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData.mood_entry_stats_chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mean">
                {mockData.mood_entry_stats_chart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center mt-4">
            {mockData.mood_entry_stats_chart.map((entry, index) => {
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
              data={mockData.context_factor_chart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis type="number" stroke="#fff" domain={[-1, 1]} />
              <YAxis dataKey="name" type="category" stroke="#fff" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#fff" />
              <Bar dataKey="mean">
                {mockData.context_factor_chart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.mean >= 0 ? "#4CAF50" : "#FF5252"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center mt-4">
            {mockData.context_factor_chart.map((entry, index) => {
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

        <div className="md:col-span-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Анализ эмоций
          </h2>
          <p className="text-white text-base md:text-lg leading-relaxed">
            {mockData.emotion_detail}
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

export default StatisticsPage;