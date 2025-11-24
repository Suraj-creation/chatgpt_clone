# 🤖 Gemini Chat UI

A production-quality web application that replicates the ChatGPT interface using Google's Gemini API. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Gemini Chat UI](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### Core Functionality
- 💬 **Real-time Streaming**: Token-by-token response streaming from Gemini API
- 📝 **Conversation Management**: Create, save, load, and delete conversations
- 🔄 **Model Selection**: Switch between Gemini 1.5 Flash, Pro, and legacy models
- 💾 **Local Persistence**: All conversations saved to browser localStorage
- 🎨 **Dark Theme**: Beautiful dark interface inspired by ChatGPT

### Advanced Features
- 🔧 **System Instructions**: Customize AI behavior with custom prompts
- 📊 **Markdown Support**: Full markdown rendering with syntax highlighting
- 📋 **Code Copy**: One-click copy for code blocks
- ⚡ **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- 🎯 **Error Handling**: Graceful error recovery with user-friendly messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or download this repository**
```bash
cd gemini-chat-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_NAME=Gemini Chat
```

Or copy from the example:
```bash
cp .env.example .env.local
# Then edit .env.local with your API key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
gemini-chat-ui/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Gemini API integration
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main chat page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx            # Left sidebar
│   │   ├── ConversationList.tsx   # Past conversations
│   │   ├── ChatHeader.tsx         # Top header
│   │   ├── MessageList.tsx        # Message container
│   │   ├── MessageBubble.tsx      # Individual message
│   │   ├── ChatInput.tsx          # Input area
│   │   ├── ModelSelector.tsx      # Model dropdown
│   │   ├── SystemPromptEditor.tsx # System instructions
│   │   └── LoadingIndicator.tsx   # Typing animation
│   ├── contexts/
│   │   └── ChatContext.tsx        # Global state management
│   └── lib/
│       ├── types.ts               # TypeScript definitions
│       ├── storage.ts             # localStorage utilities
│       └── utils.ts               # Helper functions
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind config
└── next.config.js                 # Next.js config
```

## 🎯 Usage Guide

### Starting a Conversation
1. Click "New Chat" in the sidebar
2. Type your message in the input box
3. Press Enter or click Send
4. Watch the AI respond in real-time

### Managing Conversations
- **Switch conversations**: Click on any conversation in the sidebar
- **Delete conversation**: Hover over a conversation and click the trash icon
- **Clear all**: Click "Clear All" in the sidebar footer

### Customizing Behavior
- **Change model**: Use the dropdown in the top-right corner
- **System instructions**: Expand the system prompt editor at the top
- **Edit conversations**: Click on conversation titles to rename (coming soon)

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in message
- `Ctrl/Cmd + K` - Focus on input (coming soon)

## 🔧 Configuration

### Available Models

```typescript
- gemini-1.5-flash  // Fast and efficient (default)
- gemini-1.5-pro    // Most capable
- gemini-1.0-pro    // Legacy support
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |

### Customizing Theme

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  'bg-primary': '#1a1a1a',      // Main background
  'bg-secondary': '#2a2a2a',    // Sidebar background
  'bg-tertiary': '#3a3a3a',     // Input background
  'accent-blue': '#3b82f6',     // Primary accent
  'accent-green': '#10b981',    // Secondary accent
  'text-primary': '#ffffff',    // Primary text
  'text-secondary': '#a0a0a0',  // Secondary text
  'border-subtle': '#404040',   // Border color
}
```

## 🐛 Troubleshooting

### API Key Issues

**Error: "GEMINI_API_KEY is not configured"**
- Ensure `.env.local` exists in the root directory
- Check that `GEMINI_API_KEY` is set correctly
- Restart the development server after adding the key

### Rate Limiting

**Error: "Rate limit exceeded"**
- The Gemini API has rate limits on the free tier
- Wait a moment before trying again
- Consider upgrading your API plan

### Build Errors

**Module not found errors**
```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Storage Issues

**Error: "Storage quota exceeded"**
- Clear old conversations using "Clear All"
- Your browser has limited localStorage space (~5-10MB)
- Consider exporting important conversations

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` in Environment Variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- **Netlify**: Use Next.js runtime
- **Railway**: Automatic Docker deployment
- **AWS/Google Cloud**: Use container or serverless deployment
- **Self-hosted**: Use `npm run build` and `npm start`

## 📚 API Reference

### POST /api/chat

Send a message to Gemini and receive streaming response.

**Request Body:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Hello!",
      "timestamp": 1234567890
    }
  ],
  "model": "gemini-1.5-flash",
  "systemPrompt": "You are a helpful assistant."
}
```

**Response:**
Server-Sent Events (SSE) stream:
```
data: {"text":"Hello"}
data: {"text":" there"}
data: {"text":"!"}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow the existing code style
- Run `npm run lint` before committing
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini** - For the powerful AI API
- **OpenAI ChatGPT** - For UI/UX inspiration
- **Next.js Team** - For the amazing framework
- **Vercel** - For seamless deployment

## 📞 Support

Having issues? Here's how to get help:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/yourusername/gemini-chat-ui/issues)
3. Create a new issue with:
   - Your environment details
   - Steps to reproduce
   - Error messages
   - Screenshots (if applicable)

## 🗺️ Roadmap

### Phase 2 (Coming Soon)
- [ ] Voice input/output
- [ ] Image upload support
- [ ] Export conversations to PDF
- [ ] Custom themes
- [ ] Conversation search
- [ ] Multi-language support

### Phase 3 (Future)
- [ ] User authentication
- [ ] Cloud sync
- [ ] Conversation sharing
- [ ] Plugins system
- [ ] Mobile native apps

## 💡 Tips & Best Practices

1. **API Key Security**: Never commit your `.env.local` file
2. **Rate Limits**: Implement caching for repeated queries
3. **Error Handling**: Always provide user-friendly error messages
4. **Performance**: Use React.memo for large conversation lists
5. **Storage**: Regularly export important conversations

## 📊 Tech Stack Details

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.0 | React framework |
| React | 18.3.0 | UI library |
| TypeScript | 5.3.0 | Type safety |
| Tailwind CSS | 3.4.0 | Styling |
| react-markdown | 9.0.1 | Markdown rendering |
| react-syntax-highlighter | 15.5.0 | Code highlighting |
| lucide-react | 0.344.0 | Icons |
| uuid | 9.0.1 | ID generation |

## 🎨 Screenshots

### Desktop View
![Desktop Screenshot](https://via.placeholder.com/800x450.png?text=Desktop+View)

### Mobile View
![Mobile Screenshot](https://via.placeholder.com/375x667.png?text=Mobile+View)

### Code Highlighting
![Code Screenshot](https://via.placeholder.com/800x450.png?text=Code+Highlighting)

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Suraj-creation/chatgpt_clone)

**Important**: After deploying, you MUST add your environment variable:
1. Go to your Vercel Dashboard
2. Navigate to: Settings → Environment Variables
3. Add: `GEMINI_API_KEY` with your API key
4. Redeploy the application

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Made with ❤️ using Google Gemini API

**Star ⭐ this repo if you find it useful!**
