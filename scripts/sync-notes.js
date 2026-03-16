import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源笔记目录
const SOURCE_DIRS = ['前端', '后端', '开发经验', '服务器', 'CodeBlock', '📝Notes', '🎃网址收集'];
// 目标 markdown 目录（用于静态访问）
const TARGET_DIR = path.join(__dirname, '../public/notes');
// 索引文件（React 应用通过 /notes-index.json 加载）
const INDEX_FILE = path.join(__dirname, '../public/notes-index.json');

// 分类映射
const CATEGORY_MAP = {
  '前端': '前端',
  '后端': '后端',
  '开发经验': '经验教程',
  '服务器': '后端',
  'CodeBlock': '前端',
  '📝Notes': '前端',
  '🎃网址收集': '其他',
};

// 生成唯一的 slug
function generateSlug(filepath) {
  const cwd = process.cwd();
  const relativePath = filepath.replace(cwd, '');
  return relativePath
    .replace(/[\\\/]/g, '/')
    .replace(/^\//, '')
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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
  const h1Regex = /^#\s+(.+)$/m;
  const match = content.match(h1Regex);
  if (match) {
    return match[1].trim();
  }
  return filename.replace('.md', '');
}

// 提取描述
function extractDescription(body) {
  const text = body
    .replace(/^#+\s.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[_*`#\[\]]/g, '')
    .trim();
  const firstLine = text.split('\n')[0];
  return firstLine.length > 20 && firstLine.length < 200 ? firstLine : undefined;
}

// 生成 frontmatter，同时返回元数据
function generateFrontmatter(existingFrontmatter, title, category, filepath) {
  const lines = existingFrontmatter.split('\n').filter(l => l.trim());
  const frontmatterObj = {};

  // 解析现有的 frontmatter
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      frontmatterObj[match[1]] = match[2];
    }
  }

  // 合并值
  const result = {
    title,
    category,
    description: frontmatterObj.description || extractDescription(frontmatterObj.content || ''),
    tags: frontmatterObj.tags ? frontmatterObj.tags.split(',').map(t => t.trim()) : undefined,
  };

  // 生成 YAML frontmatter
  let output = '---\n';
  output += `title: ${title}\n`;
  output += `category: ${category}\n`;
  if (result.description) output += `description: ${result.description}\n`;
  if (result.tags && result.tags.length > 0) {
    output += `tags:\n`;
    for (const tag of result.tags) {
      output += `  - ${tag}\n`;
    }
  }
  output += '---\n';

  return { yaml: output, meta: result };
}

// 处理单个文件
function processFile(sourceFile, category) {
  const cwd = process.cwd();
  const relativePath = path.relative(cwd, sourceFile);
  const filename = path.basename(sourceFile);
  const slug = generateSlug(relativePath);
  const targetFile = path.join(TARGET_DIR, `${slug}.md`);

  // 读取源文件
  const content = fs.readFileSync(sourceFile, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  const title = extractTitle(body, filename);

  // 生成新的 frontmatter 和元数据
  const { yaml, meta } = generateFrontmatter(frontmatter, title, category, relativePath);

  // 写入目标文件
  fs.writeFileSync(targetFile, yaml + body);
  console.log(`✓ Synced: ${relativePath} → ${slug}.md`);

  return {
    slug,
    title: meta.title,
    category: meta.category,
    description: meta.description || extractDescription(body),
    tags: meta.tags || [],
    file: `/notes/${slug}.md`,
  };
}

// 递归遍历目录
function walkDirectory(dir, category, index) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.')) {
        walkDirectory(fullPath, category, index);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const meta = processFile(fullPath, category);
      index.push(meta);
    }
  }
}

// 主函数
function main() {
  // 确保目标目录存在
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const index = [];

  // 清空目标目录
  if (fs.existsSync(TARGET_DIR)) {
    const existingFiles = fs.readdirSync(TARGET_DIR);
    for (const file of existingFiles) {
      fs.unlinkSync(path.join(TARGET_DIR, file));
    }
  }

  // 处理每个源目录
  for (const sourceDir of SOURCE_DIRS) {
    const sourcePath = path.join(process.cwd(), sourceDir);
    if (fs.existsSync(sourcePath)) {
      console.log(`\nProcessing: ${sourceDir}`);
      const category = CATEGORY_MAP[sourceDir] || '其他';
      walkDirectory(sourcePath, category, index);
    }
  }

  // 写入索引文件，供 React 应用使用
  const sortedIndex = index.sort((a, b) => a.slug.localeCompare(b.slug, 'zh-CN'));
  const indexPayload = { notes: sortedIndex };
  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexPayload, null, 2), 'utf-8');

  console.log(`\n✓ Synced ${sortedIndex.length} notes`);
}

main();
