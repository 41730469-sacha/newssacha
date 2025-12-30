# 🚀 Quick Start Reference

## ✅ Your App is NOW RUNNING!

### 🌐 Access URLs
- **Frontend:** http://localhost:3002
- **Backend API:** http://localhost:5000/api/test

---

## 🎯 Currently Running

### Terminal 1: Backend Server
```bash
Status: ✅ Running on port 5000
Database: ✅ Connected to MySQL (pdf_db)
```

### Terminal 2: React Client
```bash
Status: ✅ Running on port 3002
Proxy: ✅ API calls proxied to localhost:5000
```

---

## 🔑 Quick Commands

### Stop Servers
Press `Ctrl + C` in each terminal

### Restart Backend
```bash
npm start
```

### Restart Frontend
```bash
cd client
npm start
```

### Run Both Together
```bash
npm run both
# (requires: npm install concurrently --save-dev)
```

---

## 📝 Test the App

1. **Open browser:** http://localhost:3002
2. **Register:** Create a new account
3. **Login:** Sign in with your credentials
4. **Test PDF:** Place a PDF in `public_pdfs/` folder
5. **Try AI features:** Summarize, Translate, TTS

---

## 🔧 Important Files

- **`.env`** - Environment variables (passwords, API keys)
- **`database.sql`** - Database schema (import if needed)
- **`PROJECT_STATUS.md`** - Full project documentation
- **`STARTUP_GUIDE.md`** - Detailed setup guide

---

## ⚡ Quick Fixes

### MySQL Connection Error
```bash
# Test connection
node testDB.js

# Fix: Update .env with correct password
DB_PASSWORD=
```

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

---

## 📊 Project Features

✅ User Authentication (Register/Login)  
✅ PDF Viewing  
✅ AI Summarization  
✅ Translation (Multi-language)  
✅ Text-to-Speech  
✅ Text Analysis  

---

**All systems GO! 🎉**
