"use server";

import {
  getMedicationInfo as getMedicationInfoFlow,
  type MedicationInfoOutput,
} from "@/ai/flows/medication-explainer";

interface MedicationInfoState {
  result?: MedicationInfoOutput;
  error?: string;
  medicationName?: string;
}

export async function getMedicationInfo(
  prevState: MedicationInfoState,
  formData: FormData
): Promise<MedicationInfoState> {
  const medicationName = formData.get("medicationName");
  const userContext = formData.get("userContext");

  if (!medicationName || typeof medicationName !== "string" || medicationName.length < 2) {
    return { error: "Please enter a valid medication name (at least 2 characters)." };
  }

  try {
    const result = await getMedicationInfoFlow({
      medicationName,
      userContext: typeof userContext === 'string' ? userContext : undefined,
    });
    return { result, medicationName };
  } catch (e) {
    console.error(e);
    return {
      error: "An error occurred while getting medication information. Please try again.",
      medicationName,
    };
  }
}
