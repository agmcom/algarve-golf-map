"""Sunset and civil dusk (last usable light) times (local Portugal time) for Vilamoura, NOAA solar position algorithm.
Checked against timeanddate.com for spot dates. Writes sunset.json."""
import math, datetime, json, os
from zoneinfo import ZoneInfo
LAT, LNG = 37.08, -8.12   # Vilamoura, central Algarve
TZ = ZoneInfo('Europe/Lisbon')
def sunset(d, zenith=90.833):
    n = d.timetuple().tm_yday
    g = 2*math.pi/365*(n-1+0.5)
    eqt = 229.18*(0.000075+0.001868*math.cos(g)-0.032077*math.sin(g)-0.014615*math.cos(2*g)-0.040849*math.sin(2*g))
    decl = 0.006918-0.399912*math.cos(g)+0.070257*math.sin(g)-0.006758*math.cos(2*g)+0.000907*math.sin(2*g)-0.002697*math.cos(3*g)+0.00148*math.sin(3*g)
    lat = math.radians(LAT)
    ha = math.degrees(math.acos(math.cos(math.radians(zenith))/(math.cos(lat)*math.cos(decl))-math.tan(lat)*math.tan(decl)))
    utc_min = 720 - 4*(LNG - ha) - eqt
    t = datetime.datetime(d.year, d.month, d.day, tzinfo=datetime.timezone.utc) + datetime.timedelta(minutes=utc_min)
    return t.astimezone(TZ)
out = {}
for m in range(1, 13):
    for day in (1, 15):
        d = datetime.date(2027, m, day); s = sunset(d); c = sunset(d, 96)  # civil dusk: sun 6 degrees below horizon
        out[d.isoformat()] = {'sunset': s.strftime('%H:%M'), 'civil_dusk': c.strftime('%H:%M')}
        print(d, s.strftime('%H:%M'), c.strftime('%H:%M %Z'))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sunset.json'), 'w'), indent=1)
