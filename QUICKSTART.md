# 🚀 QUICK START GUIDE

## Prerequisites Checklist
- ✅ Node.js 18+ installed (check with: `node --version`)
- ✅ npm installed (check with: `npm --version`)
- ✅ Google Gemini API key ready

## Installation Steps

### Option 1: Automated Start (Easiest)

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Windows (Command Prompt):**
```cmd
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Verify Environment Variables**
Make sure `.env.local` exists with your API key:
```env
GEMINI_API_KEY=AIzaSyBoW7RSSIa5ahtsU1mPZEeiDgIOJjNeGGM
NEXT_PUBLIC_APP_NAME=Gemini Chat
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
Navigate to: http://localhost:3000

## Common Issues & Solutions

### Issue: "Cannot load npm.ps1 - scripts disabled"
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "GEMINI_API_KEY is not configured"
**Solution:**
1. Make sure `.env.local` file exists in the root directory
2. Check the API key is correct and not expired
3. Restart the dev server after changing `.env.local`

### Issue: Port 3000 already in use
**Solution:**
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Issue: Module not found errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## Testing the Application

1. **Create a New Chat**
   - Click "New Chat" button in sidebar
   - Type "Hello, how are you?"
   - Press Enter

2. **Test Streaming**
   - Ask "Write a Python function to calculate fibonacci"
   - Watch tokens appear in real-time

3. **Test Model Switching**
   - Change model in top-right dropdown
   - Send a new message

4. **Test System Prompt**
   - Expand "System Instructions" at top
   - Change to "You are a pirate. Always respond like a pirate."
   - Ask a question and see the difference

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment Checklist

- [ ] Set `GEMINI_API_KEY` in your hosting platform
- [ ] Run `npm run build` to verify build works
- [ ] Test all features in production mode
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Monitor API usage

## Next Steps

1. ✅ Application is running
2. 🎨 Customize colors in `tailwind.config.js`
3. 📝 Modify system prompt defaults
4. 🚀 Deploy to Vercel/Netlify
5. 📱 Share with friends!

## Support

If you encounter any issues:
1. Check this guide
2. Review README.md
3. Check browser console for errors
4. Verify API key is valid

---

**Happy Chatting! 🤖✨**
