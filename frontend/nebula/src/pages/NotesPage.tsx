import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import StarryBackground from "../components/StarryBackground";
import { Note } from "../types/noteTypes";
import PageHeader from "../components/notes/PageHeader";
import NoteList from "../components/notes/NoteList";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import EditNoteModal from "../components/notes/EditNodeModal";
import { useNotes } from "../hooks/useNote";
import AIGradient from "../components/AIGradient";

const NotesPage: React.FC = () => {
  const { notes, loading, fetchNotes, addNote, editNote, removeNote } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const handleCreateNote = (content: string) => {
    addNote(content);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditModalOpen(true);
  };

  const handleUpdateNote = (id: string, content: string) => {
    editNote(id, content);
  };

  const handleDeleteNote = (id: string) => {
    removeNote(id);
  };

  const handleLoadMore = () => {
    fetchNotes();
  };

  const handleMoodUpdated = (updatedNote: Note) => {
    // Обновите состояние заметок с обновленной заметкой
    console.log("bababoi");
  };

  const hasMore = !loading && notes.length > 0; // Adjust this condition based on your logic

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-start p-4 overflow-hidden">
      <StarryBackground />
      <AIGradient />

      <div className="w-full max-w-4xl">
        <PageHeader onCreateNote={() => setIsCreateModalOpen(true)} />

        <NoteList
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onMoodUpdated={handleMoodUpdated}
          onLoadMore={handleLoadMore} // Corrected prop
          hasMore={hasMore} // Corrected prop
        />

        
      </div>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateNote}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateNote}
        note={currentNote}
      />
    </div>
  );
};

export default NotesPage;
