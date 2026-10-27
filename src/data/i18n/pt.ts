import type { Translations } from './types';

// Brazilian Portuguese. Technical terms (FreeRTOS, I2C, ARM, RP2350, etc.) and
// proper nouns (Insper, MIT NuVu, etc.) are intentionally kept in English.

export const pt: Translations = {
  meta: {
    title: 'Luis Pazzanese — Estudante de Engenharia da Computação · Embarcados, FPGA & Nuvem',
    description:
      'Luis Fernando Pazzanese Pinheiro, estudante de Engenharia da Computação no Insper — sistemas embarcados, hardware em FPGA/VHDL e infraestrutura em nuvem. Firmware para microcontroladores ARM, CPU MIPS em VHDL, ferramentas de automação que as pessoas usam.',
    skipLink: 'Pular para o conteúdo',
  },
  nav: {
    primary: 'Principal',
  },
  hero: {
    linkGithub: 'GitHub',
    linkLinkedin: 'LinkedIn',
    linkEmail: 'E-mail',
    linkCV: 'Baixar currículo (PDF)',
    photoAlt: 'Luis Pazzanese',
  },
  sections: {
    highlights: 'Destaques',
    timeline: 'Trajetória',
    archive: 'Também no GitHub',
    skills: 'Competências',
    contact: 'Contato',
  },
  ui: {
    alsoLabel: 'também',
    gradLabel: 'formatura',
    details: 'Detalhes técnicos',
    repoLabel: 'repositório',
    zoom: 'Abrir em tamanho real',
    kind: {
      origin: 'origem',
      education: 'formação',
      club: 'entidade',
      work: 'trabalho',
      project: 'projeto',
    },
  },
  contact: {
    emailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    githubLabel: 'GitHub',
    locationLabel: 'Localização',
    footer: 'feito com Astro, sem JavaScript',
    references: 'Referências sob consulta',
  },
  notFound: {
    code: '404',
    heading: 'Página não encontrada',
    body: 'A página que você está procurando não existe ou foi movida.',
    backHome: 'Voltar ao início',
    backHomeAria: 'Voltar para a página inicial',
  },
};
