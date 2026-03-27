import { useState, useEffect } from 'react';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = import.meta.env.BASE_URL;
        const stamp = Date.now();

        // 首先尝试加载树形结构数据
        const treeUrl = `${baseUrl}all-notes-tree.json?v=${stamp}`.replace(/\/+/g, '/');
        const treeResponse = await fetch(treeUrl, { cache: 'no-store' });

        if (treeResponse.ok) {
          const treeData = await treeResponse.json();
          setTree(treeData.tree || []);
          setNotes(treeData.flat || []);
          console.log('Loaded tree data:', treeData.tree?.length, 'categories,', treeData.flat?.length, 'notes');
        } else {
          // 如果树形数据不存在，加载旧的扁平数据
          const flatUrl = `${baseUrl}notes-index.json?v=${stamp}`.replace(/\/+/g, '/');
          const flatResponse = await fetch(flatUrl, { cache: 'no-store' });
          if (!flatResponse.ok) {
            throw new Error('Failed to load notes');
          }
          const flatData = await flatResponse.json();
          setNotes(flatData.notes || []);
          // 从扁平数据构建树形结构
          setTree(buildTreeFromNotes(flatData.notes || []));
          console.log('Loaded flat data:', flatData.notes?.length, 'notes');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading notes:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // 从扁平笔记数据构建树形结构
  const buildTreeFromNotes = (flatNotes) => {
    const categoryMap = {
      '前端': { id: 'frontend', name: '前端开发', icon: '⌘', children: [] },
      '后端': { id: 'backend', name: '后端开发', icon: '⚙', children: [] },
      '经验教程': { id: 'experience', name: '开发经验', icon: '✍️', children: [] },
      '其他': { id: 'other', name: '其他', icon: '📚', children: [] }
    };

    flatNotes.forEach(note => {
      const categoryKey = note.category || '其他';
      const category = categoryMap[categoryKey];

      if (category) {
        let subcategory = null;
        if (note.slug.startsWith('前端-js')) {
          subcategory = 'JavaScript';
        } else if (note.slug.startsWith('前端-react')) {
          subcategory = 'React';
        } else if (note.slug.startsWith('前端-vue')) {
          subcategory = 'Vue';
        } else if (note.slug.startsWith('后端-go')) {
          subcategory = 'Go';
        } else if (note.slug.startsWith('后端-java')) {
          subcategory = 'Java';
        } else if (note.slug.startsWith('开发经验')) {
          if (note.title.includes('架构')) subcategory = '前端架构';
          else if (note.title.includes('性能')) subcategory = '性能优化';
          else if (note.title.includes('TypeScript')) subcategory = 'TypeScript';
          else if (note.title.includes('CSS')) subcategory = 'CSS';
          else if (note.title.includes('AI')) subcategory = 'AI辅助';
          else subcategory = '其他';
        }

        if (subcategory) {
          let subCatNode = category.children.find(c => c.name === subcategory);
          if (!subCatNode) {
            subCatNode = {
              id: `${category.id}-${subcategory.toLowerCase().replace(/\s+/g, '-')}`,
              name: subcategory,
              children: []
            };
            category.children.push(subCatNode);
          }
          subCatNode.children.push({
            id: note.slug,
            name: note.title,
            slug: note.slug,
            path: `/notes/${note.slug}`
          });
        } else {
          category.children.push({
            id: note.slug,
            name: note.title,
            slug: note.slug,
            path: `/notes/${note.slug}`
          });
        }
      }
    });

    return Object.entries(categoryMap).map(([key, category]) => ({
      ...category,
      path: `/category/${category.id}`,
      children: category.children.map(child => ({
        ...child,
        path: child.path || `/category/${category.id}/${child.id}`
      }))
    }));
  };

  return { notes, tree, loading, error };
};

export default useNotes;
