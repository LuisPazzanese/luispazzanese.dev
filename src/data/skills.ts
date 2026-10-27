// Five short rows in the words recruiters and ATS filters search for. Each
// value is a plain list; keep it to one line on a phone. Rows ordered by
// relevance to the roles being targeted (embedded / hardware / cloud / AI).

import type { L } from './localized';

export interface SkillRow {
  id: string;
  label: L;
  value: string | L;
}

export const skills: SkillRow[] = [
  {
    id: 'programming',
    label: { en: 'Programming', pt: 'Programação' },
    value: 'Python · C · TypeScript · Git · Linux',
  },
  {
    id: 'hardware',
    label: { en: 'Hardware', pt: 'Hardware' },
    value: { en: 'VHDL · FPGA · ARM microcontrollers · FreeRTOS', pt: 'VHDL · FPGA · microcontroladores ARM · FreeRTOS' },
  },
  {
    id: 'cloud',
    label: { en: 'Cloud', pt: 'Nuvem' },
    value: 'AWS · OpenStack · Docker · Kubernetes · Terraform',
  },
  {
    id: 'ai',
    label: { en: 'AI', pt: 'IA' },
    value: {
      en: 'LLM applications (Anthropic API) · AI-assisted development (Claude Code)',
      pt: 'Aplicações com LLM (API da Anthropic) · desenvolvimento assistido por IA (Claude Code)',
    },
  },
  {
    id: 'languages',
    label: { en: 'Languages', pt: 'Idiomas' },
    value: { en: 'Portuguese (native) · English (C1, TOEFL)', pt: 'Português (nativo) · Inglês (C1, TOEFL)' },
  },
];
