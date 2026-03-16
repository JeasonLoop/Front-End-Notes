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
        const baseUrl = import.meta.env.BASE_URL;
        const url = `${baseUrl}notes-index.json`.replace(/\/+/g, '/');
        const response = await fetch(url);
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
