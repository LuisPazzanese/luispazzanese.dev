import type { Translations } from './types';

// Brazilian Portuguese. Technical terms (FreeRTOS, I2C, ARM, RP2350, etc.) and
// proper nouns (Insper, MIT NuVu, etc.) are intentionally kept in English.

export const pt: Translations = {
  meta: {
    title: 'Luis Pazzanese — Estudante de Engenharia da Computação · Embarcados, FPGA & Nuvem',
    description:
      'Luis Fernando Pazzanese Pinheiro, estudante de Engenharia da Computação no Insper — sistemas embarcados, hardware em FPGA/VHDL e infraestrutura em nuvem. Firmware para microcontroladores ARM, CPU MIPS em VHDL, ferramentas de automação que as pessoas usam.',
    skipLink: 'Pular para o conteúdo',
    langToggleAria: 'Trocar idioma',
  },
  nav: {
    primary: 'Principal',
  },
  hero: {
    eyebrow: 'luis@luispazzanese:~$ whoami',
    linkGithub: 'GitHub',
    linkLinkedin: 'LinkedIn',
    linkEmail: 'Email',
    linkCV: 'Currículo',
  },
  sections: {
    timeline: 'trajetória',
    archive: 'também no github',
    skills: 'habilidades',
    contact: 'contato',
  },
  ui: {
    alsoLabel: 'também',
    gradLabel: 'formatura',
    kind: {
      origin: 'origem',
      education: 'formação',
      club: 'entidade',
      work: 'trabalho',
      project: 'projeto',
      now: 'agora',
    },
  },
  contact: {
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    locationLabel: 'Localização',
    footer: 'feito com Astro + Three.js',
  },
  notFound: {
    code: '404',
    heading: 'Página não encontrada',
    body: 'A página que você está procurando não existe ou foi movida.',
    backHome: 'Voltar ao início',
    backHomeAria: 'Voltar para a página inicial',
  },
};
