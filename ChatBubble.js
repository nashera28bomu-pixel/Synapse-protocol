'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import CodeBlock from './CodeBlock'

function SmileyLogo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke="#00FFD1" strokeWidth="3" fill="rgba(0,255,209,0.05)" />
      <circle cx="35" cy="40" r="6" fill="#00FFD1" />
      <circle cx="65" cy="40" r="6" fill="#00FFD1" />
      <path d="M 30 62 Q 50 80 70 62" stroke="#00FFD1" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="40" r="2.5" fill="#050A0E" />
      <circle cx="65" cy="40" r="2.5" fill="#050A0E" />
    </svg>
  )
}

function parseContent(content) {
  if (!content) return []
  const parts = []
  const regex = /```(\w+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', language: match[1] || 'plaintext', content: match[2].trim() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts.length > 0 ? parts : [{ type: 'text', content }]
}

function renderText(text) {
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00FFD1;font-weight:700">$1</strong>')
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em style="color:#a5f3f0">$1</em>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="font-family:Space Mono,monospace;background:rgba(0,255,209,0.1);border:1px solid rgba(0,255,209,0.2);padding:2px 6px;border-radius:4px;font-size:12px;color:#00FFD1">$1</code>')
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#00FFD1;text-decoration:underline">$1</a>')
  return html
}

function TextContent({ text }) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="font-display text-lg font-bold neon-text mt-3 mb-2 uppercase tracking-widest">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-display text-sm font-bold neon-text mt-3 mb-2 uppercase tracking-widest">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-display text-xs font-bold text-[#7B2FFF] mt-2 mb-1 uppercase tracking-wider">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2 ml-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-white/70">
              <span style={{ color: '#00FFD1' }} className="mt-1 flex-shrink-0">›</span>
              <span dangerouslySetInnerHTML={{ __html: renderText(item) }} />
            </li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const items = []
      let num = 1
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
        num++
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2 ml-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-white/70">
              <span style={{ color: '#00FFD1', fontFamily: 'Space Mono, monospace', fontSize: 11 }} className="mt-0.5 flex-shrink-0 font-bold">
                {j + 1}.
              </span>
              <span dangerouslySetInnerHTML={{ __html: renderText(item) }} />
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(
        <p key={i} className="text-sm text-white/75 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: renderText(line) }} />
        </p>
      )
    }
    i++
  }

  return <div className="space-y-0.5">{elements}</div>
}

export default function ChatBubble({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const parts = isUser ? null : parseContent(message.content)

  const copyAll = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 message-enter">
        <div className="max-w-[80%]">
          <div
            className="rounded-2xl rounded-tr-sm px-5 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(123,47,255,0.3), rgba(0,255,209,0.1))',
              border: '1px solid rgba(123,47,255,0.3)',
            }}
          >
            {message.image && (
              <img src={message.image} alt="uploaded" className="max-w-full rounded-xl mb-3 max-h-48 object-cover" />
            )}
            {message.file && (
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#7B2FFF]">
                📎 {message.file}
              </div>
            )}
            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-right font-mono text-xs text-white/20 mt-1 mr-1">{timeStr}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-4 message-enter group">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 animate-pulse-glow"
        style={{ background: 'rgba(0,255,209,0.1)', border: '1px solid rgba(0,255,209,0.3)' }}
      >
        <SmileyLogo size={24} />
      </div>

      <div className="flex-1 max-w-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-xs font-bold neon-text tracking-widest">CYMOR</span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs text-white/20">{timeStr}</span>
            <button
              onClick={copyAll}
              className="font-mono text-xs text-white/30 hover:text-[#00FFD1] transition-colors px-2 py-0.5 rounded glass border border-transparent hover:border-[rgba(0,255,209,0.2)]"
            >
              {copied ? '✓ Copied' : 'Copy all'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`rounded-2xl rounded-tl-sm overflow-hidden ${message.error ? 'border border-[rgba(255,77,109,0.3)]' : 'border border-[rgba(0,255,209,0.1)]'}`}
          style={{ background: 'rgba(13,27,42,0.6)' }}
        >
          {parts?.length > 0 ? (
            <div className="p-5 space-y-3">
              {parts.map((part, i) =>
                part.type === 'code' ? (
                  <CodeBlock key={i} code={part.content} language={part.language} />
                ) : (
                  <TextContent key={i} text={part.content} />
                )
              )}
              {message.streaming && (
                <span className="inline-block w-2 h-4 bg-[#00FFD1] animate-blink ml-0.5" />
              )}
            </div>
          ) : (
            <div className="p-5">
              <p className="text-sm text-white/50 italic">Generating response...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
