import { useState } from 'react';

const projectsData = [
  {
    id: 1,
    title: '筑记 - 轻量级现场装修助手',
    description: '一个小巧的装修帮手，支持图片导入跟装修进度导出',
    tags: ['React', 'Vite', 'PDF', '装修'],
    githubUrl: 'https://github.com/JeasonLoop/renovation-progress-tracker',
    previewUrl: 'https://zhuji.jeasonloop.online/login/',
  },
  {
    id: 2,
    title: '云灵修仙传',
    description: '一个修仙刷宝小游戏，挂机修炼，打怪掉宝，沉浸式修仙体验',
    tags: ['Game', 'JavaScript', 'HTML5', 'React',],
    githubUrl: null,
    previewUrl: 'https://xiuxian.jeasonloop.online/',
  },
  {
    id: 3,
    title: 'Front-End Notes',
    description: '个人笔记博客，采用复古CRT显示器风格，使用React + Vite构建，代码语法高亮，响应式设计',
    tags: ['React', 'Vite', 'CSS3', 'Markdown'],
    githubUrl: 'https://github.com/JeasonLoop/Front-End-Notes',
    previewUrl: null,
  },
];

function isExternalUrl(url) {
  return Boolean(url) && /^https?:\/\//i.test(url);
}

function Projects() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="page-container projects-page">
      <header className="projects-header">
        <h1>项目展示</h1>
        <p className="projects-subtitle">这里展示我开发过的一些有趣项目</p>
      </header>

      <div className="projects-grid">
        {projectsData.map((project) => (
          <article
            key={project.id}
            className={`project-card ${hoveredId === project.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="project-links">
                {isExternalUrl(project.githubUrl) && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    GitHub
                  </a>
                )}
                {isExternalUrl(project.previewUrl) && (
                  <a
                    href={project.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    预览
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Projects;
