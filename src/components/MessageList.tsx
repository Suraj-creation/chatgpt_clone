'use client';

import React, { useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';

export const MessageList: React.FC = () => {
  const { getActiveConversation, isStreaming } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = getActiveConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isStreaming]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Welcome to Gemini Chat
          </h2>
          <p className="text-text-secondary text-sm">
            Start a conversation by clicking "New Chat" or selecting a previous conversation from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  if (activeConversation.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Start Chatting
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Ask me anything! I can help with coding, explain concepts, answer questions, and more.
          </p>
          <div className="grid gap-2 text-left">
            <div className="bg-bg-secondary p-3 rounded-lg border border-border-subtle hover:border-accent-blue transition-colors cursor-pointer">
              <p className="text-sm text-text-primary">💡 Explain quantum computing</p>
            </div>
            <div className="bg-bg-secondary p-3 rounded-lg border border-border-subtle hover:border-accent-blue transition-colors cursor-pointer">
              <p className="text-sm text-text-primary">🔧 Help me debug my code</p>
            </div>
            <div className="bg-bg-secondary p-3 rounded-lg border border-border-subtle hover:border-accent-blue transition-colors cursor-pointer">
              <p className="text-sm text-text-primary">📚 Recommend a book on AI</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {activeConversation.messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={isStreaming && index === activeConversation.messages.length - 1}
        />
      ))}
      
      {isStreaming && activeConversation.messages[activeConversation.messages.length - 1]?.role !== 'assistant' && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-green-600 flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div className="flex-1">
            <LoadingIndicator />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
