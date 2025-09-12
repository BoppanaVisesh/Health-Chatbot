export type DetectedLanguage = {
  language: string;
  confidence: number;
};

export class LanguageDetectionService {
  private static instance: LanguageDetectionService;
  
  // Language patterns for detection
  private languagePatterns = {
    hi: /[\u0900-\u097F]/,  // Hindi Unicode range
    en: /^[A-Za-z\s.,!?]+$/ // English characters and basic punctuation
  };

  private constructor() {}

  public static getInstance(): LanguageDetectionService {
    if (!LanguageDetectionService.instance) {
      LanguageDetectionService.instance = new LanguageDetectionService();
    }
    return LanguageDetectionService.instance;
  }

  public detectLanguage(text: string): DetectedLanguage {
    // Remove spaces and punctuation for more accurate detection
    const cleanText = text.trim();
    
    if (this.languagePatterns.hi.test(cleanText)) {
      return { language: 'hi', confidence: 0.9 };
    }
    
    if (this.languagePatterns.en.test(cleanText)) {
      return { language: 'en', confidence: 0.9 };
    }

    // Default to English if no clear match
    return { language: 'en', confidence: 0.6 };
  }

  public isSameScript(text: string, language: string): boolean {
    if (language === 'hi') {
      return this.languagePatterns.hi.test(text);
    }
    if (language === 'en') {
      return this.languagePatterns.en.test(text);
    }
    return false;
  }
}
