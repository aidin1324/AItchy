import React, { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Note {
  id: number;
  content: string;
  note_date: string;
  mood_id: number;
}

const AITooltip: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/notes/all?limit=1000000', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data.items);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const analyzeNote = async (noteId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/entry-analyze/analyze-entry?note_id=${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to analyze note');
      }

      const data = await response.json();
      const formattedAnalysis = formatAnalysis(data.response);
      setAnalysis(formattedAnalysis);
    } catch (error) {
      console.error('Error analyzing note:', error);
    }
  };

  const formatAnalysis = (rawAnalysis: string): string => {
    const sections = rawAnalysis.split('\n\n');
    const formattedSections = sections.map((section, index) => {
      const [title, ...content] = section.split('\n');
      return `## ${title.replace(/^\d+\.\s*/, '')}

${content.join('\n\n')}

---`;
    });

    return `# Анализ вашей записи

${formattedSections.join('\n\n')}

> 💡 Этот анализ основан на твоей записи и предназначен для размышления. Помни, что ты лучше всего знаешь свою ситуацию.`;
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    analyzeNote(note.id);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <Bot size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">AI Анализ</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-grow">
                {!selectedNote ? (
                  <>
                    <p className="mb-4 text-gray-700">Выберите запись для анализа:</p>
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => handleNoteSelect(note)}
                          className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition duration-200"
                        >
                          <p className="font-semibold">{note.note_date}</p>
                          <p className="text-sm text-gray-600 truncate">{note.content}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold mb-2">Выбранная запись:</h3>
                    <p className="mb-4 p-2 bg-gray-100 rounded">{selectedNote.content}</p>
                    {analysis ? (
                      <div className="prose max-w-none">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-600">Загрузка анализа...</p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedNote(null);
                        setAnalysis(null);
                      }}
                      className="mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded hover:from-purple-600 hover:to-pink-700 transition duration-300"
                    >
                      Выбрать другую запись
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITooltip;