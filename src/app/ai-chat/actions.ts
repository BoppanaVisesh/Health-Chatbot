"use server";

import {
  aiChat,
  type AiChatOutput,
} from "@/ai/flows/ai-chat";

export async function sendMessage(
  userInput: string
): Promise<AiChatOutput> {
  if (!userInput) {
    return { response: "I'm sorry, I didn't receive a message." };
  }

  try {
    const result = await aiChat({ userInput });
    return result;
  } catch (e) {
    console.error('Error in sendMessage:', e);
    return {
      response: "I apologize, but I'm having trouble connecting to the AI service. Please ensure the Ollama service is running with the 'healthbot' model and try again.",
    };
  }
}
