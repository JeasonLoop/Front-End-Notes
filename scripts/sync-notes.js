import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// all-notes 目录（src 同级，直接存放笔记）
const ALL_NOTES_DIR = path.join(__dirname, '../all-notes');
// 目标 markdown 目录（用于构建后访问）
const TARGET_DIR = path.join(__dirname, '../public/notes');
// 目标资源目录（用于 Obsidian 图片等附件）
const ASSETS_DIR = path.join(__dirname, '../public/notes-assets');
// 索引文件（React 应用通过 /all-notes-tree.json 加载）
const TREE_INDEX_FILE = path.join(__dirname, '../public/all-notes-tree.json');
// 缺失图片日志
const missingAssetsByNote = new Map();

// 笔记文件名到 slug 的完整映射
const slugMapping = {
  // JavaScript
  '01-闭包和作用域': '前端-js-01-闭包和作用域',
  '02-this绑定和上下文': '前端-js-02-this绑定和上下文',
  '03-原型和继承': '前端-js-03-原型和继承',
  '04-异步编程详解': '前端-js-04-异步编程详解',
  '05-事件循环和并发': '前端-js-05-事件循环和并发',
  '06-函数式编程': '前端-js-06-函数式编程',
  '07-es6-新特性详解': '前端-js-07-es6-新特性详解',
  '08-元编程和反射': '前端-js-08-元编程和反射',
  '09-设计模式': '前端-js-09-设计模式',
  '10-内存管理和性能优化': '前端-js-10-内存管理和性能优化',
  '11-模块化和打包': '前端-js-11-模块化和打包',
  '12-错误处理和调试': '前端-js-12-错误处理和调试',
  'JS基础&高级语法笔记': 'notes-原生js-js基础-高级语法笔记',
  '原型链解析': 'notes-原生js-原型链解析',
  '同步异步函数': 'notes-原生js-同步异步函数',
  // React
  '01-基础入门': '前端-react-01-基础入门',
  '02-hooks': '前端-react-02-hooks',
  '03-状态管理': '前端-react-03-状态管理',
  '04-路由管理': '前端-react-04-路由管理',
  '05-性能优化': '前端-react-05-性能优化',
  '06-最佳实践': '前端-react-06-最佳实践',
  'Diff算法': 'notes-react-diff',
  '高阶组件HOC': 'notes-react-hoc高阶组件',
  'Redux': 'notes-react-redux',
  'useCallback&useMemo': 'notes-react-usecallback-usememo',
  'useRef存取状态': 'notes-react-useref存取状态',
  // Vue
  '01-基础入门': '前端-vue-01-基础入门',
  '02-组件系统': '前端-vue-02-组件系统',
  '03-响应式原理': '前端-vue-03-响应式原理',
  '04-composition-api': '前端-vue-04-composition-api',
  '05-路由管理': '前端-vue-05-路由管理',
  '06-状态管理': '前端-vue-06-状态管理',
  '07-最佳实践': '前端-vue-07-最佳实践',
  // 计算机网络
  '访问URL的背后': 'notes-计算机网络-访问url的背后',
  '浏览器工作原理': 'notes-计算机网络-浏览器工作原理',
  '浏览器缓存': 'notes-计算机网络-浏览器缓存',
  'BOM属性对象方法': 'notes-计算机网络-bom属性对象方法',
  'HTTP&HTTPS': 'notes-计算机网络-http-https',
  'TCP三次握手': 'notes-计算机网络-tcp三次握手',
  // 工具函数
  '前端实用工具函数集合': 'codeblock-工具函数',
  // Go
  '简介与特点': '后端-go-01-基础入门-go-简介与特点',
  '安装与环境配置': '后端-go-01-基础入门-安装与环境配置',
  '基础语法': '后端-go-01-基础入门-基础语法',
  '函数': '后端-go-01-基础入门-函数',
  '包与模块': '后端-go-01-基础入门-包与模块',
  '控制结构': '后端-go-01-基础入门-控制结构',
  '数据类型与变量': '后端-go-01-基础入门-数据类型与变量',
  '结构体与方法': '后端-go-01-基础入门-结构体与方法',
  '接口': '后端-go-01-基础入门-接口',
  'goroutine协程': '后端-go-02-核心特性-goroutine协程',
  'channel通道': '后端-go-02-核心特性-channel通道',
  'select语句': '后端-go-02-核心特性-select语句',
  '同步原语': '后端-go-02-核心特性-同步原语',
  '错误处理机制': '后端-go-02-核心特性-错误处理机制',
  'HTTP服务基础': '后端-go-03-web开发-http-服务基础',
  'Gin框架': '后端-go-03-web开发-gin-框架',
  '路由处理': '后端-go-03-web开发-路由处理',
  '中间件': '后端-go-03-web开发-中间件',
  '第一个HTTP服务': '后端-go-06-实践项目-第一个-http-服务',
  '微服务基础': '后端-go-05-企业架构-微服务基础',
  '!MOC-Go': '后端-go-moc-go',
  'Go 知识体系（Go）': '后端-go-moc-go',
  // Java
  '简介与特点': '后端-java-01-基础入门-java-简介与特点',
  '安装与环境配置': '后端-java-01-基础入门-安装与环境配置',
  '基础语法': '后端-java-01-基础入门-基础语法',
  '数据类型与变量': '后端-java-01-基础入门-数据类型与变量',
  '控制结构': '后端-java-01-基础入门-控制结构',
  '数组与字符串': '后端-java-01-基础入门-数组与字符串',
  '函数与方法': '后端-java-01-基础入门-函数与方法',
  '异常处理': '后端-java-01-基础入门-异常处理',
  'IO流': '后端-java-01-基础入门-io流',
  '类与对象': '后端-java-02-面向对象-类与对象',
  '接口与抽象类': '后端-java-02-面向对象-接口与抽象类',
  '继承与多态': '后端-java-02-面向对象-继承与多态',
  '枚举': '后端-java-02-面向对象-枚举',
  '内部类': '后端-java-02-面向对象-内部类',
  '集合List': '后端-java-03-高级特性-集合-list',
  'JDBC基础': '后端-java-07-数据库操作-jdbc基础',
  'MyBatis入门': '后端-java-07-数据库操作-mybatis入门',
  '!MOC-Java': '后端-java-moc-java',
  'Java 知识体系': '后端-java-moc-java',
  // 服务器
  'Docker部署前端项目教程': '服务器-docker部署前端项目教程',
  // 开发经验
  '当我们聊前端架构我们在聊什么': '开发经验-当我们聊前端架构我们在聊什么',
  'React性能优化从理论到实战': '开发经验-react性能优化从理论到实战',
  'TypeScript进阶用好类型体操提升代码质量': '开发经验-typescript进阶用好类型体操提升代码质量',
  'CSS现代布局ContainerQueries真香': '开发经验-css现代布局containerqueries真香',
  'AI辅助开发一年体验总结': '开发经验-ai辅助开发一年体验总结',
  'VibeCoding我是如何用AI写代码的': '开发经验-vibecoding我是如何用ai写代码的',
  '中高阶前端必懂闭包其实并不难': '开发经验-中高阶前端必懂闭包其实并不难',
  '网址书签收集': '开发经验-网址书签收集',
  // 其他
  '技术课程收集': 'notes-技术课程收集',
  '1-文档文章': '网址收集-1-文档文章',
  '2-工具轮子': '网址收集-2-工具轮子',
  '3-摸鱼': '网址收集-3-摸鱼',
};

