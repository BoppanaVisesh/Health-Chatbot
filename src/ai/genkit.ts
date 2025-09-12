import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
  // Performance optimizations
  config: {
    temperature: 0.3, // Lower temperature for more consistent responses
    maxOutputTokens: 1000, // Limit response length for faster processing
    topP: 0.8,
    topK: 40,
  },
});
