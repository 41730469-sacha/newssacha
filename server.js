// =====================
// Imports
// =====================
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Pool } = require("pg");

// Routes
const ttsRoutes = require("./routes/tts");
const aiRoutes = require("./routes/ai");
const authRoutesFactory = require("./routes/auth");

// =====================
// App & Config
// =====================
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

// =====================
// Middleware
// =====================
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =====================
// Database (PostgreSQL – Render)
// =====================
const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // REQUIRED ON RENDER
  },
});

dbPool
  .connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// =====================
// JWT Middleware
// =====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// =====================
// Static Folders
// =====================

// PDFs
const publicPdfsPath = path.join(__dirname, "public_pdfs");
if (!fs.existsSync(publicPdfsPath)) fs.mkdirSync(publicPdfsPath);
app.use("/pdfs", express.static(publicPdfsPath));

// TTS
const publicTtsPath = path.join(__dirname, "public_tts");
if (!fs.existsSync(publicTtsPath)) fs.mkdirSync(publicTtsPath);
app.use("/public_tts", express.static(publicTtsPath));

// =====================
// Routes
// =====================
const authRoutes = authRoutesFactory(dbPool, JWT_SECRET);

app.use("/api/auth", authRoutes);
app.use("/api/ai", authenticateToken, aiRoutes);
app.use("/api/tts", authenticateToken, ttsRoutes);

// =====================
// PDF List (Public)
// =====================
app.get("/api/pdfs", (req, res) => {
  res.json([
    { id: 1, title: "The Associated Press", filename: "AP.pdf", language: "English" },
    { id: 2, title: "Haaretz", filename: "Haaretz.pdf", language: "English" },
    { id: 3, title: "El Mundo", filename: "el mundo.pdf", language: "Spanish" },
    { id: 4, title: "Le Parisien", filename: "le parisien.pdf", language: "French" },
    { id: 5, title: "جريدة الأخبار", filename: "الاخبار.pdf", language: "Arabic" },
  ]);
});

// =====================
// Health Check
// =====================
app.get("/api/test", (req, res) => {
  res.json({ message: "🚀 Server is running!" });
});

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
