// src/services/noteService.ts
import { Note, Mood } from '../types/noteTypes';

const mockNotes: Note[] = [
  { id: '1', content: 'Сегодня был отличный день!', user_id: 'user123', mood: 'happy', created_at: '2024-09-06T10:00:00Z' },
  { id: '2', content: 'Немного устал, но все хорошо.', user_id: 'user123', mood: 'neutral', created_at: '2024-09-05T15:30:00Z' },
  { id: '3', content: 'Очень расстроен из-за работы.', user_id: 'user123', mood: 'sad', created_at: '2024-09-04T20:15:00Z' },
];

export const getNotes = async (cursor?: string): Promise<{ notes: Note[], nextCursor: string | null }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + 5;
  const paginatedNotes = mockNotes.slice(startIndex, endIndex);
  const nextCursor = endIndex < mockNotes.length ? endIndex.toString() : null;
  return { notes: paginatedNotes, nextCursor };
};

export const createNote = async (content: string): Promise<Note> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newNote: Note = {
    id: Date.now().toString(),
    content,
    user_id: 'user123',
    mood: await getMoodPrediction(content),
    created_at: new Date().toISOString(),
  };
  mockNotes.unshift(newNote);
  return newNote;
};

export const updateNote = async (id: string, content: string, mood?: Mood): Promise<Note> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockNotes.findIndex(note => note.id === id);
  if (index === -1) throw new Error('Note not found');
  const updatedNote = { ...mockNotes[index], content, mood: mood ?? mockNotes[index].mood };
  mockNotes[index] = updatedNote;
  return updatedNote;
};


export const deleteNote = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockNotes.findIndex(note => note.id === id);
  if (index === -1) throw new Error('Note not found');
  mockNotes.splice(index, 1);
};

const getMoodPrediction = async (text: string): Promise<Mood> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const moods: Mood[] = ['happy', 'sad', 'neutral', 'excited', 'angry'];
  return moods[Math.floor(Math.random() * moods.length)];
};

export const getNotesByDay = async (start_date?: string, end_date?: string, cursor?: string): Promise<{ notes: Note[], nextCursor: string | null }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let filteredNotes = mockNotes;

  if (start_date) {
    filteredNotes = filteredNotes.filter(note => new Date(note.created_at) >= new Date(start_date));
  }

  if (end_date) {
    filteredNotes = filteredNotes.filter(note => new Date(note.created_at) <= new Date(end_date));
  }

  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + 5;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  const nextCursor = endIndex < filteredNotes.length ? endIndex.toString() : null;
  return { notes: paginatedNotes, nextCursor };
};

export const getNotesByMood = async (mood: Mood, cursor?: string): Promise<{ notes: Note[], nextCursor: string | null }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const filteredNotes = mockNotes.filter(note => note.mood === mood);
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + 5;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  const nextCursor = endIndex < filteredNotes.length ? endIndex.toString() : null;
  return { notes: paginatedNotes, nextCursor };
};