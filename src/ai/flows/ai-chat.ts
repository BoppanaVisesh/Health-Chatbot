'use server';

/**
 * @fileOverview A general purpose AI chatbot using Ollama.
 *
 * - aiChat - A function that handles the AI chat process with Ollama model.
 * - AiChatInput - The input type for the aiChat function.
 * - AiChatOutput - The return type for the aiChat function.
 */

import { OllamaClient } from '@/lib/ollama';

export interface AiChatInput {
  userInput: string;
}

export interface AiChatOutput {
  response: string;
}

// Create a singleton instance of the Ollama client
const ollamaClient = new OllamaClient('healthbot');

export async function aiChat(input: AiChatInput): Promise<AiChatOutput> {
  if (!input.userInput?.trim()) {
    return {
      response: "I apologize, but I didn't receive any input. Could you please try again?"
    };
  }

  try {
    const response = await ollamaClient.chat(input.userInput);
    return { response };
  } catch (error) {
    console.error('Error in aiChat:', error);
    return {
      response: "I apologize, but I'm having trouble processing your request. Please ensure the Ollama service is running and try again."
    };
  }
}
