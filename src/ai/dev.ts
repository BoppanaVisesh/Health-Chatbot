import { config } from 'dotenv';
config();

import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/myth-buster.ts';
import '@/ai/flows/mental-health-chat.ts';
import '@/ai/flows/post-diagnosis-education.ts';
import '@/ai/flows/health-q-and-a.ts';
import '@/ai/flows/medication-explainer.ts';
import '@/ai/flows/translator.ts';
