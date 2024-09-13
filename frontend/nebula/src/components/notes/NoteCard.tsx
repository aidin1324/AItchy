import React, { useState, useRef, useEffect } from "react";
import { PenTool, Trash, X } from "lucide-react";
import MoodIndicator from "./MoodIndicator";
import UpdateMoodModal from "./UpdateMoodModal";
import { Note } from "../../types/noteTypes";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onMoodUpdated: (updatedNote: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onMoodUpdated,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTextTruncation = () => {
      if (contentRef.current) {
        const isTruncated =
          contentRef.current.scrollHeight > contentRef.current.clientHeight ||
          contentRef.current.scrollWidth > contentRef.current.clientWidth;
        setIsContentTruncated(isTruncated);
      }
    };

    checkTextTruncation();
    window.addEventListener("resize", checkTextTruncation);

    return () => window.removeEventListener("resize", checkTextTruncation);
  }, [note.content]);

  const handleMoodClick = () => {
    setIsModalOpen(true);
  };

  const handleContentClick = () => {
    if (isContentTruncated) {
      setIsTextModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg relative">
        <p
          ref={contentRef}
          className="text-white mb-4 overflow-hidden cursor-pointer"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onClick={handleContentClick}
        >
          {note.content}
        </p>
        {/* {isContentTruncated && (
          <button
            className="text-blue-400 hover:text-blue-300 text-sm mb-2"
            onClick={() => setIsTextModalOpen(true)}
          >
            Показать полностью
          </button>
        )} */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">{note.note_date}</span>
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
              {note.mood === "happy"
                ? "Счастлив"
                : note.mood === "sad"
                ? "Грустный"
                : note.mood === "neutral"
                ? "Нейтральный"
                : note.mood === "excited"
                ? "Взволнованный"
                : "Злой"}
            </div>
          )}
        </div>
      </div>

      <UpdateMoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={note}
        onMoodUpdated={onMoodUpdated}
      />

      {isTextModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg relative w-3/4 h-1/2 flex flex-col">
            <button
              onClick={() => setIsTextModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">
              Полный текст заметки
            </h2>
            <div className="flex-1 overflow-y-auto">
              <p className="text-white whitespace-normal break-words">
                {note.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
