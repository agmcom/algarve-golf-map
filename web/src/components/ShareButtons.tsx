'use client'

import { useState } from 'react'
import { Link2, Mail, Check } from 'lucide-react'
import { SOCIAL_PROFILES } from './SocialLinks'

interface ShareButtonsProps {
  url: string
  title: string
  label?: string
  contentType?: string
}

const BRAND_PATHS = Object.fromEntries(SOCIAL_PROFILES.map(p => [p.name, p.path]))

const WHATSAPP_PATH = 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41'
const X_PATH = 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z'

function trackShare(method: string, url: string, contentType: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.('event', 'share', { method, content_type: contentType, item_id: url })
}

function shareTargets(url: string, title: string) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  return [
    { name: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, path: WHATSAPP_PATH },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, path: BRAND_PATHS.Facebook },
    { name: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}`, path: X_PATH },
    { name: 'Threads', href: `https://www.threads.com/intent/post?text=${t}%20${u}`, path: BRAND_PATHS.Threads },
  ]
}

function useCopyLink(url: string, contentType: string) {
  const [copied, setCopied] = useState(false)
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackShare('copy_link', url, contentType)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }
  return { copied, copyLink }
}

export function ShareButtons({ url, title, label = 'Share this guide', contentType = 'guide' }: ShareButtonsProps) {
  const { copied, copyLink } = useCopyLink(url, contentType)
  const t = encodeURIComponent(title)
  const u = encodeURIComponent(url)
  const targets = shareTargets(url, title)

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#222', marginRight: 4 }}>
        {label}
      </span>
      {targets.map(s => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.name}`}
          title={`Share on ${s.name}`}
          onClick={() => trackShare(s.name.toLowerCase(), url, contentType)}
          style={buttonStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={s.path} />
          </svg>
        </a>
      ))}
      <a
        href={`mailto:?subject=${t}&body=${u}`}
        aria-label="Share by email"
        title="Share by email"
        onClick={() => trackShare('email', url, contentType)}
        style={buttonStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <Mail size={18} strokeWidth={2} />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        title="Copy link"
        style={{ ...buttonStyle, width: 'auto', padding: '0 14px', gap: 6, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        {copied ? <Check size={16} strokeWidth={2.5} /> : <Link2 size={16} strokeWidth={2} />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 40, height: 40, borderRadius: 20,
  border: '1.5px solid #ebebeb', background: '#fff', color: '#444',
  cursor: 'pointer', textDecoration: 'none',
  transition: 'border-color .15s, color .15s',
}

function hoverOn(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = '#2B6090'
  e.currentTarget.style.color = '#2B6090'
}

function hoverOff(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = '#ebebeb'
  e.currentTarget.style.color = '#444'
}
