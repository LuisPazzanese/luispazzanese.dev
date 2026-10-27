// The trajectory, oldest first. This is the single source of truth for the
// site's main section AND for the resume PDF (src/pages/resume/[lang].astro).
//
// How to add a node:
//   1. Append a TimelineNode below (keep `nodes` sorted by `start`).
//   2. Every bullet answers "accomplished X, measured by Y, by doing Z"; if
//      there is no number, say what changed for whom — never list duties.
//   3. Link something: a repo, a page, a writeup. `artifacts: []` is allowed
//      only for work that is genuinely private (say so in the summary).
//   4. `npm run build` fails if a node is malformed (see `validateTimeline`).
//
// Dates are 'YYYY-MM'. `end: 'present'` means ongoing; `end: null` means a
// single point in time.

import type { L } from './localized';
import { isYearMonth, type YearMonth } from './dates';
import { profile } from './profile';

export type NodeKind = 'origin' | 'education' | 'work' | 'project' | 'now';

export interface Artifact {
  href: string;
  label: L;
}

export interface ProjectRef {
  name: string;
  /** GitHub repo slug under profile.github, or null when there is no public repo. */
  repo: string | null;
  description: L;
  stack: string[];
  /** Featured projects render with their description; the rest render as a one-line list. */
  featured: boolean;
}

export interface TimelineNode {
  /** Stable id; used as the i18n key prefix `timeline.<id>.*` and as the DOM anchor. */
  id: string;
  kind: NodeKind;
  start: YearMonth;
  end: YearMonth | 'present' | null;
  /** Optional override for the rendered date, e.g. "until 2023" for the origin node. */
  dateLabel?: L;
  /** Organisation name; language-neutral. Omit for origin/now nodes. */
  org?: string;
  orgHref?: string;
  role: L;
  /** One or two sentences of context. `{semester}` is replaced by the computed current semester. */
  summary?: L;
  bullets: L[];
  projects?: ProjectRef[];
  artifacts: Artifact[];
  tags: string[];
}

export function repoHref(slug: string): string {
  return `${profile.github}/${slug}`;
}

