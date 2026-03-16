import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
