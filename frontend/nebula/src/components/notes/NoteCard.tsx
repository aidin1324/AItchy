import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { PenTool, Trash } from 'lucide-react';
import MoodIndicator from './MoodIndicator';
import UpdateMoodModal from './UpdateMoodModal';
import { Note } from '../../types/noteTypes';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onMoodUpdated: (updatedNote: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onMoodUpdated }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoodClick = () => {
    setIsModalOpen(true);
  };

  console.log(note);
  console.log(note.note_date)

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg relative">
      <p className="text-white mb-4">{note.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm">
          {note.note_date}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-400 hover:text-blue-300"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        className="absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
        title={note.mood}
        onClick={handleMoodClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <MoodIndicator mood={note.mood} />
        {showTooltip && (
          <div className="absolute -top-10 bg-gray-800 text-white text-xs rounded-lg p-2">
            {note.mood === 'happy' ? 'Счастлив' : note.mood === 'sad' ? 'Грустный' : note.mood === 'neutral' ? 'Нейтральный' : note.mood === 'excited' ? 'Взволнованный' : 'Злой'}
          </div>
        )}
      </div>

      <UpdateMoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={note}
        onMoodUpdated={onMoodUpdated}
      />
    </div>
  );
};

export default NoteCard;
