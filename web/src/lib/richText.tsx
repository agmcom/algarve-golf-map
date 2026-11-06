// Tiny inline-formatting syntax for guide post text: **bold** and [text](url).
// Bold text may contain links. Used by the admin block editor (live preview) and
// the public guide article page, so both must stay in sync with this same parser.

const INLINE_PATTERN = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g

export function renderInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const match of text.matchAll(INLINE_PATTERN)) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))

    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{renderInlineText(match[1])}</strong>)
    } else {
      parts.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" style={{ color: '#2B6090', textDecoration: 'underline' }}>
          {match[2]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}
