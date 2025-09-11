"use server";

import { translateText, type TranslateTextOutput } from "@/ai/flows/translator";

interface TranslatorState {
  result?: TranslateTextOutput;
  error?: string;
  originalText?: string;
  targetLanguage?: string;
}

export async function getTranslation(
  prevState: TranslatorState,
  formData: FormData
): Promise<TranslatorState> {
  const text = formData.get("text");
  const targetLanguage = formData.get("targetLanguage");

  if (!text || typeof text !== "string" || text.length < 2) {
    return { error: "Please enter some text to translate (at least 2 characters)." };
  }
  if (!targetLanguage || typeof targetLanguage !== "string") {
    return { error: "Please select a target language." };
  }

  try {
    const result = await translateText({ text, targetLanguage });
    return { result, originalText: text, targetLanguage };
  } catch (e) {
    console.error(e);
    return { 
      error: "An error occurred while translating. Please try again.",
      originalText: text,
      targetLanguage 
    };
  }
}
