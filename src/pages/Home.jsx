import { Link } from 'react-router-dom';
import RetroComputer from '../components/RetroComputer';
import useNotes from '../hooks/useNotes';
import '../styles/pages.css';

function Home() {
  const { notes, tree } = useNotes();
  const totalNotes = notes.length;
  const totalWords = notes.reduce((sum, note) => sum + (note.wordCount || 0), 0);

  // 从同步的 tree 动态生成分类卡片，数量按 note.category 与顶层目录名一致来统计
  const categories = (tree || []).map((node) => ({
    id: node.id,
    name: node.name,
    icon: node.icon,
    count: notes.filter((n) => n.category === node.name).length,
  }));

  // 最近 3 篇笔记（无 date 时按 title 排序）
  const recentNotes = [...notes]
    .sort((a, b) => (a.date && b.date ? new Date(b.date) - new Date(a.date) : 0))
    .slice(0, 3);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="home-page-enhanced">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>
            <span className="hero-title-line">Front-End</span>
            <span className="hero-title-line italic">Notes.</span>
          </h1>
          <p className="hero-lead">
            个人学习笔记汇总，整理前端、后端、计算机基础知识。<br />
            保持更新，持续学习。
          </p>

          <div className="cta-group">
            <Link to="/all-notes" className="btn btn-primary">开始阅读</Link>
            <Link to="/projects" className="btn btn-outline">项目展示</Link>
          </div>

          <div className="hero-stats">
            <span className="stats-tag">{totalNotes} 篇笔记</span>
          </div>
        </div>

        <div className="home-computer">
          <RetroComputer />
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{totalNotes}</div>
          <div className="stat-label">总笔记数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">分类</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.max(1, Math.floor(totalWords / 1000))}k
          </div>
          <div className="stat-label">字数统计</div>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="categories-section">
        <h2 className="section-title">
          <span className="section-icon">🗂️</span>
          分类浏览
        </h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.id}`}
              className="category-card"
              key={cat.id}
            >
              {cat.icon && <div className="category-icon">{cat.icon}</div>}
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} 篇笔记</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近更新 */}
      {recentNotes.length > 0 && (
        <div className="recent-notes">
          <h2 className="section-title">
            <span className="section-icon">🆕</span>
            最近更新
          </h2>
          <div className="recent-list">
            {recentNotes.map(note => (
              <Link to={`/notes/${note.slug}`} className="recent-note-card" key={note.slug}>
                <div className="recent-note-info">
                  <h3 className="recent-note-title">{note.title}</h3>
                  {note.description && (
                    <p className="recent-note-excerpt">{note.description}</p>
                  )}
                  <div className="recent-note-meta">
                    <span className="recent-note-category">{note.category}</span>
                    {note.date && <span className="recent-note-date">{formatDate(note.date)}</span>}
                  </div>
                </div>
                <span className="recent-note-arrow">→</span>
              </Link>
            ))}
          </div>
          <div className="view-all">
            <Link to="/all-notes" className="btn">查看全部笔记</Link>
          </div>
        </div>
      )}

      {/* 技能栈标签云风格 */}
      <div className="tech-tags-section">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          技术栈
        </h2>
        <div className="tech-tags">
          <span className="tech-tag">JavaScript</span>
          <span className="tech-tag">React</span>
          <span className="tech-tag">Vue</span>
          <span className="tech-tag">TypeScript</span>
          <span className="tech-tag">CSS</span>
          <span className="tech-tag">HTML</span>
          <span className="tech-tag">Node.js</span>
          <span className="tech-tag">Git</span>
          <span className="tech-tag">算法</span>
          <span className="tech-tag">计算机网络</span>
          <span className="tech-tag">设计模式</span>
          <span className="tech-tag">数据结构</span>
          <span className="tech-tag">操作系统</span>
          <span className="tech-tag">Java</span>
          <span className="tech-tag">数据库</span>
          <span className="tech-tag">WebPack</span>
          <span className="tech-tag">Vite</span>
        </div>
      </div>

      {/* 名言警句 */}
      <div className="quote-section">
        <blockquote className="quote">
          "Talk is cheap. Show me the code."
          <footer>Linus Torvalds</footer>
        </blockquote>
      </div>
    </div>
  );
}

export default Home;
