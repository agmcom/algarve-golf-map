// Tiny inline-formatting syntax for guide post text: **bold** and [text](url).
// Used by the admin block editor (live preview) and the public guide article page,
// so both must stay in sync with this same parser.

const INLINE_PATTERN = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g

export function renderInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))

    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>)
    } else {
      parts.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" style={{ color: '#2B6090', textDecoration: 'underline' }}>
          {match[2]}
        </a>
      )
    }
    lastIndex = INLINE_PATTERN.lastIndex
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}
