import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Mood, Note } from '../../types/noteTypes';
import { updateNote } from '../../services/noteService';
import ModalPortal from '../ModalPortal';

interface UpdateMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
  onMoodUpdated: (updatedNote: Note) => void;
}

const moodOptions: Mood[] = ['happy', 'sad', 'neutral', 'excited', 'angry'];

const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  excited: '😃',
  angry: '😠'
};

const UpdateMoodModal: React.FC<UpdateMoodModalProps> = ({ isOpen, onClose, note, onMoodUpdated }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(note.mood);

  const handleSave = async () => {
    try {
      const updatedNote = await updateNote(note.id, note.content, selectedMood);
      onMoodUpdated(updatedNote);
      onClose();
    } catch (error) {
      console.error('Error updating note mood:', error);
    }
  };
  

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
              className="bg-gradient-to-br from-purple-700 to-indigo-800 p-6 rounded-2xl shadow-xl w-96 text-white z-50 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">Обновить настроение</h2>
              <p className="text-sm text-purple-200 mb-6 text-center">
                Если вы считаете, что у этой заметки другое настроение, то вы можете выбрать из имеющихся вариантов и изменить его
              </p>
              <div className="mb-6 flex flex-wrap justify-center">
                {moodOptions.map(mood => (
                  <motion.button
                    key={mood}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-4 py-2 rounded-full m-1 flex items-center ${
                      selectedMood === mood
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    <span className="mr-2">{moodEmojis[mood]}</span>
                    <span className="capitalize">{mood}</span>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
                >
                  Отмена
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Сохранить
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default UpdateMoodModal;