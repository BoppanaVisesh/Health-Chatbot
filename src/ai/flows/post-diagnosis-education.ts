// Implemented Genkit flow for generating personalized post-diagnosis education materials.

'use server';

/**
 * @fileOverview Provides personalized educational materials for users after receiving a diagnosis.
 *
 * - postDiagnosisEducation - A function that generates personalized educational materials for a given medical condition.
 * - PostDiagnosisEducationInput - The input type for the postDiagnosisEducation function.
 * - PostDiagnosisEducationOutput - The return type for the postDiagnosisEducation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PostDiagnosisEducationInputSchema = z.object({
  diagnosis: z.string().describe('The medical diagnosis received by the user.'),
  userContext: z
    .string()
    .optional()
    .describe(
      'Additional context about the user, such as age, health history, and concerns, to personalize the educational material.'
    ),
});
export type PostDiagnosisEducationInput = z.infer<typeof PostDiagnosisEducationInputSchema>;

const PostDiagnosisEducationOutputSchema = z.object({
  educationalMaterial: z
    .string()
    .describe(
      'Personalized educational material explaining the medical condition in an easy to understand way, including treatment options and self-care advice.'
    ),
});
export type PostDiagnosisEducationOutput = z.infer<typeof PostDiagnosisEducationOutputSchema>;

export async function postDiagnosisEducation(
  input: PostDiagnosisEducationInput
): Promise<PostDiagnosisEducationOutput> {
  return postDiagnosisEducationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postDiagnosisEducationPrompt',
  input: {schema: PostDiagnosisEducationInputSchema},
  output: {schema: PostDiagnosisEducationOutputSchema},
  prompt: `You are an expert medical educator. Your role is to provide patients with clear, easy-to-understand explanations of their medical diagnoses and available treatment options.

  Based on the diagnosis: {{{diagnosis}}}
  And considering the user context: {{{userContext}}}

  Generate personalized educational material that will help the patient understand their condition and what steps they can take for treatment and self-care. Focus on clarity and actionable advice.
  `,
});

const postDiagnosisEducationFlow = ai.defineFlow(
  {
    name: 'postDiagnosisEducationFlow',
    inputSchema: PostDiagnosisEducationInputSchema,
    outputSchema: PostDiagnosisEducationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
