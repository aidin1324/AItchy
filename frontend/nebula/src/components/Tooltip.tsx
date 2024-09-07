import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TooltipModal: React.FC<TooltipModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Важность самооценки",
      content: "Регулярная оценка вашего состояния помогает:\n\n• Лучше понимать себя\n• Выявлять паттерны настроения\n• Принимать обоснованные решения\n• Отслеживать прогресс\n• Улучшать общее качество жизни"
    },
    {
      title: "Общее состояние (1-10)",
      content: "1-2: Крайне плохо. Вы чувствуете себя подавленным, возможно больным.\n3-4: Плохо. Вы испытываете дискомфорт и негативные эмоции.\n5-6: Нормально. Вы чувствуете себя стабильно, без особых взлетов и падений.\n7-8: Хорошо. Вы ощущаете позитивный настрой и удовлетворенность.\n9-10: Отлично. Вы чувствуете себя на пике формы, полны энтузиазма и радости."
    },
    {
      title: "Уровень энергии (1-10)",
      content: "1-2: Полное истощение. Вы с трудом выполняете базовые задачи.\n3-4: Низкая энергия. Вы чувствуете усталость и нуждаетесь в отдыхе.\n5-6: Средний уровень. Вы способны выполнять повседневные задачи.\n7-8: Высокая энергия. Вы чувствуете себя бодрым и продуктивным.\n9-10: Максимальная энергия. Вы полны сил и готовы к любым вызовам."
    },
    {
      title: "Уровень стресса (1-10)",
      content: "1-2: Минимальный стресс. Вы чувствуете себя спокойно и расслабленно.\n3-4: Низкий стресс. Вы ощущаете легкое напряжение, но оно не мешает.\n5-6: Умеренный стресс. Вы чувствуете напряжение, но справляетесь с ним.\n7-8: Высокий стресс. Вы испытываете сильное напряжение и тревогу.\n9-10: Экстремальный стресс. Вы чувствуете себя перегруженным и на грани."
    },
    {
      title: "Качество сна (1-10)",
      content: "1-2: Очень плохой сон. Вы почти не спали или сон был крайне беспокойным.\n3-4: Плохой сон. Вы спали недостаточно или часто просыпались.\n5-6: Средний сон. Вы спали, но не чувствуете себя полностью отдохнувшим.\n7-8: Хороший сон. Вы спали достаточно и чувствуете себя отдохнувшим.\n9-10: Отличный сон. Вы спали глубоко и проснулись полным сил и энергии."
    }
  ];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-white/95 to-purple-100/95 p-8 rounded-3xl shadow-xl max-w-2xl w-full backdrop-blur-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-900">{pages[currentPage].title}</h2>
              <button onClick={onClose} className="text-purple-700 hover:text-purple-900 transition-colors">
                <X size={28} />
              </button>
            </div>
            <div className="text-purple-800 mb-8 leading-relaxed">
              {pages[currentPage].content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="text-purple-700 disabled:text-purple-400 transition-colors hover:text-purple-900"
              >
                <ChevronLeft size={28} />
              </button>
              <span className="text-purple-800 text-lg font-semibold">{currentPage + 1} / {pages.length}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
                disabled={currentPage === pages.length - 1}
                className="text-purple-700 disabled:text-purple-400 transition-colors hover:text-purple-900"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Tooltip: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-white/90 to-purple-200/90 rounded-full p-4 shadow-md backdrop-blur-sm"
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
      >
        <HelpCircle className="text-purple-700" size={28} />
      </motion.button>
      <TooltipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Tooltip;