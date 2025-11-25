import { Conversation, STORAGE_KEYS } from './types';

// Debounce utility
let saveTimeout: NodeJS.Timeout | null = null;

export const storage = {
  // Save conversations with debounce
  saveConversations: (conversations: Conversation[]) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save conversations:', error);
        // Handle quota exceeded
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Please delete some conversations.');
        }
      }
    }, 300);
  },

  // Load conversations
  loadConversations: (): Conversation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  },

  // Save active conversation ID
  saveActiveConversationId: (id: string | null) => {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
      }
    } catch (error) {
      console.error('Failed to save active conversation ID:', error);
    }
  },

  // Load active conversation ID
  loadActiveConversationId: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
    } catch (error) {
      console.error('Failed to load active conversation ID:', error);
      return null;
    }
  },

  // Save current model
  saveCurrentModel: (model: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_MODEL, model);
    } catch (error) {
      console.error('Failed to save current model:', error);
    }
  },

  // Load current model
  loadCurrentModel: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_MODEL) || 'gemini-2.5-flash';
    } catch (error) {
      console.error('Failed to load current model:', error);
      return 'gemini-2.5-flash';
    }
  },

  // Save system prompt
  saveSystemPrompt: (prompt: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('Failed to save system prompt:', error);
    }
  },

  // Load system prompt
  loadSystemPrompt: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SYSTEM_PROMPT) || 
        'You are a helpful AI assistant. Answer clearly and concisely.';
    } catch (error) {
      console.error('Failed to load system prompt:', error);
      return 'You are a helpful AI assistant. Answer clearly and concisely.';
    }
  },

  // Save sidebar state
  saveSidebarState: (isOpen: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(isOpen));
    } catch (error) {
      console.error('Failed to save sidebar state:', error);
    }
  },

  // Load sidebar state
  loadSidebarState: (): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
      return stored ? JSON.parse(stored) : true;
    } catch (error) {
      console.error('Failed to load sidebar state:', error);
      return true;
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  // Theme
  saveTheme: (theme: 'dark' | 'light') => {
    try { localStorage.setItem(STORAGE_KEYS.THEME, theme); } catch (e) { console.error(e); }
  },
  loadTheme: (): 'dark' | 'light' => {
    try { return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark'; } catch { return 'dark'; }
  },

  // Font scale
  saveFontScale: (scale: number) => {
    try { localStorage.setItem(STORAGE_KEYS.FONT_SCALE, String(scale)); } catch (e) { console.error(e); }
  },
  loadFontScale: (): number => {
    try { const v = localStorage.getItem(STORAGE_KEYS.FONT_SCALE); return v ? parseFloat(v) : 1; } catch { return 1; }
  },

  // Message width
  saveMessageWidth: (width: number) => {
    try { localStorage.setItem(STORAGE_KEYS.MESSAGE_WIDTH, String(width)); } catch (e) { console.error(e); }
  },
  loadMessageWidth: (): number => {
    try { const v = localStorage.getItem(STORAGE_KEYS.MESSAGE_WIDTH); return v ? parseInt(v) : 760; } catch { return 760; }
  },

  // Sidebar width
  saveSidebarWidth: (width: number) => {
    try { localStorage.setItem(STORAGE_KEYS.SIDEBAR_WIDTH, String(width)); } catch (e) { console.error(e); }
  },
  loadSidebarWidth: (): number => {
    try { const v = localStorage.getItem(STORAGE_KEYS.SIDEBAR_WIDTH); return v ? parseInt(v) : 320; } catch { return 320; }
  },

  // Message density
  saveMessageDensity: (density: 'comfortable' | 'compact') => {
    try { localStorage.setItem(STORAGE_KEYS.MESSAGE_DENSITY, density); } catch (e) { console.error(e); }
  },
  loadMessageDensity: (): 'comfortable' | 'compact' => {
    try { return (localStorage.getItem(STORAGE_KEYS.MESSAGE_DENSITY) as 'comfortable' | 'compact') || 'comfortable'; } catch { return 'comfortable'; }
  },
};
