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
    console.error(e);
    return {
      response: "I'm sorry, something went wrong. Please try again later.",
    };
  }
}
