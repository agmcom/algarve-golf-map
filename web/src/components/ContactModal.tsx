'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ContactModalProps {
  onClose: () => void
}

const SUBJECTS = [
  'General enquiry',
  'Course listing',
  'Partnership',
  'Report an error',
  'Other',
]

export function ContactModal({ onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20,
        width: '100%', maxWidth: 480,
        boxShadow: '0 24px 60px rgba(0,0,0,.2)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #ebebeb',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#222' }}>Get in touch</div>
            <div style={{ fontSize: 13, color: '#6a6a6a', marginTop: 2 }}>We'll get back to you as soon as possible</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: 'none', background: '#f5f5f5',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6a6a6a', flexShrink: 0,
            }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {status === 'sent' ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 8 }}>Message sent!</div>
            <div style={{ fontSize: 14, color: '#6a6a6a', marginBottom: 24 }}>
              Thanks for reaching out. We'll reply to {email} shortly.
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: '#2B6090', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <Field label="Name" required>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required
                  style={inputStyle}
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" required
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Subject" style={{ marginBottom: 12 }}>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Message" required style={{ marginBottom: 20 }}>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                placeholder="How can we help?" required rows={4}
                style={{ ...inputStyle, resize: 'none', height: 'auto' }}
              />
            </Field>

            {status === 'error' && (
              <div style={{ fontSize: 13, color: '#2B6090', marginBottom: 12 }}>
                Something went wrong. Please try again or email us directly.
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
        )}
      </div>
    </div>
  )
}

function Field({ label, children, required, style }: {
  label: string
  children: React.ReactNode
  required?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6a6a6a', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#2B6090' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1.5px solid #ebebeb', borderRadius: 10,
  fontSize: 14, color: '#222', background: '#fff',
  fontFamily: 'var(--font-body)',
  boxSizing: 'border-box', outline: 'none',
}
