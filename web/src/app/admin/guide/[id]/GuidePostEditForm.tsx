'use client'

import { useRef, useState } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { savePost, deletePost, saveHeroImage, uploadContentImage, type SaveResult } from './actions'
import { CATEGORY_LABELS } from '@/lib/guideCategories'
import { renderInlineText } from '@/lib/richText'

type CardRefType = 'course' | 'hotel' | 'shop'

type Block =
  | { id: string; type: 'heading'; level: 2 | 3; text: string }
  | { id: string; type: 'paragraph'; text: string }
  | { id: string; type: 'image'; url: string; alt: string }
  | { id: string; type: 'card'; refType: CardRefType; slug: string; withPhoto: boolean }

interface ReferenceOption { slug: string; name: string; town: string }

interface Post {
  id: string
  title: string
  slug: string
  categories: string[]
  excerpt: string | null
  content: unknown
  hero_image_url: string | null
  hero_image_alt: string | null
  published: boolean
}

function newId() {
  return Math.random().toString(36).slice(2)
}

function normalizeBlocks(raw: unknown): Block[] {
  if (!Array.isArray(raw)) return []
  return raw.map((b): Block | null => {
    if (!b || typeof b !== 'object') return null
    const type = (b as { type?: string }).type
    if (type === 'heading') return { id: newId(), type: 'heading', level: (b as { level?: number }).level === 3 ? 3 : 2, text: (b as { text?: string }).text ?? '' }
    if (type === 'paragraph') return { id: newId(), type: 'paragraph', text: (b as { text?: string }).text ?? '' }
    if (type === 'image') return { id: newId(), type: 'image', url: (b as { url?: string }).url ?? '', alt: (b as { alt?: string }).alt ?? '' }
    if (type === 'card') {
      const refType = (b as { refType?: string }).refType
      if (refType === 'course' || refType === 'hotel' || refType === 'shop') {
        return { id: newId(), type: 'card', refType, slug: (b as { slug?: string }).slug ?? '', withPhoto: (b as { withPhoto?: boolean }).withPhoto ?? false }
      }
      return null
    }
    return null
  }).filter((b): b is Block => b !== null)
}

const CARD_TYPE_LABELS: Record<CardRefType, string> = {
  course: 'Golf course',
  hotel: 'Hotel',
  shop: 'Shop',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd',
  fontSize: 14, color: '#111', background: '#fff', width: '100%', boxSizing: 'border-box',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 20px' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

function Notice({ result }: { result: SaveResult | null }) {
  if (!result) return null
  return (
    <div style={{
      marginTop: 10, fontSize: 13, padding: '8px 12px', borderRadius: 8,
      background: result.ok ? '#f0fdf4' : '#fef2f2',
      color: result.ok ? '#166534' : '#b91c1c',
      border: `1px solid ${result.ok ? '#86efac' : '#fca5a5'}`,
    }}>
      {result.ok ? '✓ Saved' : `✗ ${result.error}`}
    </div>
  )
}

function BlockShell({ children, onMoveUp, onMoveDown, onDelete }: {
  children: React.ReactNode
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 8 }}>
        <button type="button" onClick={onMoveUp} title="Move up" style={iconBtn}>↑</button>
        <button type="button" onClick={onMoveDown} title="Move down" style={iconBtn}>↓</button>
        <button type="button" onClick={onDelete} title="Remove" style={{ ...iconBtn, color: '#b91c1c' }}>×</button>
      </div>
      {children}
    </div>
  )
}

