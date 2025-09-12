"use server";

import {
  getMedicationInfo,
  type MedicationInfoOutput,
} from "@/ai/flows/medication-explainer";

interface MedicationInfoState {
  result?: MedicationInfoOutput;
  error?: string;
}

export async function getMedicationInfo(
  prevState: MedicationInfoState,
  formData: FormData
): Promise<MedicationInfoState> {
  const photoDataUri = formData.get("photoDataUri");

  if (!photoDataUri || typeof photoDataUri !== "string" || !photoDataUri.startsWith('data:image')) {
    return { error: "Please upload or capture a valid image of the prescription." };
  }

  try {
    const result = await getMedicationInfo({
      photoDataUri,
    });
    return { result };
  } catch (e) {
    console.error(e);
    return {
      error: "An error occurred while getting medication information. Please try again.",
    };
  }
}
