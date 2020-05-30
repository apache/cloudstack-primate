#!/usr/bin/python3

import demjson
import json

cs = {}
pr = {}
tmap = {}

with open('cs/en.js', 'r') as f:
    cs = demjson.decode(f.read())

with open('en.json', 'r') as f:
    pr = json.load(f)

print('Total locale keys in CS', len(cs.keys()))
print('Total locale keys in Primate', len(pr.keys()))

# keys from cs locales
# skip is map of cs keys to list of primate keys
skip = {}
for k, v in cs.items():
    skip[k.lower()] = []
    for key, val in pr.items():
        if key.lower() == k.lower() or val.lower() == v.lower():
            skip[k.lower()].append(key.lower())

    if len(skip[k.lower()]) == 0:
        skip.pop(k.lower())

print('Total CS keys to be skipped while migration', len(skip.keys()))

# keys from primate locales
# map of primate keys to possible cs keys
tr = {}
for k, v in pr.items():
    tr[k] = []
    for key, val in cs.items():
        if val.lower() == v.lower():
            tr[k].append(key.lower())
    if len(tr[k]) == 0:
        tr.pop(k)

print('Total translation keys found from legacy to Primate', len(tr.keys()))

# start with primate, skip common and get from cs locales
merge = pr.copy()
for k, v in cs.items():
    if k.lower() in skip.keys():
        continue
    merge[k.lower()] = v

migkeys = merge.keys()
print('Total translation keys after migration', len(migkeys))

with open('out/en.json', 'w') as fout:
    json.dump(merge, fout, indent=0, sort_keys=True)

langs = ['ar', 'de_DE', 'es', 'hu', 'ja_JP', 'nb_NO', 'pl', 'ru_RU', 'ca', 'fr_FR', 'it_IT', 'ko_KR', 'nl_NL', 'pt_BR', 'zh_CN']

for lang in langs:
    print('Migrating language:', lang)
    l = {}
    with open('cs/' + lang + '.js', 'r') as f:
        l = demjson.decode(f.read())
    print('Keys found', len(l.keys()))

    lower = {}
    for k, v in l.items():
        lower[k.lower()] = v

    lout = {}
    for k, v in merge.items():
        value = v
        if k in lower.keys():
            value = lower[k]
        # search in tr (primate to cs key list)
        elif k in tr.keys() and tr[k][0] in lower.keys():
            value = lower[tr[k][0]]
        else:
            #print('translation not found for:', k)
            continue
        lout[k] = value
    print('Total lang keys translated are:', len(lout.keys()))
    with open('out/' + lang + '.json', 'w') as fout:
        json.dump(lout, fout, indent=0, sort_keys=True)

