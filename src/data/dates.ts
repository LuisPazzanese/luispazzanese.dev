// Date helpers for the timeline. All dates in data files are ISO 'YYYY-MM'
// strings so they sort lexicographically and never need a Date object.

import type { LangCode } from './i18n/types';

/** 'YYYY-MM' */
export type YearMonth = `${number}-${number}`;

const MONTHS: Record<LangCode, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
};

const PRESENT: Record<LangCode, string> = { en: 'present', pt: 'atual' };

export const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isYearMonth(value: unknown): value is YearMonth {
  return typeof value === 'string' && YEAR_MONTH_RE.test(value);
}

/** '2025-03' → 'Mar 2025' / 'mar 2025'. */
export function formatMonth(ym: YearMonth, lang: LangCode): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[lang][Number(m) - 1]} ${y}`;
}

/**
 * Range label. Same-year ranges collapse the first year ('Feb — Jun 2026');
 * `end === 'present'` renders as 'present' / 'atual'; `end === null` is a
 * point in time and renders only the start.
 */
export function formatRange(
  start: YearMonth,
  end: YearMonth | 'present' | null,
  lang: LangCode,
): string {
  if (end === null) return formatMonth(start, lang);
  if (end === 'present') return `${formatMonth(start, lang)} — ${PRESENT[lang]}`;
  const [sy, sm] = start.split('-');
  const [ey] = end.split('-');
  if (sy === ey) {
    return `${MONTHS[lang][Number(sm) - 1]} — ${formatMonth(end, lang)}`;
  }
  return `${formatMonth(start, lang)} — ${formatMonth(end, lang)}`;
}

/**
 * Which curriculum period the student is in now, counted forward from a known
 * anchor (`anchor.term` was period `anchor.period`). Semesters: Feb–Jul (.1),
 * Aug–Jan (.2). Anchored rather than derived from the entry date because
 * enrolment and curriculum position can drift apart (lighter semesters).
 * Computed at build time so the site never says a stale "5th semester".
 */
export function currentSemester(
  anchor: { term: YearMonth; period: number },
  now: Date = new Date(),
): number {
  const [ay, am] = anchor.term.split('-').map(Number);
  const anchorIndex = ay * 2 + (am >= 8 ? 1 : 0);
  const nowIndex = now.getFullYear() * 2 + (now.getMonth() + 1 >= 8 ? 1 : 0);
  return anchor.period + (nowIndex - anchorIndex);
}

/** Ordinal suffix for the semester number: '6th' / '6º'. */
export function ordinal(n: number, lang: LangCode): string {
  if (lang === 'pt') return `${n}º`;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
