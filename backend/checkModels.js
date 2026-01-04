// Check available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('🔍 Checking available Gemini models...\n');
        
        // Try the simple approach with different model names
        const modelNames = [
            'gemini-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'models/gemini-pro',
            'models/gemini-1.5-flash'
        ];
        
        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say hello");
                const response = await result.response;
                console.log(`✅ ${modelName} - WORKS!`);
                console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
                break; // Found working model
            } catch (err) {
                console.log(`❌ ${modelName} - ${err.message.substring(0, 100)}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

listModels();
