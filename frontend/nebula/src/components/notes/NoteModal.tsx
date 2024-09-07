import React from "react";
import Modal from "../Modal"; // Assuming Modal is a reusable component

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteContent: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
  title: string;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  noteContent,
  onChange,
  onSubmit,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        {title}
      </h2>
      <textarea
        value={noteContent}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Введите текст вашей записи..."
      />
      <button
        onClick={onSubmit}
        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition duration-300 shadow-md"
      >
        {title === "Создать новую запись" ? "Сохранить" : "Обновить"}
      </button>
    </Modal>
  );
};

export default NoteModal;
