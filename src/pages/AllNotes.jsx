import { Link } from 'react-router-dom';
import useNotes from '../hooks/useNotes';

function AllNotes() {
  const { notes, loading, error } = useNotes();

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>所有笔记</h1>
      <div className="notes-grid">
        {notes.map(note => (
          <Link key={note.slug} to={`/notes/${note.slug}`} className="note-card">
            <div className="note-card-header">
              <h3>{note.title}</h3>
            </div>
            {note.description && <p>{note.description}</p>}
            <div className="note-tags">
              {note.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllNotes;
