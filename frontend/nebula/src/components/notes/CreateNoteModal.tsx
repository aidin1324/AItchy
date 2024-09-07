// src/components/CreateNoteModal.tsx
import React, { useState } from 'react';
import Modal from '../Modal';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    onSave(content);
    setContent('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        Создать новую запись
      </h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Введите текст вашей записи..."
      />
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition duration-300 shadow-md"
      >
        Сохранить
      </button>
    </Modal>
  );
};

export default CreateNoteModal;