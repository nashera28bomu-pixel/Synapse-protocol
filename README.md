# 🤖 Cymor AI — Elite Coding Assistant

> Write production-ready code. Debug like a machine. 100% Free.

Built by **Riel Kirote** · Powered by Groq, Gemini, Qwen2.5-Coder & Claude

---

## 🚀 Quick Start (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API keys
Copy `.env.local.example` to `.env.local` and fill in your free keys:

```bash
cp .env.local.example .env.local
```

Get free keys from:
| Key | URL |
|-----|-----|
| `GROQ_API_KEY` | https://console.groq.com/keys |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `HF_TOKEN` | https://huggingface.co/settings/tokens |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |

### 3. Run locally
```bash
npm run dev
```

Open http://localhost:3000

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | CSS + Framer Motion |
| Primary AI | Groq Llama 3.1 70B |
| Vision | Google Gemini 1.5 Flash |
| Debugging | HuggingFace Qwen2.5-Coder 32B |
| Fallback | Anthropic Claude |
| Hosting | Vercel Free Tier |

---

## 🌍 Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com and import the repo
3. Add environment variables (same 4 keys)
4. Deploy → Live at `your-app.vercel.app`

---

## ✨ Features

- **Streaming responses** — text appears word-by-word in real time
- **Smart model routing** — auto-selects the best AI for each task
- **File debugging** — upload broken code files for surgical fixes
- **Image analysis** — upload wireframes/screenshots, get code back
- **Chat history** — saved automatically to localStorage
- **Export** — download sessions as Markdown
- **Model selector** — choose between Groq, Claude, or Auto
- **Language selector** — tell Cymor which language to prefer
- **Quick actions** — one-click for explain, debug deeper, ideas, tests

---

## 📁 File Structure

```
cymor-coding-ai/
├── app/
│   ├── page.js              # 🏠 Landing page
│   ├── layout.js            # Root layout + fonts
│   ├── globals.css          # Global styles
│   └── chat/
│       └── page.js          # 💬 Chat interface
│   └── api/
│       ├── chat/route.js    # Text chat (Groq + Claude)
│       ├── vision/route.js  # Image analysis (Gemini)
│       └── files/route.js   # File debug (Qwen)
├── components/
│   ├── ChatBubble.js        # Message renderer with markdown
│   ├── CodeBlock.js         # Syntax-highlighted code display
│   └── LandingHero.js       # Hero section component
└── .env.local               # Your API keys (never commit!)
```

---

## 🔑 Rate Limiting

Built-in IP-based rate limiting: 60 requests per 5 minutes per user. After 40 requests, a 2-second delay is added. Enough for ~100+ daily active users on free tiers.

---

## 🛡️ Security Notes

- Never commit `.env.local` to GitHub
- API keys are server-side only (Next.js API routes)
- No user data is stored server-side

---

*Built with ❤️ by Riel Kirote*
