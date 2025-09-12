export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

import { HealthDataService, type Disease } from './health-data';
import { HealthTranslationService, type SupportedLanguage } from './health-translation';
import { LanguageDetectionService } from './language-detection';

export class OllamaClient {
  private baseUrl: string;
  private model: string;
  private healthData: HealthDataService;
  private translationService: HealthTranslationService;
  private languageDetection: LanguageDetectionService;
  private currentLanguage: SupportedLanguage = 'en';
  private conversationLanguage: SupportedLanguage = 'en';

  constructor(model: string = 'healthbot', baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.model = model;
    this.healthData = HealthDataService.getInstance();
    this.translationService = HealthTranslationService.getInstance();
    this.languageDetection = LanguageDetectionService.getInstance();
  }

  private async initializeHealthData() {
    await this.healthData.initialize();
  }

  private async translateUserMessage(message: string, fromLang: SupportedLanguage): Promise<string> {
    const words = message.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      const englishSymptom = this.translationService.getEnglishSymptom(word, fromLang);
      return englishSymptom || word;
    });
    return translatedWords.join(' ');
  }

  private getLanguageName(lang: SupportedLanguage): string {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      // Add more languages as needed
    };
    return languageNames[lang] || lang;
  }

  private getLocalizedDisclaimer(lang: SupportedLanguage): string {
    const disclaimers: { [key: string]: string } = {
      'en': 'IMPORTANT: This is not a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.',
      'hi': 'महत्वपूर्ण: यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। उचित निदान और उपचार के लिए हमेशा एक स्वास्थ्य सेवा प्रदाता से परामर्श करें।'
    };
    return disclaimers[lang] || disclaimers['en'];
  }

  private buildContext(message: string, targetLang: SupportedLanguage = 'en'): string {
    const symptoms = this.extractSymptoms(message);
    let context = "";

    if (symptoms.length > 0) {
      const possibleDiseases = this.healthData.findDiseasesBySymptoms(symptoms);
      if (possibleDiseases.length > 0) {
        context += this.buildDiseaseContext(possibleDiseases, targetLang);
      }

      // Add severity information
      const severities = symptoms.map(s => ({
        symptom: targetLang === 'en' ? s : this.translationService.translateSymptom(s, targetLang),
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

  private buildDiseaseContext(diseases: Disease[], targetLang: SupportedLanguage = 'en'): string {
    let context = targetLang === 'en' ? "Relevant Health Information:\n\n" : "प्रासंगिक स्वास्थ्य जानकारी:\n\n";
    
    diseases.slice(0, 3).forEach(disease => {
      const translatedName = this.translationService.translateDisease(disease.name, targetLang);
      const translatedDescription = disease.description ? 
        this.translationService.translateDescription(disease.description, targetLang) : undefined;

      context += `${targetLang === 'en' ? 'Disease' : 'रोग'}: ${translatedName}\n`;
      if (translatedDescription) {
        context += `${targetLang === 'en' ? 'Description' : 'विवरण'}: ${translatedDescription}\n`;
      }
      if (disease.precautions?.length) {
        context += targetLang === 'en' ? "Precautions:\n" : "सावधानियां:\n";
        disease.precautions.forEach(p => {
          const translatedPrecaution = this.translationService.translatePrecaution(p, targetLang);
          context += `- ${translatedPrecaution}\n`;
        });
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

  setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
  }

  async chat(message: string, language?: SupportedLanguage): Promise<string> {
    try {
      // Initialize services if needed
      await Promise.all([
        this.initializeHealthData(),
        this.translationService.initialize()
      ]);

      // Detect language from the message if not explicitly provided
      if (!language) {
        const detected = this.languageDetection.detectLanguage(message);
        if (detected.confidence > 0.8) {
          this.conversationLanguage = detected.language as SupportedLanguage;
        }
      } else {
        this.conversationLanguage = language;
      }
      
      // If the message is not in English, try to detect and translate symptoms
      let englishMessage = message;
      if (this.conversationLanguage !== 'en') {
        englishMessage = await this.translateUserMessage(message, this.conversationLanguage);
      }

      // Build context from health data
      const context = this.buildContext(englishMessage, this.conversationLanguage);

      // Get language-specific medical disclaimer
      const disclaimer = this.getLocalizedDisclaimer(this.conversationLanguage);

      // Construct the prompt with context and language instruction
      const fullPrompt = `Context for your reference:
${context}

User message: ${message}

IMPORTANT: You must respond in ${this.conversationLanguage === 'en' ? 'English' : 'Hindi'}.
If the user writes in Hindi, respond in Hindi. If they write in English, respond in English.

Based on the above context and your medical knowledge, provide a helpful response.
${disclaimer}`;

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
