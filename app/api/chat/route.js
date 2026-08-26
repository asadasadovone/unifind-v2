export async function POST(req) {
  const { messages, uniName, field, location } = await req.json()

  const systemPrompt = `You are UniAsk AI, a friendly and knowledgeable university advisor helping prospective students learn about ${uniName || 'this university'}${field ? ` — ${field} program` : ''}${location ? ` in ${location}` : ''}. Answer questions concisely and helpfully about admissions requirements, scholarships, tuition costs, visa process, campus life, career prospects, and program details. Use **bold** for key terms, numbers, and important facts. Keep responses focused and under 200 words unless detail is specifically requested.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-beta': 'messages-2023-12-15',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(JSON.stringify({ error: err }), { status: 500 })
  }

  // Transform Anthropic SSE stream to plain text stream
  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  const readable = new ReadableStream({
    async start(controller) {
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                controller.enqueue(new TextEncoder().encode(parsed.delta.text))
              }
            } catch {}
          }
        }
      } finally {
        controller.close()
      }
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
