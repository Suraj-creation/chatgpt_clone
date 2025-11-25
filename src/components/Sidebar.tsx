'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SidebarProps, AVAILABLE_MODELS } from '@/lib/types';
import { ConversationList } from './ConversationList';
import { PlusCircle, Sparkles, Trash, Settings } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { SettingsPanel } from './SettingsPanel';

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClearAll,
  isOpen,
}) => {
  const { sidebarWidth, setSidebarWidth } = useChatContext() as any;
  const [showSettings, setShowSettings] = useState(false);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const delta = e.clientX - startXRef.current;
    setSidebarWidth(startWidthRef.current + delta);
  }, [setSidebarWidth]);

  const stopResize = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopResize);
  }, [onMouseMove]);

  const startResize = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className={`fixed lg:relative inset-y-0 left-0 z-50 bg-bg-secondary border-r border-border-subtle flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Gemini Chat</h1>
              <p className="text-xs text-text-secondary">Powered by Google AI</p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-accent-blue to-blue-600 hover:from-accent-blue hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
        />

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle space-y-2">
          {/* Model Info */}
          <div className="px-3 py-2 bg-bg-tertiary rounded-lg">
            <p className="text-xs text-text-secondary mb-1">Current Model</p>
            <p className="text-sm font-medium text-text-primary">
              {AVAILABLE_MODELS.find(m => m.id === activeConversationId)?.name || 'Gemini 1.5 Flash'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm('Clear all conversations? This cannot be undone.')) {
                  onClearAll();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-tertiary hover:bg-red-500/20 text-text-secondary hover:text-red-500 rounded-lg transition-all text-sm"
            >
              <Trash className="w-4 h-4" />
              Clear All
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bg-tertiary hover:bg-bg-primary text-text-secondary hover:text-text-primary rounded-lg transition-all text-sm"
              aria-label="Open interface settings"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Version */}
          <p className="text-xs text-text-secondary text-center pt-2">
            v1.0.0 • Built with ❤️
          </p>
        </div>
      </aside>
      {/* Resize handle */}
      {isOpen && (
        <div
          onMouseDown={startResize}
          className="hidden lg:block absolute top-0 left-[var(--sidebar-right)] z-50 cursor-col-resize" 
          style={{ left: sidebarWidth, width: 6, height: '100%', background: 'transparent' }}
          aria-label="Resize sidebar"
        />
      )}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
};
