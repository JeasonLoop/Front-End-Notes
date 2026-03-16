import { useParams, Link } from 'react-router-dom';
import useNotes from '../hooks/useNotes';

function Category() {
  const { id } = useParams();
  const { notes, loading, error } = useNotes();

  const categoryName = {
    frontend: '前端开发',
    backend: '后端开发',
    experience: '经验教程',
    other: '其他'
  };

  const filteredNotes = notes.filter(note => {
    if (id === 'frontend') return note.category === '前端';
    if (id === 'backend') return note.category === '后端';
    if (id === 'experience') return note.category === '经验教程';
    return note.category !== '前端' && note.category !== '后端' && note.category !== '经验教程';
  });

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>{categoryName[id] || id}</h1>
      <div className="notes-grid">
        {filteredNotes.map(note => (
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

export default Category;
