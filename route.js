import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, fileContent, fileName, language } = await request.json()

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 })
    }

    const langHint = language && language !== 'Auto Detect' ? ` Use ${language} conventions.` : ''
    const userInstruction = message?.trim() || 'Debug this code, fix all issues, and explain what you found.'

    const systemPrompt = `You are Cymor, an elite code debugging specialist powered by deep static analysis.

When analyzing code files:
1. Read every line carefully — find ALL bugs, not just the obvious ones
2. Identify: syntax errors, logic bugs, security vulnerabilities, performance issues, anti-patterns
3. Provide a brief "Diagnosis" section listing what was wrong (use **bold** for issue names)
4. Then provide the COMPLETE fixed file in a single code block — not partial, not snippets
5. After the code block, provide a "What Changed" section explaining each fix
6. Mention any remaining improvements the developer should consider

Standards: Production-grade fixes only. No quick hacks. Handle edge cases. Add input validation where missing.${langHint}`

    const userPrompt = `File: \`${fileName || 'uploaded file'}\`\n\nInstruction: ${userInstruction}\n\n\`\`\`\n${fileContent.slice(0, 8000)}\n\`\`\``

    // Try HuggingFace Qwen2.5-Coder first
    const hfToken = process.env.HF_TOKEN
    if (hfToken) {
      try {
        const hfRes = await fetch(
          'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              max_tokens: 4096,
              temperature: 0.3, // Lower temp for more precise debugging
              stream: true,
            }),
          }
        )

        if (hfRes.ok) {
          const { readable, writable } = new TransformStream()
          hfRes.body.pipeTo(writable)
          return new Response(readable, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-Model': 'qwen2.5-coder-32b',
            }
          })
        }
      } catch (err) {
        console.error('HuggingFace failed:', err)
      }
    }

    // Fallback to Groq
    const groqKey = process.env.GROQ_API_KEY
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: 4096,
            temperature: 0.3,
            stream: true,
          }),
        })

        if (groqRes.ok) {
          const { readable, writable } = new TransformStream()
          groqRes.body.pipeTo(writable)
          return new Response(readable, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-Model': 'groq-llama-3.1-70b',
            }
          })
        }
      } catch (err) {
        console.error('Groq fallback failed:', err)
      }
    }

    // Claude fallback
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey) {
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          stream: true,
        }),
      })

      if (claudeRes.ok) {
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()
        const { readable, writable } = new TransformStream({
          transform(chunk, controller) {
            const text = decoder.decode(chunk, { stream: true })
            for (const line of text.split('\n')) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.type === 'content_block_delta' && data.delta?.text) {
                    controller.enqueue(encoder.encode(
                      `data: ${JSON.stringify({ choices: [{ delta: { content: data.delta.text } }] })}\n\n`
                    ))
                  }
                } catch {}
              }
            }
          }
        })
        claudeRes.body.pipeTo(writable)
        return new Response(readable, {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
        })
      }
    }

    return NextResponse.json({ error: 'No AI models available. Check your API keys.' }, { status: 500 })

  } catch (error) {
    console.error('Files API error:', error)
    return NextResponse.json({ error: 'File analysis failed' }, { status: 500 })
  }
}
