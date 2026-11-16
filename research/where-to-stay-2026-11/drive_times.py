# Drive time from each "golf near <town>" centre to every course, Mapbox Directions
# (driving, no traffic), same source as scripts/build-faro-drive-times.mjs.
# Run from web/ with .env.local exported; writes drive-times.json next to this file.
import json, os, urllib.request
T=os.environ['NEXT_PUBLIC_MAPBOX_TOKEN']; U=os.environ['NEXT_PUBLIC_SUPABASE_URL']; K=os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
def get(url, h={}): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=h)))
courses=get(U+"/rest/v1/courses?select=slug,lat,lng&order=lng",{'apikey':K})
towns={"vilamoura":(37.0775,-8.1175),"almancil":(37.0862,-8.0300),"albufeira":(37.0887,-8.2503),"carvoeiro":(37.0965,-8.4722),"portimao":(37.1205,-8.5370),"lagos":(37.1025,-8.6735),"tavira":(37.1265,-7.6505)}
out={}
for t,(lat,lng) in towns.items():
    res={}
    for c in courses:
        r=get(f"https://api.mapbox.com/directions/v5/mapbox/driving/{lng},{lat};{c['lng']},{c['lat']}?overview=false&access_token="+T)['routes'][0]
        res[c['slug']]={'mins':round(r['duration']/60),'km':round(r['distance']/1000)}
    out[t]={'lat':lat,'lng':lng,'drive':res}
    print(t, sorted([(v['mins'],k) for k,v in res.items()])[:10])
json.dump(out,open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'drive-times.json'),'w'),indent=1)
