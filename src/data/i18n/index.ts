// Translations = UI chrome strings authored per language (en.ts / pt.ts)
//              + content strings derived from the data files (profile.ts,
//                timeline.ts, skills.ts), which hold both languages per record.
//
// The client-side switcher (scripts/i18n-client.ts) walks dotted keys such as
// `timeline.zagros.bullets.0` over the object built here, so content strings
// are addressable from markup exactly like chrome strings.

import { en } from './en';
import { pt } from './pt';
import type { LangCode, Translations } from './types';
import { pick } from '../localized';
import { profile } from '../profile';
import { nodes, archive } from '../timeline';
import { skills } from '../skills';
import { currentSemester, formatMonth, formatRange, ordinal } from '../dates';

export { en, pt };
export type { LangCode, Translations };

export interface TimelineNodeStrings {
  date: string;
  role: string;
  summary?: string;
  bullets: string[];
  artifacts: string[];
  /** keyed by repo slug (or project name when there is no repo) */
  projects: Record<string, string>;
  /** [termIndex][courseIndex], same order as the node's `coursework` */
  coursework: string[][];
}

export interface ContentStrings {
  profile: {
    headline: string;
    pitch: string;
    location: string;
    focus: string[];
    resumeHref: string;
    degreeTitle: string;
    /** e.g. "6th semester" / "6º semestre" */
    semester: string;
    /** Hero one-liner: "BSc in Computer Engineering · Insper · 6th semester · graduating Dec 2028". */
    degreeLine: string;
  };
  timeline: Record<string, TimelineNodeStrings>;
  archive: Record<string, string>;
  skills: Record<string, { label: string; value: string }>;
}

export type Strings = Translations & ContentStrings;

export function semesterLabel(lang: LangCode, now?: Date): string {
  const n = currentSemester(profile.degree.start, now);
  return `${ordinal(n, lang)} ${lang === 'pt' ? 'semestre' : 'semester'}`;
}

export function deriveContent(lang: LangCode): ContentStrings {
  const semester = ordinal(currentSemester(profile.degree.start), lang);
  const chrome = lang === 'pt' ? pt : en;

  const timeline: Record<string, TimelineNodeStrings> = {};
  for (const n of nodes) {
    const projects: Record<string, string> = {};
    for (const p of n.projects ?? []) projects[p.repo ?? p.name] = pick(p.description, lang);
    timeline[n.id] = {
      date: n.dateLabel ? pick(n.dateLabel, lang) : formatRange(n.start, n.end, lang),
      role: pick(n.role, lang),
      summary: n.summary ? pick(n.summary, lang).replace('{semester}', semester) : undefined,
      bullets: n.bullets.map((b) => pick(b, lang)),
      artifacts: n.artifacts.map((a) => pick(a.label, lang)),
      projects,
      coursework: (n.coursework ?? []).map((term) => term.courses.map((c) => pick(c.name, lang))),
    };
  }

  const archiveStrings: Record<string, string> = {};
  for (const p of archive) archiveStrings[p.repo ?? p.name] = pick(p.description, lang);

  const skillStrings: ContentStrings['skills'] = {};
  for (const s of skills) {
    skillStrings[s.id] = { label: pick(s.label, lang), value: typeof s.value === 'string' ? s.value : pick(s.value, lang) };
  }

  return {
    profile: {
      headline: pick(profile.headline, lang),
      pitch: pick(profile.pitch, lang),
      location: pick(profile.location, lang),
      focus: profile.focus.map((f) => pick(f, lang)),
      resumeHref: profile.resume[lang],
      degreeTitle: pick(profile.degree.title, lang),
      semester: semesterLabel(lang),
      degreeLine: [
        pick(profile.degree.title, lang),
        profile.degree.school,
        semesterLabel(lang),
        `${chrome.ui.gradLabel} ${formatMonth(profile.degree.graduation, lang)}`,
      ].join(' · '),
    },
    timeline,
    archive: archiveStrings,
    skills: skillStrings,
  };
}

export const translations: Record<LangCode, Strings> = {
  en: { ...en, ...deriveContent('en') },
  pt: { ...pt, ...deriveContent('pt') },
};

// Language the server renders into the static HTML (components import
// `translations.en`). Crawlers and no-JS visitors see this.
export const SSR_LANG: LangCode = 'en';

// Preference applied for first-time visitors with no stored choice. English:
// the audience is international recruiters; PT stays one click away.
export const DEFAULT_LANG: LangCode = 'en';

export function isLangCode(value: unknown): value is LangCode {
  return value === 'en' || value === 'pt';
}
