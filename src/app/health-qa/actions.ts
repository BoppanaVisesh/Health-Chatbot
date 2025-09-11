"use server";

import { healthQA, type HealthQAOutput } from "@/ai/flows/health-q-and-a";

interface HealthQAState {
  result?: HealthQAOutput;
  error?: string;
  question?: string;
}

export async function askQuestion(
  prevState: HealthQAState,
  formData: FormData
): Promise<HealthQAState> {
  const question = formData.get("question");

  if (!question || typeof question !== "string" || question.length < 5) {
    return { error: "Please enter a valid question (at least 5 characters)." };
  }

  try {
    const result = await healthQA({ question });
    return { result, question };
  } catch (e) {
    console.error(e);
    return { error: "An error occurred while getting the answer. Please try again.", question };
  }
}
