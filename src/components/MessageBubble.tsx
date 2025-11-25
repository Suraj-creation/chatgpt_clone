'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MessageBubbleProps } from '@/lib/types';
import { formatTimestamp, copyToClipboard } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message, isStreaming }: MessageBubbleProps) => {
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
            <div className="prose prose-invert prose-sm max-w-none formatted-response">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const codeString = String(children).replace(/\n$/, '');

                    return !inline && match ? (
                      <div className="relative group my-4">
                        <div className="flex items-center justify-between bg-gradient-to-r from-bg-tertiary to-bg-secondary px-4 py-2 rounded-t-xl border border-border-subtle shadow-sm">
                          <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider font-mono">{language}</span>
                          <button
                            onClick={() => handleCopyCode(codeString, language)}
                            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-green transition-all duration-200 hover:scale-105"
                          >
                            {copiedCode === language ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span className="text-accent-green">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={language}
                          PreTag="div"
                          className="rounded-b-xl !mt-0 !bg-bg-tertiary border-x border-b border-border-subtle shadow-md"
                          customStyle={{ padding: '1.25rem', fontSize: '0.9rem', lineHeight: '1.6' }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="inline-code bg-gradient-to-r from-bg-tertiary to-bg-secondary px-2 py-1 rounded-md text-accent-green font-mono text-sm font-semibold border border-border-subtle" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }: { children?: React.ReactNode }) {
                    return <p className="mb-4 last:mb-0 leading-[1.8] text-[15px] text-text-primary">{children}</p>;
                  },
                  ul({ children }: { children?: React.ReactNode }) {
                    return <ul className="list-none mb-4 space-y-2.5 pl-1">{children}</ul>;
                  },
                  ol({ children }: { children?: React.ReactNode }) {
                    return <ol className="list-none counter-reset-item mb-4 space-y-2.5 pl-1">{children}</ol>;
                  },
                  li({ children, ordered }: { children?: React.ReactNode; ordered?: boolean }) {
                    return (
                      <li className="flex items-start gap-3 leading-[1.7]">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent-blue to-accent-green flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {ordered ? '•' : '→'}
                        </span>
                        <span className="flex-1 text-text-primary">{children}</span>
                      </li>
                    );
                  },
                  h1({ children }: { children?: React.ReactNode }) {
                    return <h1 className="text-2xl font-bold mb-4 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-green pb-2 border-b-2 border-accent-blue/30">{children}</h1>;
                  },
                  h2({ children }: { children?: React.ReactNode }) {
                    return <h2 className="text-xl font-bold mb-3 mt-5 text-accent-blue flex items-center gap-2"><span className="w-1.5 h-6 bg-gradient-to-b from-accent-blue to-accent-green rounded-full"></span>{children}</h2>;
                  },
                  h3({ children }: { children?: React.ReactNode }) {
                    return <h3 className="text-lg font-semibold mb-3 mt-4 text-accent-green">{children}</h3>;
                  },
                  h4({ children }: { children?: React.ReactNode }) {
                    return <h4 className="text-base font-semibold mb-2 mt-3 text-text-primary uppercase tracking-wide">{children}</h4>;
                  },
                  strong({ children }: { children?: React.ReactNode }) {
                    return <strong className="font-bold text-accent-blue">{children}</strong>;
                  },
                  em({ children }: { children?: React.ReactNode }) {
                    return <em className="italic text-accent-green font-medium">{children}</em>;
                  },
                  blockquote({ children }: { children?: React.ReactNode }) {
                    return (
                      <blockquote className="border-l-4 border-accent-blue bg-gradient-to-r from-bg-secondary to-transparent pl-5 pr-4 py-3 my-4 italic text-text-secondary rounded-r-lg">
                        {children}
                      </blockquote>
                    );
                  },
                  hr() {
                    return <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />;
                  },
                  a({ children, href }: { children?: React.ReactNode; href?: string }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:text-accent-green font-medium underline decoration-accent-blue/50 hover:decoration-accent-green underline-offset-2 transition-all duration-200"
                      >
                        {children}
                      </a>
                    );
                  },
                  table({ children }: { children?: React.ReactNode }) {
                    return (
                      <div className="overflow-x-auto my-4 rounded-xl border border-border-subtle shadow-lg">
                        <table className="min-w-full divide-y divide-border-subtle">{children}</table>
                      </div>
                    );
                  },
                  thead({ children }: { children?: React.ReactNode }) {
                    return <thead className="bg-gradient-to-r from-bg-tertiary to-bg-secondary">{children}</thead>;
                  },
                  tbody({ children }: { children?: React.ReactNode }) {
                    return <tbody className="divide-y divide-border-subtle bg-bg-secondary">{children}</tbody>;
                  },
                  tr({ children }: { children?: React.ReactNode }) {
                    return <tr className="hover:bg-bg-tertiary/50 transition-colors">{children}</tr>;
                  },
                  th({ children }: { children?: React.ReactNode }) {
                    return <th className="px-4 py-3 text-left text-xs font-bold text-accent-blue uppercase tracking-wider">{children}</th>;
                  },
                  td({ children }: { children?: React.ReactNode }) {
                    return <td className="px-4 py-3 text-sm text-text-primary">{children}</td>;
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
