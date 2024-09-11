// src/services/noteService.ts
import { jwtDecode } from "jwt-decode";
import { Mood, MoodType } from "../types/moodTypes";
import { Note } from "../types/noteTypes";

const mockNotes: Note[] = [
  {
    id: 1,
    content: "Сегодня был отличный день!",
    user_id: "user123",
    mood: "happy",
    note_date: "2024-09-06T10:00:00Z",
  },
  {
    id: 2,
    content: "Немного устал, но все хорошо.",
    user_id: "user123",
    mood: "neutral",
    note_date: "2024-09-05T15:30:00Z",
  },
  {
    id: 3,
    content: "Очень расстроен из-за работы.",
    user_id: "user123",
    mood: "sad",
    note_date: "2024-09-04T20:15:00Z",
  },
];

export const getNotes = async (
  cursor?: string
): Promise<{ notes: Note[]; nextCursor: string | null }> => {
  const notesUrl = "http://127.0.0.1:8000/notes/all";
  const moodsUrl = "http://127.0.0.1:8000/mood-content/all";

  try {
    // Запрос для получения списка всех доступных эмоций
    const moodsResponse = await fetch(moodsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // предполагая, что токен хранится в localStorage
      },
    });

    if (!moodsResponse.ok) {
      throw new Error(`Error fetching moods: ${moodsResponse.statusText}`);
    }

    const moodsData: Mood[] = await moodsResponse.json();
    const moodMap = new Map<number, string>(
      moodsData.map((mood) => [mood.id, mood.type])
    );

    // Запрос для получения заметок
    const notesUrlWithParams = new URL(notesUrl);
    notesUrlWithParams.searchParams.append("last_id", cursor || "0");
    notesUrlWithParams.searchParams.append("limit", "5"); // Устанавливаем лимит в 5, как в вашем mock коде

    const notesResponse = await fetch(notesUrlWithParams.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!notesResponse.ok) {
      throw new Error(`Error fetching notes: ${notesResponse.statusText}`);
    }

    const data = await notesResponse.json();

    const notes: Note[] = data.items.map((item: any) => ({
      content: item.content,
      note_date: item.note_date,
      mood: moodMap.get(item.mood_id) || "unknown", // Заменяем mood_id на type
      id: item.id,
      user_id: item.user_id,
    }));

    const nextCursor = data.next_cursor ? data.next_cursor.toString() : null;

    return { notes, nextCursor };
  } catch (error) {
    console.error(error);
    return { notes: [], nextCursor: null };
  }
};

const getMoodId = async (mood: MoodType): Promise<number> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/mood-content/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching mood content: ${response.statusText}`);
    }

    const moodData = await response.json();
    const moodItem = moodData.find(
      (item: { type: string; id: number }) => item.type === mood
    );

    if (!moodItem) {
      throw new Error(`Mood type '${mood}' not found`);
    }

    return moodItem.id;
  } catch (error) {
    console.error("Error fetching mood ID:", error);
    throw error;
  }
};

interface JwtPayload {
  user_id: string;
  // другие поля, если есть
}

export const createNote = async (
  content: string,
  mood: MoodType
): Promise<Note> => {
  try {
    const moodId = await getMoodId(mood);

    // Форматируем дату в формат YYYY-MM-DD
    const noteDate = new Date().toISOString().split("T")[0]; // Получаем только дату без времени

    const token = localStorage.getItem("token");

    let userId = "";
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      userId = decodedToken.user_id;
    } else {
      throw new Error("Token is missing from localStorage");
    }

    const body = JSON.stringify({
      content,
      note_date: noteDate, // Используем форматированную дату
      mood_id: moodId,
      user_id: userId,
    });

    console.log(body); // Для отладки

    const response = await fetch("http://127.0.0.1:8000/notes/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Error creating note: ${response.statusText}`);
    }

    const createdNote = await response.json();

    return {
      id: createdNote.id,
      content: createdNote.content,
      user_id: createdNote.user_id,
      mood: mood, // Сохраняем тип эмоции, а не ID
      note_date: createdNote.note_date,
    };
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const updateNote = async (
  id: number,
  content: string,
  mood?: Mood
): Promise<Note> => {
  console.log(
    "updateNote called with id:",
    id,
    "content:",
    content,
    "mood:",
    mood
  );
  return {
    id: Number(id), // Возвращаем id как number
    content,
    user_id: "user123",
    mood: mood ? mood.type : "happy", // Хардкодируем значение для mood, если передан mood
    note_date: new Date().toISOString(),
  };
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/notes/delete?note_id=${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // если нужно передавать токен для аутентификации
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ошибка удаления заметки с id: ${id}. Статус: ${response.status}`
      );
    }

    console.log(`Заметка с id: ${id} успешно удалена`);
  } catch (error) {
    console.error("Ошибка при удалении заметки:", error);
  }
};

const getMoodPrediction = async (text: string): Promise<Mood> => {
  console.log("getMoodPrediction called with text:", text);
  return {
    type: "happy", // Хардкодируем значение для mood
    id: 1, // Хардкодируем значение для id
  };
};

export const getNotesByDay = async (
  start_date?: string,
  end_date?: string,
  cursor?: string
): Promise<{ notes: Note[]; nextCursor: string | null }> => {
  console.log(
    "getNotesByDay called with start_date:",
    start_date,
    "end_date:",
    end_date,
    "cursor:",
    cursor
  );
  return {
    notes: mockNotes, // Возвращаем все моковые заметки
    nextCursor: null, // Хардкодируем значение для nextCursor
  };
};

export const getNotesByMood = async (
  mood: Mood,
  cursor?: string
): Promise<{ notes: Note[]; nextCursor: string | null }> => {
  console.log("getNotesByMood called with mood:", mood, "cursor:", cursor);
  return {
    notes: mockNotes.filter((note) => note.mood === mood.type), // Фильтруем по mood
    nextCursor: null, // Хардкодируем значение для nextCursor
  };
};
