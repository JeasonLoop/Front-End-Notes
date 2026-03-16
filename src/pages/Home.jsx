import { Link } from 'react-router-dom';
import RetroComputer from '../components/RetroComputer';
import useNotes from '../hooks/useNotes';
import '../styles/pages.css';

function Home() {
  const { notes } = useNotes();
  const totalNotes = notes.length;

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>
          <span>Front-End</span>
          <span className="italic">Notes.</span>
        </h1>
        <p className="lead">
          个人学习笔记汇总，整理前端、后端、计算机基础知识。保持更新，持续学习。
        </p>

        <div className="cta-group">
          <Link to="/all-notes" className="btn btn-primary">开始阅读</Link>
          <span className="stats-tag">{totalNotes} 篇笔记</span>
        </div>

        <div className="specs-grid">
          <div className="spec-item">
            <h4>前端开发</h4>
            <p>JavaScript / React / Vue / CSS</p>
          </div>
          <div className="spec-item">
            <h4>后端开发</h4>
            <p>Node.js / Java / 数据库</p>
          </div>
          <div className="spec-item">
            <h4>计算机基础</h4>
            <p>算法 / 网络 / 操作系统</p>
          </div>
          <div className="spec-item">
            <h4>持续更新</h4>
            <p>学习从未停止</p>
          </div>
        </div>
      </div>

      <div className="home-computer">
        <RetroComputer />
      </div>
    </div>
  );
}

export default Home;
