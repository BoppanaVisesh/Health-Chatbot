"use server";

import {
  getMedicationInfo as getMedicationInfoFlow,
  type MedicationInfoOutput,
} from "@/ai/flows/medication-explainer";

interface MedicationInfoState {
  result?: MedicationInfoOutput;
  error?: string;
}

// Timeout wrapper function
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
}

export async function getMedicationInfo(
  prevState: MedicationInfoState,
  formData: FormData
): Promise<MedicationInfoState> {
  const photoDataUri = formData.get("photoDataUri");

  if (!photoDataUri || typeof photoDataUri !== "string" || !photoDataUri.startsWith('data:image')) {
    return { error: "Please upload or capture a valid image of the prescription." };
  }

  // Validate image size (basic check)
  if (photoDataUri.length > 10 * 1024 * 1024) { // 10MB limit
    return { error: "Image file is too large. Please use a smaller image." };
  }

  try {
    // Add timeout of 45 seconds (image processing takes longer)
    const result = await withTimeout(getMedicationInfoFlow({
      photoDataUri,
    }), 45000);
    return { result };
  } catch (e) {
    console.error('Medication analyzer error:', e);
    
    if (e instanceof Error && e.message === 'Request timeout') {
      return { error: "Analysis is taking longer than expected. Please try with a clearer image." };
    }
    
    return {
      error: "An error occurred while getting medication information. Please try again.",
    };
  }
}
