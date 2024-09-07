export type Mood = "happy" | "sad" | "neutral" | "excited" | "angry";

export type Note = {
  id: string;
  content: string;
  user_id: string;
  mood: Mood;
  created_at: string;
}