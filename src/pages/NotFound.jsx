import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-container not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>页面未找到</h2>
        <p>这个笔记不存在哦</p>
        <Link to="/" className="btn btn-primary">返回首页</Link>
      </div>
    </div>
  );
}

export default NotFound;
