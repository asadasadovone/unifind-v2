// Server route: forward feedback + contact-form submissions to the team inbox
// via Resend, so nothing sits in a UI-only state after the user hits Send.

const escapeHtml = (s = '') => String(s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

export async function POST(req) {
  try {
    const body = await req.json()
    const category = String(body.category || '').slice(0, 80)
    const message = String(body.message || '').trim().slice(0, 8000)
    const name = String(body.name || '').slice(0, 200)
    const email = String(body.email || '').slice(0, 200)
    const source = String(body.source || 'feedback').slice(0, 40)

    if (!message) {
      return Response.json({ ok: false, error: 'Message is required.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // No mailer configured — accept the submission but flag it so the client
      // can tell the user to email us directly instead of silently swallowing.
      return Response.json({ ok: false, error: 'mailer-not-configured' }, { status: 503 })
    }

    const subject = `[UniAsk ${source}${category ? ' · ' + category : ''}] from ${email || 'anonymous'}`

    const text = [
      `Source: ${source}`,
      category ? `Category: ${category}` : null,
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      '',
      message,
    ].filter(Boolean).join('\n')

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0D2C54;">
        <p style="margin:0 0 12px;font-size:13px;color:#6B7280;">
          <strong>Source:</strong> ${escapeHtml(source)}${category ? ' · <strong>Category:</strong> ' + escapeHtml(category) : ''}
        </p>
        ${name ? `<p style="margin:0 0 4px;font-size:14px;"><strong>Name:</strong> ${escapeHtml(name)}</p>` : ''}
        ${email ? `<p style="margin:0 0 16px;font-size:14px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#0162E3;">${escapeHtml(email)}</a></p>` : ''}
        <div style="padding:16px;background:#F4F5F7;border-radius:12px;font-size:14px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'UniAsk <noreply@uniask.ai>',
        to: ['hello@uniask.ai'],
        // If the user gave an email, Reply lands on them so a hit-reply
        // conversation goes straight back to the sender.
        reply_to: email || undefined,
        subject,
        text,
        html,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.warn('resend send failed', res.status, detail)
      return Response.json({ ok: false, error: 'send-failed' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.warn('feedback route error', err)
    return Response.json({ ok: false, error: 'bad-request' }, { status: 400 })
  }
}
