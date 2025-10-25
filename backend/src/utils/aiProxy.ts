import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, ChatMessage, ChatResponse } from '@ai-playground/shared';

interface AIProxyOptions {
  provider: AIProvider;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
}

export class AIProxy {
  static async chat(options: AIProxyOptions): Promise<ChatResponse> {
    const { provider, apiKey, model, messages } = options;

    switch (provider) {
      case 'openai':
        return this.chatOpenAI(apiKey, model, messages);
      case 'openrouter':
        return this.chatOpenRouter(apiKey, model, messages);
      case 'anthropic':
        return this.chatAnthropic(apiKey, model, messages);
      case 'google':
        return this.chatGoogle(apiKey, model, messages);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private static async chatOpenAI(
    apiKey: string,
    model: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const choice = completion.choices[0];
    if (!choice?.message) {
      throw new Error('No response from OpenAI');
    }

    return {
      message: {
        id: completion.id,
        role: 'assistant',
        content: choice.message.content || '',
        timestamp: new Date(),
        model,
      },
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    };
  }

  private static async chatOpenRouter(
    apiKey: string,
    model: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    const completion = await client.chat.completions.create({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const choice = completion.choices[0];
    if (!choice?.message) {
      throw new Error('No response from OpenRouter');
    }

    return {
      message: {
        id: completion.id,
        role: 'assistant',
        content: choice.message.content || '',
        timestamp: new Date(),
        model,
      },
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    };
  }

  private static async chatAnthropic(
    apiKey: string,
    model: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            role: m.role,
            content: m.content,
          })),
        system: messages.find(m => m.role === 'system')?.content,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic error: ${error}`);
    }

    const data: any = await response.json();

    return {
      message: {
        id: data.id,
        role: 'assistant',
        content: data.content[0]?.text || '',
        timestamp: new Date(),
        model,
      },
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      } : undefined,
    };
  }

  private static async chatGoogle(
    apiKey: string,
    model: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // Convert messages to Gemini format
    const history = messages
      .filter(m => m.role !== 'system')
      .slice(0, -1)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1];
    const systemPrompt = messages.find(m => m.role === 'system')?.content;

    const chat = geminiModel.startChat({
      history,
      ...(systemPrompt && {
        systemInstruction: systemPrompt,
      }),
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    return {
      message: {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        model,
      },
    };
  }

  static async validateKey(provider: AIProvider, apiKey: string): Promise<string[]> {
    try {
      switch (provider) {
        case 'openai':
          return this.validateOpenAI(apiKey);
        case 'openrouter':
          return this.validateOpenRouter(apiKey);
        case 'anthropic':
          return this.validateAnthropic(apiKey);
        case 'google':
          return this.validateGoogle(apiKey);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error: any) {
      throw new Error(`Invalid API key: ${error.message}`);
    }
  }

  private static async validateOpenAI(apiKey: string): Promise<string[]> {
    const client = new OpenAI({ apiKey });
    const models = await client.models.list();
    return models.data
      .filter(m => m.id.startsWith('gpt'))
      .map(m => m.id);
  }

  private static async validateOpenRouter(apiKey: string): Promise<string[]> {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid API key');
    }

    const data: any = await response.json();
    return data.data.slice(0, 20).map((m: any) => m.id);
  }

  private static async validateAnthropic(apiKey: string): Promise<string[]> {
    // Simple validation - try a minimal request
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1,
      }),
    });

    if (!response.ok) {
      throw new Error('Invalid API key');
    }

    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  private static async validateGoogle(apiKey: string): Promise<string[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Test with a simple prompt
    await model.generateContent('Hi');

    return ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  }
}
