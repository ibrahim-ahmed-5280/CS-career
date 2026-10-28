export const LANGS = ["en", "so", "ar"];

/* Value of a { en, so, ar } map in the asked language, English when it is missing. */
export function pick(map, lang) {
  if (!map) return undefined;
  const get = (k) => (map instanceof Map ? map.get(k) : map[k]);
  return get(lang) ?? get("en");
}

export function hasLang(map, lang) {
  return map instanceof Map ? map.has(lang) : Boolean(map && map[lang]);
}

export function langOf(req) {
  return LANGS.includes(req.query.lang) ? req.query.lang : "en";
}
