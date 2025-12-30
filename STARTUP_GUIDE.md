# 🚀 News AI Platform - Startup Guide

## Project Overview
This is a MERN-like application (MySQL + Express + React + Node.js) with AI features:
- PDF text extraction and summarization
- Multi-language translation
- Text-to-speech conversion
- User authentication with JWT

---

## 📋 Prerequisites

### 1. **XAMPP Running**
Make sure XAMPP is running with:
- ✅ Apache (if needed for other services)
- ✅ **MySQL** (REQUIRED!)

### 2. **Node.js Installed**
Check: `node --version` (should be v16+ or higher)

---

## 🔧 Setup Instructions

### Step 1: Import Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Login with:
   - Username: `root`
   - Password: `sacha123` (or leave empty if default)
3. Click "Import" tab
4. Select file: `database.sql`
5. Click "Go" to execute

**OR** use command line:
```bash
# In XAMPP MySQL bin folder or if mysql is in PATH
mysql -u root -psacha123 < database.sql
```

### Step 2: Install Dependencies

#### Backend Dependencies
```bash
cd d:\Xamp\htdocs\news\news
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 3: Configure Environment
Check `.env` file has:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sacha123
DB_NAME=pdf_db
JWT_SECRET=A_VERY_STRONG_AND_RANDOM_SECRET_KEY
PORT=5000
OPENAI_API_KEY=your_openai_api_key
```

---

## ▶️ Starting the Application

### Option A: Run Both (Backend + Frontend)
```bash
npm run dev
```
Then in another terminal:
```bash
cd client
npm start
```

### Option B: Add Concurrent Script (Recommended)
Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "client": "cd client && npm start",
  "both": "concurrently \"npm run dev\" \"cd client && npm start\""
}
```

Then run:
```bash
npm run both
```

---

## 🌐 Access Points

- **Frontend (React):** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Test Endpoint:** http://localhost:5000/api/test

---

## 🔍 Troubleshooting

### ❌ MySQL Connection Failed
**Error:** `Access denied for user 'root'@'localhost'`

**Solutions:**
1. Check XAMPP MySQL is running
2. Verify password in `.env` matches MySQL password
3. Reset MySQL password in XAMPP:
   - Stop MySQL in XAMPP
   - Click "Config" → "my.ini"
   - Find `[mysqld]` and add: `skip-grant-tables`
   - Start MySQL
   - Run: `mysql -u root`
   - Execute: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'sacha123';`
   - Remove `skip-grant-tables` from my.ini
   - Restart MySQL

### ❌ Module Error: "Unexpected token 'export'"
**Fixed!** All files now use CommonJS (`require/module.exports`)

### ❌ Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID_NUMBER> /F
```

---

## 📁 Project Structure

```
news/
├── server.js              # Backend entry point
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── database.sql           # MySQL setup script
├── routes/
│   ├── ai.js             # AI routes (summarize, translate, TTS)
│   ├── auth.js           # Auth routes (login, register)
│   ├── summarize.js      # OpenAI summarization
│   └── tts.js            # Text-to-speech
├── utils/
│   ├── extractText.js    # PDF text extraction
│   └── translate.js      # Google Translate
├── public_pdfs/          # Uploaded PDFs
├── public_tts/           # Generated audio files
└── client/               # React frontend
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── contexts/
    └── package.json
```

---

## 🧪 Testing the Features

### 1. Register a User
```bash
POST http://localhost:5000/api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "nationality": "USA",
  "dateOfBirth": "1990-01-01"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Upload & Summarize PDF
Place a PDF in `public_pdfs/` folder (e.g., `test.pdf`)

```bash
POST http://localhost:5000/api/ai/summarize
Headers: { "Authorization": "Bearer <your_token>" }
Body: { "filename": "test.pdf" }
```

---

## ✅ Next Steps
1. Test user registration/login in frontend
2. Upload PDFs and test summarization
3. Try translation feature
4. Test TTS functionality
5. Customize UI/UX as needed

---

## 🆘 Need Help?
- Check console logs in terminal for errors
- Verify XAMPP MySQL is running
- Ensure all npm packages are installed
- Check OpenAI API key is valid

---

**Happy Coding! 🎉**
