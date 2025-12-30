// Quick guide to test your app properly

console.log(`
✅ TESTING YOUR APP - STEP BY STEP GUIDE
==========================================

🔹 STEP 1: Clear Browser Storage
   - Open your browser at http://localhost:3002
   - Press F12 to open Developer Tools
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Local Storage" -> "http://localhost:3002"
   - Click "Clear All" or delete "token" and "user" entries
   - Refresh the page (F5)

🔹 STEP 2: Verify NOT Logged In
   - You should see "Login" and "Register" buttons in header
   - You should NOT see "Welcome, [name]!"
   
🔹 STEP 3: Login
   - Click "Login" button
   - Enter credentials:
     Email: sacha23@gmail.com
     Password: sacha2309
   - After login, you should see "Welcome, sacha!" in header
   
🔹 STEP 4: Test PDF Features
   - Go to Dashboard or HomePage
   - Click on a PDF (e.g., "1.pdf")
   - Try these buttons:
   
   ✨ TRANSLATE BUTTON:
      - Select language (e.g., English, French)
      - Click "Translate"
      - Wait... it will:
        1. Extract text from PDF (using pdf-parse)
        2. Send text to Gemini API
        3. Get translation back
        4. Display result
   
   ✨ SUMMARIZE BUTTON:
      - Click "Summarize"
      - Wait... it will:
        1. Extract text from PDF
        2. Send to Gemini API for summarization
        3. Display Arabic summary
   
   ✨ ANALYZE BUTTON:
      - Click "Analyze"
      - Gets text and shows word count + keywords

🔹 WHAT TO EXPECT:
   ✅ Login required - Can't access PDF features without login
   ✅ Real Gemini API - Buttons use actual AI, not static text
   ✅ PDF Text Extraction - Automatically extracts text before translation
   ✅ Token Auth - All API calls include JWT token in headers

🔹 IF ERRORS OCCUR:
   - Check console (F12) for error messages
   - Verify backend is running (port 5000)
   - Verify frontend is running (port 3002)
   - Check that GEMINI_API_KEY is in .env file
   - Make sure you're logged in before clicking AI buttons

==========================================
`);
