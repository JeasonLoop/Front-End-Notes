import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALL_NOTES_DIR = path.join(__dirname, '../all-notes');
const TARGET_DIR = path.join(__dirname, '../public/notes');
const ASSETS_DIR = path.join(__dirname, '../public/notes-assets');
const TREE_INDEX_FILE = path.join(__dirname, '../public/all-notes-tree.json');
const missingAssetsByNote = new Map();

/** AFM 课程模板不进公开站；隐藏目录 / node_modules 也不扫 */
const SKIP_DIR_NAMES = new Set(['Agent学习', 'node_modules']);

function shouldSkipDir(name) {
  return name.startsWith('.') || SKIP_DIR_NAMES.has(name);
}

function posixRel(relativePath = '') {
  return relativePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function folderId(relativePath) {
  const rel = posixRel(relativePath);
  return rel
    .split('/')
    .filter(Boolean)
    .join('--')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function generateSlug(relativePath) {
  const rel = posixRel(relativePath).replace(/\.md$/i, '');
  return rel
    .split('/')
    .filter(Boolean)
    .join('-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (match) {
    return { frontmatter: match[1], body: content.slice(match[0].length) };
  }
  return { frontmatter: '', body: content };
}

function extractTitle(content, filename) {
  void content;
  return filename.replace('.md', '');
}

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

function scanDirectory(dir, relativePath = '') {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory() && !shouldSkipDir(entry.name));
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'));

  for (const dirEntry of dirs) {
    const dirName = dirEntry.name;
    const childRel = posixRel(path.join(relativePath, dirName));
    const childItems = scanDirectory(path.join(dir, dirName), childRel);
    if (childItems.length === 0) continue;
    items.push({
      id: folderId(childRel),
      name: dirName,
      type: 'folder',
      path: `/category/${folderId(childRel)}`,
      children: childItems,
    });
  }

  for (const fileEntry of files) {
    const fileName = fileEntry.name;
    const filePath = path.join(dir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { body } = parseFrontmatter(fileContent);
    const title = extractTitle(body, fileName);
    const fileRelativePath = posixRel(path.join(relativePath, fileName));
    const slug = generateSlug(fileRelativePath);

    items.push({
      id: slug,
      name: title,
      type: 'file',
      path: `/notes/${slug}`,
      slug,
      description: extractDescription(body),
      wordCount: countWords(body),
      relativePath: fileRelativePath,
    });
  }

  return items;
}

function buildAllNotesTree() {
  console.log('开始扫描 all-notes 目录...');

  if (!fs.existsSync(ALL_NOTES_DIR)) {
    console.error('all-notes 目录不存在:', ALL_NOTES_DIR);
    return null;
  }

  const tree = [];
  const flat = [];
  const slugSeen = new Map();

  const categories = fs.readdirSync(ALL_NOTES_DIR, { withFileTypes: true });
  const categoryDirs = categories
    .filter((entry) => entry.isDirectory() && !shouldSkipDir(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

  for (const dirEntry of categoryDirs) {
    const categoryName = dirEntry.name;
    const categoryPath = path.join(ALL_NOTES_DIR, categoryName);
    const childItems = scanDirectory(categoryPath, categoryName);
    const categoryId = folderId(categoryName);

    tree.push({
      id: categoryId,
      name: categoryName,
      icon: null,
      type: 'category',
      path: `/category/${categoryId}`,
      children: childItems,
    });

    function collectFlat(items, category) {
      for (const item of items) {
        if (item.type === 'file') {
          if (slugSeen.has(item.slug)) {
            throw new Error(
              `slug 冲突: ${item.slug}\n  ${slugSeen.get(item.slug)}\n  ${item.relativePath}`,
            );
          }
          slugSeen.set(item.slug, item.relativePath);
          flat.push({
            slug: item.slug,
            title: item.name,
            description: item.description,
            wordCount: item.wordCount || 0,
            category,
            file: `/notes/${item.slug}.md`,
            relativePath: item.relativePath,
          });
        } else if (item.children) {
          collectFlat(item.children, category);
        }
      }
    }
    collectFlat(childItems, categoryName);
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

function copyNotesToPublic(flatNotes) {
  console.log('复制笔记到 public/notes...');
  missingAssetsByNote.clear();

  clearDirectory(TARGET_DIR);
  clearDirectory(ASSETS_DIR);

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
