// Keyword rows for recruiters and ATS filters, ordered by the target role
// (embedded / FPGA first). Only tools used in a project on this site.

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
    value: 'C · Python · VHDL · SQL · TypeScript',
  },
  {
    id: 'embedded',
    label: { en: 'Embedded', pt: 'Embarcados' },
    value: 'FreeRTOS · RP2350 (Cortex-M33) · I2C · SPI · UART · ADC/PWM',
  },
  {
    id: 'fpga',
    label: { en: 'FPGA', pt: 'FPGA' },
    value: 'Cyclone V · Quartus · ModelSim · cocotb · GHDL',
  },
  {
    id: 'tools',
    label: { en: 'Tools', pt: 'Ferramentas' },
    value: 'Linux · Git · GDB · Docker · AWS · Terraform',
  },
  {
    id: 'spoken',
    label: { en: 'Spoken', pt: 'Idiomas' },
    value: { en: 'Portuguese (native) · English (C1, TOEFL)', pt: 'Português (nativo) · inglês (C1, TOEFL)' },
  },
];
