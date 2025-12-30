// routes/tts.js
const fs = require("fs");
const path = require("path");
// Use the GoogleGenAI library
const { GoogleGenAI } = require("@google/genai"); 

// Standard sample rate for gemini-2.5-flash-preview-tts audio output
const SAMPLE_RATE = 24000; 

// Only initialize Gemini AI if the API key is available
// It reads GEMINI_API_KEY from process.env, which is loaded by dotenv in server.js
const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
    : null;

/**
 * Helper function to convert base64 to ArrayBuffer (Node.js version)
 * @param {string} base64 - Base64 encoded string
 * @returns {ArrayBuffer}
 */
function base64ToArrayBuffer(base64) {
    // In Node.js environment, Buffer is used for efficient binary data handling
    const buffer = Buffer.from(base64, 'base64');
    // Return the underlying ArrayBuffer view
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Writes a string to a DataView
 * @param {DataView} view - The DataView to write to
 * @param {number} offset - The starting offset
 * @param {string} string - The string to write
 */
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

/**
 * Converts raw 16-bit signed PCM data to a complete WAV file ArrayBuffer 
 * by adding the required WAV header. This is necessary because the Gemini TTS API
 * returns raw audio data, not a ready-to-play file format like MP3 or WAV.
 * @param {Int16Array} pcm16 - The raw 16-bit signed PCM data
 * @param {number} sampleRate - The sample rate (24000 Hz)
 * @returns {ArrayBuffer} - The complete WAV file binary data
 */
function pcmToWav(pcm16, sampleRate) {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcm16.length * 2; // 2 bytes per sample (Int16)
    const buffer = new ArrayBuffer(44 + dataSize); // 44 bytes for the WAV header
    const view = new DataView(buffer);
    
    // RIFF header
    writeString(view, 0, 'RIFF'); // Chunk ID: "RIFF"
    view.setUint32(4, 36 + dataSize, true); // Chunk size (File size - 8)
    writeString(view, 8, 'WAVE'); // Format: "WAVE"

    // fmt sub-chunk
    writeString(view, 12, 'fmt '); // Sub-chunk 1 ID: "fmt "
    view.setUint32(16, 16, true); // Sub-chunk 1 size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample

    // data sub-chunk
    writeString(view, 36, 'data'); // Sub-chunk 2 ID: "data"
    view.setUint32(40, dataSize, true); // Sub-chunk 2 size (Data size)
    
    // Write PCM data
    let offset = 44;
    for (let i = 0; i < pcm16.length; i++, offset += 2) {
        // Write the 16-bit sample, little-endian (true)
        view.setInt16(offset, pcm16[i], true);
    }

    return buffer;
}


/**
 * Convert text to speech using Gemini TTS and save as WAV
 * @param {string} text - Text to read
 * @param {string} outputFile - Path to save the WAV file
 * @param {string} selectedVoice - The voice chosen by the user (Female/Male)
 */
async function textToSpeech(text, outputFile, selectedVoice) {
    if (!genAI) {
        throw new Error('TTS functionality requires GEMINI_API_KEY. Please ensure it is set in your environment.');
    }
    
    if (!text || text.trim() === '') {
        throw new Error('Text is empty. Cannot convert to speech.');
    }
    
    // Map the user's choice to a suitable Gemini TTS voice.
    // Kore (Firm) is a suitable male-sounding voice; Leda (Youthful) is a female-sounding voice.
    const voiceName = selectedVoice === 'Male' ? 'Kore' : 'Leda'; 

    try {
        // --- 1. Call the Gemini TTS API ---
        const payload = {
            contents: [{
                parts: [{ text: text }]
            }],
            generationConfig: {
                // Request audio modality
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName }
                    }
                }
            },
        };

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            payload: payload
        });
        
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioBase64 = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        // The API returns raw 16-bit signed PCM audio with MIME type audio/L16
        if (!audioBase64 || !mimeType || !mimeType.startsWith("audio/L16")) {
             throw new Error("Invalid response format or missing audio data from Gemini TTS.");
        }

        // --- 2. Convert base64 raw PCM to WAV ArrayBuffer ---
        const pcmDataBuffer = base64ToArrayBuffer(audioBase64);
        const pcm16 = new Int16Array(pcmDataBuffer); 
        
        const wavBuffer = pcmToWav(pcm16, SAMPLE_RATE);

        // --- 3. Save the WAV file to disk ---
        // Use Buffer.from() to write the ArrayBuffer to a file
        await fs.promises.writeFile(outputFile, Buffer.from(wavBuffer));
        
    } catch (error) {
        // Log the actual API error details
        console.error("Gemini TTS API Error:", error.message);
        throw new Error("Failed to generate text-to-speech audio. Details: " + error.message);
    }
}

module.exports = { textToSpeech };