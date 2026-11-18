// "Pace of play": how long the club expects a round to take, from the club's own rules, booking terms or scorecard.
// Evidence: research/pace-2026-11/ (crawl_pace.py, scan_saved.py, scorecard_txt/) and research/rain-2026-11/sources/.
// Only official club sources. Courses without an entry show the "not published" text; inactive or closed
// courses (see NO_SECTION) show no section.

export const PACE_LAST_CHECKED = 'November 2026'

export interface PaceSource {
  label: string
  url: string
}

export interface PaceInfo {
  target?: string // short headline shown as a pill, e.g. '4h30 for 18 holes'
  summary: string
  sources: PaceSource[]
}

const PESTANA_RULE = "The club rules printed on the official scorecard say an 18-hole round shall not last longer than 4 hours 30 minutes. Every group must let faster players through and follow the marshals' instructions, and you must report to the starter at least 5 minutes before your tee time or lose it."
const pestanaCard = (label: string, url: string): PaceSource => ({ label: `Pestana ${label} official scorecard`, url })

const VILAMOURA: PaceInfo = {
  target: '4h40 for 18 holes',
  summary: "Vilamoura Golf's rules say a round of 18 holes must not take longer than 4 hours 40 minutes. If there's a free hole ahead of you, you must let the group behind play through, and at busy times players are asked to mark their balls on par-3 greens and step aside so the next group can tee off.",
  sources: [{ label: 'Vilamoura Golf rules and regulations', url: 'https://www.vilamouragolf.com/en/rules-and-regulations/' }],
}

const VALE_DO_LOBO: PaceInfo = {
  target: '4h30 for 18 holes',
  summary: "Vale do Lobo's booking conditions ask all players to finish a round in 4 hours 30 minutes or less, and to stay no more than half a hole behind the group in front. Starters and marshals are authorised to enforce the speed-of-play rules.",
  sources: [{ label: 'Vale do Lobo booking conditions', url: 'https://valedolobo.golfmanager.com/system/page/condicoes' }],
}

const QUINTA_DO_LAGO: PaceInfo = {
  target: 'About 4h30 for 18 holes',
  summary: "Quinta do Lago says a round takes about 4 hours 30 minutes for 18 holes and 2 hours 15 minutes for nine. Its booking terms set a maximum of 2 hours 14 minutes for nine holes, and players must follow the ranger's instructions.",
  sources: [
    { label: 'Quinta do Lago FAQ', url: 'https://www.quintadolago.com/en/faq/' },
    { label: 'Quinta do Lago booking terms', url: 'https://eu.golfmanager.com/quintadolago/consumer/page?name=terms' },
  ],
}

const QDR_TERMS: PaceSource = { label: 'Quinta da Ria booking conditions', url: 'https://quintadaria.golfmanager.com/system/page/conditions' }

