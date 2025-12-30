// Test Gemini API functions
require('dotenv').config();
const { summarizeText } = require('./routes/summarize');
const { translateText } = require('./utils/translate');

// Sample Arabic news text
const arabicText = `
ملفات مهمة أمام مجلس الوزراء اليوم أبرزها تقرير الجيش
ترحيب عربي ودولي عارم بموافقة حماس على خطة ترامب
بيرلا حرب ملكة جمال لبنان 2025
`;

async function testGemini() {
    console.log('🧪 Testing Gemini AI Functions\n');
    console.log('Original Arabic Text:');
    console.log(arabicText);
    console.log('\n---\n');

    try {
        // Test 1: Summarize
        console.log('1️⃣ Testing SUMMARIZE function...');
        const summary = await summarizeText(arabicText.trim(), 3);
        console.log('✅ Summary (Arabic):');
        console.log(summary);
        console.log('\n---\n');

        // Test 2: Translate to English
        console.log('2️⃣ Testing TRANSLATE to English...');
        const translationEN = await translateText(arabicText.trim(), 'en');
        console.log('✅ Translation (English):');
        console.log(translationEN);
        console.log('\n---\n');

        // Test 3: Translate to French
        console.log('3️⃣ Testing TRANSLATE to French...');
        const translationFR = await translateText(arabicText.trim(), 'fr');
        console.log('✅ Translation (French):');
        console.log(translationFR);
        console.log('\n---\n');

        console.log('✅ All tests passed! Gemini API is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nMake sure you have:');
        console.error('1. Added GEMINI_API_KEY to your .env file');
        console.error('2. Get your free API key from: https://makersuite.google.com/app/apikey');
    }
}

testGemini();
