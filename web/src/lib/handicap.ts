import type { Course } from '@/types/database'

type HandicapFields = Pick<Course, 'handicap_required_men' | 'handicap_required_ladies' | 'handicap_required'>

// What a course asks for: a published limit, a handicap with no published limit,
// no handicap at all, or not verified yet. A missing limit never means "none" on its own.
export type HandicapRule = 'limit' | 'required' | 'none' | 'unknown'

export function handicapRule(c: HandicapFields): HandicapRule {
  if (c.handicap_required_men != null || c.handicap_required_ladies != null) return 'limit'
  if (c.handicap_required === true) return 'required'
  if (c.handicap_required === false) return 'none'
  return 'unknown'
}

// Short label for spec grids when there is no number to show.
export function handicapRuleLabel(rule: HandicapRule): string | null {
  if (rule === 'none') return 'Not required'
  if (rule === 'required') return 'Required (no limit published)'
  return null
}
