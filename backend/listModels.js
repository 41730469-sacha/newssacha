require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function listAvailableModels() {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    console.log('📋 Fetching available models for your API key...\n');
    
    const modelsList = await genAI.models.list();
    
    console.log('✅ Available models:\n');
    console.log(JSON.stringify(modelsList, null, 2));
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
    if (error.status) {
      console.error('   Status:', error.status);
    }
  }
}

listAvailableModels();
