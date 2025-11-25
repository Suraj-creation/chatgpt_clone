'use client';

import React, { useState } from 'react';
import { SystemPromptEditorProps } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const SystemPromptEditor: React.FC<SystemPromptEditorProps> = ({
  systemPrompt,
  onSystemPromptChange,
}: SystemPromptEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-secondary transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">System Instructions</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          <textarea
            value={systemPrompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onSystemPromptChange(e.target.value)}
            placeholder="Enter system instructions for the AI..."
            className="w-full bg-bg-tertiary text-text-primary px-3 py-2 rounded-lg border border-border-subtle focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 resize-none text-sm"
            rows={4}
          />
          <p className="mt-2 text-xs text-text-secondary">
            System instructions help guide the AI's behavior and responses.
          </p>
        </div>
      )}
    </div>
  );
};
