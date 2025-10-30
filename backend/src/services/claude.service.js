import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_CONFIG, validateClaudeConfig } from '../config/claude.js';

// Validate configuration on load
validateClaudeConfig();

const anthropic = new Anthropic({
  apiKey: CLAUDE_CONFIG.apiKey,
});

/**
 * Call Claude API with a prompt
 * @param {string} userPrompt - The user prompt
 * @param {string} systemPrompt - The system prompt (optional)
 * @returns {Promise<string>} - The generated text
 */
export const callClaude = async (userPrompt, systemPrompt = '') => {
  try {
    console.log('🤖 Calling Claude API...');

    const message = await anthropic.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      system: systemPrompt || undefined,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
    });

    const responseText = message.content[0].text;
    console.log(`✅ Claude API response received (${responseText.length} chars)`);

    return responseText;
  } catch (error) {
    console.error('❌ Claude API Error:', error.message);

    if (error.status === 401) {
      throw new Error('Invalid Claude API key');
    }
    if (error.status === 429) {
      throw new Error('Claude API rate limit exceeded');
    }
    if (error.status === 529) {
      throw new Error('Claude API is temporarily overloaded');
    }

    throw new Error(`Error generating content with Claude: ${error.message}`);
  }
};

/**
 * Parse JSON response from Claude
 * Handles cases where Claude includes markdown code blocks
 * @param {string} text - The text response from Claude
 * @returns {any} - Parsed JSON object
 */
export const parseClaudeJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse Claude JSON response:', text);
    throw new Error('Invalid JSON response from Claude');
  }
};
