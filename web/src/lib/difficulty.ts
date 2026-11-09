import type { Course } from '@/types/database'

// Difficulty normally comes from the official slope rating (see SLOPE in src/data/courses.ts).
// A few courses have no official slope; these carry a difficulty with the reason shown beside it,
// so the label never pretends to come from a slope that doesn't exist.
export const DIFFICULTY_WITHOUT_SLOPE: Record<string, { difficulty: 'easy' | 'moderate' | 'challenging'; note: string }> = {
  // 9 holes, all par 3, 926 m in total, no handicap required (club's own site). Not on the FPG rating table.
  'vale-de-milho': { difficulty: 'easy', note: 'par-3 course' },
}

export function difficultyNote(slug: string): string | null {
  return DIFFICULTY_WITHOUT_SLOPE[slug]?.note ?? null
}

// "Easy", or "Easy (par-3 course)" when the label doesn't come from a slope rating.
export function difficultyText(c: Pick<Course, 'slug' | 'difficulty'>): string | null {
  if (!c.difficulty) return null
  const base = c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)
  const note = difficultyNote(c.slug)
  return note ? `${base} (${note})` : base
}
