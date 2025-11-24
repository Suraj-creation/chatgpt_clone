'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatInputProps } from '@/lib/types';
import { Send, Square } from 'lucide-react';
import { validateMessage } from '@/lib/utils';

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!validateMessage(input) || disabled || isStreaming) return;
    
    onSendMessage(input.trim());
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleStop = () => {
    onStopStreaming();
  };

  const isValid = validateMessage(input);
  const charCount = input.length;

  return (
    <div className="border-t border-border-subtle bg-bg-primary px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini..."
              disabled={disabled}
              className="w-full bg-bg-secondary text-text-primary px-4 py-3 pr-16 rounded-2xl border border-border-subtle focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              rows={1}
              maxLength={10000}
            />
            
            {/* Character count */}
            {charCount > 9000 && (
              <span className={`absolute right-16 bottom-3 text-xs ${charCount > 9900 ? 'text-red-500' : 'text-text-secondary'}`}>
                {charCount}/10000
              </span>
            )}
          </div>

          {/* Send/Stop Button */}
          {isStreaming ? (
            <button
              onClick={handleStop}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
              title="Stop generating"
            >
              <Square className="w-5 h-5 text-white fill-white" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isValid || disabled}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-blue-600 hover:from-accent-blue hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              title="Send message (Enter)"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Helper text */}
        <p className="mt-2 text-xs text-text-secondary text-center">
          Gemini may produce inaccurate information. Verify important details.
          <span className="mx-2">•</span>
          <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded border border-border-subtle">Enter</kbd> to send,
          <span className="mx-1"></span>
          <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded border border-border-subtle">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};
