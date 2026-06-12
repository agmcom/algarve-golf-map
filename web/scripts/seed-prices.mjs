// Seed course_prices with monthly data from algarvegolf.net
// Usage: node scripts/seed-prices.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lltyahomlgnigxdtidys.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdHlhaG9tbGduaWd4ZHRpZHlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyNTI0NCwiZXhwIjoyMDk1ODAxMjQ0fQ.KQQjZ96VuRfmR0JSR5s7_8DZbGDnWHElyixHKshVRzM'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Raw price data: [slug, month, time_slot, holes, price_eur, buggy_price, buggy_included]
// Source: algarvegolf.net (Jun 2026 – May 2027)
const RAW = [
  // ── Quinta do Lago South ─────────────────────────────────
  ['quinta-do-lago-south',  1,'standard',18, 188, 60,false],
  ['quinta-do-lago-south',  2,'standard',18, 228, 60,false],
  ['quinta-do-lago-south',  3,'standard',18, 264, 60,false],
  ['quinta-do-lago-south',  4,'standard',18, 264, 60,false],
  ['quinta-do-lago-south',  5,'standard',18, 264, 60,false],
  ['quinta-do-lago-south',  6,'standard',18, 214, 60,false],
  ['quinta-do-lago-south',  7,'standard',18, 178, 60,false],
  ['quinta-do-lago-south',  8,'standard',18, 178, 60,false],
  ['quinta-do-lago-south',  9,'standard',18, 214, 60,false],
  ['quinta-do-lago-south', 10,'standard',18, 243, 60,false],
  ['quinta-do-lago-south', 11,'standard',18, 228, 60,false],
  ['quinta-do-lago-south', 12,'standard',18, 188, 60,false],

  // ── Quinta do Lago North ─────────────────────────────────
  ['quinta-do-lago-north',  1,'standard',18, 172, 60,false],
  ['quinta-do-lago-north',  2,'standard',18, 206, 60,false],
  ['quinta-do-lago-north',  3,'standard',18, 242, 60,false],
  ['quinta-do-lago-north',  4,'standard',18, 242, 60,false],
  ['quinta-do-lago-north',  5,'standard',18, 242, 60,false],
  ['quinta-do-lago-north',  6,'standard',18, 193, 60,false],
  ['quinta-do-lago-north',  7,'standard',18, 163, 60,false],
  ['quinta-do-lago-north',  8,'standard',18, 163, 60,false],
  ['quinta-do-lago-north',  9,'standard',18, 193, 60,false],
  ['quinta-do-lago-north', 10,'standard',18, 223, 60,false],
  ['quinta-do-lago-north', 11,'standard',18, 206, 60,false],
  ['quinta-do-lago-north', 12,'standard',18, 172, 60,false],

  // ── Quinta do Lago Laranjal ───────────────────────────────
  ['quinta-do-lago-laranjal',  1,'standard',18, 172, 60,false],
  ['quinta-do-lago-laranjal',  2,'standard',18, 206, 60,false],
  ['quinta-do-lago-laranjal',  3,'standard',18, 242, 60,false],
  ['quinta-do-lago-laranjal',  4,'standard',18, 242, 60,false],
  ['quinta-do-lago-laranjal',  5,'standard',18, 242, 60,false],
  ['quinta-do-lago-laranjal',  6,'standard',18, 193, 60,false],
  ['quinta-do-lago-laranjal',  7,'standard',18, 163, 60,false],
  ['quinta-do-lago-laranjal',  8,'standard',18, 163, 60,false],
  ['quinta-do-lago-laranjal',  9,'standard',18, 193, 60,false],
  ['quinta-do-lago-laranjal', 10,'standard',18, 223, 60,false],
  ['quinta-do-lago-laranjal', 11,'standard',18, 206, 60,false],
  ['quinta-do-lago-laranjal', 12,'standard',18, 172, 60,false],

  // ── San Lorenzo ──────────────────────────────────────────
  ['san-lorenzo',  1,'standard',18, 151, 55,false],
  ['san-lorenzo',  2,'standard',18, 151, 55,false],
  ['san-lorenzo',  3,'standard',18, 176, 55,false],
  ['san-lorenzo',  4,'standard',18, 176, 55,false],
  ['san-lorenzo',  5,'standard',18, 176, 55,false],
  ['san-lorenzo',  6,'standard',18, 148, 55,false],
  ['san-lorenzo',  7,'standard',18, 138, 55,false],
  ['san-lorenzo',  8,'standard',18, 138, 55,false],
  ['san-lorenzo',  9,'standard',18, 148, 55,false],
  ['san-lorenzo', 10,'standard',18, 161, 55,false],
  ['san-lorenzo', 11,'standard',18, 148, 55,false],
  ['san-lorenzo', 12,'standard',18, 204, 55,false],

  // ── Vilamoura Old Course ─────────────────────────────────
  ['vilamoura-old-course',  1,'standard',18, 236, 60,false],
  ['vilamoura-old-course',  2,'standard',18, 236, 60,false],
  ['vilamoura-old-course',  3,'standard',18, 301, 60,false],
  ['vilamoura-old-course',  4,'standard',18, 301, 60,false],
  ['vilamoura-old-course',  5,'standard',18, 301, 60,false],
  ['vilamoura-old-course',  6,'standard',18, 248, 60,false],
  ['vilamoura-old-course',  7,'standard',18, 214, 60,false],
  ['vilamoura-old-course',  8,'standard',18, 214, 60,false],
  ['vilamoura-old-course',  9,'standard',18, 248, 60,false],
  ['vilamoura-old-course', 10,'standard',18, 274, 60,false],
  ['vilamoura-old-course', 11,'standard',18, 248, 60,false],
  ['vilamoura-old-course', 12,'standard',18, 214, 60,false],

  // ── Vilamoura Pinhal ─────────────────────────────────────
  ['vilamoura-pinhal',  1,'standard',18, 141, 60,false],
  ['vilamoura-pinhal',  2,'standard',18, 141, 60,false],
  ['vilamoura-pinhal',  3,'standard',18, 204, 60,false],
  ['vilamoura-pinhal',  4,'standard',18, 204, 60,false],
  ['vilamoura-pinhal',  5,'standard',18, 204, 60,false],
  ['vilamoura-pinhal',  6,'standard',18, 153, 60,false],
  ['vilamoura-pinhal',  7,'standard',18, 123, 60,false],
  ['vilamoura-pinhal',  8,'standard',18, 123, 60,false],
  ['vilamoura-pinhal',  9,'standard',18, 153, 60,false],
  ['vilamoura-pinhal', 10,'standard',18, 170, 60,false],
  ['vilamoura-pinhal', 11,'standard',18, 153, 60,false],
  ['vilamoura-pinhal', 12,'standard',18, 123, 60,false],
  ['vilamoura-pinhal',  1,'twilight',18, 101,null,false],
  ['vilamoura-pinhal',  2,'twilight',18, 101,null,false],
  ['vilamoura-pinhal',  3,'twilight',18, 144,null,false],
  ['vilamoura-pinhal',  4,'twilight',18, 144,null,false],
  ['vilamoura-pinhal',  5,'twilight',18, 144,null,false],
  ['vilamoura-pinhal',  6,'twilight',18, 107,null,false],
  ['vilamoura-pinhal',  7,'twilight',18,  87,null,false],
  ['vilamoura-pinhal',  8,'twilight',18,  87,null,false],
  ['vilamoura-pinhal',  9,'twilight',18, 107,null,false],
  ['vilamoura-pinhal', 10,'twilight',18, 118,null,false],
  ['vilamoura-pinhal', 11,'twilight',18, 107,null,false],
  ['vilamoura-pinhal', 12,'twilight',18,  86,null,false],

  // ── Vilamoura Laguna ─────────────────────────────────────
  ['vilamoura-laguna',  1,'standard',18, 135, 60,false],
  ['vilamoura-laguna',  2,'standard',18, 135, 60,false],
  ['vilamoura-laguna',  3,'standard',18, 187, 60,false],
  ['vilamoura-laguna',  4,'standard',18, 187, 60,false],
  ['vilamoura-laguna',  5,'standard',18, 187, 60,false],
  ['vilamoura-laguna',  6,'standard',18, 153, 60,false],
  ['vilamoura-laguna',  7,'standard',18, 123, 60,false],
  ['vilamoura-laguna',  8,'standard',18, 123, 60,false],
  ['vilamoura-laguna',  9,'standard',18, 153, 60,false],
  ['vilamoura-laguna', 10,'standard',18, 170, 60,false],
  ['vilamoura-laguna', 11,'standard',18, 153, 60,false],
  ['vilamoura-laguna', 12,'standard',18, 123, 60,false],
  ['vilamoura-laguna',  1,'twilight',18,  97,null,false],
  ['vilamoura-laguna',  2,'twilight',18,  97,null,false],
  ['vilamoura-laguna',  3,'twilight',18, 132,null,false],
  ['vilamoura-laguna',  4,'twilight',18, 132,null,false],
  ['vilamoura-laguna',  5,'twilight',18, 132,null,false],
  ['vilamoura-laguna',  6,'twilight',18, 107,null,false],
  ['vilamoura-laguna',  7,'twilight',18,  86,null,false],
  ['vilamoura-laguna',  8,'twilight',18,  86,null,false],
  ['vilamoura-laguna',  9,'twilight',18, 107,null,false],
  ['vilamoura-laguna', 10,'twilight',18, 118,null,false],
  ['vilamoura-laguna', 11,'twilight',18, 107,null,false],
  ['vilamoura-laguna', 12,'twilight',18,  86,null,false],

  // ── Vilamoura Millennium ──────────────────────────────────
  ['vilamoura-millennium',  1,'standard',18, 135, 60,false],
  ['vilamoura-millennium',  2,'standard',18, 135, 60,false],
  ['vilamoura-millennium',  3,'standard',18, 187, 60,false],
  ['vilamoura-millennium',  4,'standard',18, 187, 60,false],
  ['vilamoura-millennium',  5,'standard',18, 187, 60,false],
  ['vilamoura-millennium',  6,'standard',18, 153, 60,false],
  ['vilamoura-millennium',  7,'standard',18, 123, 60,false],
  ['vilamoura-millennium',  8,'standard',18, 123, 60,false],
  ['vilamoura-millennium',  9,'standard',18, 153, 60,false],
  ['vilamoura-millennium', 10,'standard',18, 170, 60,false],
  ['vilamoura-millennium', 11,'standard',18, 153, 60,false],
  ['vilamoura-millennium', 12,'standard',18, 123, 60,false],
  ['vilamoura-millennium',  1,'twilight',18,  97,null,false],
  ['vilamoura-millennium',  2,'twilight',18,  97,null,false],
  ['vilamoura-millennium',  3,'twilight',18, 132,null,false],
  ['vilamoura-millennium',  4,'twilight',18, 132,null,false],
  ['vilamoura-millennium',  5,'twilight',18, 132,null,false],
  ['vilamoura-millennium',  6,'twilight',18, 107,null,false],
  ['vilamoura-millennium',  7,'twilight',18,  87,null,false],
  ['vilamoura-millennium',  8,'twilight',18,  87,null,false],
  ['vilamoura-millennium',  9,'twilight',18, 107,null,false],
  ['vilamoura-millennium', 10,'twilight',18, 118,null,false],
  ['vilamoura-millennium', 11,'twilight',18, 107,null,false],
  ['vilamoura-millennium', 12,'twilight',18,  86,null,false],

  // ── Monte Rei (buggy included) ────────────────────────────
  ['monte-rei',  1,'standard',18, 242,null,true],
  ['monte-rei',  2,'standard',18, 242,null,true],
  ['monte-rei',  3,'standard',18, 298,null,true],
  ['monte-rei',  4,'standard',18, 298,null,true],
  ['monte-rei',  5,'standard',18, 298,null,true],
  ['monte-rei',  6,'standard',18, 255,null,true],
  ['monte-rei',  7,'standard',18, 240,null,true],
  ['monte-rei',  8,'standard',18, 240,null,true],
  ['monte-rei',  9,'standard',18, 255,null,true],
  ['monte-rei', 10,'standard',18, 255,null,true],
  ['monte-rei', 11,'standard',18, 255,null,true],
  ['monte-rei', 12,'standard',18, 230,null,true],

  // ── Palmares ─────────────────────────────────────────────
  ['palmares',  1,'standard',18, 138, 50,false],
  ['palmares',  2,'standard',18, 138, 50,false],
  ['palmares',  3,'standard',18, 183, 50,false],
  ['palmares',  4,'standard',18, 183, 50,false],
  ['palmares',  5,'standard',18, 183, 50,false],
  ['palmares',  6,'standard',18, 120, 50,false],
  ['palmares',  7,'standard',18, 120, 50,false],
  ['palmares',  8,'standard',18, 120, 50,false],
  ['palmares',  9,'standard',18, 159, 50,false],
  ['palmares', 10,'standard',18, 159, 50,false],
  ['palmares', 11,'standard',18, 159, 50,false],
  ['palmares', 12,'standard',18, 120, 50,false],
  ['palmares',  1,'twilight',18, 135,null,false],
  ['palmares',  2,'twilight',18, 135,null,false],
  ['palmares',  3,'twilight',18, 135,null,false],
  ['palmares',  4,'twilight',18, 135,null,false],
  ['palmares',  5,'twilight',18, 135,null,false],
  ['palmares',  6,'twilight',18, 117,null,false],
  ['palmares',  7,'twilight',18, 117,null,false],
  ['palmares',  8,'twilight',18, 117,null,false],
  ['palmares',  9,'twilight',18, 117,null,false],
  ['palmares', 10,'twilight',18, 117,null,false],
  ['palmares', 11,'twilight',18, 117,null,false],
  ['palmares', 12,'twilight',18, 117,null,false],

  // ── Pinheiros Altos ───────────────────────────────────────
  ['pinheiros-altos',  6,'standard',18, 108, 55,false],
  ['pinheiros-altos',  7,'standard',18,  99, 55,false],
  ['pinheiros-altos',  8,'standard',18,  99, 55,false],
  ['pinheiros-altos',  9,'standard',18,  99, 55,false],
  ['pinheiros-altos', 10,'standard',18, 122, 55,false],
  ['pinheiros-altos', 11,'standard',18, 122, 55,false],
  ['pinheiros-altos', 12,'standard',18,  99, 55,false],
  ['pinheiros-altos',  6,'twilight',18,  92,null,false],
  ['pinheiros-altos',  7,'twilight',18,  92,null,false],
  ['pinheiros-altos',  8,'twilight',18,  92,null,false],

  // ── Salgados ─────────────────────────────────────────────
  ['salgados',  6,'standard',18, 102,null,false],
  ['salgados',  7,'standard',18,  78,null,false],
  ['salgados',  8,'standard',18,  78,null,false],
  ['salgados',  9,'standard',18, 139,null,false],
  ['salgados', 10,'standard',18, 139,null,false],
  ['salgados', 11,'standard',18, 102,null,false],
  ['salgados', 12,'standard',18,  78,null,false],
  ['salgados',  6,'twilight',18,  67,null,false],
  ['salgados',  7,'twilight',18,  51,null,false],
  ['salgados',  8,'twilight',18,  51,null,false],
  ['salgados',  9,'twilight',18,  98,null,false],
  ['salgados', 10,'twilight',18,  98,null,false],
  ['salgados', 11,'twilight',18,  67,null,false],
  ['salgados', 12,'twilight',18,  51,null,false],

  // ── Boavista ─────────────────────────────────────────────
  ['boavista',  1,'standard',18,  73, 45,false],
  ['boavista',  2,'standard',18,  99, 45,false],
  ['boavista',  3,'standard',18, 107, 45,false],
  ['boavista',  4,'standard',18, 107, 45,false],
  ['boavista',  5,'standard',18,  99, 45,false],
  ['boavista',  6,'standard',18,  69, 45,false],
  ['boavista',  7,'standard',18,  69, 45,false],
  ['boavista',  8,'standard',18,  69, 45,false],
  ['boavista',  9,'standard',18,  93, 45,false],
  ['boavista', 10,'standard',18, 102, 45,false],
  ['boavista', 11,'standard',18,  99, 45,false],
  ['boavista', 12,'standard',18,  73, 45,false],

  // ── Alamos ───────────────────────────────────────────────
  ['alamos',  6,'standard',18,  94,null,false],
  ['alamos',  7,'standard',18,  78,null,false],
  ['alamos',  8,'standard',18,  78,null,false],
  ['alamos',  9,'standard',18, 119,null,false],
  ['alamos', 10,'standard',18, 119,null,false],
  ['alamos',  6,'twilight',18,  63,null,false],
  ['alamos',  7,'twilight',18,  63,null,false],
  ['alamos',  8,'twilight',18,  63,null,false],
  ['alamos',  9,'twilight',18,  63,null,false],
  ['alamos', 10,'twilight',18,  63,null,false],

  // ── Morgado ──────────────────────────────────────────────
  ['morgado',  6,'standard',18,  94,null,false],
  ['morgado',  7,'standard',18,  78,null,false],
  ['morgado',  8,'standard',18,  78,null,false],
  ['morgado',  9,'standard',18, 119,null,false],
  ['morgado', 10,'standard',18, 119,null,false],
  ['morgado',  6,'twilight',18,  63,null,false],
  ['morgado',  7,'twilight',18,  63,null,false],
  ['morgado',  8,'twilight',18,  63,null,false],
  ['morgado',  9,'twilight',18,  63,null,false],
  ['morgado', 10,'twilight',18,  63,null,false],

  // ── Vale do Lobo Royal ────────────────────────────────────
  ['vale-do-lobo-royal',  1,'standard',18, 116,null,false],
  ['vale-do-lobo-royal',  2,'standard',18, 116,null,false],
  ['vale-do-lobo-royal',  3,'standard',18, 154,null,false],
  ['vale-do-lobo-royal',  4,'standard',18, 171,null,false],
  ['vale-do-lobo-royal',  5,'standard',18, 171,null,false],
  ['vale-do-lobo-royal',  6,'standard',18, 128,null,false],
  ['vale-do-lobo-royal',  7,'standard',18, 121,null,false],
  ['vale-do-lobo-royal',  8,'standard',18, 121,null,false],
  ['vale-do-lobo-royal',  9,'standard',18, 150,null,false],
  ['vale-do-lobo-royal', 10,'standard',18, 177,null,false],
  ['vale-do-lobo-royal', 11,'standard',18, 154,null,false],
  ['vale-do-lobo-royal', 12,'standard',18, 116,null,false],
  ['vale-do-lobo-royal',  6,'twilight',18,  84,null,false],
  ['vale-do-lobo-royal',  7,'twilight',18,  80,null,false],
  ['vale-do-lobo-royal',  8,'twilight',18,  80,null,false],
  ['vale-do-lobo-royal',  9,'twilight',18,  88,null,false],
  ['vale-do-lobo-royal', 10,'twilight',18, 103,null,false],

  // ── Vale do Lobo Ocean ────────────────────────────────────
  ['vale-do-lobo-ocean',  1,'standard',18, 116,null,false],
  ['vale-do-lobo-ocean',  2,'standard',18, 116,null,false],
  ['vale-do-lobo-ocean',  3,'standard',18, 154,null,false],
  ['vale-do-lobo-ocean',  4,'standard',18, 171,null,false],
  ['vale-do-lobo-ocean',  5,'standard',18, 171,null,false],
  ['vale-do-lobo-ocean',  6,'standard',18, 128,null,false],
  ['vale-do-lobo-ocean',  7,'standard',18, 121,null,false],
  ['vale-do-lobo-ocean',  8,'standard',18, 121,null,false],
  ['vale-do-lobo-ocean',  9,'standard',18, 150,null,false],
  ['vale-do-lobo-ocean', 10,'standard',18, 177,null,false],
  ['vale-do-lobo-ocean', 11,'standard',18, 154,null,false],
  ['vale-do-lobo-ocean', 12,'standard',18, 116,null,false],
  ['vale-do-lobo-ocean',  6,'twilight',18,  84,null,false],
  ['vale-do-lobo-ocean',  7,'twilight',18,  80,null,false],
  ['vale-do-lobo-ocean',  8,'twilight',18,  80,null,false],
  ['vale-do-lobo-ocean',  9,'twilight',18,  88,null,false],
  ['vale-do-lobo-ocean', 10,'twilight',18, 103,null,false],

  // ── Vila Sol ─────────────────────────────────────────────
  ['vila-sol',  6,'standard',18, 105, 55,false],
  ['vila-sol',  7,'standard',18, 105, 55,false],
  ['vila-sol',  8,'standard',18, 105, 55,false],
  ['vila-sol',  9,'standard',18, 146, 55,false],
  ['vila-sol', 10,'standard',18, 161, 55,false],
  ['vila-sol',  6,'twilight',18,  60,null,false],
  ['vila-sol',  7,'twilight',18,  60,null,false],
  ['vila-sol',  8,'twilight',18,  60,null,false],
  ['vila-sol',  9,'twilight',18,  60,null,false],
  ['vila-sol', 10,'twilight',18,  60,null,false],

  // ── Penina Championship ───────────────────────────────────
  ['penina-championship',  6,'standard',18,  86, 55,false],
  ['penina-championship',  7,'standard',18,  77, 55,false],
  ['penina-championship',  8,'standard',18,  77, 55,false],
  ['penina-championship',  9,'standard',18,  77, 55,false],
  ['penina-championship', 10,'standard',18, 110, 55,false],
  ['penina-championship', 11,'standard',18,  86, 55,false],
  ['penina-championship', 12,'standard',18,  77, 55,false],
  ['penina-championship',  6,'twilight',18,  69,null,false],
  ['penina-championship',  7,'twilight',18,  69,null,false],
  ['penina-championship',  8,'twilight',18,  69,null,false],
  ['penina-championship',  9,'twilight',18,  69,null,false],
  ['penina-championship', 10,'twilight',18,  69,null,false],
  ['penina-championship', 11,'twilight',18,  69,null,false],
  ['penina-championship', 12,'twilight',18,  69,null,false],

  // ── Espiche ───────────────────────────────────────────────
  ['espiche',  1,'standard',18,  68, 41,false],
  ['espiche',  2,'standard',18,  68, 41,false],
  ['espiche',  3,'standard',18,  99, 41,false],
  ['espiche',  4,'standard',18,  99, 41,false],
  ['espiche',  5,'standard',18,  99, 41,false],
  ['espiche',  6,'standard',18,  65, 41,false],
  ['espiche',  7,'standard',18,  65, 41,false],
  ['espiche',  8,'standard',18,  65, 41,false],
  ['espiche',  9,'standard',18,  65, 41,false],
  ['espiche', 10,'standard',18,  90, 41,false],
  ['espiche', 11,'standard',18,  65, 41,false],
  ['espiche', 12,'standard',18,  65, 41,false],
  ['espiche',  1,'twilight',18,  54,null,false],
  ['espiche',  2,'twilight',18,  54,null,false],
  ['espiche',  3,'twilight',18,  79,null,false],
  ['espiche',  4,'twilight',18,  79,null,false],
  ['espiche',  5,'twilight',18,  79,null,false],
  ['espiche',  6,'twilight',18,  49,null,false],
  ['espiche',  7,'twilight',18,  49,null,false],
  ['espiche',  8,'twilight',18,  49,null,false],
  ['espiche',  9,'twilight',18,  49,null,false],
  ['espiche', 10,'twilight',18,  65,null,false],
  ['espiche', 11,'twilight',18,  49,null,false],
  ['espiche', 12,'twilight',18,  49,null,false],

  // ── Benamor ───────────────────────────────────────────────
  ['benamor',  6,'standard',18,  60, 40,false],
  ['benamor',  7,'standard',18,  60, 40,false],
  ['benamor',  8,'standard',18,  60, 40,false],
  ['benamor',  9,'standard',18, 105, 40,false],
  ['benamor', 10,'standard',18, 113, 48,false],
  ['benamor', 11,'standard',18, 113, 48,false],
  ['benamor', 12,'standard',18,  73, 40,false],
  ['benamor',  6,'twilight',18,  60,null,false],
  ['benamor',  7,'twilight',18,  60,null,false],
  ['benamor',  8,'twilight',18,  60,null,false],
  ['benamor',  9,'twilight',18,  60,null,false],

  // ── Castro Marim ─────────────────────────────────────────
  ['castro-marim',  1,'standard',18,  96, 45,false],
  ['castro-marim',  2,'standard',18,  96, 45,false],
  ['castro-marim',  3,'standard',18, 116, 45,false],
  ['castro-marim',  4,'standard',18, 116, 45,false],
  ['castro-marim',  5,'standard',18,  96, 45,false],
  ['castro-marim',  6,'standard',18,  80, 45,false],
  ['castro-marim',  7,'standard',18,  80, 45,false],
  ['castro-marim',  8,'standard',18,  80, 45,false],
  ['castro-marim',  9,'standard',18,  80, 45,false],
  ['castro-marim', 10,'standard',18, 104, 45,false],
  ['castro-marim', 11,'standard',18,  87, 45,false],
  ['castro-marim', 12,'standard',18,  87, 45,false],
  ['castro-marim',  6,'twilight',18,  62,null,false],
  ['castro-marim',  7,'twilight',18,  62,null,false],
  ['castro-marim',  8,'twilight',18,  62,null,false],
  ['castro-marim',  9,'twilight',18,  62,null,false],
  ['castro-marim', 10,'twilight',18,  81,null,false],
  ['castro-marim', 11,'twilight',18,  81,null,false],
  ['castro-marim', 12,'twilight',18,  77,null,false],

  // ── Quinta da Ria ─────────────────────────────────────────
  ['quinta-da-ria',  1,'standard',18, 105, 50,false],
  ['quinta-da-ria',  2,'standard',18, 130, 50,false],
  ['quinta-da-ria',  3,'standard',18, 150, 50,false],
  ['quinta-da-ria',  4,'standard',18, 150, 50,false],
  ['quinta-da-ria',  5,'standard',18, 150, 50,false],
  ['quinta-da-ria',  6,'standard',18, 100, 50,false],
  ['quinta-da-ria',  7,'standard',18, 100, 50,false],
  ['quinta-da-ria',  8,'standard',18, 100, 50,false],
  ['quinta-da-ria',  9,'standard',18, 130, 50,false],
  ['quinta-da-ria', 10,'standard',18, 145, 50,false],
  ['quinta-da-ria', 11,'standard',18, 145, 50,false],
  ['quinta-da-ria', 12,'standard',18, 100, 50,false],
  ['quinta-da-ria',  1,'twilight',18, 120,null,false],
  ['quinta-da-ria',  2,'twilight',18, 120,null,false],
  ['quinta-da-ria',  6,'twilight',18,  85,null,false],
  ['quinta-da-ria',  7,'twilight',18,  85,null,false],
  ['quinta-da-ria',  8,'twilight',18,  85,null,false],
  ['quinta-da-ria',  9,'twilight',18, 101,null,false],
  ['quinta-da-ria', 10,'twilight',18, 113,null,false],
  ['quinta-da-ria', 11,'twilight',18, 113,null,false],
  ['quinta-da-ria', 12,'twilight',18, 104,null,false],

  // ── Quinta de Cima ────────────────────────────────────────
  ['quinta-de-cima',  1,'standard',18, 105, 50,false],
  ['quinta-de-cima',  2,'standard',18, 130, 50,false],
  ['quinta-de-cima',  3,'standard',18, 150, 50,false],
  ['quinta-de-cima',  4,'standard',18, 150, 50,false],
  ['quinta-de-cima',  5,'standard',18, 150, 50,false],
  ['quinta-de-cima',  6,'standard',18, 100, 50,false],
  ['quinta-de-cima',  7,'standard',18, 100, 50,false],
  ['quinta-de-cima',  8,'standard',18, 100, 50,false],
  ['quinta-de-cima',  9,'standard',18, 130, 50,false],
  ['quinta-de-cima', 10,'standard',18, 145, 50,false],
  ['quinta-de-cima', 11,'standard',18, 145, 50,false],
  ['quinta-de-cima', 12,'standard',18, 100, 50,false],
  ['quinta-de-cima',  1,'twilight',18, 120,null,false],
  ['quinta-de-cima',  2,'twilight',18, 120,null,false],
  ['quinta-de-cima',  6,'twilight',18,  85,null,false],
  ['quinta-de-cima',  7,'twilight',18,  85,null,false],
  ['quinta-de-cima',  8,'twilight',18,  85,null,false],
  ['quinta-de-cima',  9,'twilight',18, 101,null,false],
  ['quinta-de-cima', 10,'twilight',18, 113,null,false],
  ['quinta-de-cima', 11,'twilight',18, 113,null,false],
  ['quinta-de-cima', 12,'twilight',18, 104,null,false],

  // ── Quinta do Vale ────────────────────────────────────────
  ['quinta-do-vale',  1,'standard',18,  68,null,false],
  ['quinta-do-vale',  2,'standard',18,  79,null,false],
  ['quinta-do-vale',  3,'standard',18,  99,null,false],
  ['quinta-do-vale',  4,'standard',18,  99,null,false],
  ['quinta-do-vale',  5,'standard',18,  99,null,false],
  ['quinta-do-vale',  6,'standard',18,  67,null,false],
  ['quinta-do-vale',  7,'standard',18,  67,null,false],
  ['quinta-do-vale',  8,'standard',18,  67,null,false],
  ['quinta-do-vale',  9,'standard',18,  75,null,false],
  ['quinta-do-vale', 10,'standard',18,  95,null,false],
  ['quinta-do-vale', 11,'standard',18,  95,null,false],
  ['quinta-do-vale', 12,'standard',18,  67,null,false],

  // ── Alto Golf ─────────────────────────────────────────────
  ['alto-golf',  6,'standard',18,  59, 55,false],
  ['alto-golf',  7,'standard',18,  59, 55,false],
  ['alto-golf',  8,'standard',18,  59, 55,false],
  ['alto-golf',  9,'standard',18,  88, 55,false],
  ['alto-golf', 10,'standard',18, 106, 55,false],
  ['alto-golf',  6,'twilight',18,  45,null,false],
  ['alto-golf',  7,'twilight',18,  45,null,false],
  ['alto-golf',  8,'twilight',18,  45,null,false],
  ['alto-golf',  9,'twilight',18,  45,null,false],
  ['alto-golf', 10,'twilight',18,  45,null,false],

  // ── Santo António ─────────────────────────────────────────
  ['santo-antonio',  6,'standard',18,  57,null,false],
  ['santo-antonio',  7,'standard',18,  57,null,false],
  ['santo-antonio',  8,'standard',18,  57,null,false],
  ['santo-antonio',  9,'standard',18,  68,null,false],
  ['santo-antonio', 10,'standard',18,  68,null,false],

  // ── Silves ────────────────────────────────────────────────
  ['silves',  6,'standard',18,  75, 55,false],
  ['silves',  7,'standard',18,  75, 55,false],
  ['silves',  8,'standard',18,  75, 55,false],
  ['silves',  9,'standard',18, 117, 55,false],
  ['silves', 10,'standard',18, 135, 55,false],
  ['silves',  6,'twilight',18,  50,null,false],
  ['silves',  7,'twilight',18,  50,null,false],
  ['silves',  8,'twilight',18,  50,null,false],
  ['silves',  9,'twilight',18,  50,null,false],
  ['silves', 10,'twilight',18,  50,null,false],

  // ── Gramacho ──────────────────────────────────────────────
  ['gramacho',  6,'standard',18,  75, 55,false],
  ['gramacho',  7,'standard',18,  75, 55,false],
  ['gramacho',  8,'standard',18,  75, 55,false],
  ['gramacho',  9,'standard',18, 117, 55,false],
  ['gramacho', 10,'standard',18, 135, 55,false],
  ['gramacho',  6,'twilight',18,  50,null,false],
  ['gramacho',  7,'twilight',18,  50,null,false],
  ['gramacho',  8,'twilight',18,  50,null,false],
  ['gramacho',  9,'twilight',18,  50,null,false],
  ['gramacho', 10,'twilight',18,  50,null,false],

  // ── Vale da Pinta ─────────────────────────────────────────
  ['vale-da-pinta',  6,'standard',18,  75, 55,false],
  ['vale-da-pinta',  7,'standard',18,  75, 55,false],
  ['vale-da-pinta',  8,'standard',18,  75, 55,false],
  ['vale-da-pinta',  9,'standard',18, 117, 55,false],
  ['vale-da-pinta', 10,'standard',18, 135, 55,false],
  ['vale-da-pinta',  6,'twilight',18,  50,null,false],
  ['vale-da-pinta',  7,'twilight',18,  50,null,false],
  ['vale-da-pinta',  8,'twilight',18,  50,null,false],
  ['vale-da-pinta',  9,'twilight',18,  50,null,false],
  ['vale-da-pinta', 10,'twilight',18,  50,null,false],

  // ── Pine Cliffs (9 holes) ─────────────────────────────────
  ['pine-cliffs',  6,'standard', 9,  54,null,false],
  ['pine-cliffs',  7,'standard', 9,  54,null,false],
  ['pine-cliffs',  8,'standard', 9,  54,null,false],
  ['pine-cliffs',  9,'standard', 9,  54,null,false],
  ['pine-cliffs', 10,'standard', 9,  66,null,false],
  ['pine-cliffs', 11,'standard', 9,  57,null,false],
  ['pine-cliffs', 12,'standard', 9,  57,null,false],

  // ── Balaia (9 holes, flat) ────────────────────────────────
  ['balaia',  1,'standard', 9,  45,null,false],
  ['balaia',  2,'standard', 9,  45,null,false],
  ['balaia',  3,'standard', 9,  45,null,false],
  ['balaia',  4,'standard', 9,  45,null,false],
  ['balaia',  5,'standard', 9,  45,null,false],
  ['balaia',  6,'standard', 9,  45,null,false],
  ['balaia',  7,'standard', 9,  45,null,false],
  ['balaia',  8,'standard', 9,  45,null,false],
  ['balaia',  9,'standard', 9,  45,null,false],
  ['balaia', 10,'standard', 9,  45,null,false],
  ['balaia', 11,'standard', 9,  45,null,false],
  ['balaia', 12,'standard', 9,  45,null,false],

  // ── Penina Resort (9 holes) ───────────────────────────────
  ['penina-resort',  6,'standard', 9,  28,null,false],
  ['penina-resort',  7,'standard', 9,  28,null,false],
  ['penina-resort',  8,'standard', 9,  28,null,false],
  ['penina-resort',  9,'standard', 9,  28,null,false],
  ['penina-resort', 10,'standard', 9,  29,null,false],
  ['penina-resort', 11,'standard', 9,  28,null,false],
  ['penina-resort', 12,'standard', 9,  28,null,false],

  // ── Amendoeira Faldo (twilight+buggy only) ────────────────
  ['amendoeira-faldo',  1,'twilight',18, 118,null,true],
  ['amendoeira-faldo',  2,'twilight',18, 127,null,true],
  ['amendoeira-faldo',  3,'twilight',18, 127,null,true],
  ['amendoeira-faldo',  4,'twilight',18, 127,null,true],
  ['amendoeira-faldo',  6,'twilight',18,  96,null,true],
  ['amendoeira-faldo',  7,'twilight',18,  96,null,true],
  ['amendoeira-faldo',  8,'twilight',18,  96,null,true],
  ['amendoeira-faldo',  9,'twilight',18, 107,null,true],
  ['amendoeira-faldo', 10,'twilight',18, 116,null,true],
  ['amendoeira-faldo', 11,'twilight',18, 118,null,true],
  ['amendoeira-faldo', 12,'twilight',18, 105,null,true],

  // ── Amendoeira O'Connor (twilight+buggy only) ─────────────
  ['amendoeira-oconnor',  1,'twilight',18, 118,null,true],
  ['amendoeira-oconnor',  2,'twilight',18, 127,null,true],
  ['amendoeira-oconnor',  3,'twilight',18, 127,null,true],
  ['amendoeira-oconnor',  4,'twilight',18, 127,null,true],
  ['amendoeira-oconnor',  6,'twilight',18,  96,null,true],
  ['amendoeira-oconnor',  7,'twilight',18,  96,null,true],
  ['amendoeira-oconnor',  8,'twilight',18,  96,null,true],
  ['amendoeira-oconnor',  9,'twilight',18, 107,null,true],
  ['amendoeira-oconnor', 10,'twilight',18, 116,null,true],
  ['amendoeira-oconnor', 11,'twilight',18, 118,null,true],
  ['amendoeira-oconnor', 12,'twilight',18, 105,null,true],

  // ── Ombria (twilight+buggy only, Jun–Sep) ─────────────────
  ['ombria',  6,'twilight',18, 131,null,true],
  ['ombria',  7,'twilight',18, 131,null,true],
  ['ombria',  8,'twilight',18, 131,null,true],
  ['ombria',  9,'twilight',18, 131,null,true],
]

