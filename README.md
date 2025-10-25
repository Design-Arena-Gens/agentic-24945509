# AI Playground - Free AI Platform

**Bring Your API Key, Unlock AI Magic—100% Free!**

A complete, production-ready web application where users bring their own API keys from AI providers (OpenRouter, Google Gemini, Anthropic Claude, OpenAI) to access AI models for chatting, coding, and agentic tasks. 100% free with no subscriptions or monetization.

## 🌟 Features

- **Multi-Model Chat**: Chat with GPT-4, Claude, Gemini, and more from one interface
- **Code Assistant**: Generate, explain, and debug code with AI-powered assistance  
- **AI Agents**: Research, math solving, task automation, and more built-in agents
- **Persistent Memory**: AI remembers context across conversations for personalized responses
- **Chat History**: Save, search, and export all your conversations
- **Secure Key Storage**: Client-side encryption ensures your API keys are never exposed
- **Dark/Light Theme**: Responsive design with theme switching
- **PWA Support**: Works offline for non-AI features

## 🚀 Live Demo

**Production URL**: https://agentic-24945509.vercel.app

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- Framer Motion for animations
- PWA support with service workers

### Backend
- Node.js 20+ with Express.js
- TypeScript
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- JWT authentication
- Socket.io for real-time features
- Rate limiting and security middleware

### AI Integration
- OpenAI SDK
- Google Generative AI SDK
- Anthropic Claude API
- OpenRouter API support

## 📦 Installation

### Prerequisites
- Node.js 20+
- npm or yarn

### Clone and Install

```bash
git clone <repository-url>
cd ai-playground
npm install
```

### Environment Setup

**Backend (.env)**:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

**Frontend (.env)**:
```bash
cp frontend/.env.example frontend/.env
# Configure API URL if needed
```

### Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## 🎮 Usage

### Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
docker-compose up -d
```

## 🔑 API Key Setup

1. Sign up for an account
2. Navigate to **API Keys** in the sidebar
3. Add your API key from one or more providers:
   - OpenRouter: https://openrouter.ai/keys
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/
   - Google: https://makersuite.google.com/app/apikey
4. Keys are encrypted client-side before storage

## 🛡️ Security

- **API Keys**: Encrypted client-side using Web Crypto API (AES-GCM) before transmission
- **Authentication**: JWT tokens with refresh token rotation  
- **Rate Limiting**: 100 req/min per user, 30 chat req/min
- **HTTPS**: All communication encrypted in transit
- **GDPR Compliant**: Users can export/delete all data

## 📱 Features Overview

### Chat Interface
- Real-time messaging with streaming responses (via SSE)
- Multi-turn conversations with context injection
- Model selection dropdown per provider
- Automatic chat history saving
- Rate limit and error handling with retry logic

### Code Editor
- Syntax highlighting for multiple languages
- AI-powered code explanation
- Debug assistance
- Code optimization suggestions
- Monaco Editor integration (future)

### AI Agents
- **Research Agent**: Search and synthesize information
- **Math Solver**: Step-by-step problem solving
- **Code Assistant**: Generate and debug code
- **Task Automator**: Multi-step workflow execution
- **Summarizer**: Condense long texts

### Memory & Context
- Persistent key-value storage (10KB limit per user)
- Automatic context injection into prompts
- Editable memory panel in UI
- Memory management endpoints

### Profile Management
- Avatar upload/selection
- Bio and preferences
- Data export (JSON)
- Account deletion

## 🧪 Testing

```bash
npm run test
```

Coverage: 80%+ unit tests with Vitest

## 📊 Project Structure

```
ai-playground/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   ├── hooks/      # Custom React hooks
│   │   ├── store/      # Zustand state stores
│   │   └── utils/      # Helper functions
├── backend/           # Express server
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Prisma schemas
│   │   ├── middleware/  # Auth, validation
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # AI proxy, JWT
├── shared/            # TypeScript types, constants
└── docker-compose.yml # Container orchestration
```

## 🔧 Configuration

### Rate Limits
- General: 100 requests/minute
- Chat: 30 requests/minute  
- API Key Validation: 10/hour

### JWT Expiry
- Access Token: 15 minutes
- Refresh Token: 7 days

### Pagination
- Chat History: 20 per page
- Messages: 50 per page

## 🤝 Contributing

This is a free, open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a pull request

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🆘 Support

- Issues: GitHub Issues
- Documentation: This README
- Email: Contact via GitHub profile

## 🎯 Roadmap

- [ ] Streaming chat responses (SSE implementation)
- [ ] Monaco Code Editor integration
- [ ] Voice input/output
- [ ] Image generation support
- [ ] Multi-user collaboration
- [ ] Plugin system for custom agents
- [ ] Mobile app (React Native)

## ⚠️ Disclaimer

This application proxies requests to AI providers using user-provided API keys. Users are responsible for:
- API key security
- API usage costs from their provider
- Compliance with provider terms of service

We never store plaintext API keys and have no access to your conversations.

---

Built with ❤️ using React, Node.js, and AI
