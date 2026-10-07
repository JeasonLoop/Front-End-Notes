# AGENT.md — Front-End-Notes

给在这个仓库里干活的 coding agent。先读这份，再改代码或笔记。

## 这是什么

个人知识库的**双模式站点**：

- 源内容：`all-notes/`（Obsidian 直接编辑 Markdown）
- 展示层：`src/`（React 18 + Vite + HashRouter，CRT 复古终端风）
- 构建：`scripts/sync-notes.js` 扫描源目录 → `public/notes/*.md` + `public/all-notes-tree.json` → Vite 打静态站
- 发布：push `main` → GitHub Actions → GitHub Pages（`base: /Front-End-Notes/`）

**一份 Markdown，两处消费。源永远在 `all-notes/`。**

## 绝对不要做

- 不要手改 `public/notes/`、`public/notes-assets/`、`public/all-notes-tree.json`（下次 `npm run sync` 会清掉重写）
- 不要为了「方便」加笔记 slug 映射表；slug 由相对路径生成
- 不要把空模板、课程草稿灌进公开站。同步脚本会跳过目录名 `Agent学习` 和 `node_modules`，以及以 `.` 开头的目录
- 不要改 CRT 视觉方向（扫描线、霓虹、Three.js 背景）去换成通用 AI 审美，除非用户明确要求换皮
- 不要用 Vue 工作流硬套本仓库前端——站点是 React + 手写 CSS
- 不要新增依赖来做同步脚本已经能用 Node `fs` 做的事
- 项目页不要用 iframe 弹窗嵌外站，不要把预览写成 `#`，不要加没有样式的占位图标

## 目录约定

```
all-notes/                  # 唯一笔记源
  00-开发经验/
  01-前端/{JS,React,Vue}/
  02-后端/{Go,Java,Nest}/
  04-AI-Agent/              # Agent 相关笔记（会进公开站）
  05-经验避坑/              # 目前可能是空目录
  NOTE-TEMPLATE.md          # 新笔记模板（不会被扫进站点，它在根下不是分类目录）
scripts/sync-notes.js       # 扫描 / slug / 拷图 / 写索引
src/                        # 站点
  hooks/useNotes.js         # fetch all-notes-tree.json
  pages/                    # Home / AllNotes / Category / NoteDetail / Projects
  components/               # Layout / TreeNav / MarkdownRenderer / CRT / Three
public/                     # 同步产物，勿手改
```

顶层分类名带编号前缀（`00-` `01-` …），网站菜单按目录名展示。

## 笔记规则

新笔记优先抄 `all-notes/NOTE-TEMPLATE.md`：YAML frontmatter + 场景 / 概念 / 代码 / 坑 / checklist。

- 文件名即标题（同步脚本用文件名当 `title`，**不读** frontmatter 的 `title` 字段）
- 站内 slug：`相对路径` 去 `.md`，`/` 换成 `-`，空白压成 `-`
  - 例：`01-前端/React/01-基础入门.md` → `01-前端-React-01-基础入门`
- 图片：写在笔记同目录（或相对路径），Obsidian `![[file]]` 或 `![](file)` 都可以；sync 会拷到 `public/notes-assets/<slug>/`
- 缺图不会让 sync 失败，但会打警告。不要留下坏链
- `Agent学习` 目录名被硬编码跳过；新的 Agent 内容放 `04-AI-Agent/`
- 站点用 `rehype-raw`，笔记里的 HTML 会进页面。不要在笔记里放可执行脚本或不明来源 HTML

改完笔记需要进站时跑 `npm run sync`（`npm run dev` / `npm run build` 会先 sync）。

## 站点技术约束

| 项 | 事实 |
| --- | --- |
| 路由 | `HashRouter`，适配 GitHub Pages |
| base | `/Front-End-Notes/`，本地资源 URL 必须走 `import.meta.env.BASE_URL` |
| 数据 | 运行时 fetch `all-notes-tree.json`，没有 SSG 预渲染正文 |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-raw` + Prism `vscDarkPlus` |
| 样式 | 手写 CSS（`src/styles/`），无 Tailwind / UI 库 |
| 项目页 | `src/pages/Projects.jsx` 写死的数组，样式在 `src/styles/pages.css` 的 `.projects-*` |

改导航 / 分类 / 列表：动 `useNotes` + `TreeNav` / `Home` / `Category`，不要另起一套索引。

改渲染：`MarkdownRenderer.jsx` 已处理 `==高亮==` 和 `[[wikilink]]`。缺能力先扩这里，不要换渲染栈。

改项目展示：只改 `projectsData` 和现有卡片结构。`githubUrl` / `previewUrl` 必须是 `http(s)://`，用 `<a target="_blank" rel="noopener noreferrer">` 新开标签。没有外链就填 `null`，不要假链接。外站不能 iframe（会被拦）。

## 改代码时的技能选择

自用高频 skill，按任务加载，不要全开：

1. **结构问题先 CodeGraph**：定义、调用链、改动影响。字面量/注释再用 Grep。
2. **写/改代码默认 ponytail**：能不写就不写，能用现有 `sync-notes.js` / `useNotes` 就复用。禁止再加 slug 映射表。
3. **React 性能/重渲染** 才加载 `vercel-react-best-practices`。
4. **明确要改视觉** 才加载 `frontend-design` 或 `ui-ux-pro-max`，并且必须保住 CRT 方向。
5. **多步新功能** 才 `brainstorming` → `writing-plans` → `executing-plans`。改文案、改一篇笔记、修一个 slug 不要走这套。
6. 用户说「删掉过度设计 / 能简化吗」用 `ponytail-review`（看 diff）或 `ponytail-audit`（扫全库）。

详细对照见 `all-notes/04-AI-Agent/skill推荐/自用高频Skill.md`。

## 常用命令

```bash
npm install
npm run sync      # 只同步笔记
npm run dev       # sync + Vite :3000（端口占用会顺延）
npm run build     # sync + 生产构建
npm run preview
```

Windows 环境。不要假设 bash 专有语法；脚本本身是 Node ESM，跨平台。

## 验证清单

改 **sync / slug / 资源拷贝**：跑 `npm run sync`，看控制台缺图警告和分类/篇数。

改 **站点 UI**：`npm run dev`，抽查首页分类、一篇带图笔记、一篇带代码块笔记、Hash 路由刷新。

改 **项目页**：GitHub / 预览都要新开标签；没有 URL 的按钮不要出现；卡片标题、简介、标签、按钮要分开，不能叠在一起。

改 **笔记内容**：确认文件在正确分类目录；需要上站再 sync。不要把构建产物提交当源。公开笔记不要写本机路径、本机 skill 目录、公司业务仓库名。

## 已知文档漂移

根目录 `README.md` 仍写 `Agent学习/` 和偏旧的分类统计。以 `all-notes/` 实际目录和 `scripts/sync-notes.js` 为准。