async function main() {
  console.log(`Seeding ${RAW.length} price rows…`)

  // 1. Fetch all courses (id + slug)
  const { data: courses, error: cErr } = await supabase
    .from('courses')
    .select('id, slug')
  if (cErr) { console.error('Failed to fetch courses:', cErr.message); process.exit(1) }

  const slugToId = Object.fromEntries(courses.map(c => [c.slug, c.id]))

  // 2. Build rows, skipping unknown slugs
  const rows = []
  const missing = new Set()
  for (const [slug, month, time_slot, holes, price_eur, buggy_price, buggy_included] of RAW) {
    const course_id = slugToId[slug]
    if (!course_id) { missing.add(slug); continue }
    rows.push({ course_id, month, time_slot, holes, rate_type: 'visitor', price_eur, buggy_price, buggy_included })
  }
  if (missing.size) console.warn('Slugs not found in DB (skipped):', [...missing].join(', '))

  // 3. Insert in batches of 100
  let inserted = 0
  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('course_prices').insert(batch)
    if (error) { console.error(`Batch ${i}–${i+BATCH} failed:`, error.message); process.exit(1) }
    inserted += batch.length
    process.stdout.write(`\r  ${inserted}/${rows.length} rows inserted`)
  }
  console.log(`\n✓ Done — ${inserted} rows inserted.`)

  // 4. Update price_from on courses — min standard rate only (not twilight)
  const { data: standardPrices } = await supabase
    .from('course_prices')
    .select('course_id, price_eur')
    .eq('time_slot', 'standard')
  if (standardPrices) {
    const mins = {}
    for (const { course_id, price_eur } of standardPrices) {
      if (!mins[course_id] || price_eur < mins[course_id]) mins[course_id] = price_eur
    }
    let updated = 0
    for (const [course_id, price_from] of Object.entries(mins)) {
      const { error } = await supabase.from('courses').update({ price_from }).eq('id', course_id)
      if (!error) updated++
    }
    console.log(`✓ Updated price_from on ${updated} courses (standard rates only).`)
  }
}

main()
