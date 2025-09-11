'use server';
/**
 * @fileOverview An AI agent to answer health questions.
 *
 * - healthQA - A function that answers health questions.
 * - HealthQAInput - The input type for the healthQA function.
 * - HealthQAOutput - The return type for the healthQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthQAInputSchema = z.object({
  question: z.string().describe('The health question to answer.'),
});
export type HealthQAInput = z.infer<typeof HealthQAInputSchema>;

const HealthQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the health question.'),
});
export type HealthQAOutput = z.infer<typeof HealthQAOutputSchema>;

export async function healthQA(input: HealthQAInput): Promise<HealthQAOutput> {
  return healthQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthQAPrompt',
  input: {schema: HealthQAInputSchema},
  output: {schema: HealthQAOutputSchema},
  prompt: `You are a helpful AI assistant that answers health questions based on verified medical knowledge.

  Question: {{{question}}}
  Answer: `,
});

const healthQAFlow = ai.defineFlow(
  {
    name: 'healthQAFlow',
    inputSchema: HealthQAInputSchema,
    outputSchema: HealthQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
