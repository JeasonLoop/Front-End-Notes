import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import useNotes from '../hooks/useNotes';

function NoteDetail() {
  const { slug } = useParams();
  const { notes, loading: notesLoading } = useNotes();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const note = notes.find(n => n.slug === slug);

  useEffect(() => {
    // 如果笔记还在加载中，等待
    if (notesLoading) {
      return;
    }

    // 如果笔记不存在，不做处理
    if (!note) {
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.BASE_URL;

        // 从 notes 目录加载（同步后的扁平结构）
        let url = `${baseUrl}notes/${slug}.md`.replace(/\/+/g, '/');
        let response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to load note: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err.message);
        console.error('Error loading note:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug, note, notesLoading]);

  if (notesLoading) {
    return (
      <div className="page-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="page-container">
        <h1>笔记不存在</h1>
        <p>笔记 slug: {slug}</p>
        <p>可用笔记数量: {notes.length}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">加载内容中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>{note.title}</h1>
        <div className="error">加载失败: {error}</div>
        <p className="hint">请确保笔记文件已同步到 public/notes/{slug}.md</p>
      </div>
    );
  }

  return (
    <div className="page-container note-detail">
      <header className="note-header">
        <h1>{note.title}</h1>
        {note.description && <p className="note-description">{note.description}</p>}
        <div className="note-meta">
          {note.category && <span className="tag">{note.category}</span>}
          {note.tags?.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </header>
      <MarkdownRenderer content={content} />
    </div>
  );
}

export default NoteDetail;
