'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const TYPEWRITER_PHRASES = [
  'Write production-ready code.',
  'Debug like a senior engineer.',
  'Analyze blueprints & wireframes.',
  'Ship features 10x faster.',
]

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const current = TYPEWRITER_PHRASES[phraseIndex]
    let timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 30)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setPhraseIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, phraseIndex])

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="text-white/80">
      {displayed}
      <span style={{ color: 'var(--neon)', opacity: showCursor ? 1 : 0 }}>_</span>
    </span>
  )
}

function FloatingOrb({ style }) {
  return (
    <div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={style}
    />
  )
}

function FeatureCard({ icon, title, desc, accent, delay }) {
  return (
    <div
      className="glass rounded-2xl p-8 group hover:scale-105 transition-all duration-500 relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: `${accent}22`,
        '--accent': accent,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accent}08, transparent 70%)` }}
      />
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5"
        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
      >
        {icon}
      </div>
      <h3
        className="font-display text-sm font-bold uppercase tracking-widest mb-3"
        style={{ color: accent }}
      >
        {title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-black neon-text mb-1">{value}</div>
      <div className="text-white/40 text-xs uppercase tracking-widest font-mono">{label}</div>
    </div>
  )
}

function ModelBadge({ name, role, color }) {
  return (
    <div
      className="glass rounded-xl px-4 py-3 flex items-center gap-3 group hover:scale-105 transition-all duration-300"
      style={{ borderColor: `${color}30` }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div>
        <div className="font-mono text-xs font-bold" style={{ color }}>{name}</div>
        <div className="text-white/40 text-xs">{role}</div>
      </div>
    </div>
  )
}

function SmileyLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" stroke="#00FFD1" strokeWidth="3" fill="rgba(0,255,209,0.05)" />
      <circle cx="35" cy="40" r="6" fill="#00FFD1" />
      <circle cx="65" cy="40" r="6" fill="#00FFD1" />
      <path d="M 30 62 Q 50 80 70 62" stroke="#00FFD1" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="40" r="2.5" fill="#050A0E" />
      <circle cx="65" cy="40" r="2.5" fill="#050A0E" />
    </svg>
  )
}

const CODE_DEMO = `// Cymor wrote this in 0.8 seconds ⚡
async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      // Exponential backoff with jitter
      const delay = 2 ** attempt * 100 + Math.random() * 100
      await new Promise(r => setTimeout(r, delay))
    }
  }
}`

export default function LandingPage() {
  const [codeVisible, setCodeVisible] = useState(false)
  const codeRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCodeVisible(true) },
      { threshold: 0.3 }
    )
    if (codeRef.current) observer.observe(codeRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="noise mesh-bg min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-[rgba(0,255,209,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SmileyLogo size={32} />
            <span className="font-display text-sm font-bold tracking-widest neon-text">CYMOR</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Models', 'Demo', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/50 hover:text-white text-sm transition-colors duration-200 font-mono"
              >
                {item}
              </a>
            ))}
          </div>
          <Link href="/chat">
            <button className="btn-neon text-xs px-5 py-2.5 rounded-lg">
              Launch App →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Floating orbs */}
        <FloatingOrb style={{ width: 600, height: 600, top: '-10%', left: '-15%', background: 'radial-gradient(circle, rgba(123,47,255,0.15), transparent 70%)' }} />
        <FloatingOrb style={{ width: 400, height: 400, bottom: '5%', right: '-10%', background: 'radial-gradient(circle, rgba(0,255,209,0.1), transparent 70%)' }} />
        <FloatingOrb style={{ width: 300, height: 300, top: '40%', right: '20%', background: 'radial-gradient(circle, rgba(255,77,109,0.08), transparent 70%)' }} />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(var(--neon) 1px, transparent 1px), linear-gradient(90deg, var(--neon) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-[rgba(0,255,209,0.2)]">
            <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse" />
            <span className="font-mono text-xs text-white/60 uppercase tracking-widest">
              Multi-Model AI Brain · 100% Free Forever
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="neon-text">CYMOR</span>
            <br />
            <span className="text-white/90">CODING AI</span>
          </h1>

          {/* Typewriter */}
          <div className="font-mono text-lg md:text-xl mb-10 h-8 flex items-center justify-center">
            <TypewriterText />
          </div>

          {/* Sub-headline */}
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Four AI models. One brilliant assistant. Write, debug, analyze, and ship code
            faster than you ever thought possible — completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/chat">
              <button className="btn-solid rounded-xl text-sm px-8 py-4 w-full sm:w-auto">
                Start Coding Free →
              </button>
            </Link>
            <a href="#demo">
              <button className="btn-neon rounded-xl text-xs px-8 py-4 w-full sm:w-auto">
                See It In Action
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <StatCard value="4" label="AI Models" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatCard value="∞" label="Free Requests" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatCard value="0.8s" label="Avg Response" />
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <StatCard value="50+" label="Languages" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#00FFD1] to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00FFD1] uppercase tracking-[6px] mb-4">Capabilities</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            Everything a dev needs.
          </h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Not just a chatbot. A full-stack engineering partner trained to write code that actually works in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="⚡"
            title="Write & Debug Code"
            desc="Production-grade code with comments, error handling, and best practices. Supports 50+ languages including TypeScript, Python, Rust, Go, and more."
            accent="#00FFD1"
            delay={0}
          />
          <FeatureCard
            icon="🔬"
            title="Analyze Blueprints"
            desc="Upload wireframes, screenshots, or diagrams and Cymor will analyze them and generate the corresponding code implementation instantly."
            accent="#7B2FFF"
            delay={100}
          />
          <FeatureCard
            icon="🧭"
            title="Step-by-Step Guidance"
            desc="Don't just get code — understand it. Cymor explains every decision, pattern, and concept so you grow as a developer with every session."
            accent="#FF4D6D"
            delay={200}
          />
          <FeatureCard
            icon="🐛"
            title="Deep File Debugging"
            desc="Upload your broken files and Cymor's Qwen2.5-Coder 32B model will read every line, identify root causes, and return a fully fixed version."
            accent="#F59E0B"
            delay={300}
          />
          <FeatureCard
            icon="💡"
            title="Project Ideation"
            desc="Stuck for ideas? Ask Cymor to brainstorm project concepts with tech stacks, learning value, and starter code. Never ship generic projects again."
            accent="#10B981"
            delay={400}
          />
          <FeatureCard
            icon="📤"
            title="Export Anywhere"
            desc="Download your entire conversation as a clean Markdown or PDF file. Keep your code sessions organized and shareable with your team."
            accent="#06B6D4"
            delay={500}
          />
        </div>
      </section>

      {/* Models section */}
      <section id="models" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(123,47,255,0.12), transparent)' }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-[#7B2FFF] uppercase tracking-[6px] mb-4">The Brain</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Four models. One voice.
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Each model is the best at what it does. Cymor routes your request automatically to the right model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Groq Llama 3.1 70B',
                role: 'Primary code generation & chat',
                color: '#00FFD1',
                desc: 'Blazing fast responses powered by Groq\'s LPU hardware. Handles 90% of coding requests with sub-second latency.',
                badge: 'PRIMARY',
              },
              {
                name: 'Gemini 1.5 Flash',
                role: 'Vision & blueprint analysis',
                color: '#7B2FFF',
                desc: 'Google\'s multimodal powerhouse reads your images, wireframes, and screenshots and turns them into working code.',
                badge: 'VISION',
              },
              {
                name: 'Qwen2.5-Coder 32B',
                role: 'Deep file debugging',
                color: '#FF4D6D',
                desc: 'HuggingFace\'s specialized coding model trained on 5.5T code tokens. Upload files and get surgical precision fixes.',
                badge: 'DEBUG',
              },
              {
                name: 'Claude (Anthropic)',
                role: 'Complex reasoning fallback',
                color: '#F59E0B',
                desc: 'When problems get hard, Cymor escalates to Claude for nuanced reasoning, architecture advice, and edge-case handling.',
                badge: 'FALLBACK',
              },
            ].map((model) => (
              <div
                key={model.name}
                className="glass rounded-2xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-400"
                style={{ borderColor: `${model.color}20` }}
              >
                <div
                  className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: model.color,
                    transform: 'translate(30%, -30%)',
                    filter: 'blur(40px)',
                  }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-display text-base font-bold text-white">{model.name}</div>
                    <div className="text-white/40 text-sm mt-0.5">{model.role}</div>
                  </div>
                  <span
                    className="font-mono text-xs px-2 py-1 rounded-md"
                    style={{ background: `${model.color}15`, color: model.color, border: `1px solid ${model.color}30` }}
                  >
                    {model.badge}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{model.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: model.color }} />
                  <span className="font-mono text-xs" style={{ color: model.color }}>ONLINE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Demo */}
      <section id="demo" className="py-32 px-6 max-w-7xl mx-auto" ref={codeRef}>
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-[#00FFD1] uppercase tracking-[6px] mb-4">Live Demo</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            See the quality.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* User message */}
          <div className="flex justify-end mb-4">
            <div className="glass rounded-2xl rounded-tr-sm px-5 py-4 max-w-sm border border-[rgba(0,255,209,0.1)]">
              <p className="text-sm text-white/80">Write a fetch function with automatic retry and exponential backoff</p>
            </div>
          </div>

          {/* Cymor response */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: 'rgba(0,255,209,0.1)', border: '1px solid rgba(0,255,209,0.3)' }}
            >
              <SmileyLogo size={24} />
            </div>
            <div className="flex-1">
              <div className="glass rounded-2xl rounded-tl-sm overflow-hidden border border-[rgba(0,255,209,0.1)]">
                {/* Code header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,255,209,0.1)]"
                  style={{ background: 'rgba(0,255,209,0.05)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#00FFD1]" />
                    <span className="font-mono text-xs text-white/40 ml-2">fetchWithRetry.js</span>
                  </div>
                  <span className="font-mono text-xs text-[#00FFD1]">JavaScript</span>
                </div>
                <pre className="p-5 text-sm overflow-x-auto"
                  style={{ background: '#030810', fontFamily: 'Space Mono, monospace' }}
                >
                  {codeVisible ? (
                    <code style={{ color: '#a5f3f0' }}>
                      {CODE_DEMO.split('\n').map((line, i) => (
                        <div
                          key={i}
                          style={{
                            opacity: 0,
                            animation: codeVisible ? `fadeIn 0.3s ease forwards ${i * 40}ms` : 'none',
                          }}
                        >
                          {line.startsWith('//') ? (
                            <span style={{ color: '#4A5568' }}>{line}</span>
                          ) : line.includes('async function') || line.includes('for ') || line.includes('try') || line.includes('catch') ? (
                            <span>
                              {line.split(/\b(async|function|for|let|const|try|catch|if|throw|return|await)\b/).map((part, j) =>
                                ['async', 'function', 'for', 'let', 'const', 'try', 'catch', 'if', 'throw', 'return', 'await'].includes(part)
                                  ? <span key={j} style={{ color: '#7B2FFF' }}>{part}</span>
                                  : <span key={j}>{part}</span>
                              )}
                            </span>
                          ) : (
                            line
                          )}
                        </div>
                      ))}
                    </code>
                  ) : (
                    <div className="shimmer h-40 rounded" />
                  )}
                </pre>
              </div>
              <p className="text-white/50 text-sm mt-3 px-1">
                ✓ Production-ready · ✓ Error handling · ✓ Exponential backoff with jitter
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cymor */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,255,209,0.04), transparent)' }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="font-mono text-xs text-[#00FFD1] uppercase tracking-[6px] mb-4">Why Cymor</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Built different.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🆓', label: '100% Free', desc: 'No paywalls. No credit cards. Ever.' },
              { icon: '🧠', label: 'Multi-Model', desc: 'Best model for each task, automatically.' },
              { icon: '⚡', label: 'Sub-second', desc: 'Groq LPU makes responses feel instant.' },
              { icon: '🏗️', label: 'For Builders', desc: 'Made by a dev, for devs who ship.' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <div className="font-display text-xs font-bold neon-text uppercase tracking-widest mb-2">{item.label}</div>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-border rounded-3xl p-px">
            <div className="bg-[#0D1B2A] rounded-3xl p-16">
              <SmileyLogo size={60} />
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-6 mb-4">
                Ready to code smarter?
              </h2>
              <p className="text-white/50 mb-10 leading-relaxed">
                Join developers building with Cymor. No signup needed — just open the app and start.
              </p>
              <Link href="/chat">
                <button className="btn-solid rounded-xl text-sm px-10 py-4">
                  Open Cymor Free →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-[rgba(0,255,209,0.08)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <SmileyLogo size={48} />
            <div className="font-display text-lg font-bold neon-text tracking-widest">CYMOR AI</div>
            <p className="text-white/30 text-sm text-center max-w-md font-mono">
              Elite coding intelligence. Built by{' '}
              <span className="text-[#00FFD1]">Riel Kirote</span>.
              Free for every developer, everywhere.
            </p>
            <div className="flex items-center gap-6 text-white/20 text-xs font-mono">
              <span>© 2025 Cymor AI</span>
              <span>·</span>
              <Link href="/chat" className="hover:text-[#00FFD1] transition-colors">Launch App</Link>
              <span>·</span>
              <a href="#features" className="hover:text-[#00FFD1] transition-colors">Features</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
