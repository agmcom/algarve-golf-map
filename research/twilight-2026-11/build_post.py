# "Twilight golf in the Algarve" (topic #45). Sources checked 17-18 Nov 2026:
# - Pestana Golf price list (pestanagolf.com/pt-pt/precario, 18 Nov 2026): twilight times + prices, twilight buggy €40,
#   NEW standard rates (raised since our 26 Oct check): Gramacho/V.Pinta/Silves 155/95/180, Alto 115/75/140, Vila Sol 195/140/215, Ferragudo 200/130/230
# - Santo António official 2026 rates (already in our price data): twilight from 13:30, €35
# - Benamor official green-fees page: internet afternoon rate €59 in low season (Dec-Jan, Jun-Aug), from 13:04 / 14:00
# - Vale do Lobo official golf page: 'Twilight & Sunset Schedules' (sources/valedolobo-golf.html), confirmed by the
#   club's own booking engine samples (research/prices-2026-10/raw/gm2_valedolobo_1.json)
# - Vale do Lobo booking conditions (valedolobo.golfmanager.com/system/page/condicoes): 'play a round in 4 hours and 30 minutes, or less'
# - Club booking engines: Salgados + Espiche (probe-salgados-espiche.log), Monte Rei (raw/gm2_monterei_1.json)
# - Penina 2024/25 visitors price list (sources/penina-2024-25-visitors.pdf): 'Twilight Green Fee after 14:30'. Expired; hedged.
# - Sunset/civil dusk: sunset.py (NOAA algorithm, checked against timeanddate.com Faro, Dec 2026)
# Excluded: Ombria (online twilight dearer than standard), Morgado/Alamos (twilight seen on too few dates).
import json, os, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda t: {'type': 'paragraph', 'text': t}
H2 = lambda t: {'type': 'heading', 'level': 2, 'text': t}
H3 = lambda t: {'type': 'heading', 'level': 3, 'text': t}
card = lambda s: {'type': 'card', 'refType': 'course', 'slug': s, 'withPhoto': True}

sun = json.load(open(os.path.join(HERE, 'sunset.json')))
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
def latest(dusk):  # last tee time for 18 holes in 4h30 before last light, rounded down to 5 min
    t = datetime.datetime.strptime(dusk, '%H:%M') - datetime.timedelta(hours=4, minutes=30)
    return f'{t.hour:02d}:{t.minute - t.minute % 5:02d}'
light_rows = []
for i, m in enumerate(MONTHS, 1):
    s = sun[f'2027-{i:02d}-15']
    light_rows.append([m, s['sunset'], s['civil_dusk'], latest(s['civil_dusk'])])

c = []
c.append(P("Twilight golf means booking a late tee time for a cheaper green fee. In the Algarve, twilight rates start between about **1pm and 4pm**, depending on the course and the time of year, and they can cost less than half the standard price: **€35 at Santo António**, **€50 at Alto Golf** and **€60 at Vila Sol**, against €140 or more for a standard round at Vila Sol. The catch is daylight. From **April to September** you have time for 18 holes. From **November to February** the sun sets between about 5.15pm and 6.15pm, and a tee time much after 1pm won't get you round 18 holes before dark."))

c.append(H2("When does twilight start, and what does it cost?"))
c.append(P("These are examples from each club's official price list or its own online booking, not a full list of every course with a twilight rate. Some clubs change the start time through the year, others keep one time all year."))
c.append({'type': 'table', 'caption': 'Twilight green fees for 18 holes',
  'headers': ['Course', 'Twilight from', 'Twilight price', 'Standard round'],
  'rows': [
    ['[Santo António](/courses/santo-antonio/green-fees)', '1.30pm', '**€35**', '€57–€68'],
    ['[Alto Golf](/courses/alto-golf/green-fees)', '3pm', '**€50**', '€75–€140'],
    ['[Gramacho](/courses/gramacho/green-fees) and [Vale da Pinta](/courses/vale-da-pinta/green-fees)', '3.30pm', '**€55**', '€95–€180'],
    ['[Silves](/courses/silves/green-fees)', '3.30pm', '**€55**', '€95–€180'],
    ['[Vila Sol](/courses/vila-sol/green-fees)', '3.30pm', '**€60**', '€140–€215'],
    ['[Pestana Ferragudo](/courses/pestana-ferragudo/green-fees)', '1.30pm', '**€80**', '€130–€230'],
    ['[Benamor](/courses/benamor/green-fees)', 'About 1pm or 2pm', '**€59** (December, January and June to August only)', '€66–€103'],
    ['[Espiche](/courses/espiche/green-fees)', '2pm in winter, 3.30pm from spring', '€49–€79', '€65–€99'],
    ['[Salgados](/courses/salgados/green-fees)', 'About 1.30pm in winter, 4pm in summer', '€47–€99', '€78–€139'],
    ['[Vale do Lobo](/courses/vale-do-lobo-royal/green-fees) (Royal and Ocean)', '1pm in winter, 3pm to 3.30pm the rest of the year', '€76–€101 online', '€116–€171 online'],
    ['[Monte Rei](/courses/monte-rei/green-fees)', '1pm to 3pm, by season', '€195–€240', '€190–€312'],
  ],
  'note': 'Sources: Pestana Golf price list (checked 18 November 2026); Santo António 2026 rates; Benamor internet rates; Vale do Lobo Twilight & Sunset schedule; online booking at Espiche, Salgados, Vale do Lobo and Monte Rei, sampled October and November 2026. Standard round = lowest visitor price for 18 holes across the year. Prices change, and clubs that sell online adjust them day by day.'})
