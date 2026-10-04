# GroupWhy
Type a number as written; see how 33 locales read it (group and decimal characters, resulting value or why it is invalid).
Static client-side app. Open `app.html`.
Data: separators from the runtime's Intl.NumberFormat formatToParts (ICU/CLDR of the viewing browser; Node 22.23 / ICU 78.3 / CLDR 48 in tests). No web page was read for this app; behaviour was checked against Babel.
Tests: `node test-engine.js`. 5000 generated strings written with each locale's own separators vs Python Babel 2.18.0 `parse_decimal` (`oracle.py`): 4342 strings in 29 locales agree (0 mismatches). The other 658 strings, in de-AT, de-CH, fr-CH and ar-EG, disagree because the two CLDR data sets use different group characters (ICU: NBSP for de-AT, ASCII apostrophe for de-CH and fr-CH, Arabic symbols for ar-EG; Babel: dot, U+2019, narrow NBSP, Latin symbols). A second set of 5000 arbitrary strings shows 399 differences, mostly because Babel is lenient (it keeps a literal "." as a decimal point in every locale and treats only the exact group character as a group); this app is strict.
Limits: no currency, percent or exponent; default digits only; the 33 locales were chosen by hand.
