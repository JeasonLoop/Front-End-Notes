import { useParams, Link } from 'react-router-dom';
import useNotes from '../hooks/useNotes';

function Category() {
  const { id } = useParams();
  const { notes, tree, loading, error } = useNotes();

  const categoryNode = (tree || []).find((node) => node.id === id);
  const categoryName = categoryNode ? categoryNode.name : id;
  const filteredNotes = notes.filter((note) => note.category === categoryName);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1>{categoryName}</h1>
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
