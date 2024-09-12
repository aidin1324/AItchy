// src/hooks/useNotes.ts
import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/noteTypes';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { Mood, MoodType } from '../types/moodTypes';

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

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем 1 к месяцу, потому что getMonth() возвращает месяцы с 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const editNote = async (id: number, content: string, mood?: Mood) => {
    try {
      console.log('editNote called with id:', id, 'content:', content);
  
      // Форматируем текущую дату
      const formattedDate = formatDate(new Date());
  
      // Вызываем функцию реального обновления заметки
      const updatedNote = await updateNote(id, content, mood);
  
      // Форматируем дату заметки после обновления
      updatedNote.note_date = formattedDate;
  
      // Обновляем состояние заметок с помощью данных, возвращенных из updateNote
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === Number(id) ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  
  const removeNote = async (id: number) => {
    console.log('removeNote called with id:', id);
    // Вместо вызова реального deleteNote, просто выводим сообщение и имитируем удаление
    setNotes(prevNotes => prevNotes.filter(note => note.id !== Number(id)));
  };
  

  return { notes, loading, fetchNotes, addNote, editNote, removeNote };
};