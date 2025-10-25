import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message),
      });
    }

    next();
  };
};

export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(50).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    bio: Joi.string().max(500),
    avatarUrl: Joi.string().uri(),
  }).min(1),

  addAPIKey: Joi.object({
    provider: Joi.string().valid('openrouter', 'openai', 'anthropic', 'google').required(),
    encryptedKey: Joi.string().required(),
  }),

  validateAPIKey: Joi.object({
    provider: Joi.string().valid('openrouter', 'openai', 'anthropic', 'google').required(),
    apiKey: Joi.string().required(),
  }),

  chat: Joi.object({
    messages: Joi.array().items(
      Joi.object({
        role: Joi.string().valid('user', 'assistant', 'system').required(),
        content: Joi.string().required(),
        timestamp: Joi.date(),
      })
    ).required(),
    provider: Joi.string().valid('openrouter', 'openai', 'anthropic', 'google').required(),
    model: Joi.string().required(),
    useMemory: Joi.boolean(),
    stream: Joi.boolean(),
  }),

  memory: Joi.object({
    key: Joi.string().min(1).max(100).required(),
    value: Joi.string().max(10240).required(),
  }),

  agent: Joi.object({
    tool: Joi.string().valid('research', 'math', 'code', 'task', 'summarize').required(),
    input: Joi.string().required(),
    provider: Joi.string().valid('openrouter', 'openai', 'anthropic', 'google').required(),
    model: Joi.string().required(),
  }),
};
