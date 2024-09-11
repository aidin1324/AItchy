// src/components/EditNoteModal.tsx
import React, { useState, useEffect } from 'react';
import { Note } from '../../types/noteTypes';
import Modal from '../Modal';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, content: string) => void;
  note: Note | null;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (note) {
      onSave(note.id, content);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        Редактировать запись
      </h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition duration-300 shadow-md"
      >
        Обновить
      </button>
    </Modal>
  );
};

export default EditNoteModal;