import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import StarryBackground from "../components/StarryBackground";
import { Note } from "../types/noteTypes";
import PageHeader from "../components/notes/PageHeader";
import NoteList from "../components/notes/NoteList";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import EditNoteModal from "../components/notes/EditNodeModal";

import AIGradient from "../components/AIGradient";
import { useNotes } from "../hooks/useNote";
import { MoodType } from "../types/moodTypes";

const NotesPage: React.FC = () => {
  const { notes, loading, fetchNotes, addNote, editNote, removeNote } = useNotes();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const handleCreateNote = (content: string, mood: MoodType) => {
    addNote(content, mood);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditModalOpen(true);
  };

  const handleUpdateNote = async (id: number, content: string) => {
    await editNote(id, content);
    window.location.reload();
  };

  const handleDeleteNote = async (id: number) => {
    await removeNote(id);
    fetchNotes(); // Перезагрузка списка заметок после удаления
  };

  const handleLoadMore = () => {
    fetchNotes();
  };

  const handleMoodUpdated = (updatedNote: Note) => {
    fetchNotes(); // Перезагрузка списка заметок после обновления настроения
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
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
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