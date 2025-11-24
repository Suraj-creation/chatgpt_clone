'use client';

import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-text-secondary">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-sm">Thinking...</span>
    </div>
  );
};
