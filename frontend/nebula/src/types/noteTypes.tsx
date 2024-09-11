import { Mood } from "./moodTypes";

export type Note = {
  id: number;
  content: string;
  user_id: string;
  mood: string;
  note_date: string;
}