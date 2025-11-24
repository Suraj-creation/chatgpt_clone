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
};
