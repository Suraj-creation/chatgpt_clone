'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ChatState, Conversation, Message } from '@/lib/types';
import { storage } from '@/lib/storage';
import {
  createNewConversation,
  createNewMessage,
  generateConversationTitle,
  getCurrentTimestamp,
} from '@/lib/utils';

interface ChatContextType extends ChatState {
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  loadConversation: (id: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setModel: (model: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  toggleSidebar: () => void;
  clearAllConversations: () => void;
  getActiveConversation: () => Conversation | null;
  setTheme: (theme: 'dark' | 'light') => void;
  setFontScale: (scale: number) => void;
  setMessageWidth: (width: number) => void;
  setSidebarWidth: (width: number) => void;
  setMessageDensity: (density: 'comfortable' | 'compact') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    currentModel: 'gemini-2.5-flash',
    systemPrompt: 'You are an extremely helpful, knowledgeable, and comprehensive AI assistant. Provide detailed, well-structured responses with thorough explanations. Use proper formatting including headings, bullet points, numbered lists, bold text, and code blocks when appropriate. Be informative and aim to give complete answers that fully address the question.',
    isStreaming: false,
    isSidebarOpen: true,
    theme: 'dark',
    fontScale: 1,
    messageWidth: 760,
    sidebarWidth: 320,
    messageDensity: 'comfortable',
  });

  // Load initial state from localStorage
  useEffect(() => {
    const conversations = storage.loadConversations();
    const activeConversationId = storage.loadActiveConversationId();
    const currentModel = storage.loadCurrentModel();
    const systemPrompt = storage.loadSystemPrompt();
    const isSidebarOpen = storage.loadSidebarState();
    const theme = storage.loadTheme();
    const fontScale = storage.loadFontScale();
    const messageWidth = storage.loadMessageWidth();
    const sidebarWidth = storage.loadSidebarWidth();
    const messageDensity = storage.loadMessageDensity();

    setState({
      conversations,
      activeConversationId,
      currentModel,
      systemPrompt,
      isStreaming: false,
      isSidebarOpen,
      theme,
      fontScale,
      messageWidth,
      sidebarWidth,
      messageDensity,
    });
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    if (state.conversations.length > 0) {
      storage.saveConversations(state.conversations);
    }
  }, [state.conversations]);

  // Create new conversation
  const createConversation = useCallback(() => {
    const newConv = createNewConversation();
    setState((prev: ChatState) => ({
      ...prev,
      conversations: [newConv, ...prev.conversations],
      activeConversationId: newConv.id,
    }));
    storage.saveActiveConversationId(newConv.id);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((id: string) => {
    setState((prev: ChatState) => {
      const newConversations = prev.conversations.filter((c: Conversation) => c.id !== id);
      const newActiveId = prev.activeConversationId === id
        ? (newConversations.length > 0 ? newConversations[0].id : null)
        : prev.activeConversationId;

      storage.saveActiveConversationId(newActiveId);
      return {
        ...prev,
        conversations: newConversations,
        activeConversationId: newActiveId,
      };
    });
  }, []);

  // Load conversation
  const loadConversation = useCallback((id: string) => {
    setState((prev: ChatState) => ({
      ...prev,
      activeConversationId: id,
    }));
    storage.saveActiveConversationId(id);
  }, []);

  // Add message to active conversation
  const addMessage = useCallback((message: Message) => {
    setState((prev: ChatState) => {
      if (!prev.activeConversationId) return prev;

      const newConversations = prev.conversations.map((conv: Conversation) => {
        if (conv.id === prev.activeConversationId) {
          const updatedMessages = [...conv.messages, message];
          const title = conv.messages.length === 0 && message.role === 'user'
            ? generateConversationTitle(message.content)
            : conv.title;

          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: getCurrentTimestamp(),
          };
        }
        return conv;
      });

      return {
        ...prev,
        conversations: newConversations,
      };
    });
  }, []);

  // Update last message (for streaming)
  const updateLastMessage = useCallback((content: string) => {
    setState((prev: ChatState) => {
      if (!prev.activeConversationId) return prev;

      const newConversations = prev.conversations.map((conv: Conversation) => {
        if (conv.id === prev.activeConversationId) {
          const messages = [...conv.messages];
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
              messages[messages.length - 1] = {
                ...lastMessage,
                content,
              };
            }
          }

          return {
            ...conv,
            messages,
            updatedAt: getCurrentTimestamp(),
          };
        }
        return conv;
      });

      return {
        ...prev,
        conversations: newConversations,
      };
    });
  }, []);

  // Set current model
  const setModel = useCallback((model: string) => {
    setState((prev: ChatState) => ({ ...prev, currentModel: model }));
    storage.saveCurrentModel(model);
  }, []);

  // Set system prompt
  const setSystemPrompt = useCallback((prompt: string) => {
    setState((prev: ChatState) => ({ ...prev, systemPrompt: prompt }));
    storage.saveSystemPrompt(prompt);
  }, []);

  // Set streaming state
  const setIsStreaming = useCallback((isStreaming: boolean) => {
    setState((prev: ChatState) => ({ ...prev, isStreaming }));
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setState((prev: ChatState) => {
      const newState = !prev.isSidebarOpen;
      storage.saveSidebarState(newState);
      return { ...prev, isSidebarOpen: newState };
    });
  }, []);

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setState((prev: ChatState) => ({
      ...prev,
      conversations: [],
      activeConversationId: null,
    }));
    storage.clearAll();
  }, []);

  // Get active conversation
  const getActiveConversation = useCallback((): Conversation | null => {
    if (!state.activeConversationId) return null;
    return state.conversations.find((c: Conversation) => c.id === state.activeConversationId) || null;
  }, [state.activeConversationId, state.conversations]);

  const value: ChatContextType = {
    ...state,
    createConversation,
    deleteConversation,
    loadConversation,
    addMessage,
    updateLastMessage,
    setModel,
    setSystemPrompt,
    setIsStreaming,
    toggleSidebar,
    clearAllConversations,
    getActiveConversation,
    setTheme: (theme: 'dark' | 'light') => {
      setState((prev: ChatState) => ({ ...prev, theme }));
      storage.saveTheme(theme);
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
      }
    },
    setFontScale: (scale: number) => {
      const clamped = Math.min(1.25, Math.max(0.85, scale));
      setState((prev: ChatState) => ({ ...prev, fontScale: clamped }));
      storage.saveFontScale(clamped);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-scale', String(clamped));
      }
    },
    setMessageWidth: (width: number) => {
      const clamped = Math.min(1000, Math.max(520, width));
      setState((prev: ChatState) => ({ ...prev, messageWidth: clamped }));
      storage.saveMessageWidth(clamped);
    },
    setSidebarWidth: (width: number) => {
      const clamped = Math.min(500, Math.max(220, width));
      setState((prev: ChatState) => ({ ...prev, sidebarWidth: clamped }));
      storage.saveSidebarWidth(clamped);
    },
    setMessageDensity: (density: 'comfortable' | 'compact') => {
      setState((prev: ChatState) => ({ ...prev, messageDensity: density }));
      storage.saveMessageDensity(density);
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
