import React from "react";
import NoteCard from "./NoteCard";
import { Note } from "../../types/noteTypes";

interface NoteListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: number) => void;
  onMoodUpdated: (updatedNote: Note) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onEditNote,
  onDeleteNote,
  onMoodUpdated,
  onLoadMore,
  hasMore,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            onMoodUpdated={onMoodUpdated}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg relative text-white  hover:bg-purple-600 hover:bg-opacity-10 hover:scale-105 transition-transform duration-300"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </>
  );
};

export default NoteList;
