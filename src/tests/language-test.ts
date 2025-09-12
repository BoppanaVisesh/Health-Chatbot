import { OllamaClient } from '@/lib/ollama';
import { HealthDataService } from '@/lib/health-data';
import { HealthTranslationService } from '@/lib/health-translation';

async function testLanguageSupport() {
  // Initialize services
  const healthData = HealthDataService.getInstance();
  const translationService = HealthTranslationService.getInstance();
  await Promise.all([
    healthData.initialize(),
    translationService.initialize()
  ]);

  const ollama = new OllamaClient();

  // Test cases
  const testCases = [
    {
      language: 'en',
      message: "I have fever and cough",
      description: "English test - basic symptoms"
    },
    {
      language: 'hi',
      message: "मुझे बुखार और खांसी है",
      description: "Hindi test - basic symptoms"
    },
    {
      language: 'en',
      message: "I have severe headache and chest pain",
      description: "English test - severe symptoms"
    },
    {
      language: 'hi',
      message: "मुझे तेज सिरदर्द और छाती में दर्द है",
      description: "Hindi test - severe symptoms"
    }
  ];

  console.log("Starting language support tests...\n");

  for (const test of testCases) {
    console.log(`Test: ${test.description}`);
    console.log(`Language: ${test.language}`);
    console.log(`Input: ${test.message}`);
    
    try {
      ollama.setLanguage(test.language);
      const response = await ollama.chat(test.message, test.language);
      console.log("Response:", response);
      console.log("Test passed!\n");
    } catch (error) {
      console.error("Test failed:", error);
      console.log("\n");
    }
  }
}

// Run the tests
testLanguageSupport().catch(console.error);
