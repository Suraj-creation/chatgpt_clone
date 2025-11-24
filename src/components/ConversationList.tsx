'use client';

import React from 'react';
import { Conversation } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-text-secondary text-sm text-center">
          No conversations yet.<br />Start a new chat to begin!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              conversation.id === activeConversationId
                ? 'bg-bg-tertiary border border-accent-blue'
                : 'hover:bg-bg-secondary border border-transparent'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            {/* Icon */}
            <MessageSquare className="w-4 h-4 text-text-secondary flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {conversation.title}
              </p>
              <p className="text-xs text-text-secondary">
                {formatTimestamp(conversation.updatedAt)}
              </p>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this conversation?')) {
                  onDeleteConversation(conversation.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/20 transition-all"
              aria-label="Delete conversation"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
