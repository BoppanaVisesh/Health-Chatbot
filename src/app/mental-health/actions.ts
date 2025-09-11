"use server";

import {
  mentalHealthChat,
  type MentalHealthChatOutput,
} from "@/ai/flows/mental-health-chat";

export async function sendMessage(
  userInput: string
): Promise<MentalHealthChatOutput> {
  if (!userInput) {
    return { response: "I'm sorry, I didn't receive a message." };
  }

  try {
    const result = await mentalHealthChat({ userInput });
    return result;
  } catch (e) {
    console.error(e);
    return {
      response: "I'm sorry, something went wrong. Please try again later.",
    };
  }
}
