// A string authored in both site languages. Content data (timeline, skills,
// profile) uses this instead of the i18n/{en,pt}.ts files so that one record
// holds everything about one fact — date, links, EN text, PT text — and the
// two languages can never drift apart.

import type { LangCode } from './i18n/types';

export interface L {
  en: string;
  pt: string;
}

export function pick(l: L, lang: LangCode): string {
  return l[lang];
}
