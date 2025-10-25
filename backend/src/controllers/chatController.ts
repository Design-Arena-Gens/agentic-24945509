import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ChatRequest, ChatMessage, PAGINATION } from '@ai-playground/shared';
import { AIProxy } from '../utils/aiProxy';

const prisma = new PrismaClient();

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { messages, provider, model, useMemory }: ChatRequest = req.body;

    // Get user's API key
    const apiKey = await prisma.aPIKey.findUnique({
      where: {
        userId_provider: {
          userId: req.userId!,
          provider,
        },
      },
    });

    if (!apiKey || !apiKey.isValid) {
      return res.status(400).json({ error: 'Invalid or missing API key for this provider' });
    }

    // Inject memory context if requested
    let enhancedMessages = [...messages];
    if (useMemory) {
      const memoryContexts = await prisma.memoryContext.findMany({
        where: { userId: req.userId },
        take: 10,
      });

      if (memoryContexts.length > 0) {
        const memoryText = memoryContexts
          .map(m => `${m.key}: ${m.value}`)
          .join('\n');

        enhancedMessages = [
          {
            role: 'system',
            content: `User context:\n${memoryText}`,
            timestamp: new Date(),
          } as ChatMessage,
          ...messages,
        ];
      }
    }

    // Call AI provider
    const response = await AIProxy.chat({
      provider,
      apiKey: apiKey.encryptedKey, // This should be decrypted on client side
      model,
      messages: enhancedMessages,
    });

    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);

    // Handle rate limits
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    // Handle token limits
    if (error.message?.includes('token')) {
      return res.status(400).json({ error: 'Token limit exceeded. Please reduce message length.' });
    }

    res.status(500).json({ error: 'Failed to process chat request' });
  }
};

export const saveChat = async (req: AuthRequest, res: Response) => {
  try {
    const { title, messages, provider, model } = req.body;

    const chatHistory = await prisma.chatHistory.create({
      data: {
        userId: req.userId!,
        title: title || messages[0]?.content?.substring(0, 50) || 'Untitled Chat',
        messages: JSON.stringify(messages),
        provider,
        model,
      },
    });

    res.json({
      ...chatHistory,
      messages: JSON.parse(chatHistory.messages)
    });
  } catch (error) {
    console.error('Save chat error:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = PAGINATION.CHAT_HISTORY_PER_PAGE;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      prisma.chatHistory.findMany({
        where: {
          userId: req.userId,
          deletedAt: null,
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          provider: true,
          model: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.chatHistory.count({
        where: {
          userId: req.userId,
          deletedAt: null,
        },
      }),
    ]);

    res.json({
      chats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

export const getChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const chat = await prisma.chatHistory.findFirst({
      where: {
        id,
        userId: req.userId,
        deletedAt: null,
      },
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({
      ...chat,
      messages: JSON.parse(chat.messages)
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to get chat' });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete
    await prisma.chatHistory.update({
      where: {
        id,
        userId: req.userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

export const searchChats = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const chats = await prisma.chatHistory.findMany({
      where: {
        userId: req.userId,
        deletedAt: null,
        title: { contains: query },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        provider: true,
        model: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(chats);
  } catch (error) {
    console.error('Search chats error:', error);
    res.status(500).json({ error: 'Failed to search chats' });
  }
};
