import type { Translations } from './types';

// Português do Brasil. Termos técnicos (FreeRTOS, FPGA, VHDL) e nomes próprios
// ficam em inglês.

export const pt: Translations = {
  meta: {
    title: 'Luis Pazzanese · Sistemas embarcados e FPGA',
    description:
      'Luis Pazzanese, estudante de Engenharia da Computação no Insper: firmware em C com FreeRTOS, CPU MIPS e IP de motor de passo em VHDL, rede neural rodando num microcontrolador.',
    skipLink: 'Pular para os projetos',
  },
  sections: {
    projects: 'Projetos',
    more: 'Mais projetos',
    experience: 'Experiência',
    education: 'Formação',
    skills: 'Competências',
  },
  rows: {
    education: 'Formação',
    seeking: 'Busca',
    links: 'Links',
  },
  links: {
    resume: 'Currículo (PDF)',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'E-mail',
  },
  ui: {
    fig: 'FIG.',
    gradLabel: 'formatura',
    zoom: 'Abrir em tamanho real',
    close: 'Fechar',
    otherLang: 'English',
  },
  footer: 'Feito com Astro. Código no GitHub.',
  notFound: {
    heading: 'Página não encontrada',
    body: 'Este endereço não existe.',
    backHome: 'Voltar ao início',
  },
};
