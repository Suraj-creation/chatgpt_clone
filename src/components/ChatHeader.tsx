'use client';

import React from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { ModelSelector } from './ModelSelector';
import { Menu, X } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const { 
    getActiveConversation, 
    currentModel, 
    setModel, 
    isStreaming,
    isSidebarOpen,
    toggleSidebar,
  } = useChatContext();
  
  const activeConversation = getActiveConversation();

  return (
    <div className="border-b border-border-subtle bg-bg-primary px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu button (mobile) + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-text-primary" />
            )}
          </button>
          
          <h1 className="text-lg font-semibold text-text-primary truncate">
            {activeConversation?.title || 'New Chat'}
          </h1>
        </div>

        {/* Right: Model selector */}
        <ModelSelector
          currentModel={currentModel}
          onModelChange={setModel}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
};
