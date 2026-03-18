import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// 箭头图标组件
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// 树节点组件
function TreeNode({ node, level = 0, activePath, onToggle, expandedNodes }) {
  const location = useLocation();
  const hasChildren = node.children && node.children.length > 0;
  // 对于文件节点，使用 slug 作为路径
  const nodePath = node.type === 'file' ? `/notes/${node.slug}` : node.path;
  const isActive = activePath === nodePath || location.pathname === nodePath || (nodePath && location.pathname.startsWith(nodePath));
  const isExpanded = expandedNodes.has(node.id);

  // 自动展开包含当前路径的父节点
  if (hasChildren && node.children.some(child => {
    const childPath = child.type === 'file' ? `/notes/${child.slug}` : child.path;
    return location.pathname === childPath || location.pathname.startsWith(childPath);
  }) && !expandedNodes.has(node.id)) {
    expandedNodes.add(node.id);
  }

  const handleClick = (e) => {
    if (hasChildren) {
      e.preventDefault();
      onToggle(node.id);
    }
  };

  return (
    <div className="tree-node">
      {hasChildren ? (
        <div
          className={`tree-link ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={handleClick}
        >
          <span className="tree-toggle">
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </span>
          {node.icon && <span className="tree-icon">{node.icon}</span>}
          <span className="tree-label">{node.name}</span>
          <span className="tree-count">{node.children.length}</span>
        </div>
      ) : (
        <Link
          to={nodePath}
          className={`tree-link ${isActive ? 'active' : ''}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {node.icon && <span className="tree-icon">{node.icon}</span>}
          <span className="tree-label">{node.name}</span>
        </Link>
      )}

      {hasChildren && isExpanded && (
        <div className="tree-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              activePath={activePath}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 树形导航组件
export default function TreeNav({ tree }) {
  const location = useLocation();
  const [expandedNodes, setExpandedNodes] = useState(new Set(['frontend', 'backend', 'experience', 'other']));

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleToggle = (nodeId) => {
    toggleNode(nodeId);
  };

  return (
    <div className="tree-nav">
      {tree.map(node => (
        <div key={node.id} className="tree-section">
          <TreeNode
            node={node}
            activePath={location.pathname}
            onToggle={handleToggle}
            expandedNodes={expandedNodes}
          />
        </div>
      ))}
    </div>
  );
}
