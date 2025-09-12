'use server';

/**
 * @fileOverview An AI agent to explain medication usage and dosage from a photo.
 *
 * - getMedicationInfo - A function that provides an explanation for a given medication from a photo.
 * - MedicationInfoInput - The input type for the getMedicationInfo function.
 * - MedicationInfoOutput - The return type for the getMedicationInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationInfoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a prescription or medication, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MedicationInfoInput = z.infer<typeof MedicationInfoInputSchema>;

const MedicationInfoOutputSchema = z.object({
  medicationName: z.string().describe('The name of the medication found in the image.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the medication, including its purpose, common dosage, and important considerations.'
    ),
});
export type MedicationInfoOutput = z.infer<typeof MedicationInfoOutputSchema>;

// Cache for repeated requests
const medicationCache = new Map<string, { result: MedicationInfoOutput; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (medications change less frequently)

export async function getMedicationInfo(
  input: MedicationInfoInput
): Promise<MedicationInfoOutput> {
  // Create cache key from image hash (first 50 chars of base64)
  const cacheKey = input.photoDataUri.substring(0, 50);
  const cached = medicationCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  try {
    const result = await getMedicationInfoFlow(input);
    
    // Cache the result
    medicationCache.set(cacheKey, { result, timestamp: Date.now() });
    
    // Clean up old cache entries
    if (medicationCache.size > 50) {
      const now = Date.now();
      for (const [key, value] of medicationCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          medicationCache.delete(key);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Medication analyzer error:', error);
    throw new Error('Failed to analyze medication. Please try again.');
  }
}

const prompt = ai.definePrompt({
  name: 'medicationExplainerPrompt',
  input: {schema: MedicationInfoInputSchema},
  output: {schema: MedicationInfoOutputSchema},
  prompt: `You are an AI pharmacist. Analyze the medication image and provide clear information.

Image: {{media url=photoDataUri}}

Identify the medication name and provide:
1. What it's used for
2. Common dosage (general range only)
3. Important considerations
4. Reminder to consult doctor

Be concise and helpful.`,
});

const getMedicationInfoFlow = ai.defineFlow(
  {
    name: 'getMedicationInfoFlow',
    inputSchema: MedicationInfoInputSchema,
    outputSchema: MedicationInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
