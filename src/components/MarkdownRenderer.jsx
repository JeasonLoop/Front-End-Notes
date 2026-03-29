import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function normalizeObsidianMarkdown(content = '') {
  return content
    .replace(/==([^=\n][\s\S]*?[^=\n])==/g, '<mark>$1</mark>')
    .replace(/!\[\[([^\]]+)\]\]/g, (_match, target) => {
      const [rawPath, rawAlt] = target.split('|');
      const path = rawPath?.trim();
      const alt = rawAlt?.trim() || path || '';
      if (!path) {
        return '';
      }
      return `![${alt}](${path})`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_match, target) => {
      const [rawPath, rawAlias] = target.split('|');
      const path = rawPath?.trim();
      const alias = rawAlias?.trim() || path || '';
      if (!path) {
        return '';
      }
      return `[${alias}](${path})`;
    });
}

function toPublicAssetUrl(src = '') {
  if (!src) {
    return src;
  }

  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src.replace(/^\.?\//, '');

  if (normalizedSrc.startsWith('notes-assets/')) {
    return `${normalizedBase}${normalizedSrc}`.replace(/([^:]\/)\/+/g, '$1');
  }

  return `${normalizedBase}notes-assets/${normalizedSrc}`.replace(/([^:]\/)\/+/g, '$1');
}

function MarkdownRenderer({ content }) {
  const normalizedContent = normalizeObsidianMarkdown(content);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img({ src, alt, ...props }) {
            const resolvedSrc = toPublicAssetUrl(src);
            return <img src={resolvedSrc} alt={alt || ''} loading="lazy" {...props} />;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // 代码块 - 使用语法高亮
            if (!inline && language) {
              return (
                <div className="code-block-wrapper">
                  <div className="code-block-header">
                    <span className="code-language">{language}</span>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    showLineNumbers={false}
                    wrapLongLines={true}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // 代码块但没有指定语言
            if (!inline && !language) {
              return (
                <div className="code-block-wrapper">
                  <SyntaxHighlighter
                    language="text"
                    style={vscDarkPlus}
                    showLineNumbers={false}
                    wrapLongLines={true}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // 行内代码
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
