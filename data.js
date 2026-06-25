// ===================== CYMORGIT DATA =====================
const CG = {

  repos: [
    {
      id: 1, slug: 'smiley-md-bot',
      name: 'Smiley MD Bot',
      author: 'LegendarySmiley', authorAvatar: '😎',
      desc: 'A powerful WhatsApp multi-device bot with 90+ commands, AI integration, MongoDB storage, and anti-crash system.',
      category: 'whatsapp', lang: 'JavaScript', framework: 'Baileys',
      stars: 312, forks: 87, deploys: 204,
      security: 95, performance: 91, quality: 94, beginner: false,
      badge: 'verified', updated: '2 days ago',
      tags: ['whatsapp', 'bot', 'baileys', 'mongodb', 'ai'],
      topics: ['#whatsapp-bot', '#baileys', '#nodejs', '#mongodb'],
      deployTargets: ['render', 'railway', 'heroku'],
      readme: `# Smiley MD Bot\n\nA powerful WhatsApp MD bot built with Baileys.\n\n## Features\n- 90+ commands\n- AI chat (Groq/Gemini)\n- MongoDB session storage\n- Anti-crash protection\n- Auto-reconnect\n\n## Setup\n\`\`\`bash\nnpm install\nnode index.js\n\`\`\``,
      files: ['index.js','package.json','config.js','lib/commands.js','lib/handler.js','.env.example','README.md'],
      envVars: ['MONGO_URI','BOT_NUMBER','SESSION_ID','GROQ_API_KEY'],
    },
    {
      id: 2, slug: 'cymor-predict-bot',
      name: 'CymorPredict Bot',
      author: 'LegendarySmiley', authorAvatar: '😎',
      desc: 'Telegram football prediction bot with AI predictions, live scores, referral tier system, and Groq integration.',
      category: 'telegram', lang: 'JavaScript', framework: 'Telegraf',
      stars: 198, forks: 43, deploys: 156,
      security: 93, performance: 89, quality: 91, beginner: true,
      badge: 'verified', updated: '5 days ago',
      tags: ['telegram', 'bot', 'football', 'ai', 'predictions'],
      topics: ['#telegram-bot', '#telegraf', '#football', '#ai'],
      deployTargets: ['render', 'railway', 'vercel'],
      readme: `# CymorPredict Bot\n\nAI-powered Telegram football prediction bot.\n\n## Features\n- AI match predictions via Groq\n- Live football scores\n- Referral tier system\n- World Cup 2026 coverage`,
      files: ['index.js','package.json','handlers/','utils/','README.md'],
      envVars: ['TELEGRAM_TOKEN','GROQ_API_KEY','MONGO_URI'],
    },
    {
      id: 3, slug: 'kenya-bot-pro',
      name: 'KenyaBot Pro',
      author: 'DevNairobi', authorAvatar: '🇰🇪',
      desc: 'WhatsApp bot with M-Pesa STK Push, Safaricom data bundle purchasing, and admin dashboard.',
      category: 'whatsapp', lang: 'JavaScript', framework: 'Baileys',
      stars: 267, forks: 64, deploys: 189,
      security: 88, performance: 85, quality: 87, beginner: false,
      badge: 'verified', updated: '1 week ago',
      tags: ['whatsapp', 'mpesa', 'kenya', 'safaricom', 'bot'],
      topics: ['#whatsapp-bot', '#mpesa', '#kenya', '#fintech'],
      deployTargets: ['render', 'heroku'],
      readme: `# KenyaBot Pro\n\nWhatsApp bot for Kenyan users with M-Pesa integration.\n\n## Features\n- M-Pesa STK Push\n- Safaricom data bundles\n- Admin dashboard\n- MongoDB storage`,
      files: ['index.js','mpesa/','admin/','config/','README.md'],
      envVars: ['CONSUMER_KEY','CONSUMER_SECRET','MPESA_SHORTCODE','CALLBACK_URL','MONGO_URI'],
    },
    {
      id: 4, slug: 'quizmaster-telegram',
      name: 'QuizMaster TG',
      author: 'AfriDev', authorAvatar: '🧠',
      desc: 'Interactive Telegram quiz bot with leaderboards, categories, timer-based questions and prize system.',
      category: 'telegram', lang: 'Python', framework: 'python-telegram-bot',
      stars: 134, forks: 29, deploys: 98,
      security: 78, performance: 82, quality: 80, beginner: true,
      badge: 'community', updated: '2 weeks ago',
      tags: ['telegram', 'quiz', 'games', 'leaderboard'],
      topics: ['#telegram-bot', '#python', '#quiz', '#games'],
      deployTargets: ['railway', 'heroku', 'render'],
      readme: `# QuizMaster TG\n\nTelegram quiz bot with multiple categories and leaderboards.`,
      files: ['main.py','handlers.py','database.py','requirements.txt','README.md'],
      envVars: ['BOT_TOKEN','DATABASE_URL'],
    },
    {
      id: 5, slug: 'modebot-discord',
      name: 'ModeBot Discord',
      author: 'CodeWizardKE', authorAvatar: '🎮',
      desc: 'Full-featured Discord moderation bot with auto-mod, logging, role management, and custom commands.',
      category: 'discord', lang: 'JavaScript', framework: 'Discord.js',
      stars: 89, forks: 18, deploys: 67,
      security: 80, performance: 84, quality: 79, beginner: true,
      badge: 'community', updated: '3 weeks ago',
      tags: ['discord', 'moderation', 'bot', 'roles'],
      topics: ['#discord-bot', '#moderation', '#discord.js'],
      deployTargets: ['railway', 'heroku'],
      readme: `# ModeBot Discord\n\nDiscord moderation bot with full logging and auto-mod.`,
      files: ['index.js','commands/','events/','utils/','README.md'],
      envVars: ['DISCORD_TOKEN','CLIENT_ID','GUILD_ID'],
    },
    {
      id: 6, slug: 'musicbot-pro',
      name: 'MusicBot Pro',
      author: 'SoundDev', authorAvatar: '🎵',
      desc: 'Discord music bot with YouTube, Spotify support, queue management, filters, and 24/7 mode.',
      category: 'discord', lang: 'JavaScript', framework: 'Discord.js',
      stars: 178, forks: 52, deploys: 143,
      security: 88, performance: 86, quality: 85, beginner: false,
      badge: 'verified', updated: '4 days ago',
      tags: ['discord', 'music', 'youtube', 'spotify'],
      topics: ['#discord-bot', '#music', '#youtube', '#spotify'],
      deployTargets: ['railway', 'heroku', 'render'],
      readme: `# MusicBot Pro\n\nFull-featured Discord music bot.`,
      files: ['index.js','player/','commands/','utils/','README.md'],
      envVars: ['DISCORD_TOKEN','SPOTIFY_CLIENT_ID','SPOTIFY_SECRET'],
    },
    {
      id: 7, slug: 'portfolio-starter',
      name: 'Portfolio Starter',
      author: 'WebDevAfrica', authorAvatar: '🌐',
      desc: 'Clean HTML/CSS/JS portfolio template optimized for African developers. Mobile-first, fast, and beautiful.',
      category: 'website', lang: 'HTML/CSS/JS', framework: 'Vanilla',
      stars: 223, forks: 91, deploys: 312,
      security: 98, performance: 97, quality: 96, beginner: true,
      badge: 'verified', updated: '1 day ago',
      tags: ['portfolio', 'html', 'css', 'website', 'starter'],
      topics: ['#portfolio', '#html', '#css', '#javascript', '#beginner'],
      deployTargets: ['vercel', 'netlify', 'github-pages'],
      readme: `# Portfolio Starter\n\nMobile-first portfolio template for developers.`,
      files: ['index.html','style.css','script.js','assets/','README.md'],
      envVars: [],
    },
    {
      id: 8, slug: 'express-api-starter',
      name: 'Express API Starter',
      author: 'NodeKenya', authorAvatar: '📦',
      desc: 'Production-ready Express.js REST API with JWT auth, MongoDB, rate limiting, and full error handling.',
      category: 'api', lang: 'JavaScript', framework: 'Express.js',
      stars: 156, forks: 47, deploys: 201,
      security: 91, performance: 88, quality: 90, beginner: false,
      badge: 'verified', updated: '3 days ago',
      tags: ['api', 'express', 'nodejs', 'mongodb', 'jwt'],
      topics: ['#express', '#rest-api', '#nodejs', '#mongodb', '#jwt'],
      deployTargets: ['render', 'railway', 'heroku', 'vercel'],
      readme: `# Express API Starter\n\nProduction-ready REST API starter with full auth.`,
      files: ['server.js','routes/','middleware/','models/','config/','.env.example','README.md'],
      envVars: ['MONGO_URI','JWT_SECRET','PORT'],
    },
    {
      id: 9, slug: 'wa-group-manager',
      name: 'WA Group Manager',
      author: 'BotMakerKE', authorAvatar: '👥',
      desc: 'WhatsApp group management bot with welcome messages, anti-link, anti-spam, member tracking.',
      category: 'whatsapp', lang: 'JavaScript', framework: 'whatsapp-web.js',
      stars: 145, forks: 38, deploys: 117,
      security: 82, performance: 80, quality: 81, beginner: true,
      badge: 'community', updated: '1 week ago',
      tags: ['whatsapp', 'groups', 'bot', 'anti-spam'],
      topics: ['#whatsapp-bot', '#group-management', '#anti-spam'],
      deployTargets: ['render', 'heroku'],
      readme: `# WA Group Manager\n\nWhatsApp group management with anti-spam and welcome messages.`,
      files: ['index.js','handlers/','utils/','README.md'],
      envVars: ['SESSION_DATA','MONGO_URI'],
    },
    {
      id: 10, slug: 'next-starter-app',
      name: 'Next.js Starter App',
      author: 'ReactDevAfrica', authorAvatar: '⚛️',
      desc: 'Full-stack Next.js 14 starter with Supabase, Tailwind CSS, auth, and dark mode out of the box.',
      category: 'website', lang: 'TypeScript', framework: 'Next.js',
      stars: 201, forks: 73, deploys: 267,
      security: 94, performance: 92, quality: 93, beginner: false,
      badge: 'verified', updated: '2 days ago',
      tags: ['nextjs', 'react', 'supabase', 'typescript', 'tailwind'],
      topics: ['#nextjs', '#react', '#typescript', '#supabase', '#tailwind'],
      deployTargets: ['vercel', 'netlify'],
      readme: `# Next.js Starter App\n\nFull-stack Next.js starter with Supabase and auth.`,
      files: ['app/','components/','lib/','public/','README.md'],
      envVars: ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    },
    {
      id: 11, slug: 'telegram-store-bot',
      name: 'Telegram Store Bot',
      author: 'AfriCommerce', authorAvatar: '🛒',
      desc: 'Telegram e-commerce bot with product catalog, cart, M-Pesa payments, and order management.',
      category: 'telegram', lang: 'JavaScript', framework: 'Telegraf',
      stars: 167, forks: 44, deploys: 132,
      security: 87, performance: 85, quality: 86, beginner: false,
      badge: 'verified', updated: '6 days ago',
      tags: ['telegram', 'ecommerce', 'mpesa', 'store', 'payments'],
      topics: ['#telegram-bot', '#ecommerce', '#mpesa', '#payments'],
      deployTargets: ['render', 'railway'],
      readme: `# Telegram Store Bot\n\nFull e-commerce bot for Telegram with M-Pesa.`,
      files: ['index.js','scenes/','utils/','README.md'],
      envVars: ['BOT_TOKEN','MPESA_KEY','MONGO_URI'],
    },
    {
      id: 12, slug: 'ai-chatbot-api',
      name: 'AI Chatbot API',
      author: 'CymorTech', authorAvatar: '🤖',
      desc: 'REST API wrapper for multiple AI models — Groq, Gemini, HuggingFace with rate limiting and caching.',
      category: 'api', lang: 'JavaScript', framework: 'Express.js',
      stars: 189, forks: 61, deploys: 178,
      security: 92, performance: 90, quality: 91, beginner: false,
      badge: 'verified', updated: '1 day ago',
      tags: ['ai', 'api', 'groq', 'gemini', 'chatbot'],
      topics: ['#ai', '#groq', '#gemini', '#api', '#nodejs'],
      deployTargets: ['vercel', 'render', 'railway'],
      readme: `# AI Chatbot API\n\nMulti-model AI API with Groq, Gemini, and HuggingFace.`,
      files: ['server.js','routes/ai.js','providers/','middleware/','README.md'],
      envVars: ['GROQ_API_KEY','GEMINI_API_KEY','HUGGINGFACE_TOKEN'],
    },
  ],

  categories: [
    { id: 'all',       label: '🌐 All',        count: 12 },
    { id: 'whatsapp',  label: '🟢 WhatsApp',   count: 3  },
    { id: 'telegram',  label: '✈️ Telegram',   count: 3  },
    { id: 'discord',   label: '💬 Discord',    count: 2  },
    { id: 'website',   label: '🖥 Websites',   count: 2  },
    { id: 'api',       label: '📦 APIs',       count: 2  },
  ],

  languages: ['All Languages','JavaScript','TypeScript','Python','HTML/CSS/JS'],
  sortOptions: ['Most Stars','Most Deployed','Highest AI Score','Recently Updated','Most Forks'],

  deployPlatforms: [
    { id:'vercel',    name:'Vercel',   icon:'▲', free:true,  note:'Best for websites & APIs' },
    { id:'netlify',   name:'Netlify',  icon:'🌐', free:true,  note:'Great for static sites'   },
    { id:'render',    name:'Render',   icon:'🟣', free:true,  note:'Best for bots & servers'  },
    { id:'railway',   name:'Railway',  icon:'🚂', free:false, note:'Fast deploys, pay-as-go'  },
    { id:'heroku',    name:'Heroku',   icon:'🟪', free:false, note:'Eco dynos available'      },
    { id:'koyeb',     name:'Koyeb',    icon:'☁️', free:true,  note:'Free tier, global edge'   },
  ],
};

