'use server';

/**
 * @fileOverview An AI agent to explain medication usage and dosage.
 *
 * - getMedicationInfo - A function that provides an explanation for a given medication.
 * - MedicationInfoInput - The input type for the getMedicationInfo function.
 * - MedicationInfoOutput - The return type for the getMedicationInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationInfoInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to explain.'),
  userContext: z
    .string()
    .optional()
    .describe(
      'Additional context about the user, such as their condition or other medications.'
    ),
});
export type MedicationInfoInput = z.infer<typeof MedicationInfoInputSchema>;

const MedicationInfoOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the medication, including its purpose, common dosage, and important considerations.'
    ),
});
export type MedicationInfoOutput = z.infer<typeof MedicationInfoOutputSchema>;

export async function getMedicationInfo(
  input: MedicationInfoInput
): Promise<MedicationInfoOutput> {
  return getMedicationInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationExplainerPrompt',
  input: {schema: MedicationInfoInputSchema},
  output: {schema: MedicationInfoOutputSchema},
  prompt: `You are an AI pharmacist. Your role is to provide clear, easy-to-understand information about medications.

A user has asked for information about the following medication:
Medication: {{{medicationName}}}
{{#if userContext}}
User Context: {{{userContext}}}
{{/if}}

Please provide a detailed explanation that covers:
1.  What the medication is used for.
2.  Common dosage information (provide a general range, not specific medical advice).
3.  Why it is important to take as prescribed.
4.  Mention that this is not a substitute for professional medical advice and the user should consult their doctor.

Generate the explanation in a conversational and helpful tone.`,
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
