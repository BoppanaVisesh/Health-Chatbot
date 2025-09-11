"use server";

import { translateText, type TranslateTextOutput, supportedLanguages } from "@/ai/flows/translator";

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
  const targetLanguageValue = formData.get("targetLanguage");

  if (!text || typeof text !== "string" || text.length < 2) {
    return { error: "Please enter some text to translate (at least 2 characters)." };
  }
  if (!targetLanguageValue || typeof targetLanguageValue !== "string") {
    return { error: "Please select a target language." };
  }

  const targetLanguageLabel = supportedLanguages.find(l => l.value === targetLanguageValue)?.label || String(targetLanguageValue);


  try {
    const result = await translateText({ text, targetLanguage: targetLanguageLabel });
    return { result, originalText: text, targetLanguage: String(targetLanguageValue) };
  } catch (e) {
    console.error(e);
    return { 
      error: "An error occurred while translating. Please try again.",
      originalText: text,
      targetLanguage: String(targetLanguageValue)
    };
  }
}