function SourceTabs({ mode, onChange }: { mode: 'upload' | 'link'; onChange: (m: 'upload' | 'link') => void }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {(['upload', 'link'] as const).map(m => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${mode === m ? '#2B6090' : '#ddd'}`,
            background: mode === m ? '#eef4f8' : '#fff',
            color: mode === m ? '#2B6090' : '#777',
          }}
        >
          {m === 'upload' ? 'Upload' : 'Paste link'}
        </button>
      ))}
    </div>
  )
}

function ImageLinkInput({ onSubmit, disabled }: { onSubmit: (url: string) => void; disabled: boolean }) {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="url"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Paste a Pexels/Unsplash image link"
        disabled={disabled}
        style={{ ...inputStyle, flex: 1 }}
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={() => onSubmit(value.trim())}
        style={{ ...addBtn, border: '1px solid #2B6090', color: '#2B6090', background: '#fff', flexShrink: 0 }}
      >
        Use link
      </button>
    </div>
  )
}

function InlineToolbar({ onBold, onLink }: { onBold: () => void; onLink: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
      <button type="button" onClick={onBold} title="Bold selected text" style={{ ...iconBtn, width: 32, fontWeight: 700 }}>B</button>
      <button type="button" onClick={onLink} title="Turn selected text into a link" style={{ ...iconBtn, width: 32 }}>🔗</button>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: '1px solid #ddd', background: '#fff',
  color: '#555', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export function GuidePostEditForm({ post, referenceOptions }: {
  post: Post
  referenceOptions: Record<CardRefType, ReferenceOption[]>
}) {
  const router = useRouter()
  const [blocks, setBlocks] = useState<Block[]>(() => normalizeBlocks(post.content))
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set())
  const [imageModes, setImageModes] = useState<Record<string, 'upload' | 'link'>>({})
  const [heroMode, setHeroMode] = useState<'upload' | 'link'>('upload')
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map())

  const boundSave = savePost.bind(null, post.id)
  const [saveResult, saveAction, savePending] = useActionState(boundSave, null)

  const boundHero = saveHeroImage.bind(null, post.id)
  const [heroResult, heroAction, heroPending] = useActionState(boundHero, null)

  function addBlock(type: Block['type']) {
    const block: Block =
      type === 'heading' ? { id: newId(), type: 'heading', level: 2, text: '' } :
      type === 'image' ? { id: newId(), type: 'image', url: '', alt: '' } :
      type === 'card' ? { id: newId(), type: 'card', refType: 'course', slug: '', withPhoto: false } :
      { id: newId(), type: 'paragraph', text: '' }
    setBlocks(prev => [...prev, block])
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } as Block : b))
  }

  function removeBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks(prev => {
      const i = prev.findIndex(b => b.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function formatSelection(id: string, kind: 'bold' | 'link') {
    const el = textareaRefs.current.get(id)
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = el.value.slice(start, end) || 'text'

    let inserted: string
    if (kind === 'bold') {
      inserted = `**${selected}**`
    } else {
      const url = window.prompt('Where should this link go? (e.g. https://... or /courses/some-course)')
      if (!url) return
      inserted = `[${selected}](${url})`
    }

    const newValue = el.value.slice(0, start) + inserted + el.value.slice(end)
    updateBlock(id, { text: newValue } as Partial<Block>)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start, start + inserted.length)
    })
  }

  async function handleImageUpload(id: string, file: File) {
    setUploadingIds(prev => new Set(prev).add(id))
    const fd = new FormData()
    fd.set('file', file)
    const res = await uploadContentImage(post.id, fd)
    setUploadingIds(prev => { const n = new Set(prev); n.delete(id); return n })
    if (res.ok) updateBlock(id, { url: res.url } as Partial<Block>)
    else alert('Error: ' + res.error)
  }

  async function handleImageLink(id: string, url: string) {
    setUploadingIds(prev => new Set(prev).add(id))
    const fd = new FormData()
    fd.set('url', url)
    const res = await uploadContentImage(post.id, fd)
    setUploadingIds(prev => { const n = new Set(prev); n.delete(id); return n })
    if (res.ok) updateBlock(id, { url: res.url } as Partial<Block>)
    else alert('Error: ' + res.error)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const res = await deletePost(post.id)
    if (res.ok) router.push('/admin/guide')
    else alert('Error: ' + res.error)
  }

  const contentJson = JSON.stringify(blocks.map(({ ...b }) => {
    const { id, ...rest } = b as Block & { id: string }
    void id
    return rest
  }))

  return (
    <div>
      {/* Hero image */}
      <Section title="Main image">
        {post.hero_image_url && (
          <img
            src={post.hero_image_url}
            alt={post.hero_image_alt ?? ''}
            style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 8, display: 'block' }}
          />
        )}
        <form action={heroAction} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SourceTabs mode={heroMode} onChange={setHeroMode} />
          {heroMode === 'upload' ? (
            <input type="file" name="hero_file" accept="image/*" style={{ fontSize: 13 }} />
          ) : (
            <input name="hero_url" type="url" placeholder="Paste a Pexels/Unsplash image link" style={inputStyle} />
          )}
          <input name="hero_alt" placeholder="Describe the image (for accessibility & SEO)" defaultValue={post.hero_image_alt ?? ''} style={inputStyle} />
          <button
            type="submit"
            disabled={heroPending}
            style={{
              alignSelf: 'flex-start', padding: '9px 18px', borderRadius: 8, border: 'none',
              background: heroPending ? '#ccc' : '#2B6090', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: heroPending ? 'not-allowed' : 'pointer',
            }}
          >
            {heroPending ? 'Uploading…' : post.hero_image_url ? 'Replace image' : 'Upload image'}
          </button>
        </form>
        <Notice result={heroResult} />
      </Section>

      <form action={saveAction}>
        <Section title="Basics">
          <Field label="Title (this becomes the page's H1)">
            <input name="title" defaultValue={post.title} required style={inputStyle} />
          </Field>
          <Field label="URL slug">
            <input name="slug" defaultValue={post.slug} required style={inputStyle} />
          </Field>
          <Field label="Categories (pick one or more)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#333' }}>
                  <input
                    type="checkbox"
                    name="categories"
                    value={value}
                    defaultChecked={post.categories?.includes(value)}
                    style={{ width: 15, height: 15, accentColor: '#2B6090', cursor: 'pointer' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Excerpt (shown in previews & Google search results)">
            <textarea name="excerpt" defaultValue={post.excerpt ?? ''} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" name="published" defaultChecked={post.published} style={{ width: 16, height: 16, accentColor: '#2B6090', cursor: 'pointer' }} />
            <span style={{ fontSize: 14, color: '#333' }}>Published (visible on the site)</span>
          </label>
        </Section>

        <Section title="Article content">
          {blocks.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', fontSize: 13, padding: '20px 0' }}>
              Empty so far — add a paragraph, subtitle, or photo below.
            </div>
          )}

          {blocks.map((block, i) => (
            <BlockShell
              key={block.id}
              onMoveUp={() => moveBlock(block.id, -1)}
              onMoveDown={() => moveBlock(block.id, 1)}
              onDelete={() => removeBlock(block.id)}
            >
              {block.type === 'heading' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <select
                    value={block.level}
                    onChange={e => updateBlock(block.id, { level: Number(e.target.value) as 2 | 3 } as Partial<Block>)}
                    style={{ ...inputStyle, width: 90, flexShrink: 0 }}
                  >
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                  <input
                    value={block.text}
                    onChange={e => updateBlock(block.id, { text: e.target.value } as Partial<Block>)}
                    placeholder="Subtitle text"
                    style={{ ...inputStyle, fontWeight: 700 }}
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <div>
                  <InlineToolbar
                    onBold={() => formatSelection(block.id, 'bold')}
                    onLink={() => formatSelection(block.id, 'link')}
                  />
                  <textarea
                    ref={el => { if (el) textareaRefs.current.set(block.id, el); else textareaRefs.current.delete(block.id) }}
                    value={block.text}
                    onChange={e => updateBlock(block.id, { text: e.target.value } as Partial<Block>)}
                    placeholder="Write a paragraph… select text and use B / 🔗 above to format it"
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                  {block.text && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#333', lineHeight: 1.6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 4 }}>Preview</span>
                      {renderInlineText(block.text)}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'image' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {block.url && (
                    <>
                      <img src={block.url} alt={block.alt} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }} />
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, { url: '' } as Partial<Block>)}
                        style={{ alignSelf: 'flex-start', fontSize: 12, color: '#2B6090', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Change image
                      </button>
                      <input
                        value={block.alt}
                        onChange={e => updateBlock(block.id, { alt: e.target.value } as Partial<Block>)}
                        placeholder="Describe this photo (for accessibility & SEO)"
                        style={inputStyle}
                      />
                    </>
                  )}
                  {!block.url && (
                    <>
                      <SourceTabs
                        mode={imageModes[block.id] ?? 'upload'}
                        onChange={m => setImageModes(prev => ({ ...prev, [block.id]: m }))}
                      />
                      {(imageModes[block.id] ?? 'upload') === 'upload' ? (
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingIds.has(block.id)}
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(block.id, f) }}
                          style={{ fontSize: 13 }}
                        />
                      ) : (
                        <ImageLinkInput
                          disabled={uploadingIds.has(block.id)}
                          onSubmit={url => handleImageLink(block.id, url)}
                        />
                      )}
                      {uploadingIds.has(block.id) && <span style={{ fontSize: 12, color: '#888' }}>Loading…</span>}
                    </>
                  )}
                </div>
              )}

              {block.type === 'card' && (() => {
                const options = referenceOptions[block.refType] ?? []
                const selected = options.find(o => o.slug === block.slug)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <select
                        value={block.refType}
                        onChange={e => updateBlock(block.id, { refType: e.target.value as CardRefType, slug: '' } as Partial<Block>)}
                        style={{ ...inputStyle, width: 130, flexShrink: 0 }}
                      >
                        {(Object.entries(CARD_TYPE_LABELS) as [CardRefType, string][]).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <select
                        value={block.slug}
                        onChange={e => updateBlock(block.id, { slug: e.target.value } as Partial<Block>)}
                        style={inputStyle}
                      >
                        <option value="">Choose one…</option>
                        {options.map(o => (
                          <option key={o.slug} value={o.slug}>{o.name} — {o.town}</option>
                        ))}
                      </select>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333' }}>
                      <input
                        type="checkbox"
                        checked={block.withPhoto}
                        onChange={e => updateBlock(block.id, { withPhoto: e.target.checked } as Partial<Block>)}
                        style={{ width: 15, height: 15, accentColor: '#2B6090', cursor: 'pointer' }}
                      />
                      Show photo on the card
                    </label>
                    {selected && (
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 14px', borderRadius: 10, border: '1px solid #ebebeb', background: '#fafafa',
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{selected.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{selected.town}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#aaa' }}>Preview</span>
                      </div>
                    )}
                  </div>
                )
              })()}
              <div style={{ position: 'absolute', top: 8, left: 12, fontSize: 10, color: '#ccc' }}>{i + 1}</div>
            </BlockShell>
          ))}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => addBlock('paragraph')} style={addBtn}>+ Paragraph</button>
            <button type="button" onClick={() => addBlock('heading')} style={addBtn}>+ Subtitle</button>
            <button type="button" onClick={() => addBlock('image')} style={addBtn}>+ Photo</button>
            <button type="button" onClick={() => addBlock('card')} style={addBtn}>+ Course/Hotel/Shop card</button>
          </div>
        </Section>

        <input type="hidden" name="content" value={contentJson} readOnly />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4, marginBottom: 20 }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '10px 20px', borderRadius: 8, border: '1px solid #fca5a5',
              background: '#fff', color: '#b91c1c', fontSize: 14, cursor: 'pointer', fontWeight: 600,
            }}
          >
            Delete post
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Notice result={saveResult} />
            <button
              type="submit"
              disabled={savePending}
              style={{
                padding: '10px 28px', borderRadius: 8, border: 'none',
                background: savePending ? '#ccc' : '#1a1a2e', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: savePending ? 'not-allowed' : 'pointer',
              }}
            >
              {savePending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const addBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 8, border: '1px dashed #bbb', background: '#fafafa',
  color: '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}