export const nodes: TimelineNode[] = [
  {
    id: 'origin',
    kind: 'origin',
    start: '2023-01',
    end: '2023-12',
    dateLabel: { en: 'until 2023', pt: 'até 2023' },
    role: { en: 'Before university', pt: 'Antes da faculdade' },
    bullets: [
      {
        en:
          'Schooled partly abroad — CATS College Cambridge (UK, one high-school semester), ' +
          'ELS Language Centers (Canada) and the MIT NuVu Program (USA) — which is where the fluent English comes from.',
        pt:
          'Parte da formação escolar foi no exterior — CATS College Cambridge (Reino Unido, um semestre do ensino médio), ' +
          'ELS Language Centers (Canadá) e MIT NuVu Program (EUA) — de onde vem o inglês fluente.',
      },
      {
        en:
          'Spent a year in an ITA-track prep course — the competitive entrance track for Brazil’s top engineering schools — ' +
          'before joining Insper.',
        pt:
          'Passou um ano em um cursinho preparatório para o ITA — a trilha de vestibular mais competitiva de engenharia do país — ' +
          'antes de entrar no Insper.',
      },
    ],
    artifacts: [],
    tags: [],
  },

  {
    id: 'insper',
    kind: 'education',
    start: profile.degree.start,
    end: profile.degree.graduation,
    org: profile.degree.school,
    orgHref: profile.degree.schoolHref,
    role: profile.degree.title,
    summary: {
      en: 'Currently in the {semester} semester; expected graduation Dec 2028.',
      pt: 'Atualmente no {semester} semestre; formatura prevista para dez 2028.',
    },
    bullets: [
      {
        en:
          'Coursework that maps to the target roles: Embedded Systems, Computer Architecture, Software Design, ' +
          'Data Science, Agile Development, Calculus I–III, Physics I–III.',
        pt:
          'Disciplinas que mapeiam para as vagas-alvo: Sistemas Embarcados, Arquitetura de Computadores, Design de Software, ' +
          'Ciência de Dados, Desenvolvimento Ágil, Cálculo I–III, Física I–III.',
      },
      {
        en:
          'Top-ranked competitor in the internal CTFs of Insper SEC, the university’s cybersecurity club — ' +
          'mostly web exploitation (SQLi, XSS, SSRF), with some crypto and misc.',
        pt:
          'Competidor de destaque nos CTFs internos do Insper SEC, o clube de cibersegurança da faculdade — ' +
          'principalmente exploração web (SQLi, XSS, SSRF), com um pouco de cripto e misc.',
      },
    ],
    artifacts: [],
    tags: ['Insper', 'CTF'],
  },

  {
    id: 'zagros',
    kind: 'work',
    start: '2025-03',
    end: '2025-09',
    org: 'Zagros Capital',
    role: { en: 'Technology Intern (Back Office)', pt: 'Estagiário de Tecnologia (Back Office)' },
    summary: {
      en: 'Independent real estate asset manager with R$2B+ under management, São Paulo. Internal tooling; code is private.',
      pt: 'Gestora independente de ativos imobiliários com mais de R$2B sob gestão, São Paulo. Ferramentas internas; o código é privado.',
    },
    bullets: [
      {
        en:
          'Removed the manual consolidation of quarterly fund reports by writing Python scrapers that pull each report ' +
          'and merge its metrics into Excel sheets grouped by fund type (CRI-backed REITs, FIDCs and others).',
        pt:
          'Eliminou a consolidação manual dos informes trimestrais dos fundos com scrapers em Python que baixam cada ' +
          'informe e consolidam as métricas em planilhas Excel por tipo de fundo (FIIs de CRI, FIDCs e outros).',
      },
      {
        en:
          'Kept fund values current with zero manual steps: a Streamlit dashboard whose long-polling job captures the ' +
          'previous day’s NAV PDF every morning and updates the figures.',
        pt:
          'Manteve o valor das cotas sempre atualizado sem intervenção manual: um dashboard em Streamlit cujo job de ' +
          'long-polling captura o PDF da cota do dia anterior toda manhã e atualiza os números.',
      },
      {
        en:
          'Gave the team a single always-current view of holdings by building interactive per-asset charts and ' +
          'replicating them across the firm’s entire fund portfolio.',
        pt:
          'Deu ao time uma visão única e sempre atual das posições, com gráficos interativos por ativo replicados ' +
          'para toda a carteira de fundos da gestora.',
      },
    ],
    artifacts: [],
    tags: ['Python', 'Streamlit', 'web scraping', 'Excel'],
  },

  {
    id: 'embedded',
    kind: 'project',
    start: '2026-02',
    end: '2026-06',
    org: 'Insper · Raspberry Pi Pico 2 (RP2350)',
    role: {
      en: 'Embedded Systems — six open-source firmware projects',
      pt: 'Sistemas Embarcados — seis projetos de firmware open source',
    },
    summary: {
      en: 'Course projects on the RP2350 (dual Cortex-M33), all in C with the Pico SDK. The three below are the ones worth reading.',
      pt: 'Projetos da disciplina no RP2350 (dual Cortex-M33), todos em C com o Pico SDK. Os três abaixo são os que valem a leitura.',
    },
    bullets: [],
    projects: [
      {
        name: 'Air Mouse',
        repo: 'pico-mpu-rtos',
        featured: true,
        description: {
          en:
            'MPU6050 IMU sampled at 100 Hz over I2C, fused into orientation with the Madgwick-based Fusion AHRS and ' +
            'streamed as a 4-byte binary protocol to a Python host that moves the cursor. Four FreeRTOS tasks decoupled ' +
            'by three queues and one semaphore; a flick gesture clicks, with refractory-period debouncing.',
          pt:
            'IMU MPU6050 amostrada a 100 Hz via I2C, fundida em orientação com o AHRS Fusion (Madgwick) e enviada em um ' +
            'protocolo binário de 4 bytes para um host Python que move o cursor. Quatro tasks FreeRTOS desacopladas por ' +
            'três filas e um semáforo; um gesto de “flick” clica, com debounce por período refratário.',
        },
        stack: ['C', 'FreeRTOS', 'I2C', 'AHRS'],
      },
      {
        name: 'Touchscreen Stepper Controller',
        repo: 'pico-expert',
        featured: true,
        description: {
          en:
            'Custom ILI9341 240×320 TFT driver plus 4-wire resistive touch read through the ADC (64-sample averaging, ' +
            'pressure gate), driving a unipolar stepper in half-step mode with an animated direction indicator.',
          pt:
            'Driver próprio para TFT ILI9341 240×320 mais touch resistivo de 4 fios lido pelo ADC (média de 64 amostras, ' +
            'gate de pressão), controlando um motor de passo unipolar em meio-passo com indicador de direção animado.',
        },
        stack: ['C', 'SPI', 'ADC', 'GPIO'],
      },
      {
        name: 'Ultrasonic Ranger',
        repo: 'pico-timer',
        featured: true,
        description: {
          en:
            'HC-SR04 ranging that never blocks: trigger via SDK alarms, echo timed with rising/falling-edge GPIO IRQs ' +
            'and time_us_64(), a 50 ms watchdog alarm flags lost echoes, and the period is reconfigurable over a serial CLI.',
          pt:
            'Medição HC-SR04 sem bloquear: disparo por alarmes do SDK, eco cronometrado com IRQs de GPIO de borda e ' +
            'time_us_64(), alarme de watchdog de 50 ms sinaliza ecos perdidos, e o período é reconfigurável por CLI serial.',
        },
        stack: ['C', 'timers', 'GPIO IRQ'],
      },
      {
        name: 'RTOS Multi-task System',
        repo: 'pico-rtos-oled',
        featured: false,
        description: {
          en: 'Four FreeRTOS tasks synchronized via a binary-semaphore ring, output on an OLED.',
          pt: 'Quatro tasks FreeRTOS sincronizadas por um anel de semáforos binários, saída em OLED.',
        },
        stack: ['C', 'FreeRTOS', 'OLED'],
      },
      {
        name: 'ADC Pipeline',
        repo: 'pico-adc-pwm',
        featured: false,
        description: {
          en: 'FreeRTOS ADC-to-UART pipeline with an auto-grading rubric.',
          pt: 'Pipeline ADC-para-UART em FreeRTOS com rubrica de auto-correção.',
        },
        stack: ['C', 'FreeRTOS', 'ADC'],
      },
      {
        name: 'IRQ Buzzer',
        repo: 'pico-irq',
        featured: false,
        description: {
          en: 'IRQ-driven two-button buzzer tone generator with software debounce.',
          pt: 'Gerador de tons com dois botões via IRQ e debounce em software.',
        },
        stack: ['C', 'GPIO', 'IRQ'],
      },
    ],
    artifacts: [{ href: profile.github, label: { en: 'All repositories', pt: 'Todos os repositórios' } }],
    tags: ['C', 'FreeRTOS', 'RP2350', 'I2C', 'SPI', 'ADC'],
  },

  {
    id: 'mywispy',
    kind: 'project',
    start: '2026-05',
    end: 'present',
    org: 'mywispy.com',
    orgHref: 'https://mywispy.com',
    role: { en: 'This site and a browser CTF', pt: 'Este site e um CTF no navegador' },
    bullets: [
      {
        en:
          'Built this site with Astro and a Three.js PCB-trace hero, statically generated to Cloudflare Pages; ' +
          'the EN/PT content and the resume PDF are rendered from one data file.',
        pt:
          'Construiu este site com Astro e um hero de trilhas de PCB em Three.js, gerado estaticamente para o Cloudflare Pages; ' +
          'o conteúdo EN/PT e o PDF do currículo são renderizados a partir de um único arquivo de dados.',
      },
      {
        en:
          'Shipped /play, a four-level reverse-engineering challenge in a terminal UI — hidden files, base64, XOR and a ' +
          'final checker compiled from C to WebAssembly — with a Cloudflare Worker that validates flags, counts solvers ' +
          'in KV and rate-limits per IP.',
        pt:
          'Publicou o /play, um desafio de engenharia reversa em quatro níveis numa UI de terminal — arquivos ocultos, ' +
          'base64, XOR e um verificador final compilado de C para WebAssembly — com um Cloudflare Worker que valida flags, ' +
          'conta solvers em KV e limita requisições por IP.',
      },
    ],
    artifacts: [
      { href: '/play', label: { en: 'Play the CTF', pt: 'Jogar o CTF' } },
      { href: repoHref('mywispy.com'), label: { en: 'Source', pt: 'Código' } },
    ],
    tags: ['Astro', 'Three.js', 'WebAssembly', 'Cloudflare Workers'],
  },

  {
    id: 'now',
    kind: 'now',
    start: '2026-10',
    end: 'present',
    dateLabel: { en: 'now', pt: 'agora' },
    role: { en: 'Looking for an engineering internship', pt: 'Em busca de estágio em engenharia' },
    summary: {
      en: 'Embedded systems, hardware or cloud infrastructure. Available to start immediately, based in São Paulo.',
      pt: 'Sistemas embarcados, hardware ou infraestrutura em nuvem. Disponível para começar imediatamente, em São Paulo.',
    },
    bullets: [],
    artifacts: [{ href: `mailto:${profile.email}`, label: { en: 'Email me', pt: 'Me mande um email' } }],
    tags: [],
  },
];

