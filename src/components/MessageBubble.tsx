'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageBubbleProps } from '@/lib/types';
import { formatTimestamp, copyToClipboard } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, isStreaming }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const isUser = message.role === 'user';

  const handleCopyCode = async (code: string, language: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(language);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-accent-blue to-blue-600'
            : 'bg-gradient-to-br from-accent-green to-green-600'
        }`}
      >
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-accent-blue to-blue-600 text-white rounded-br-md'
              : 'bg-bg-secondary border border-border-subtle text-text-primary rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const codeString = String(children).replace(/\n$/, '');

                    return !inline && match ? (
                      <div className="relative group my-2">
                        <div className="flex items-center justify-between bg-bg-tertiary px-3 py-1.5 rounded-t-lg border border-border-subtle">
                          <span className="text-xs text-text-secondary font-mono">{language}</span>
                          <button
                            onClick={() => handleCopyCode(codeString, language)}
                            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                          >
                            {copiedCode === language ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={language}
                          PreTag="div"
                          className="rounded-b-lg !mt-0 !bg-bg-tertiary border-x border-b border-border-subtle"
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-bg-tertiary px-1.5 py-0.5 rounded text-accent-green font-mono text-xs" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-text-primary">{children}</strong>;
                  },
                  a({ children, href }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-accent-green animate-pulse ml-1"></span>
              )}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-text-secondary px-2">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
