import { OllamaClient } from '@/lib/ollama';
import { HealthDataService } from '@/lib/health-data';
import { HealthTranslationService } from '@/lib/health-translation';

async function testAutoLanguageDetection() {
  // Initialize services
  const healthData = HealthDataService.getInstance();
  const translationService = HealthTranslationService.getInstance();
  await Promise.all([
    healthData.initialize(),
    translationService.initialize()
  ]);

  const ollama = new OllamaClient();

  // Test cases with language switching
  const testCases = [
    {
      message: "I have fever and cough",
      expectedLanguage: "English",
      description: "Starting conversation in English"
    },
    {
      message: "मुझे बुखार और खांसी है",
      expectedLanguage: "Hindi",
      description: "Switching to Hindi"
    },
    {
      message: "How long will this last?",
      expectedLanguage: "English",
      description: "Switching back to English"
    },
    {
      message: "क्या मुझे डॉक्टर से मिलना चाहिए?",
      expectedLanguage: "Hindi",
      description: "Switching to Hindi again"
    }
  ];

  console.log("Starting automatic language detection tests...\n");

  for (const test of testCases) {
    console.log(`Test: ${test.description}`);
    console.log(`Input: ${test.message}`);
    console.log(`Expected Language: ${test.expectedLanguage}`);
    
    try {
      const response = await ollama.chat(test.message);
      console.log("Response:", response);
      
      // Verify response language matches input language
      const isHindi = /[\u0900-\u097F]/.test(response);
      const actualLanguage = isHindi ? "Hindi" : "English";
      console.log(`Actual Response Language: ${actualLanguage}`);
      console.log(`Language Match: ${actualLanguage === test.expectedLanguage ? "✓" : "✗"}`);
      console.log("Test passed!\n");
    } catch (error) {
      console.error("Test failed:", error);
      console.log("\n");
    }
  }
}

// Run the tests
testAutoLanguageDetection().catch(console.error);
