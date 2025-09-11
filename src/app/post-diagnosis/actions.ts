"use server";

import {
  postDiagnosisEducation,
  type PostDiagnosisEducationOutput,
} from "@/ai/flows/post-diagnosis-education";

interface PostDiagnosisState {
  result?: PostDiagnosisEducationOutput;
  error?: string;
  diagnosis?: string;
}

export async function generateEducation(
  prevState: PostDiagnosisState,
  formData: FormData
): Promise<PostDiagnosisState> {
  const diagnosis = formData.get("diagnosis");
  const userContext = formData.get("userContext");

  if (!diagnosis || typeof diagnosis !== "string" || diagnosis.length < 3) {
    return { error: "Please enter a valid diagnosis (at least 3 characters)." };
  }

  try {
    const result = await postDiagnosisEducation({
      diagnosis,
      userContext: typeof userContext === 'string' ? userContext : undefined,
    });
    return { result, diagnosis };
  } catch (e) {
    console.error(e);
    return {
      error: "An error occurred while generating educational material. Please try again.",
      diagnosis,
    };
  }
}
