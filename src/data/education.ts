// Degree, the courses that back the embedded/FPGA focus, and one line on what
// came before university. The full course list lives in the vault notes; the
// site shows only what a hiring manager for this role would look for.

import type { L } from './localized';

/** Courses that back the focus, in curriculum order. */
export const keyCourses: L[] = [
  { en: 'Elements of Computing Systems', pt: 'Elementos de Sistemas' },
  { en: 'Embedded Computing', pt: 'Computação Embarcada' },
  { en: 'Hardware-Software Systems', pt: 'Sistemas Hardware-Software' },
  { en: 'Computer Design', pt: 'Design de Computadores' },
  { en: 'Embedded Linux and SoC (elective)', pt: 'Embedded Linux and SoC (eletiva)' },
  { en: 'Cloud Computing', pt: 'Computação em Nuvem' },
];

export const beforeUniversity: L = {
  en: 'ITA-track class at Poliedro (1 year); exchange at CATS Cambridge, ELS Canada and MIT NuVu (2019).',
  pt: 'Turma ITA no Poliedro (1 ano); intercâmbio no CATS Cambridge, ELS Canadá e MIT NuVu (2019).',
};
