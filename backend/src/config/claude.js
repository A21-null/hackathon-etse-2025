import dotenv from 'dotenv';

dotenv.config();

export const CLAUDE_CONFIG = {
  apiKey: process.env.CLAUDE_API_KEY,
  model: 'claude-3-5-sonnet-20241022',  // Claude 3.5 Sonnet (más potente que Haiku)
  maxTokens: 2000,
  temperature: 0.7
};

export const validateClaudeConfig = () => {
  if (!CLAUDE_CONFIG.apiKey) {
    throw new Error('CLAUDE_API_KEY is not defined in environment variables');
  }
};
