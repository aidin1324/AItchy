import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Note } from '../../types/noteTypes';
import ModalPortal from '../ModalPortal';

export type Mood = "happy" | "sad" | "neutral" | "anxious" | "angry";

interface UpdateMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
  onMoodUpdated: (updatedNote: Note) => void;
}

const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  anxious: '😰',
  angry: '😠'
};

const UpdateMoodModal: React.FC<UpdateMoodModalProps> = ({ isOpen, onClose, note }) => {
  const currentMood = note.mood as Mood;

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div 
              className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-700 to-indigo-800 p-6 rounded-2xl shadow-xl w-80 text-white z-50 relative flex flex-col items-center"
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center capitalize">{currentMood}</h2>
              <div className="text-9xl mb-6">
                {moodEmojis[currentMood]}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
              >
                Закрыть
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default UpdateMoodModal;