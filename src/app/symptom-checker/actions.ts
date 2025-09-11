"use server";

import {
  symptomChecker,
  type SymptomCheckerOutput,
} from "@/ai/flows/symptom-checker";

interface SymptomCheckerState {
  result?: SymptomCheckerOutput;
  error?: string;
}

export async function checkSymptoms(
  prevState: SymptomCheckerState,
  formData: FormData
): Promise<SymptomCheckerState> {
  const symptoms = formData.get("symptoms");

  if (!symptoms || typeof symptoms !== "string" || symptoms.length < 10) {
    return { error: "Please describe your symptoms in more detail (at least 10 characters)." };
  }

  try {
    const result = await symptomChecker({ symptoms });
    return { result };
  } catch (e) {
    console.error(e);
    return { error: "An error occurred while checking symptoms. Please try again." };
  }
}
