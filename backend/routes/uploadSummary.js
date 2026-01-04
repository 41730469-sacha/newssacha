import express from "express";
import multer from "multer";
import fs from "fs";
import { extractText } from "../pdf.js";
import { summarizeText } from "../analyze.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file is required" });

    const text = await extractText(req.file.path);
    const summary = await summarizeText(text);

    fs.unlinkSync(req.file.path); // Remove temp upload

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize PDF" });
  }
});

export default router;
