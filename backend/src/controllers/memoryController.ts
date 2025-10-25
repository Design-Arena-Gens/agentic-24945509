import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { MAX_MEMORY_SIZE } from '@ai-playground/shared';

const prisma = new PrismaClient();

export const getMemory = async (req: AuthRequest, res: Response) => {
  try {
    const memories = await prisma.memoryContext.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(memories);
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({ error: 'Failed to get memory' });
  }
};

export const setMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;

    // Check total memory size
    const memories = await prisma.memoryContext.findMany({
      where: { userId: req.userId },
      select: { value: true },
    });

    const currentSize = memories.reduce((sum, m) => sum + m.value.length, 0);
    const newSize = currentSize + value.length;

    if (newSize > MAX_MEMORY_SIZE) {
      return res.status(400).json({
        error: `Memory size limit exceeded. Maximum: ${MAX_MEMORY_SIZE} bytes`,
      });
    }

    const memory = await prisma.memoryContext.upsert({
      where: {
        userId_key: {
          userId: req.userId!,
          key,
        },
      },
      update: {
        value,
      },
      create: {
        userId: req.userId!,
        key,
        value,
      },
    });

    res.json(memory);
  } catch (error) {
    console.error('Set memory error:', error);
    res.status(500).json({ error: 'Failed to set memory' });
  }
};

export const deleteMemory = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;

    await prisma.memoryContext.delete({
      where: {
        userId_key: {
          userId: req.userId!,
          key,
        },
      },
    });

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
};

export const clearMemory = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.memoryContext.deleteMany({
      where: { userId: req.userId },
    });

    res.json({ message: 'All memory cleared successfully' });
  } catch (error) {
    console.error('Clear memory error:', error);
    res.status(500).json({ error: 'Failed to clear memory' });
  }
};
