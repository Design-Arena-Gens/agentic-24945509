export const APP_NAME = 'AI Playground';
export const APP_DESCRIPTION = 'Bring Your API Key, Unlock AI Magic—100% Free!';

export const MAX_MESSAGE_LENGTH = 32000;
export const MAX_MEMORY_SIZE = 10240; // 10KB
export const MAX_CHAT_HISTORY = 50;
export const MAX_AVATAR_SIZE = 1048576; // 1MB
export const AVATAR_DIMENSIONS = { width: 256, height: 256 };

export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 100,
  CHAT_REQUESTS_PER_MINUTE: 30,
  API_KEY_VALIDATIONS_PER_HOUR: 10,
};

export const JWT_EXPIRY = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
};

export const PAGINATION = {
  CHAT_HISTORY_PER_PAGE: 20,
  MESSAGES_PER_PAGE: 50,
};

export const DEFAULT_MODELS = {
  openrouter: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-pro'],
  openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  google: ['gemini-pro', 'gemini-pro-vision'],
};

export const AGENT_TOOLS = [
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Search and synthesize information on any topic',
    icon: '🔍',
  },
  {
    id: 'math',
    name: 'Math Solver',
    description: 'Solve mathematical problems step by step',
    icon: '🔢',
  },
  {
    id: 'code',
    name: 'Code Assistant',
    description: 'Generate, explain, and debug code',
    icon: '💻',
  },
  {
    id: 'task',
    name: 'Task Automator',
    description: 'Execute multi-step task workflows',
    icon: '⚙️',
  },
  {
    id: 'summarize',
    name: 'Summarizer',
    description: 'Condense long texts into key points',
    icon: '📝',
  },
];
