import { useState, useEffect } from 'react';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = import.meta.env.BASE_URL;
        const stamp = Date.now();
        const treeUrl = `${baseUrl}all-notes-tree.json?v=${stamp}`.replace(/\/+/g, '/');
        const treeResponse = await fetch(treeUrl, { cache: 'no-store' });
        if (!treeResponse.ok) {
          throw new Error('Failed to load all-notes-tree.json. Run npm run sync.');
        }
        const treeData = await treeResponse.json();
        setTree(treeData.tree || []);
        setNotes(treeData.flat || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading notes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return { notes, tree, loading, error };
};

export default useNotes;
