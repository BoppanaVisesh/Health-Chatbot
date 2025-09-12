'use server';

/**
 * @fileOverview An AI agent to check symptoms and provide potential causes and recommended actions.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the symptoms experienced by the user.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the symptom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  potentialCauses: z
    .string()
    .describe('A list of potential causes for the symptoms described.'),
  recommendedActions: z
    .string()
    .describe(
      'Recommended actions based on the symptoms, such as home care or a doctor visit.'
    ),
  urgencyLevel: z
    .string()
    .describe(
      'An assessment of the urgency level of the symptoms (e.g., low, medium, high).'
    ),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

// Cache for repeated requests
const symptomCache = new Map<string, { result: SymptomCheckerOutput; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  // Create cache key from symptoms (ignore photo for caching)
  const cacheKey = input.symptoms.toLowerCase().trim();
  const cached = symptomCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }

  try {
    const result = await symptomCheckerFlow(input);
    
    // Cache the result
    symptomCache.set(cacheKey, { result, timestamp: Date.now() });
    
    // Clean up old cache entries
    if (symptomCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of symptomCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          symptomCache.delete(key);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Symptom checker error:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a medical AI assistant. Analyze the symptoms and provide a concise assessment.

Symptoms: {{{symptoms}}}

{{#if photoDataUri}}
Visual symptom: {{media url=photoDataUri}}
{{/if}}

Provide:
1. Potential causes (2-3 most likely)
2. Recommended actions (immediate steps)
3. Urgency level (low/medium/high)

Be concise and professional.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
