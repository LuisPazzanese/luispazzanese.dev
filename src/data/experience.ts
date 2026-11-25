// Work and student organisations, newest first. One line each: what changed,
// for whom, with what. The site and the resume print the same line.

import type { L } from './localized';
import type { YearMonth } from './dates';

export interface Experience {
  id: string;
  org: string;
  orgHref?: string;
  role: L;
  start: YearMonth;
  end: YearMonth | 'present';
  line: L;
  stack: string[];
}

export const experience: Experience[] = [
  {
    id: 'sec',
    org: 'Insper SEC',
    role: { en: 'CTF competitor', pt: 'Competidor de CTF' },
    start: '2025-08',
    end: '2026-01',
    line: {
      en: 'Internal CTFs of Insper’s cybersecurity club: web exploitation (SQLi, XSS, SSRF) and crypto.',
      pt: 'CTFs internos do clube de cibersegurança do Insper: exploração web (SQLi, XSS, SSRF) e cripto.',
    },
    stack: [],
  },
  {
    id: 'zagros',
    org: 'Zagros Capital',
    orgHref: 'https://www.zagroscapital.com.br',
    role: { en: 'Technology intern', pt: 'Estagiário de tecnologia' },
    start: '2025-03',
    end: '2025-09',
    line: {
      en: 'Automated fund-report consolidation with Python scrapers and built the NAV dashboard used by the firm’s leadership.',
      pt: 'Automatizou a consolidação de informes de fundos com scrapers em Python e criou o painel de cotas usado pela diretoria.',
    },
    stack: ['Python', 'Streamlit', 'Excel'],
  },
];
