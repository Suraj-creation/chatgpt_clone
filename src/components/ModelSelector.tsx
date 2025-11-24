'use client';

import React from 'react';
import { AVAILABLE_MODELS, ModelSelectorProps } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <select
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-bg-tertiary text-text-primary px-4 py-2 pr-10 rounded-lg border border-border-subtle hover:border-accent-blue focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
    </div>
  );
};
