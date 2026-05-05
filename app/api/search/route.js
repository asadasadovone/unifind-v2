const SEARCH_SYSTEM = `You are a university search assistant. Return ONLY results that strictly match ALL of the user's filters:
- If degree type is selected (Bachelor/Master/PhD), return ONLY that degree type
- ONLY return English-taught programs. Never return programs taught in any other language, regardless of filters.
- If country/region is selected, return ONLY universities from that region
- Sort by best fit: prioritize free/low tuition, English instruction, and scholarship availability
- Never return programs taught in a language the user did not select
- Never exceed the user's maximum tuition budget
- Return exactly 10 results per request, no more, no less`

export async function POST(request) {
  const { prompt, system } = await request.json()

  if (!prompt) {
    return Response.json({ error: 'No prompt' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      system: system || SEARCH_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return Response.json({ error: data }, { status: response.status })
  }

  return Response.json(data)
}
