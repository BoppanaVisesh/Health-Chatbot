import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error(
    'Missing GOOGLE_API_KEY. Add it to your .env.local and restart the dev server.'
  );
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey,
  })],
  model: 'googleai/gemini-2.5-flash',
});
