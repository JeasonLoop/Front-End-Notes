import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RetroComputer from './RetroComputer';
import ThreeBackground from './ThreeBackground';
import TreeNav from './TreeNav';
import useNotes from '../hooks/useNotes';

function Layout({ children }) {
  const location = useLocation();
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 });
  const { tree, loading: notesLoading } = useNotes();

  useEffect(() => {
    const startTime = new Date();
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setUptime({ days, hours, minutes });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <ThreeBackground />
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>

      <div className="layout-container">
        <aside className="sidebar">
          <header className="sidebar-header">
            <h1 className="logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">NOTES</span>
              <span className="logo-bracket">/&gt;</span>
            </h1>
          </header>

          <nav className="sidebar-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span className="nav-icon">⌂</span>
              <span>首页</span>
            </Link>
            <Link to="/all-notes" className={`nav-link ${isActive('/all-notes') ? 'active' : ''}`}>
              <span className="nav-icon">📄</span>
              <span>所有笔记</span>
            </Link>

            <div className="nav-section">
              <h3 className="nav-section-title">分类浏览</h3>
              {!notesLoading && tree.length > 0 ? (
                <TreeNav tree={tree} />
              ) : (
                <div className="tree-loading">
                  {notesLoading ? '加载中...' : '暂无笔记'}
                </div>
              )}
            </div>

            <div className="nav-section">
              <h3 className="nav-section-title">链接</h3>
              <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
                <span className="nav-icon">💻</span>
                <span>项目展示</span>
              </Link>
              <a href="https://github.com/JeasonLoop" target="_blank" rel="noopener noreferrer" className="nav-link">
                <span className="nav-icon">♡</span>
                <span>GitHub</span>
              </a>
            </div>
          </nav>

          <footer className="sidebar-footer">
            <p className="terminal-prompt">guest@notes:~$</p>
            <p className="uptime">UPTIME: <span>{uptime.days}d {uptime.hours}h {uptime.minutes}m</span></p>
          </footer>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;
