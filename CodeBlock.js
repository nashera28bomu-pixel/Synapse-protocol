'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

const LANGUAGE_COLORS = {
  javascript: '#F59E0B',
  typescript: '#3B82F6',
  jsx: '#61DAFB',
  tsx: '#61DAFB',
  python: '#3B82F6',
  rust: '#F97316',
  go: '#06B6D4',
  java: '#EF4444',
  cpp: '#8B5CF6',
  c: '#6B7280',
  cs: '#9333EA',
  html: '#E34C26',
  css: '#264DE4',
  sql: '#00A86B',
  bash: '#00FFD1',
  shell: '#00FFD1',
  json: '#F59E0B',
  yaml: '#CB4154',
  markdown: '#white',
  plaintext: '#white',
}

// Minimal syntax highlighting
function highlight(code, lang) {
  if (!['javascript', 'typescript', 'jsx', 'tsx', 'python', 'rust', 'go'].includes(lang)) {
    return escapeHtml(code)
  }

  const keywords = {
    javascript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'import', 'export', 'default', 'from', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'of', 'in', 'true', 'false', 'null', 'undefined', 'switch', 'case', 'break', 'continue', 'delete', 'void', 'yield', 'static', 'extends', 'super', 'arrow'],
    typescript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'import', 'export', 'default', 'from', 'try', 'catch', 'throw', 'typeof', 'type', 'interface', 'enum', 'implements', 'extends', 'abstract', 'readonly', 'public', 'private', 'protected', 'static', 'true', 'false', 'null', 'undefined', 'void', 'never', 'any', 'string', 'number', 'boolean'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'pass', 'break', 'continue', 'yield', 'async', 'await', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'],
  }
  const kws = keywords[lang] || keywords.javascript

  let result = escapeHtml(code)

  // Keywords
  result = result.replace(
    new RegExp(`\\b(${kws.join('|')})\\b`, 'g'),
    '<span style="color:#7B2FFF;font-weight:600">$1</span>'
  )

  // Strings (double and single)
  result = result.replace(
    /(&quot;[^&]*&quot;|&#39;[^&]*&#39;|`[^`]*`)/g,
    '<span style="color:#00C896">$1</span>'
  )

  // Template literals
  result = result.replace(
    /(`[^`]*`)/g,
    '<span style="color:#00C896">$1</span>'
  )

  // Numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span style="color:#F59E0B">$1</span>'
  )

  // Comments
  result = result.replace(
    /(\/\/[^\n]*|#[^\n]*)/g,
    '<span style="color:#4A5568;font-style:italic">$1</span>'
  )

  // Function calls
  result = result.replace(
    /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    '<span style="color:#06B6D4">$1</span>'
  )

  return result
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default function CodeBlock({ code, language = 'plaintext' }) {
  const [copied, setCopied] = useState(false)
  const [showDiff, setShowDiff] = useState(false)
  const lang = language.toLowerCase()
  const langColor = LANGUAGE_COLORS[lang] || '#9CA3AF'
  const lineCount = code.split('\n').length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed')
    }
  }

  const highlighted = highlight(code, lang)

  return (
    <div className="code-container rounded-xl overflow-hidden border border-[rgba(0,255,209,0.1)] scanlines relative">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(0,255,209,0.08)' }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF4D6D] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#00FFD1] opacity-80" />
          </div>
          <span
            className="font-mono text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ color: langColor, background: `${langColor}15`, border: `1px solid ${langColor}30` }}
          >
            {language.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-white/20">{lineCount} lines</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: copied ? 'rgba(0,255,209,0.2)' : 'rgba(255,255,255,0.05)',
              color: copied ? '#00FFD1' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${copied ? 'rgba(0,255,209,0.3)' : 'transparent'}`,
            }}
          >
            {copied ? (
              <><span>✓</span> Copied!</>
            ) : (
              <><span>⎘</span> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Line numbers + code */}
      <div className="flex overflow-x-auto" style={{ background: '#030810' }}>
        {/* Line numbers */}
        <div
          className="select-none py-5 pr-4 pl-4 text-right flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(0,255,209,0.05)' }}
        >
          {code.split('\n').map((_, i) => (
            <div key={i} className="font-mono text-xs leading-6" style={{ color: 'rgba(0,255,209,0.2)' }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <pre
          className="flex-1 py-5 px-5 overflow-x-auto"
          style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, lineHeight: '24px', margin: 0 }}
        >
          <code
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  )
}
