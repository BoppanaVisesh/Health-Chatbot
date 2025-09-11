'use server';

/**
 * @fileOverview This file contains the MythBuster flow, which analyzes a questionable health claim and provides evidence-based explanations to debunk misinformation.
 *
 * - mythBuster - Analyzes the validity of a health claim.
 * - MythBusterInput - The input type for the mythBuster function.
 * - MythBusterOutput - The return type for the mythBuster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MythBusterInputSchema = z.object({
  healthClaim: z
    .string()
    .describe('The health claim to be analyzed for validity.'),
});
export type MythBusterInput = z.infer<typeof MythBusterInputSchema>;

const MythBusterOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe('Whether the health claim is valid or not.'),
  explanation: z
    .string()
    .describe(
      'An evidence-based explanation debunking the fake news and misinformation in the health claim.'
    ),
});
export type MythBusterOutput = z.infer<typeof MythBusterOutputSchema>;

export async function mythBuster(input: MythBusterInput): Promise<MythBusterOutput> {
  return mythBusterFlow(input);
}

const mythBusterPrompt = ai.definePrompt({
  name: 'mythBusterPrompt',
  input: {schema: MythBusterInputSchema},
  output: {schema: MythBusterOutputSchema},
  prompt: `You are an expert in health and medicine, skilled at identifying and debunking health-related myths and misinformation.

  Analyze the following health claim and determine its validity. Provide an evidence-based explanation to support your analysis.

  Health Claim: {{{healthClaim}}}
  \nDetermine if the claim is valid. Then, provide an explanation debunking the fake news and misinformation in the health claim.  Structure the explanation to be easily understood by a lay person.
  Respond in the following JSON format: { \"isValid\": <true|false>, \"explanation\": \"<explanation>\"}`,
});

const mythBusterFlow = ai.defineFlow(
  {
    name: 'mythBusterFlow',
    inputSchema: MythBusterInputSchema,
    outputSchema: MythBusterOutputSchema,
  },
  async input => {
    const {output} = await mythBusterPrompt(input);
    return output!;
  }
);
