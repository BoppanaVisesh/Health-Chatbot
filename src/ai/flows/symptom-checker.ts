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

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker. A user will describe their symptoms, and you will provide potential causes, recommended actions, and an urgency level. You may also be provided with an image.

Symptoms: {{{symptoms}}}

{{#if photoDataUri}}
Photo of symptom: {{media url=photoDataUri}}
{{/if}}

Analyze the provided information and respond in a structured JSON format.
`,
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
