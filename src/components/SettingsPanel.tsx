'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const {
    theme,
    fontScale,
    messageWidth,
    sidebarWidth,
    messageDensity,
    setTheme,
    setFontScale,
    setMessageWidth,
    setSidebarWidth,
    setMessageDensity,
  } = useChatContext() as any;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/50" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-bg-secondary border border-border-subtle rounded-xl shadow-xl overflow-hidden animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-tertiary">
          <h2 className="text-sm font-semibold">Interface Settings</h2>
          <button onClick={onClose} aria-label="Close settings" className="p-1 rounded hover:bg-bg-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-6 text-sm overflow-y-auto max-h-[70vh]">
          {/* Theme */}
          <div>
            <label className="font-medium block mb-2">Theme</label>
            <div className="flex gap-2">
              {['dark','light'].map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t as 'dark' | 'light')}
                  className={`px-3 py-1.5 rounded border text-xs ${theme===t?'bg-accent-blue text-white border-accent-blue':'bg-bg-tertiary border-border-subtle hover:border-accent-blue'}`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Font Scale */}
          <div>
            <label className="font-medium block mb-2">Font Scale ({fontScale.toFixed(2)})</label>
            <input
              type="range"
              min={0.85}
              max={1.25}
              step={0.01}
              value={fontScale}
              onChange={e => setFontScale(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Font scale"
            />
          </div>

            {/* Message Width */}
          <div>
            <label className="font-medium block mb-2">Message Width ({messageWidth}px)</label>
            <input
              type="range"
              min={520}
              max={1000}
              step={10}
              value={messageWidth}
              onChange={e => setMessageWidth(parseInt(e.target.value))}
              className="w-full"
              aria-label="Message width"
            />
          </div>

          {/* Sidebar Width */}
          <div>
            <label className="font-medium block mb-2">Sidebar Width ({sidebarWidth}px)</label>
            <input
              type="range"
              min={220}
              max={500}
              step={10}
              value={sidebarWidth}
              onChange={e => setSidebarWidth(parseInt(e.target.value))}
              className="w-full"
              aria-label="Sidebar width"
            />
          </div>

          {/* Message Density */}
          <div>
            <label className="font-medium block mb-2">Message Density</label>
            <div className="flex gap-2">
              {['comfortable','compact'].map(d => (
                <button
                  key={d}
                  onClick={() => setMessageDensity(d as 'comfortable' | 'compact')}
                  className={`px-3 py-1.5 rounded border text-xs ${messageDensity===d?'bg-accent-green text-white border-accent-green':'bg-bg-tertiary border-border-subtle hover:border-accent-green'}`}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="text-xs text-text-secondary pt-2 border-t border-border-subtle">
            Changes persist locally. Layout adapts instantly. Refresh to revert default.
          </div>
        </div>
      </div>
    </div>
  );
};