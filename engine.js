(function (root) {
  'use strict';
  // Reads "1,234" the way each locale would, using the separators the runtime's Intl data (CLDR) gives for that locale.
  var LOCALES = ['en-US', 'en-GB', 'en-IN', 'de-DE', 'de-CH', 'de-AT', 'fr-FR', 'fr-CH', 'fr-CA', 'es-ES', 'es-MX', 'it-IT', 'pt-BR', 'pt-PT', 'nl-NL', 'sv-SE', 'nb-NO', 'da-DK', 'fi-FI', 'pl-PL', 'cs-CZ', 'ru-RU', 'uk-UA', 'tr-TR', 'el-GR', 'he-IL', 'ar-EG', 'hi-IN', 'ja-JP', 'zh-CN', 'ko-KR', 'id-ID', 'vi-VN'];
  var cache = {};
  function symbols(loc) {
    if (cache[loc]) return cache[loc];
    var nf = new Intl.NumberFormat(loc, { useGrouping: true, minimumFractionDigits: 1 });
    var parts = nf.formatToParts(-12345678.9), g = '', d = '', minus = '-';
    parts.forEach(function (p) { if (p.type === 'group') g = g || p.value; if (p.type === 'decimal') d = p.value; if (p.type === 'minusSign') minus = p.value; });
    var zero = nf.format(0).charAt(0), digits = {};
    var nf2 = new Intl.NumberFormat(loc, { useGrouping: false });
    for (var i = 0; i < 10; i++) digits[nf2.format(i)] = String(i);
    var ex = new Intl.NumberFormat(loc).format(1234.5), min = new Intl.NumberFormat(loc).format(1234).length === 4 || !/[^\p{Nd}]/u.test(new Intl.NumberFormat(loc).format(1234));
    return (cache[loc] = { group: g, decimal: d, minus: minus, digits: digits, example: ex, minGrouping2: min });
  }
  function isSpace(c) { return c === ' ' || c === '\u00a0' || c === '\u202f' || c === '\u2009'; }
  function sameGroup(c, g) { return c === g || (isSpace(c) && isSpace(g)) || ((c === "'" || c === '\u2019' || c === '\u02bc') && (g === "'" || g === '\u2019' || g === '\u02bc')); }
  function parse(str, loc) {
    var s = symbols(loc), t = String(str).trim(), out = '', seenDec = false, i, c;
    if (!t) return { ok: false, why: 'empty' };
    var sign = '';
    if (t[0] === '-' || t[0] === '+' || t[0] === s.minus) { sign = t[0] === '+' ? '' : '-'; t = t.slice(1); }
    for (i = 0; i < t.length; i++) {
      c = t[i];
      if (c >= '0' && c <= '9') out += c;
      else if (s.digits[c] !== undefined) out += s.digits[c];
      else if (c === s.decimal) { if (seenDec) return { ok: false, why: 'two decimal separators' }; seenDec = true; out += '.'; }
      else if (sameGroup(c, s.group)) { /* dropped */ }
      else return { ok: false, why: 'unexpected "' + c + '"' };
    }
    if (!/\d/.test(out)) return { ok: false, why: 'no digits' };
    return { ok: true, value: sign + out, group: s.group, decimal: s.decimal };
  }
  function all(str) { return LOCALES.map(function (l) { var r = parse(str, l); r.locale = l; return r; }); }
  function summary(str) {
    var by = {}; all(str).forEach(function (r) { var k = r.ok ? String(Number(r.value)) : 'invalid'; (by[k] = by[k] || []).push(r.locale); });
    return by;
  }
  var api = { LOCALES: LOCALES, symbols: symbols, parse: parse, all: all, summary: summary };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GroupWhy = api;
})(typeof window !== 'undefined' ? window : this);