// ===== HELPERS =====
function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 75) return 'yellow';
  return 'red';
}

function getBadgeClass(badge) {
  return badge === 'verified' ? 'badge-green' : 'badge-yellow';
}

function getBadgeLabel(badge) {
  return badge === 'verified' ? '✓ Verified' : '● Community';
}

function timeAgo(str) { return str; }

function searchRepos(query, category, language, sort) {
  let results = [...CG.repos];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.tags.some(t => t.includes(q)) ||
      r.lang.toLowerCase().includes(q) ||
      r.framework.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    results = results.filter(r => r.category === category);
  }

  if (language && language !== 'All Languages') {
    results = results.filter(r => r.lang === language);
  }

  switch (sort) {
    case 'Most Deployed':      results.sort((a,b) => b.deploys - a.deploys); break;
    case 'Highest AI Score':   results.sort((a,b) => b.quality - a.quality); break;
    case 'Most Forks':         results.sort((a,b) => b.forks - a.forks);     break;
    case 'Recently Updated':   break; // already in order
    default:                   results.sort((a,b) => b.stars - a.stars);     break;
  }

  return results;
}

// ===== SHARED UTILS =====
function triggerMiniLoader(msg, duration = 2000) {
  const ml = document.getElementById('mini-loader');
  const mm = document.getElementById('miniMsg');
  if (!ml || !mm) return;
  mm.textContent = msg;
  ml.classList.add('show');
  setTimeout(() => ml.classList.remove('show'), duration);
}

function showToast(msg, icon = '✓') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = icon + ' ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function navigate(page, params = '') {
  triggerMiniLoader('Loading...');
  setTimeout(() => { window.location.href = page + params; }, 600);
}
