// Holiday availability on Golfmanager v2 booking pages (same method as research/prices-2026-10/gm2.js):
// opens each club's own public booking page for a date and reads the availability.json the page receives.
// Usage: node gm2_holiday.js <tenant> <area>
const puppeteer = require('/Users/guillermooliver/Projects/CC - Algarve Golf Map/web/node_modules/puppeteer');
const [tenant, area] = process.argv.slice(2);
const days = ['2026-12-18', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01'];
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const p = await b.newPage(); let latest = null;
  p.on('response', async r => { if (r.url().includes('availability.json')) latest = await r.json().catch(() => null) });
  const out = {};
  for (const day of days) {
    latest = null;
    try {
      await p.goto(`https://eu.golfmanager.com/${tenant}/consumer/book?area=${area}&date=${day}T00%3A00&lang=en`, { waitUntil: 'networkidle2', timeout: 60000 });
      for (let k = 0; k < 20 && !latest; k++) await new Promise(r => setTimeout(r, 250));
    } catch (e) { out[day] = 'error'; continue }
    const names = {};
    for (const it of (latest && latest.items) || []) {
      if (it.isExtra || !it.start || it.start.slice(0, 10) !== day) continue;
      const n = it.name.split('|')[0].trim().slice(0, 12); (names[n] ||= []).push(it.start.slice(11, 16));
    }
    out[day] = Object.fromEntries(Object.entries(names).map(([k, v]) => [k, [v.sort()[0], v.length]]));
  }
  console.log(JSON.stringify({ tenant, area, out }));
  await b.close();
})();