// 子分类显示名称映射
const SUBCATEGORY_NAMES = {
  'javascript': 'JavaScript',
  'react': 'React',
  'vue': 'Vue',
  '计算机网络': '计算机网络',
  '工具函数': '工具函数',
  'go': 'Go',
  'java': 'Java',
  '服务器': '服务器',
  '基础入门': '基础入门',
  '核心特性': '核心特性',
  'web开发': 'Web开发',
  '实践项目': '实践项目',
  '企业架构': '企业架构',
  '面向对象': '面向对象',
  '高级特性': '高级特性',
  '数据库操作': '数据库操作',
  '前端架构': '前端架构',
  '性能优化': '性能优化',
  'typescript': 'TypeScript',
  'css': 'CSS',
  'ai辅助': 'AI辅助',
  '技术课程': '技术课程',
  '网址收集': '网址收集',
  '其他': '其他'
};

// 解析 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (match) {
    return { frontmatter: match[1], body: content.slice(match[0].length) };
  }
  return { frontmatter: '', body: content };
}

// 提取标题
function extractTitle(content, filename) {
  void content;
  return filename.replace('.md', '');
}

// 提取描述
function extractDescription(body) {
  const text = extractPlainText(body);
  const firstLine = text;
  return firstLine.length > 20 && firstLine.length < 200 ? firstLine : undefined;
}

