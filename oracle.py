import json, sys
from babel.numbers import parse_decimal, NumberFormatError
from babel import Locale
out = []
for s, loc in json.load(sys.stdin):
    try:
        v = parse_decimal(s, locale=loc.replace('-', '_'), strict=False)
        out.append(['ok', format(v, 'f')])
    except Exception as e:
        out.append(['err', type(e).__name__])
json.dump(out, sys.stdout)
