import { useState } from 'react';

const projectsData = [
  {
    id: 1,
    title: 'ResumeGen',
    description: '一个轻量简历生成网站，快速创建美观的个人简历，支持导出PDF',
    image: null,
    tags: ['React', 'Vite', 'PDF', '简历'],
    githubUrl: 'https://github.com/JeasonLoop/resumegen',
    previewUrl: 'https://resumegen.jeasonloop.online/',
  },
  {
    id: 2,
    title: '云灵修仙传',
    description: '一个修仙刷宝小游戏，挂机修炼，打怪掉宝，沉浸式修仙体验',
    image: null,
    tags: ['Game', 'JavaScript', 'HTML5'],
    githubUrl: null,
    previewUrl: 'https://yunling.xyvan.cn/',
  },
  {
    id: 3,
    title: 'Front-End Notes',
    description: '个人笔记博客，采用复古CRT显示器风格，使用React + Vite构建，代码语法高亮，响应式设计',
    image: null,
    tags: ['React', 'Vite', 'CSS3', 'Markdown'],
    githubUrl: 'https://github.com/JeasonLoop/Front-End-Notes',
    previewUrl: '#',
  },
];

function Projects() {
  const [hoveredId, setHoveredId] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);

  const openPreview = (project) => {
    setPreviewProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewProject(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="page-container projects-page">
      <header className="projects-header">
        <h1>项目展示</h1>
        <p className="projects-subtitle">这里展示我开发过的一些有趣项目</p>
      </header>

      <div className="projects-grid">
        {projectsData.map(project => (
          <div
            key={project.id}
            className={`project-card ${hoveredId === project.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {project.image && (
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
            )}
            {!project.image && (
              <div className="project-placeholder">
                <span className="project-icon">💻</span>
              </div>
            )}
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="project-links">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    <span>GitHub</span>
                  </a>
                )}
                {project.previewUrl && project.previewUrl !== '#' && (
                  <button
                    onClick={() => openPreview(project)}
                    className="btn btn-primary"
                  >
                    <span>预览</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 弹窗预览 */}
      {previewProject && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>{previewProject.title}</h3>
              <div className="preview-header-actions">
                <a
                  href={previewProject.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-open-btn"
                >
                  🔗 新标签页打开
                </a>
                <button className="preview-close-btn" onClick={closePreview}>
                  ✕
                </button>
              </div>
            </div>
            <div className="preview-modal-content">
              <iframe
                src={previewProject.previewUrl}
                title={previewProject.title}
                frameBorder="0"
                allow="fullscreen"
              />
              <div className="iframe-fallback">
                <p>⚠️ 由于浏览器安全策略限制，此处无法显示内容</p>
                <p>请点击上方「🔗 新标签页打开」访问网站</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
