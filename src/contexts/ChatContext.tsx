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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    currentModel: 'gemini-2.5-flash',
    systemPrompt: 'You are a helpful AI assistant. Answer clearly and concisely.',
    isStreaming: false,
    isSidebarOpen: true,
  });

  // Load initial state from localStorage
  useEffect(() => {
    const conversations = storage.loadConversations();
    const activeConversationId = storage.loadActiveConversationId();
    const currentModel = storage.loadCurrentModel();
    const systemPrompt = storage.loadSystemPrompt();
    const isSidebarOpen = storage.loadSidebarState();

    setState({
      conversations,
      activeConversationId,
      currentModel,
      systemPrompt,
      isStreaming: false,
      isSidebarOpen,
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
    setState(prev => ({
      ...prev,
      conversations: [newConv, ...prev.conversations],
      activeConversationId: newConv.id,
    }));
    storage.saveActiveConversationId(newConv.id);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback((id: string) => {
    setState(prev => {
      const newConversations = prev.conversations.filter(c => c.id !== id);
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
    setState(prev => ({
      ...prev,
      activeConversationId: id,
    }));
    storage.saveActiveConversationId(id);
  }, []);

  // Add message to active conversation
  const addMessage = useCallback((message: Message) => {
    setState(prev => {
      if (!prev.activeConversationId) return prev;

      const newConversations = prev.conversations.map(conv => {
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
    setState(prev => {
      if (!prev.activeConversationId) return prev;

      const newConversations = prev.conversations.map(conv => {
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
    setState(prev => ({ ...prev, currentModel: model }));
    storage.saveCurrentModel(model);
  }, []);

  // Set system prompt
  const setSystemPrompt = useCallback((prompt: string) => {
    setState(prev => ({ ...prev, systemPrompt: prompt }));
    storage.saveSystemPrompt(prompt);
  }, []);

  // Set streaming state
  const setIsStreaming = useCallback((isStreaming: boolean) => {
    setState(prev => ({ ...prev, isStreaming }));
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setState(prev => {
      const newState = !prev.isSidebarOpen;
      storage.saveSidebarState(newState);
      return { ...prev, isSidebarOpen: newState };
    });
  }, []);

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setState(prev => ({
      ...prev,
      conversations: [],
      activeConversationId: null,
    }));
    storage.clearAll();
  }, []);

  // Get active conversation
  const getActiveConversation = useCallback((): Conversation | null => {
    if (!state.activeConversationId) return null;
    return state.conversations.find(c => c.id === state.activeConversationId) || null;
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