export const PACE: Record<string, PaceInfo> = {
  'vilamoura-old-course': VILAMOURA,
  'vilamoura-pinhal': VILAMOURA,
  'vilamoura-laguna': VILAMOURA,
  'vilamoura-millennium': VILAMOURA,
  'vale-do-lobo-royal': VALE_DO_LOBO,
  'vale-do-lobo-ocean': VALE_DO_LOBO,
  'quinta-do-lago-south': QUINTA_DO_LAGO,
  'quinta-do-lago-north': QUINTA_DO_LAGO,
  'quinta-do-lago-laranjal': QUINTA_DO_LAGO,
  'quinta-da-ria': {
    target: '4h20 for 18 holes',
    summary: 'The official scorecard has a pace-of-play column that allows 2 hours 10 minutes for each nine, or 4 hours 20 minutes for 18 holes, and the booking conditions set the same 2 hours 10 minutes as the maximum for nine holes.',
    sources: [{ label: 'Quinta da Ria official scorecard', url: 'https://www.quintadaria.com/wp-content/uploads/2024/12/QdR_score_card_web.pdf' }, QDR_TERMS],
  },
  'quinta-de-cima': {
    target: '4h20 for 18 holes',
    summary: 'The official scorecard has a pace-of-play column that allows 2 hours 10 minutes for each nine, or 4 hours 20 minutes for 18 holes.',
    sources: [{ label: 'Quinta de Cima official scorecard', url: 'https://www.quintadaria.com/wp-content/uploads/2024/12/QdC_score_card_web-cima.pdf' }, QDR_TERMS],
  },
  'quinta-do-vale': {
    target: '2h20 for 9 holes',
    summary: "Quinta do Vale's booking conditions set a maximum of 2 hours 20 minutes to play nine holes, and players must follow the ranger's instructions.",
    sources: [{ label: 'Quinta do Vale booking conditions', url: 'https://quintadovale.golfmanager.com/system/page/conditions' }],
  },
  'monte-rei': {
    target: '4h30 for 18 holes',
    summary: "Monte Rei's course rules set a pace of play of 4 hours 30 minutes, and the club leaves 12 minutes between tee times.",
    sources: [
      { label: 'Monte Rei course rules', url: 'https://www.monte-rei.com/en/course-rules-regulations/' },
      { label: 'Monte Rei golf', url: 'https://www.monte-rei.com/en/golf/' },
    ],
  },
  'ombria': {
    target: '4h30 for 18 holes',
    summary: "Ombria's rules set the pace of play at 4 hours 30 minutes for 18 holes, or 2 hours 15 minutes for each nine. Tee times are 10 minutes apart.",
    sources: [
      { label: 'Ombria golf rules and regulations', url: 'https://www.ombria.com/files/uploads/2026/06/F_OMB_Golf_RulesRegulaions_2024-1.pdf' },
      { label: 'Ombria golf course', url: 'https://www.ombria.com/en/golf/golf-course/' },
    ],
  },
  'gramacho': {
    target: '4h30 for 18 holes',
    summary: PESTANA_RULE,
    sources: [pestanaCard('Gramacho', 'https://pestanagolf.com/wp-content/uploads/2026/02/gramacho-e-pinta_compressed.pdf'), { label: 'Pestana Gramacho', url: 'https://pestanagolf.com/gramacho/' }],
  },
  'vale-da-pinta': {
    target: '4h30 for 18 holes',
    summary: PESTANA_RULE,
    sources: [pestanaCard('Vale da Pinta', 'https://pestanagolf.com/wp-content/uploads/2026/02/gramacho-e-pinta_compressed.pdf')],
  },
  'silves': {
    target: '4h30 for 18 holes',
    summary: PESTANA_RULE,
    sources: [pestanaCard('Silves Golf', 'https://pestanagolf.com/wp-content/uploads/2026/02/silves.pdf')],
  },
  'vila-sol': {
    target: '4h30 for 18 holes',
    summary: PESTANA_RULE,
    sources: [pestanaCard('Vila Sol', 'https://pestanagolf.com/wp-content/uploads/2026/02/Vila-sol_compressed.pdf')],
  },
  'pestana-ferragudo': {
    target: '4h30 for 18 holes',
    summary: PESTANA_RULE,
    sources: [pestanaCard('Ferragudo', 'https://pestanagolf.com/wp-content/uploads/2026/09/Score-card-Ferragudo.pdf')],
  },
  'pine-cliffs': {
    target: '2 hours for 9 holes',
    summary: "Pine Cliffs' rules allow 2 hours to play nine holes. To avoid holding others up, players must pick up their ball once their score reaches double par on a hole, and two- and three-balls have priority over four-balls.",
    sources: [{ label: 'Pine Cliffs golf rules', url: 'https://www.pinecliffs.com/wp-content/uploads/2025/03/Rules_Golf.pdf' }],
  },
  'balaia': {
    target: 'Under 2 hours for 9 holes',
    summary: "The club says you can play its nine par-3 holes in under 2 hours. The official scorecard's elapsed-time column allows 1 hour 35 minutes for nine holes and 3 hours 10 minutes for 18.",
    sources: [
      { label: 'Balaia Golf Club', url: 'https://www.balaiagolfvillage.com/en/balaia-golf-club/' },
      { label: 'Balaia official scorecard', url: 'https://www.balaiagolfclub.com/media/x0bkafab/score-card_compressed.pdf' },
    ],
  },
  'benamor': {
    summary: "Benamor doesn't publish a target time, but its rules ask players to keep pace with the group in front and to let the group behind through if they lose time. If you don't have a handicap, the club asks you to tell reception or the starter, so the marshal can help keep newer golfers' groups moving, especially in high season.",
    sources: [{ label: 'Benamor rules and etiquette', url: 'https://www.benamorgolf.com/en/rules-etiquette' }],
  },
  'castro-marim': {
    summary: "Castro Marim doesn't publish a target time, but its scorecard asks you to stay right behind the group in front, rather than ahead of the group behind, and says the marshals will ask you to speed up if you fall behind.",
    sources: [{ label: 'Castro Marim official scorecard', url: 'https://castromarimresort.com/wp-content/uploads/2019/03/scorecard.pdf' }],
  },
  'salgados': {
    summary: "Salgados doesn't publish a target time, but the notice on its online booking says players are expected to keep up with the group in front.",
    sources: [{ label: 'Salgados online booking', url: 'https://salgados.golfmanager.com/consumer/portal' }],
  },
  'boavista': {
    summary: "Boavista doesn't publish a target time for a round. Its booking terms say tee times are 10 minutes apart, and the club may group players into four-balls.",
    sources: [{ label: 'Boavista booking terms', url: 'https://boavista.golfmanager.com/system/page/termosecondicoes' }],
  },
}

// Private or closed courses: no section.
const NO_SECTION = new Set(['victoria-els-club', 'san-lorenzo'])

export const PACE_NOT_PUBLISHED = "This club doesn't publish a target time for a round, so ask when you book. As a rough guide, the Algarve clubs that do publish one allow between 4 hours 20 minutes and 4 hours 40 minutes for 18 holes."

export function getPaceInfo(slug: string): PaceInfo | 'not-published' | null {
  if (NO_SECTION.has(slug)) return null
  return PACE[slug] ?? 'not-published'
}
