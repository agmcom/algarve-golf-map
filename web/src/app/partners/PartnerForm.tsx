'use client'

import { useState } from 'react'
import { Field, inputStyle } from '@/components/ContactModal'

const CONTACT_EMAIL = 'contact@algarvegolfmap.com'

export function PartnerForm({ services }: { services: string[] }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [service, setService] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `Partnership: ${service} — ${company}`,
          message: `Company: ${company}\nService: ${service}\nWebsite: ${website || '—'}\n\n${message}`,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 8 }}>Thanks, message sent</div>
        <div style={{ fontSize: 14, color: '#6a6a6a' }}>
          We&apos;ll reply to {email} as soon as we can.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={card}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
        <Field label="Your name" required>
          <input value={name} onChange={e => setName(e.target.value)} required maxLength={200} style={inputStyle} />
        </Field>
        <Field label="Business name" required>
          <input value={company} onChange={e => setCompany(e.target.value)} required maxLength={120} style={inputStyle} />
        </Field>
        <Field label="Type of business" required>
          <select value={service} onChange={e => setService(e.target.value)} required style={inputStyle}>
            <option value="" disabled>Choose one</option>
            {services.map(s => <option key={s}>{s}</option>)}
            <option>Other</option>
          </select>
        </Field>
        <Field label="Email" required>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" required maxLength={254} style={inputStyle} />
        </Field>
      </div>

      <Field label="Website" style={{ marginBottom: 12 }}>
        <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.yourbusiness.com" maxLength={200} style={inputStyle} />
      </Field>

      <Field label="What do you have in mind?" required style={{ marginBottom: 20 }}>
        <textarea
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Tell us briefly what you do and how you'd like to work together"
          required rows={5} maxLength={9000}
          style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
        />
      </Field>

      {status === 'error' && (
        <div role="alert" style={{ fontSize: 13, color: '#2B6090', marginBottom: 12 }}>
          Something went wrong. Please try again or email us at {CONTACT_EMAIL}.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          width: '100%', height: 44, borderRadius: 10, border: 'none',
          background: '#2B6090', color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: status === 'sending' ? 'default' : 'pointer',
          fontFamily: 'var(--font-body)',
          opacity: status === 'sending' ? .7 : 1,
          transition: 'opacity .15s',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

const card: React.CSSProperties = {
  maxWidth: 700, padding: 20,
  border: '1px solid #ebebeb', borderRadius: 16, background: '#fff',
}
