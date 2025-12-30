// routes/ai.js (CommonJS)
const express = require('express');
const path = require('path');
const fs = require('fs');
const { extractText } = require('../utils/extractText');
const { summarizeText } = require('./summarize');
const { translateText } = require('../utils/translate');
const { textToSpeech } = require('./tts');

const router = express.Router();

// -------------------- Summarize PDF --------------------
router.post('/summarize', async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'Missing filename.' });

  try {
    const pdfPath = path.join(__dirname, '..', 'public_pdfs', filename);
    const text = await extractText(pdfPath);
    const summary = await summarizeText(text);
    res.json({ summary, text });
  } catch (err) {
    console.error('Error summarizing PDF:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Translate PDF --------------------
router.post('/translate', async (req, res) => {
  const { filename, language } = req.body;

  if (!filename || !language) {
    return res.status(400).json({ error: 'Missing filename or target language.' });
  }

  try {
    const pdfPath = path.join(__dirname, '..', 'public_pdfs', filename);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found.' });
    }

    const text = await extractText(pdfPath);
    if (!text || text.trim().length === 0) {
      return res.status(404).json({ error: 'Could not extract text from PDF. File might be image-based.' });
    }

    const translatedText = await translateText(text, language);

    res.json({
      originalText: text,
      translatedText,
      language,
    });
  } catch (err) {
    console.error('🔴 Error translating PDF:', err);
    res.status(500).json({ error: err.message || 'Failed to process PDF translation.' });
  }
});

// Alias for translate (same functionality, different endpoint name)
router.post('/translate-pdf', async (req, res) => {
  const { filename, language } = req.body;
  console.log('📥 Translation request received:', { filename, language });

  if (!filename || !language) {
    return res.status(400).json({ error: 'Missing filename or target language.' });
  }

  try {
    const pdfPath = path.join(__dirname, '..', 'public_pdfs', filename);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found.' });
    }

    console.log('📄 Extracting text from PDF...');
    const text = await extractText(pdfPath);
    console.log('✅ Text extracted, length:', text.length);
    if (!text || text.trim().length === 0) {
      return res.status(404).json({ error: 'Could not extract text from PDF. File might be image-based.' });
    }

    const translatedText = await translateText(text, language);

    res.json({
      originalText: text,
      translatedText,
      language,
    });
  } catch (err) {
    console.error('🔴 Error translating PDF:', err);
    res.status(500).json({ error: err.message || 'Failed to process PDF translation.' });
  }
});

// -------------------- Read PDF (Text-to-Speech) --------------------
router.post('/read-pdf', async (req, res) => {
    const { filename, voice } = req.body;
    if (!filename || !voice) {
        return res.status(400).json({ error: 'Missing filename or voice selection.' });
    }

    try {
        // --- Step 1: Extract Text ---
        const pdfPath = path.join(__dirname, '..', 'public_pdfs', filename);
        
        // Ensure PDF file exists
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: `PDF file not found: ${filename}` });
        }
        
        console.log('📄 [READ PDF] Starting text extraction...');
        const text = await extractText(pdfPath);
        console.log(`✅ [READ PDF] Text extracted. Length: ${text.length}`);
        
        if (!text || text.trim().length === 0) {
            return res.status(404).json({ error: 'Could not extract text from PDF. File might be image-based.' });
        }

        // --- Step 2: Convert Text to Speech (TTS) ---
        const ttsFolder = path.join(__dirname, '..', 'public_tts');
        if (!fs.existsSync(ttsFolder)) fs.mkdirSync(ttsFolder, { recursive: true });

        // ⭐ CHANGE: Use .wav extension for Gemini TTS output
        const ttsFileName = `tts_${Date.now()}.wav`; 
        const ttsFilePath = path.join(ttsFolder, ttsFileName);

        console.log('🎙️ [READ PDF] Starting TTS generation...');
        // Pass extracted text and selected voice to the TTS module
        await textToSpeech(text, ttsFilePath, voice); 
        console.log(`💾 [READ PDF] TTS file saved to: ${ttsFilePath}`);

        // --- Step 3: Send the Public URL/Path ---
        const ttsPublicPath = `/public_tts/${ttsFileName}`;
        console.log(`🚀 [READ PDF] Sending response with path: ${ttsPublicPath}`);
        
        res.json({ ttsFile: ttsPublicPath });

    } catch (err) {
        console.error('❌ Error processing read-pdf request:', err.message);
        res.status(500).json({ error: `Could not process reading request. Details: ${err.message}` });
    }
});

module.exports = router;