import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AgentRequest, ChatMessage } from '@ai-playground/shared';
import { AIProxy } from '../utils/aiProxy';

const prisma = new PrismaClient();

export const executeAgent = async (req: AuthRequest, res: Response) => {
  try {
    const { tool, input, provider, model }: AgentRequest = req.body;

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

    // Build agent prompt based on tool
    const agentPrompt = buildAgentPrompt(tool, input);

    const messages: ChatMessage[] = [
      {
        id: 'system',
        role: 'system',
        content: agentPrompt.system,
        timestamp: new Date(),
      },
      {
        id: 'user',
        role: 'user',
        content: agentPrompt.user,
        timestamp: new Date(),
      },
    ];

    // Call AI provider
    const response = await AIProxy.chat({
      provider,
      apiKey: apiKey.encryptedKey,
      model,
      messages,
    });

    // Parse agent response
    const result = parseAgentResponse(tool, response.message.content);

    res.json(result);
  } catch (error: any) {
    console.error('Agent execution error:', error);
    res.status(500).json({ error: 'Failed to execute agent' });
  }
};

function buildAgentPrompt(tool: string, input: string): { system: string; user: string } {
  switch (tool) {
    case 'research':
      return {
        system: `You are a research agent. Your task is to provide comprehensive, well-researched answers based on your knowledge. Break down complex topics into digestible sections. Always cite reasoning steps.`,
        user: `Research and provide a comprehensive answer about: ${input}`,
      };

    case 'math':
      return {
        system: `You are a math solver agent. Solve mathematical problems step-by-step, showing your work clearly. Explain each step and provide the final answer.`,
        user: `Solve this math problem step by step: ${input}`,
      };

    case 'code':
      return {
        system: `You are a code assistant agent. You can generate, explain, and debug code. Provide clear, well-commented code with explanations.`,
        user: `Code assistance request: ${input}`,
      };

    case 'task':
      return {
        system: `You are a task automation agent. Break down complex tasks into clear, actionable steps. Provide a structured plan with numbered steps.`,
        user: `Create a task plan for: ${input}`,
      };

    case 'summarize':
      return {
        system: `You are a summarization agent. Condense long texts into concise summaries, preserving key information and main ideas.`,
        user: `Summarize the following: ${input}`,
      };

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

function parseAgentResponse(tool: string, content: string): any {
  // Extract steps if present
  const steps: Array<{ action: string; result: string }> = [];

  // Simple step extraction (can be enhanced)
  const stepMatches = content.match(/(?:Step \d+|^\d+\.)(.*?)(?=Step \d+|^\d+\.|$)/gs);

  if (stepMatches && stepMatches.length > 1) {
    stepMatches.forEach((step, index) => {
      steps.push({
        action: `Step ${index + 1}`,
        result: step.trim(),
      });
    });
  }

  return {
    result: content,
    steps: steps.length > 0 ? steps : undefined,
  };
}
