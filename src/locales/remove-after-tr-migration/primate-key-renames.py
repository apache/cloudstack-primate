#!/usr/bin/python3

import json

en = {}

with open('en.json', 'r') as f:
    en = json.load(f)

orgkeys = list(en.keys())
print('Total locale keys', len(en.keys()))

labelkeys = []
upperkeys = []

# migrations here
mg = {}

for key in en.keys():
    newkey = key.replace(' ', '.').replace('_', '.').lower()
    if not newkey.startswith('label') and not newkey.startswith('message'):
        newkey = 'label.' + newkey
    if newkey != key:
        mg[key] = newkey

for k in mg.keys():
    nk = mg[k]
    val = en[k]
    en[nk] = val
    en.pop(k)

# migrate those without label/message prefx
print('Total migrations are', len(mg.keys()))
print('Total keys after migration', len(en.keys()))

with open('migrate-primate-old-to-new-keys.json', 'w') as fout:
    json.dump(mg, fout, indent=0, sort_keys=True)

with open('en.json', 'w') as fout:
    json.dump(en, fout, indent=0, sort_keys=True)
