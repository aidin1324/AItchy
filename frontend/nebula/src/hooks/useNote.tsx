// src/hooks/useNotes.ts
import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/noteTypes';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { MoodType } from '../types/moodTypes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { notes: fetchedNotes, nextCursor } = await getNotes(cursor || undefined);
      setNotes(prevNotes => {
        const newNotes = fetchedNotes.filter(note => !prevNotes.some(prevNote => prevNote.id === note.id));
        return [...prevNotes, ...newNotes];
      });
      
      setCursor(nextCursor);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
    setLoading(false);
  }, [cursor]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (content: string, mood: MoodType) => {
    try {
      const newNote = await createNote(content, mood);
      setNotes(prevNotes => [newNote, ...prevNotes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const editNote = async (id: number, content: string) => {
    console.log('editNote called with id:', id, 'content:', content);
    // Вместо вызова реального updateNote, просто выводим сообщение и имитируем обновление
    const updatedNote = {
      id: Number(id), // Преобразуем id в number
      content,
      user_id: 'user123',
      mood: 'happy', // Жестко заданное значение
      note_date: new Date().toISOString(),
    };
  
    // Имитация обновления заметки в состоянии
    setNotes(prevNotes => prevNotes.map(note => note.id === Number(id) ? updatedNote : note));
  };
  
  const removeNote = async (id: number) => {
    console.log('removeNote called with id:', id);
    // Вместо вызова реального deleteNote, просто выводим сообщение и имитируем удаление
    setNotes(prevNotes => prevNotes.filter(note => note.id !== Number(id)));
  };
  

  return { notes, loading, fetchNotes, addNote, editNote, removeNote };
};