import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AIProvider, AddAPIKeyRequest, ValidateAPIKeyRequest } from '@ai-playground/shared';
import { AIProxy } from '../utils/aiProxy';

const prisma = new PrismaClient();

export const addAPIKey = async (req: AuthRequest, res: Response) => {
  try {
    const { provider, encryptedKey }: AddAPIKeyRequest = req.body;

    // Upsert API key
    const apiKey = await prisma.aPIKey.upsert({
      where: {
        userId_provider: {
          userId: req.userId!,
          provider,
        },
      },
      update: {
        encryptedKey,
        isValid: true,
        lastValidated: new Date(),
      },
      create: {
        userId: req.userId!,
        provider,
        encryptedKey,
        models: '[]',
        isValid: true,
        lastValidated: new Date(),
      },
    });

    res.json({
      id: apiKey.id,
      provider: apiKey.provider,
      isValid: apiKey.isValid,
      models: JSON.parse(apiKey.models || '[]'),
    });
  } catch (error) {
    console.error('Add API key error:', error);
    res.status(500).json({ error: 'Failed to add API key' });
  }
};

export const validateAPIKey = async (req: AuthRequest, res: Response) => {
  try {
    const { provider, apiKey }: ValidateAPIKeyRequest = req.body;

    // Validate key with provider
    const models = await AIProxy.validateKey(provider as AIProvider, apiKey);

    res.json({
      isValid: true,
      models,
    });
  } catch (error: any) {
    console.error('Validate API key error:', error);
    res.json({
      isValid: false,
      models: [],
      error: error.message,
    });
  }
};

export const getAPIKeys = async (req: AuthRequest, res: Response) => {
  try {
    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        provider: true,
        models: true,
        isValid: true,
        lastValidated: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(apiKeys.map(k => ({
      ...k,
      models: JSON.parse(k.models || '[]')
    })));
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to get API keys' });
  }
};

export const deleteAPIKey = async (req: AuthRequest, res: Response) => {
  try {
    const { provider } = req.params;

    await prisma.aPIKey.delete({
      where: {
        userId_provider: {
          userId: req.userId!,
          provider,
        },
      },
    });

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
};

export const updateAPIKeyModels = async (req: AuthRequest, res: Response) => {
  try {
    const { provider } = req.params;
    const { models } = req.body;

    const apiKey = await prisma.aPIKey.update({
      where: {
        userId_provider: {
          userId: req.userId!,
          provider,
        },
      },
      data: {
        models: JSON.stringify(models),
        lastValidated: new Date(),
      },
    });

    res.json({
      id: apiKey.id,
      provider: apiKey.provider,
      models: JSON.parse(apiKey.models || '[]'),
    });
  } catch (error) {
    console.error('Update API key models error:', error);
    res.status(500).json({ error: 'Failed to update API key models' });
  }
};
