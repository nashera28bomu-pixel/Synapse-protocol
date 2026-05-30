'use client'

import Link from 'next/link'

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <h1 className="font-display text-6xl md:text-8xl font-black neon-text mb-6 tracking-tight">
          CYMOR AI
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10">
          Elite AI coding assistant. Write, debug, analyze, ship. 100% Free.
        </p>
        <Link href="/chat">
          <button className="btn-solid rounded-xl px-10 py-4 text-sm">
            Start Coding Free →
          </button>
        </Link>
      </div>
    </section>
  )
}
