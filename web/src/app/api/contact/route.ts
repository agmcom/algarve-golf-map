import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Algarve Golf Map <contact@algarvegolfmap.com>',
    to: 'contact@algarvegolfmap.com',
    replyTo: email,
    subject: `[Contact] ${subject || 'New message'} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '—'}\n\n${message}`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
