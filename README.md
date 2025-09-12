# Health Chatbot

A Next.js health chatbot application with AI-powered symptom checking and prescription analysis.

## Features

- **Symptom Checker**: AI-powered analysis of symptoms with urgency assessment
- **Prescription Analyzer**: Medication information extraction from photos
- **Health Q&A**: General health questions and answers
- **Mental Health Chat**: Support for mental health discussions
- **Myth Buster**: Debunking health myths
- **Post-Diagnosis Education**: Educational content after diagnosis

## Performance Optimizations

- **Caching**: Intelligent caching for repeated requests
- **Image Compression**: Automatic image compression for faster processing
- **Timeout Handling**: Proper timeout management for AI calls
- **Error Recovery**: Graceful error handling and user feedback
- **Optimized Prompts**: Streamlined AI prompts for faster responses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Google AI API key:
```env
GOOGLE_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

3. Run the development server:
```bash
npm run dev
```

4. Run the Genkit development server (in a separate terminal):
```bash
npm run genkit:dev
```

## Getting Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select an existing one
3. Generate an API key
4. Add it to your `.env.local` file

## Performance Improvements

The application has been optimized for speed with:
- Response caching (5-10 minutes)
- Image compression (800px max width, 80% quality)
- Timeout handling (30-45 seconds)
- Streamlined AI prompts
- Better error handling

## Usage

1. **Symptom Checker**: Describe your symptoms and optionally upload a photo
2. **Prescription Analyzer**: Upload or capture a photo of medication labels
3. **Health Q&A**: Ask general health questions
4. **Mental Health Chat**: Get support for mental health concerns

## Disclaimer

This application is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
