"use server";

import { mythBuster, type MythBusterOutput } from "@/ai/flows/myth-buster";

interface MythBusterState {
  result?: MythBusterOutput;
  error?: string;
  claim?: string;
}

export async function bustMyth(
  prevState: MythBusterState,
  formData: FormData
): Promise<MythBusterState> {
  const healthClaim = formData.get("healthClaim");

  if (!healthClaim || typeof healthClaim !== "string" || healthClaim.length < 10) {
    return { error: "Please enter a health claim to analyze (at least 10 characters)." };
  }

  try {
    const result = await mythBuster({ healthClaim });
    return { result, claim: healthClaim };
  } catch (e) {
    console.error(e);
    return { error: "An error occurred while analyzing the claim. Please try again.", claim: healthClaim };
  }
}