function extractPlainText(body) {
  return body
    .replace(/^---[\s\S]*?---\n?/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[\[([^\]]+)\]\]/g, ' ')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^>\s?.*$/gm, ' ')
    .replace(/^#+\s?/gm, '')
    .replace(/[*_~`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(body) {
  const plain = extractPlainText(body);
  if (!plain) return 0;
  return plain.length;
}

// 生成 slug
function generateSlug(fileName, relativePath) {
  const baseName = fileName.replace('.md', '');

  // 特殊处理 README 文件
  if (baseName.toLowerCase() === 'readme') {
    const parts = relativePath.split('/');
    const category = parts[0];
    const parentFolder = parts[1] || '';

    if (category === '后端' && parentFolder === 'Go') {
      return '后端-go-moc-go';
    } else if (category === '后端' && parentFolder === 'Java') {
      return '后端-java-moc-java';
    } else if (category === '前端' && parentFolder === 'JavaScript') {
      return '前端-js-readme';
    } else if (category === '前端' && parentFolder === 'React') {
      return '前端-react-readme';
    } else if (category === '前端' && parentFolder === 'Vue') {
      return '前端-vue-readme';
    }
  }

  // 优先使用映射表
  if (slugMapping[baseName]) {
    return slugMapping[baseName];
  }

  // 否则从相对路径生成
  const parts = relativePath.split('/');
  const category = parts[0];
  const subcategory = parts[1] || '';
  const cleanName = baseName
    .replace(/^0\d-/, '')
    .replace(/^0\d-/, '');

  if (category === '前端' && subcategory === 'JavaScript') {
    return `前端-js-${cleanName}`;
  } else if (category === '前端' && subcategory === 'React') {
    return `前端-react-${cleanName}`;
  } else if (category === '前端' && subcategory === 'Vue') {
    return `前端-vue-${cleanName}`;
  } else if (category === '后端' && subcategory === 'Go') {
    return `后端-go-${cleanName}`;
  } else if (category === '后端' && subcategory === 'Java') {
    return `后端-java-${cleanName}`;
  } else if (category === '开发经验') {
    return `开发经验-${cleanName}`;
  } else if (category === '其他') {
    return `其他-${cleanName}`;
  }

  return baseName.toLowerCase().replace(/\s+/g, '-');
}

// 递归扫描目录
function scanDirectory(dir, relativePath = '') {
  const items = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // 先处理目录
  const dirs = entries.filter(entry => entry.isDirectory());
  const files = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'));

  for (const dirEntry of dirs) {
    const dirName = dirEntry.name;
    const dirPath = path.join(dir, dirName);
    const childItems = scanDirectory(dirPath, path.join(relativePath, dirName));

    const dirId = dirName.toLowerCase().replace(/\s+/g, '-');
    const displayName = SUBCATEGORY_NAMES[dirId] || dirName;

    if (childItems.length > 0) {
      items.push({
        id: dirId,
        name: displayName,
        type: 'folder',
        children: childItems
      });
    }
  }

  // 处理文件
  for (const fileEntry of files) {
    const fileName = fileEntry.name;
    const filePath = path.join(dir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(fileContent);
    const title = extractTitle(body, fileName);
    const fileRelativePath = path.join(relativePath, fileName).replace(/\\/g, '/');
    const slug = generateSlug(fileName, fileRelativePath);

    items.push({
      id: slug,
      name: title,
      type: 'file',
      path: `/notes/${slug}.md`,
      slug: slug,
      description: extractDescription(body),
      wordCount: countWords(body),
      relativePath: fileRelativePath,
      sourceFile: filePath
    });
  }

  return items;
}

// 构建 all-notes 树形结构
function buildAllNotesTree() {
  console.log('开始扫描 all-notes 目录...');

  if (!fs.existsSync(ALL_NOTES_DIR)) {
    console.error('all-notes 目录不存在:', ALL_NOTES_DIR);
    return null;
  }

  const tree = [];
  const flat = [];

  const categories = fs.readdirSync(ALL_NOTES_DIR, { withFileTypes: true });
  const categoryDirs = categories.filter(entry => entry.isDirectory());

  // 顶层目录统一按名称（中文优先）排序，自动适配新增目录
  const sortedCategoryDirs = categoryDirs.sort((a, b) =>
    a.name.localeCompare(b.name, 'zh-CN')
  );

  for (const dirEntry of sortedCategoryDirs) {
    const categoryName = dirEntry.name;
    const categoryPath = path.join(ALL_NOTES_DIR, categoryName);

    const childItems = scanDirectory(categoryPath, categoryName);

    // 不再单独使用图标，前端直接展示 name 即可
    const icon = null;
    const categoryId = categoryName.toLowerCase();

    tree.push({
      id: categoryId,
      name: categoryName,
      icon,
      type: 'category',
      path: `/category/${categoryId}`,
      children: childItems
    });

    // 收集所有笔记到 flat 数组
    function collectFlat(items) {
      for (const item of items) {
        if (item.type === 'file') {
          flat.push({
            slug: item.slug,
            title: item.name,
            description: item.description,
            wordCount: item.wordCount || 0,
            category: categoryName,
            file: item.path,
            relativePath: item.relativePath
          });
        } else if (item.children) {
          collectFlat(item.children);
        }
      }
    }
    collectFlat(childItems);
  }

  return { tree, flat };
}

function clearDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return;
  }

  const existingFiles = fs.readdirSync(dirPath);
  for (const file of existingFiles) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
}

function normalizeAssetPath(rawPath = '') {
  const clean = rawPath.split('#')[0].split('?')[0].trim();
  try {
    return decodeURIComponent(clean);
  } catch {
    return clean;
  }
}

function isLocalAssetPath(target = '') {
  if (!target) return false;
  if (target.startsWith('/') || target.startsWith('#')) return false;
  if (/^(https?:)?\/\//i.test(target)) return false;
  if (target.startsWith('data:') || target.startsWith('mailto:')) return false;
  return true;
}

function recordMissingAsset(note, assetPath) {
  const key = `${note.slug} (${note.relativePath})`;
  if (!missingAssetsByNote.has(key)) {
    missingAssetsByNote.set(key, new Set());
  }
  missingAssetsByNote.get(key).add(assetPath);
}

function copyNoteAsset(note, assetPath) {
  const normalizedAssetPath = normalizeAssetPath(assetPath);
  if (!isLocalAssetPath(normalizedAssetPath)) {
    return null;
  }

  const noteDir = path.dirname(path.join(ALL_NOTES_DIR, note.relativePath));
  const sourcePath = path.resolve(noteDir, normalizedAssetPath);
  if (!sourcePath.startsWith(noteDir)) {
    recordMissingAsset(note, `${assetPath} [非法路径或越界访问]`);
    return null;
  }

  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    recordMissingAsset(note, assetPath);
    return null;
  }

  const fileName = path.basename(normalizedAssetPath);
  const safeFileName = fileName.replace(/\s+/g, '-');
  const targetFolder = path.join(ASSETS_DIR, note.slug);
  fs.mkdirSync(targetFolder, { recursive: true });
  const targetPath = path.join(targetFolder, safeFileName);
  fs.copyFileSync(sourcePath, targetPath);

  return `notes-assets/${note.slug}/${safeFileName}`;
}

function transformNoteContent(content, note) {
  let transformed = content;

  transformed = transformed.replace(/!\[\[([^\]]+)\]\]/g, (full, target) => {
    const [rawPath, rawAlt] = target.split('|');
    const assetPath = rawPath?.trim();
    if (!assetPath) return full;

    const publicAssetPath = copyNoteAsset(note, assetPath);
    if (!publicAssetPath) return full;

    const alt = (rawAlt?.trim() || path.basename(assetPath)).replace(/\]/g, '');
    return `![${alt}](/${publicAssetPath})`;
  });

  transformed = transformed.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (full, alt, link) => {
    const publicAssetPath = copyNoteAsset(note, link);
    if (!publicAssetPath) return full;
    return `![${alt}](/${publicAssetPath})`;
  });

  return transformed;
}

// 复制笔记文件到 public/notes
function copyNotesToPublic(flatNotes) {
  console.log('复制笔记到 public/notes...');
  missingAssetsByNote.clear();

  clearDirectory(TARGET_DIR);
  clearDirectory(ASSETS_DIR);

  // 复制笔记文件
  for (const note of flatNotes) {
    const sourcePath = path.join(ALL_NOTES_DIR, note.relativePath);

    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      const transformedContent = transformNoteContent(content, note);
      const targetPath = path.join(TARGET_DIR, `${note.slug}.md`);
      fs.writeFileSync(targetPath, transformedContent);
      console.log(`✓ Copied: ${note.relativePath} → ${note.slug}.md`);
    }
  }

  if (missingAssetsByNote.size > 0) {
    console.warn('\n⚠ 缺图日志（以下资源未找到）:');
    let missingCount = 0;
    for (const [noteKey, assets] of missingAssetsByNote.entries()) {
      console.warn(`- ${noteKey}`);
      for (const asset of assets) {
        missingCount += 1;
        console.warn(`  • ${asset}`);
      }
    }
    console.warn(`⚠ 总计缺失资源: ${missingCount}`);
  } else {
    console.log('✓ 图片资源检查通过：未发现缺图');
  }
}

// 主函数
function main() {
  const data = buildAllNotesTree();

  if (!data) {
    process.exit(1);
  }

  copyNotesToPublic(data.flat);

  fs.writeFileSync(TREE_INDEX_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✓ Generated all-notes-tree.json`);
  console.log(`✓ ${data.tree.length} categories, ${data.flat.length} notes`);
}

main();
