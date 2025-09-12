import { promises as fs } from 'fs';
import path from 'path';

export type SupportedLanguage = 'en' | 'hi' | string;

export interface TranslationMap {
  symptoms: { [key: string]: { [lang: string]: string } };
  diseases: { [key: string]: { [lang: string]: string } };
  descriptions: { [key: string]: { [lang: string]: string } };
  precautions: { [key: string]: { [lang: string]: string } };
}

export class HealthTranslationService {
  private static instance: HealthTranslationService;
  private translations: TranslationMap = {
    symptoms: {},
    diseases: {},
    descriptions: {},
    precautions: {},
  };
  private defaultLanguage: SupportedLanguage = 'en';

  private constructor() {}

  public static getInstance(): HealthTranslationService {
    if (!HealthTranslationService.instance) {
      HealthTranslationService.instance = new HealthTranslationService();
    }
    return HealthTranslationService.instance;
  }

  async initialize() {
    // Load translations from i18n dictionary files
    const dictPath = path.join(process.cwd(), 'src', 'app', 'i18n', 'dictionaries');
    
    try {
      const files = await fs.readdir(dictPath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const lang = file.replace('.json', '');
          const content = await fs.readFile(path.join(dictPath, file), 'utf-8');
          const translations = JSON.parse(content);
          
          // Add health-related translations to our maps
          this.addTranslations(lang, translations.health || {});
        }
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  private addTranslations(lang: string, healthTranslations: any) {
    // Add symptom translations
    if (healthTranslations.symptoms) {
      Object.entries(healthTranslations.symptoms).forEach(([key, value]) => {
        if (!this.translations.symptoms[key]) {
          this.translations.symptoms[key] = {};
        }
        this.translations.symptoms[key][lang] = value as string;
      });
    }

    // Add disease translations
    if (healthTranslations.diseases) {
      Object.entries(healthTranslations.diseases).forEach(([key, value]) => {
        if (!this.translations.diseases[key]) {
          this.translations.diseases[key] = {};
        }
        this.translations.diseases[key][lang] = value as string;
      });
    }

    // Add description translations
    if (healthTranslations.descriptions) {
      Object.entries(healthTranslations.descriptions).forEach(([key, value]) => {
        if (!this.translations.descriptions[key]) {
          this.translations.descriptions[key] = {};
        }
        this.translations.descriptions[key][lang] = value as string;
      });
    }

    // Add precaution translations
    if (healthTranslations.precautions) {
      Object.entries(healthTranslations.precautions).forEach(([key, value]) => {
        if (!this.translations.precautions[key]) {
          this.translations.precautions[key] = {};
        }
        this.translations.precautions[key][lang] = value as string;
      });
    }
  }

  translateSymptom(symptom: string, targetLang: SupportedLanguage): string {
    return this.translations.symptoms[symptom]?.[targetLang] || symptom;
  }

  translateDisease(disease: string, targetLang: SupportedLanguage): string {
    return this.translations.diseases[disease]?.[targetLang] || disease;
  }

  translateDescription(description: string, targetLang: SupportedLanguage): string {
    return this.translations.descriptions[description]?.[targetLang] || description;
  }

  translatePrecaution(precaution: string, targetLang: SupportedLanguage): string {
    return this.translations.precautions[precaution]?.[targetLang] || precaution;
  }

  // Get the English term for a translated symptom
  getEnglishSymptom(translatedSymptom: string, fromLang: SupportedLanguage): string | undefined {
    for (const [key, translations] of Object.entries(this.translations.symptoms)) {
      if (translations[fromLang]?.toLowerCase() === translatedSymptom.toLowerCase()) {
        return key;
      }
    }
    return undefined;
  }
}
