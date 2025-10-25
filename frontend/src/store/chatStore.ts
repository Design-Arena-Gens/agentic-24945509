import { create } from 'zustand';
import { ChatMessage, AIProvider } from '@ai-playground/shared';

interface ChatState {
  messages: ChatMessage[];
  currentProvider: AIProvider;
  currentModel: string;
  useMemory: boolean;
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setUseMemory: (useMemory: boolean) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentProvider: 'openrouter',
  currentModel: 'anthropic/claude-3.5-sonnet',
  useMemory: false,
  isLoading: false,

  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages: ChatMessage[]) =>
    set({ messages }),

  clearMessages: () =>
    set({ messages: [] }),

  setProvider: (provider: AIProvider) =>
    set({ currentProvider: provider }),

  setModel: (model: string) =>
    set({ currentModel: model }),

  setUseMemory: (useMemory: boolean) =>
    set({ useMemory }),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),
}));
