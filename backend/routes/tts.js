// routes/tts.js
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

/* ================= CONFIG ================= */

const SAMPLE_RATE = 24000;
const TTS_DIR = path.join(__dirname, "../tts");

if (!fs.existsSync(TTS_DIR)) {
    fs.mkdirSync(TTS_DIR, { recursive: true });
}

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

/* ================= HELPERS ================= */

function base64ToArrayBuffer(base64) {
    const buffer = Buffer.from(base64, "base64");
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function pcmToWav(pcm16, sampleRate) {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * 2;
    const blockAlign = numChannels * 2;
    const dataSize = pcm16.length * 2;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, "WAVE");

    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < pcm16.length; i++, offset += 2) {
        view.setInt16(offset, pcm16[i], true);
    }

    return buffer;
}

/* ================= TTS CORE ================= */

async function textToSpeech(text, outputFile, selectedVoice) {
    if (!genAI) throw new Error("GEMINI_API_KEY missing");
    if (!text || !text.trim()) throw new Error("Text is empty");

    const voiceName = selectedVoice === "Male" ? "Kore" : "Leda";

    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        payload: {
            contents: [{ parts: [{ text }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName }
                    }
                }
            }
        }
    });

    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const audioBase64 = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!audioBase64 || !mimeType?.startsWith("audio/L16")) {
        throw new Error("Invalid audio response from Gemini");
    }

    const pcmBuffer = base64ToArrayBuffer(audioBase64);
    const pcm16 = new Int16Array(pcmBuffer);
    const wavBuffer = pcmToWav(pcm16, SAMPLE_RATE);

    await fs.promises.writeFile(outputFile, Buffer.from(wavBuffer));
}

/* ================= API ROUTE ================= */

/**
 * POST /api/read
 * body: { text: string, voice: "Male" | "Female" }
 */
router.post("/read", async (req, res) => {
    try {
        const { text, voice = "Female" } = req.body;

        const filename = `tts_${Date.now()}.wav`;
        const outputPath = path.join(TTS_DIR, filename);

        await textToSpeech(text, outputPath, voice);

        res.json({
            success: true,
            audioUrl: `tts/${filename}`
        });

    } catch (err) {
        console.error("TTS ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
