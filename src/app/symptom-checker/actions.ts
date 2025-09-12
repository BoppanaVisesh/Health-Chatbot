"use server";

import {
  symptomChecker,
  type SymptomCheckerOutput,
} from "@/ai/flows/symptom-checker";

interface SymptomCheckerState {
  result?: SymptomCheckerOutput;
  error?: string;
}

// Timeout wrapper function
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
}

export async function checkSymptoms(
  prevState: SymptomCheckerState,
  formData: FormData
): Promise<SymptomCheckerState> {
  const symptoms = formData.get("symptoms");
  const photoDataUri = formData.get("photoDataUri");

  if (!symptoms || typeof symptoms !== "string" || symptoms.length < 10) {
    return { error: "Please describe your symptoms in more detail (at least 10 characters)." };
  }

  // Validate symptoms length to prevent abuse
  if (symptoms.length > 2000) {
    return { error: "Please keep your symptom description under 2000 characters." };
  }

  const input: {symptoms: string, photoDataUri?: string} = { symptoms };
  if (photoDataUri && typeof photoDataUri === "string" && photoDataUri.startsWith('data:image')) {
    // Validate image size (basic check)
    if (photoDataUri.length > 10 * 1024 * 1024) { // 10MB limit
      return { error: "Image file is too large. Please use a smaller image." };
    }
    input.photoDataUri = photoDataUri;
  }

  try {
    // Add timeout of 30 seconds
    const result = await withTimeout(symptomChecker(input), 30000);
    return { result };
  } catch (e) {
    console.error('Symptom checker error:', e);
    
    if (e instanceof Error && e.message === 'Request timeout') {
      return { error: "Analysis is taking longer than expected. Please try again with a shorter description." };
    }
    
    return { error: "An error occurred while checking symptoms. Please try again." };
  }
}
