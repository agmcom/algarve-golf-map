'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const from = params.get('from') ?? '/admin/courses'
      router.push(from)
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', marginBottom: 12 }}
      />
      {error && <p style={{ color: '#c00', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        style={{ width: '100%', padding: '10px 0', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Checking...' : 'Enter'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 360, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 16, padding: 40 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 24px' }}>Admin Access</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