/** Repos that are real but not part of the story. Rendered as a compact list after the timeline. */
export const archive: ProjectRef[] = [
  {
    name: 'Ninja Card Game',
    repo: 'pygame-ninja',
    featured: false,
    description: {
      en: 'State-machine card-matching reflex game.',
      pt: 'Jogo de reflexo de pareamento de cartas baseado em máquina de estados.',
    },
    stack: ['Python', 'Pygame'],
  },
  {
    name: 'Retro Gaming Console',
    repo: null,
    featured: false,
    description: {
      en: 'Batocera emulation setup on a Raspberry Pi 5.',
      pt: 'Setup de emulação Batocera em um Raspberry Pi 5.',
    },
    stack: ['Linux', 'Batocera'],
  },
];

/**
 * Build-time guard. Throws (and therefore fails `astro build`) when a node
 * would render something misleading: a missing/unsorted date, a project node
 * with no link, an empty node, or a bullet in only one language.
 */
export function validateTimeline(list: TimelineNode[] = nodes): void {
  const ids = new Set<string>();
  let prev: YearMonth | null = null;

  for (const n of list) {
    const where = `timeline node "${n.id}"`;
    if (ids.has(n.id)) throw new Error(`${where}: duplicate id`);
    ids.add(n.id);

    if (!isYearMonth(n.start)) throw new Error(`${where}: start must be YYYY-MM`);
    if (n.end !== null && n.end !== 'present' && !isYearMonth(n.end)) {
      throw new Error(`${where}: end must be YYYY-MM, 'present' or null`);
    }
    if (isYearMonth(n.end) && n.end < n.start) throw new Error(`${where}: end before start`);
    if (prev && n.start < prev) throw new Error(`${where}: nodes must be sorted by start`);
    prev = n.start;

    const hasContent = n.bullets.length > 0 || (n.projects?.length ?? 0) > 0 || n.summary;
    if (!hasContent) throw new Error(`${where}: needs a summary, bullets or projects`);
    if (n.bullets.length > 3) throw new Error(`${where}: max 3 bullets — cut, don't pile`);
    if (n.tags.length > 6) throw new Error(`${where}: max 6 tags`);

    const strings: L[] = [n.role, ...n.bullets, ...n.artifacts.map((a) => a.label)];
    if (n.summary) strings.push(n.summary);
    if (n.dateLabel) strings.push(n.dateLabel);
    for (const p of n.projects ?? []) strings.push(p.description);
    for (const s of strings) {
      if (!s.en?.trim() || !s.pt?.trim()) throw new Error(`${where}: every string needs both en and pt`);
    }

    if (n.kind === 'project') {
      const linked = n.artifacts.length > 0 || (n.projects ?? []).some((p) => p.repo);
      if (!linked) throw new Error(`${where}: project nodes must link to an artifact`);
    }
  }
}

validateTimeline();
