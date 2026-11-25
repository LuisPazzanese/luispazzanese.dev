// UI chrome per language, plus the two derived strings every surface needs
// (degree line and date ranges). Pages pick a language statically (`/` → pt,
// `/en/` → en) and pass it down as a prop. No client-side switching.

import { en } from './en';
import { pt } from './pt';
import type { LangCode, Translations } from './types';
import { pick } from '../localized';
import { profile } from '../profile';
import { currentSemester, formatMonth, ordinal } from '../dates';

export type { LangCode, Translations };

export const translations: Record<LangCode, Translations> = { en, pt };

/** "6º semestre" / "6th semester", computed at build time from profile.degree.anchor. */
export function semesterLabel(lang: LangCode, now?: Date): string {
  const n = currentSemester(profile.degree.anchor, now);
  return `${ordinal(n, lang)} ${lang === 'pt' ? 'semestre' : 'semester'}`;
}

/** "Engenharia da Computação, Insper · 6º semestre · formatura dez 2028". */
export function degreeLine(lang: LangCode): string {
  return [
    `${pick(profile.degree.title, lang)}, ${profile.degree.school}`,
    semesterLabel(lang),
    `${translations[lang].ui.gradLabel} ${formatMonth(profile.degree.graduation, lang)}`,
  ].join(' · ');
}
