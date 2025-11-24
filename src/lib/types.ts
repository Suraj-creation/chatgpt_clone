// Core Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentModel: string;
  systemPrompt: string;
  isStreaming: boolean;
  isSidebarOpen: boolean;
}

// API Types
export interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeminiRequest {
  contents: GeminiContent[];
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface ChatAPIRequest {
  conversationId: string;
  messages: Message[];
  model: string;
  systemPrompt?: string;
}

export interface ChatAPIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Component Props Types
export interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export interface SystemPromptEditorProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

// Available Models
export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast and efficient' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', description: 'Most capable' },
  { id: 'gemini-pro', name: 'Gemini Pro', description: 'Legacy support' },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]['id'];

// Storage Keys
export const STORAGE_KEYS = {
  CONVERSATIONS: 'gemini_chat_conversations',
  ACTIVE_CONVERSATION_ID: 'gemini_chat_active_id',
  CURRENT_MODEL: 'gemini_chat_current_model',
  SYSTEM_PROMPT: 'gemini_chat_system_prompt',
  SIDEBAR_STATE: 'gemini_chat_sidebar_open',
} as const;
