import { useState, useEffect } from 'react';

// 笔记数据（从 notes-index.json 加载）
const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/notes-index.json');
        if (!response.ok) {
          throw new Error('Failed to load notes');
        }
        const data = await response.json();
        setNotes(data.notes || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading notes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return { notes, loading, error };
};

export default useNotes;
