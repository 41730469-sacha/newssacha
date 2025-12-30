// Test the actual @google/genai package API
require('dotenv').config();

async function testGenai() {
  try {
    console.log('Testing @google/genai package...\n');
    const { GoogleGenAI } = require('@google/genai');
    
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
    
    console.log('GoogleGenAI object:', genAI);
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(genAI)));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testGenai();
