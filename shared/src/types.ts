// Shared types across frontend and backend

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  provider: AIProvider;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryContext {
  id: string;
  userId: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AIProvider = 'openrouter' | 'openai' | 'anthropic' | 'google';

export interface APIKeyConfig {
  provider: AIProvider;
  encryptedKey: string;
  models: string[];
  isValid: boolean;
  lastValidated?: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  provider: AIProvider;
  model: string;
  useMemory?: boolean;
  stream?: boolean;
}

export interface ChatResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AddAPIKeyRequest {
  provider: AIProvider;
  encryptedKey: string;
}

export interface ValidateAPIKeyRequest {
  provider: AIProvider;
  apiKey: string;
}

export interface ValidateAPIKeyResponse {
  isValid: boolean;
  models: string[];
  error?: string;
}

export interface AgentTool {
  name: string;
  description: string;
  execute: (input: string) => Promise<string>;
}

export interface AgentRequest {
  tool: string;
  input: string;
  provider: AIProvider;
  model: string;
}

export interface AgentResponse {
  result: string;
  steps?: Array<{
    action: string;
    result: string;
  }>;
}

export const AI_PROVIDERS: Record<AIProvider, { name: string; baseUrl: string }> = {
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1'
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1'
  },
  google: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  }
};

export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key. Please check your key and try again.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_MODEL: 'Invalid model selected.',
  TOKEN_LIMIT_EXCEEDED: 'Token limit exceeded. Please reduce message length.',
};