c.append(P("Pestana lists a single twilight time and price for each of its courses, with no seasonal change. Its twilight buggy costs €40. At Vale do Lobo the twilight start moves through the year: **1pm from mid-November to January**, 1.30pm in February, 2pm in March, 3.30pm from the end of March to 20 May, 3pm from late May to mid-September, 3.30pm again until late October and 2pm until mid-November. Vale do Lobo also sells a later **Sunset** rate, from 3pm in winter, rising to 5pm from April to late October, at the same price as twilight."))
c.append(P("Penina's last published visitor price list, for 2024/25, had a twilight green fee after 2.30pm. The club hasn't published a newer one, so ask Penina for the current rate."))

c.append(H2("Can you finish 18 holes?"))
c.append(P("Vale do Lobo, for example, asks golfers to play 18 holes in **4 hours 30 minutes or less**. Counting back 4 hours 30 minutes from last light (the end of civil twilight, about half an hour after sunset) gives the latest tee time that still lets you finish a full round:"))
c.append({'type': 'table', 'caption': 'Daylight for a twilight round, central Algarve (mid-month)',
  'headers': ['Month', 'Sunset', 'Last light', 'Latest tee time for 18 holes'],
  'rows': light_rows,
  'note': 'Calculated for Vilamoura on the 15th of each month, Portugal time. The clocks go forward on the last Sunday of March and back on the last Sunday of October, so light ends about an hour earlier in late October than in mid-October. The west and east of the Algarve differ by only a few minutes.'})
c.append(P("**April to September:** easy. Twilight usually starts between 3pm and 4pm and there is light until 8pm or later, enough for a full round at a normal pace."))
c.append(P("**March and October:** usually fine if you take one of the first twilight tee times. Watch the last week of October, when the clocks go back and last light comes about an hour earlier."))
c.append(P("**November to February:** be careful. Last light is around 5.45–6.40pm, so you need to tee off by about 1.15pm in December and 2pm in February. At Vale do Lobo, where twilight starts at 1pm in midwinter, the first slot leaves just enough light for 18 holes at a steady pace. With a 1.30pm start, as at Santo António and Pestana Ferragudo, you have about four and a quarter hours in December, so you'll need to play quickly. A 3.30pm twilight tee time in winter leaves about two and a half hours of light: enough for nine holes or a few more, not a full round. If that is all you want, it is still cheap golf, but book it knowing you won't finish."))

c.append(H2("Where the saving is biggest"))
c.append(P("At Pestana's courses the twilight price stays the same all year while the standard rate rises in spring and autumn, so twilight saves most in **March, April and October**, Pestana's premium months. At Vila Sol, for example, a twilight round is €60 against €215 for a standard round in those months. In December or January the gap is smaller: Alto Golf is €75 for a standard round and €50 at twilight."))
c.append(P("At clubs with dynamic pricing the saving follows the season too. On the dates we checked, Salgados charged €47 at twilight against €78 for a standard round in January, July and August, and €99 against €139 in spring and autumn. Monte Rei is the exception: its twilight round saved €48–€72 in spring and summer, but in November the twilight rate was €5 more than the standard one. Benamor's afternoon rate only applies in its low season and saves €7."))
c.append(card('vila-sol'))
c.append(card('salgados'))
c.append(card('santo-antonio'))

c.append(H2("Tips for booking a twilight tee time"))
c.append(P("**Check the start time when you book.** Twilight times change through the year at many clubs, and the price list doesn't always say so. The booking engine only shows the twilight price from the right time onwards."))
c.append(P("**Take the first twilight slot in winter.** In December, every half hour later is a few holes you may not finish."))
c.append(P("**Consider a buggy.** On a hilly course a buggy helps you keep up and finish before dark. Pestana's twilight buggy is €40, cheaper than its standard €55."))
c.append(P("**Use it on the day you arrive.** A twilight round on the afternoon you land turns a two-round weekend into three. See our [golf weekend guide](/guide/golf-weekend-in-the-algarve)."))
c.append(P("**Not every club sells twilight online.** On the dates we checked, the Vilamoura courses run by Dom Pedro, the Quinta do Lago courses, Palmares and Boavista showed no twilight rate in their own online booking. Some may still offer late-afternoon prices by phone or at the desk, so ask. For more ways to save, see [the cheapest golf courses in the Algarve](/guide/the-cheapest-golf-courses-in-the-algarve) and [how to book tee times](/guide/how-to-book-tee-times-in-the-algarve)."))
c.append(P("Want to play after dark instead? See [night golf in the Algarve](/guide/night-golf-in-the-algarve)."))

c.append(H2("Frequently asked questions"))
c.append(H3("What time does twilight golf start in the Algarve?"))
c.append(P("Between about 1pm and 4pm, depending on the course and the season. In winter some clubs start twilight at 1pm or 1.30pm; in summer it is usually 3pm to 4pm. Pestana's courses keep the same time all year: 1.30pm at Ferragudo, 3pm at Alto Golf and 3.30pm at Gramacho, Vale da Pinta, Silves and Vila Sol."))
c.append(H3("Can I play 18 holes on a twilight round in winter?"))
c.append(P("Only with an early twilight tee time. In December last light is around 5.45pm, so you need to start by about 1.15pm to play 18 holes in four and a half hours. From April to September there is plenty of light for a full round."))
c.append(H3("Where is the cheapest twilight golf in the Algarve?"))
c.append(P("Among the courses we checked, Santo António near Salema at €35, then Alto Golf at €50 and Pestana's Gramacho, Vale da Pinta and Silves courses at €55. Salgados and Espiche can be cheaper on some dates, as their online prices change with the season."))

json.dump(c, open(os.path.join(HERE, 'content.json'), 'w'), ensure_ascii=False, indent=1)
print(len(c), 'blocks'); [print(r) for r in light_rows]
