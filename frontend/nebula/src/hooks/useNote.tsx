// src/hooks/useNotes.ts
import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/noteTypes';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { notes: fetchedNotes, nextCursor } = await getNotes(cursor || undefined);
      setNotes(prevNotes => [...prevNotes, ...fetchedNotes]);
      setCursor(nextCursor);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    setLoading(false);
  }, [cursor]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (content: string) => {
    try {
      const newNote = await createNote(content);
      setNotes(prevNotes => [newNote, ...prevNotes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const editNote = async (id: string, content: string) => {
    try {
      const updatedNote = await updateNote(id, content);
      setNotes(prevNotes => prevNotes.map(note => note.id === id ? updatedNote : note));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return { notes, loading, fetchNotes, addNote, editNote, removeNote };
};