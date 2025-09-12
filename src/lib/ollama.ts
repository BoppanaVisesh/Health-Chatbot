export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

import { HealthDataService, type Disease } from './health-data';

export class OllamaClient {
  private baseUrl: string;
  private model: string;
  private healthData: HealthDataService;

  constructor(model: string = 'healthbot', baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.model = model;
    this.healthData = HealthDataService.getInstance();
  }

  private async initializeHealthData() {
    await this.healthData.initialize();
  }

  private buildContext(message: string): string {
    const symptoms = this.extractSymptoms(message);
    let context = "";

    if (symptoms.length > 0) {
      const possibleDiseases = this.healthData.findDiseasesBySymptoms(symptoms);
      if (possibleDiseases.length > 0) {
        context += this.buildDiseaseContext(possibleDiseases);
      }

      // Add severity information
      const severities = symptoms.map(s => ({
        symptom: s,
        severity: this.healthData.getSymptomSeverity(s)
      })).sort((a, b) => b.severity - a.severity);

      if (severities.length > 0) {
        context += "\nSymptom Severity Information:\n";
        severities.forEach(s => {
          context += `${s.symptom}: ${s.severity}/10\n`;
        });
      }
    }

    return context;
  }

  private buildDiseaseContext(diseases: Disease[]): string {
    let context = "Relevant Health Information:\n\n";
    
    diseases.slice(0, 3).forEach(disease => {
      context += `Disease: ${disease.name}\n`;
      if (disease.description) {
        context += `Description: ${disease.description}\n`;
      }
      if (disease.precautions?.length) {
        context += "Precautions:\n";
        disease.precautions.forEach(p => context += `- ${p}\n`);
      }
      context += "\n";
    });

    return context;
  }

  private extractSymptoms(message: string): string[] {
    const allSymptoms = this.healthData.getAllSymptoms();
    return allSymptoms.filter(symptom => 
      message.toLowerCase().includes(symptom.toLowerCase())
    );
  }

  async chat(message: string): Promise<string> {
    try {
      // Initialize health data if needed
      await this.initializeHealthData();

      // Build context from health data
      const context = this.buildContext(message);

      // Construct the prompt with context
      const fullPrompt = `Context for your reference:
${context}

User message: ${message}

Based on the above context and your medical knowledge, please provide a helpful response. If discussing potential health conditions, always advise consulting with a healthcare professional for proper diagnosis and treatment.`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as OllamaResponse;
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  }
}
