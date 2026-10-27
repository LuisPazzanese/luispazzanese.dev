// Skills, ordered by proficiency within each row and rows ordered by relevance
// to the target roles (embedded / security / low-level). Keep it short: a
// recruiter scans this, they don't read it. Values that are identical in both
// languages are plain strings; translated ones are L.

import type { L } from './localized';

export interface SkillRow {
  id: string;
  label: L;
  value: string | L;
}

export const skills: SkillRow[] = [
  {
    id: 'languages',
    label: { en: 'Languages', pt: 'Linguagens' },
    value: 'C · Python · x86 Assembly · JavaScript / TypeScript',
  },
  {
    id: 'embedded',
    label: { en: 'Embedded', pt: 'Embarcados' },
    value: 'RP2350 (ARM Cortex-M33) · FreeRTOS · Pico SDK · I2C · SPI · UART · ADC · PWM · GPIO IRQs · GDB',
  },
  {
    id: 'security',
    label: { en: 'Security', pt: 'Segurança' },
    value: {
      en: 'CTF web exploitation (SQLi, XSS, SSRF) · reverse engineering · Wireshark',
      pt: 'Exploração web em CTF (SQLi, XSS, SSRF) · engenharia reversa · Wireshark',
    },
  },
  {
    id: 'tools',
    label: { en: 'Tools & web', pt: 'Ferramentas & web' },
    value: 'Git · Linux · Python automation · Streamlit · Astro · WebAssembly · Cloudflare Workers',
  },
  {
    id: 'spoken',
    label: { en: 'Spoken', pt: 'Idiomas' },
    value: {
      en: 'Portuguese (native) · English (fluent — schooled in the UK and Canada)',
      pt: 'Português (nativo) · Inglês (fluente — estudou no Reino Unido e no Canadá)',
    },
  },
];
