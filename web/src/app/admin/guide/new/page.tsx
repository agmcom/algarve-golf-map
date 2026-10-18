import Link from 'next/link'
import { NewPostForm } from './NewPostForm'

export default function NewGuidePostPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/admin/guide" style={{ color: '#aaa', fontSize: 13, textDecoration: 'none' }}>← Back to guide</Link>
        <span style={{ color: '#555' }}>/</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>New post</span>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px' }}>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          Start with a title and a category — you&rsquo;ll write the rest and add photos on the next screen.
        </p>
        <NewPostForm />
      </div>
    </div>
  )
}
