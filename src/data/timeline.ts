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

export type NodeKind = 'origin' | 'education' | 'club' | 'work' | 'project' | 'now';

export interface Artifact {
  href: string;
  label: L;
}

export interface ProjectRef {
  name: string;
  /** GitHub repo slug under profile.github, or null when there is no public repo. */
  repo: string | null;
  description: L;
  /** One-line version for the PDF; same facts, fewer words. Falls back to `description`. */
  brief?: L;
  stack: string[];
  /** Featured projects render with their description; the rest render as a one-line list. */
  featured: boolean;
}

export interface Course {
  name: L;
  /** Backs the thesis: printed on the resume, full-contrast on the site. */
  highlight?: boolean;
}

export interface Term {
  /** e.g. '2026.2' */
  term: string;
  courses: Course[];
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
  /** Condensed bullets for the one-page PDF; same facts as `bullets`. Falls back to `bullets`. */
  brief?: L[];
  projects?: ProjectRef[];
  /** Curriculum by semester; only education nodes use it. */
  coursework?: Term[];
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
          'Studied abroad three times during the second year of high school (2019) — six months at CATS College Cambridge ' +
          '(UK), a month at ELS Language Centers (Canada) and a month at the MIT NuVu Program (USA), where I built a ' +
          'retractable helmet that shields the wearer from acid rain. That is where the English comes from.',
        pt:
          'Estudou fora três vezes durante o segundo ano do ensino médio (2019) — seis meses no CATS College Cambridge ' +
          '(Reino Unido), um mês no ELS Language Centers (Canadá) e um mês no MIT NuVu Program (EUA), onde construiu um ' +
          'capacete retrátil que protege da chuva ácida. É daí que vem o inglês.',
      },
      {
        en:
          'Spent a year in the ITA-track class at Poliedro (São José dos Campos) — the entrance track for Brazil’s ' +
          'most selective engineering school — before joining Insper.',
        pt:
          'Passou um ano na turma ITA do Poliedro (São José dos Campos) — a trilha de vestibular da escola de engenharia ' +
          'mais seletiva do país — antes de entrar no Insper.',
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
          'Six months in Insper SEC, the university’s cybersecurity club, competing in its internal CTFs to stay at the ' +
          'top of the scoreboard — mostly web exploitation (SQLi, XSS, SSRF), with some crypto and misc.',
        pt:
          'Seis meses no Insper SEC, o clube de cibersegurança da faculdade, competindo nos CTFs internos para se manter ' +
          'no topo do placar — principalmente exploração web (SQLi, XSS, SSRF), com um pouco de cripto e misc.',
      },
    ],
    // Standard curriculum (Quadro de Disciplinas 2026), one row per semester.
    // `highlight` marks the courses that back the thesis; the resume prints
    // only those, the site shows all of them with the rest dimmed.
    coursework: [
      {
        term: '2024.1',
        courses: [
          { name: { en: 'Software Design', pt: 'Design de Software' }, highlight: true },
          { name: { en: 'Instrumentation & Measurement', pt: 'Instrumentação e Medição' }, highlight: true },
          { name: { en: 'Modelling & Simulation of the Physical World', pt: 'Modelagem e Simulação do Mundo Físico' } },
          { name: { en: 'Product & Service Design', pt: 'Design de Produto e Serviço' } },
          { name: { en: 'Grand Challenges of Engineering', pt: 'Grandes Desafios da Engenharia' } },
        ],
      },
      {
        term: '2024.2',
        courses: [
          { name: { en: 'Electrical Drives', pt: 'Acionamentos Elétricos' }, highlight: true },
          { name: { en: 'Data Science', pt: 'Ciência dos Dados' }, highlight: true },
          { name: { en: 'Process Design', pt: 'Design de Processo' } },
          { name: { en: 'Physics of Motion', pt: 'Física do Movimento' } },
          { name: { en: 'Calculus of Variation', pt: 'Matemática da Variação' } },
        ],
      },
      {
        term: '2025.1',
        courses: [
          { name: { en: 'Elements of Computing Systems', pt: 'Elementos de Sistemas' }, highlight: true },
          { name: { en: 'Computational Robotics', pt: 'Robótica Computacional' }, highlight: true },
          { name: { en: 'Agile Collaborative Development', pt: 'Desenvolvimento Colaborativo Ágil' }, highlight: true },
          { name: { en: 'Multivariable Calculus', pt: 'Matemática Multivariada' } },
          { name: { en: 'Deconstructing Matter', pt: 'Desconstruindo a Matéria' } },
        ],
      },
      {
        term: '2025.2',
        courses: [
          { name: { en: 'Physical Layer of Computing', pt: 'Camada Física da Computação' }, highlight: true },
          { name: { en: 'Modelling & Control', pt: 'Modelagem e Controle' }, highlight: true },
          { name: { en: 'Web Technologies', pt: 'Tecnologias Web' }, highlight: true },
          { name: { en: 'Electromagnetism & Waves', pt: 'Eletromagnetismo e Ondulatória' } },
          { name: { en: 'Technology Entrepreneurship', pt: 'Empreendedorismo Tecnológico' } },
        ],
      },
      {
        term: '2026.1',
        courses: [
          { name: { en: 'Embedded Computing', pt: 'Computação Embarcada' }, highlight: true },
          { name: { en: 'Hardware-Software Systems', pt: 'Sistemas Hardware-Software' }, highlight: true },
          { name: { en: 'Programming Challenges', pt: 'Desafios de Programação' }, highlight: true },
          { name: { en: 'Heat Transfer & Solid Mechanics', pt: 'Transferências de Calor e Mecânica dos Sólidos' } },
          { name: { en: 'Technological & Environmental Chemistry', pt: 'Química Tecnológica e Ambiental' } },
        ],
      },
      {
        term: '2026.2',
        courses: [
          { name: { en: 'Computer Design', pt: 'Design de Computadores' }, highlight: true },
          { name: { en: 'Cloud Computing', pt: 'Computação em Nuvem' }, highlight: true },
          { name: { en: 'Embedded Linux and System on Chip (elective)', pt: 'Embedded Linux and System on Chip (eletiva)' }, highlight: true },
          { name: { en: 'Big Data', pt: 'Megadados' } },
          { name: { en: 'Social Networks', pt: 'Redes Sociais' } },
        ],
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
    orgHref: 'https://www.zagroscapital.com.br',
    role: { en: 'Technology Intern (Back Office)', pt: 'Estagiário de Tecnologia (Back Office)' },
    summary: {
      en:
        'Independent real estate asset manager in São Paulo, R$2B+ under management, with two listed funds (GGRC11, ZAGH11). ' +
        'Internship alongside the 3rd and 4th semesters; the code is internal.',
      pt:
        'Gestora independente de ativos imobiliários em São Paulo, mais de R$2B sob gestão, com dois fundos listados (GGRC11, ZAGH11). ' +
        'Estágio em paralelo ao 3º e 4º semestres; o código é interno.',
    },
    bullets: [
      {
        en:
          'Replaced the manual consolidation of fund reports with Python scrapers that pull every quarterly report ' +
          'since each fund’s inception and merge the metrics into Excel sheets grouped by fund type (CRI-backed REITs, FIDCs and others).',
        pt:
          'Substituiu a consolidação manual dos informes dos fundos por scrapers em Python que baixam todos os informes ' +
          'trimestrais desde a criação de cada fundo e consolidam as métricas em planilhas Excel por tipo de fundo (FIIs de CRI, FIDCs e outros).',
      },
      {
        en:
          'Built the Streamlit dashboard the firm’s president and vice-president used to follow fund values: a long-polling ' +
          'job captures the previous day’s NAV PDF every morning and updates the figures with no manual steps.',
        pt:
          'Construiu o dashboard em Streamlit que o presidente e o vice-presidente da gestora usavam para acompanhar as cotas: ' +
          'um job de long-polling captura o PDF da cota do dia anterior toda manhã e atualiza os números sem intervenção manual.',
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
    org: 'Insper',
    orgHref: profile.degree.schoolHref,
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
        brief: {
          en: 'MPU6050 at 100 Hz → Madgwick AHRS → cursor over a 4-byte serial protocol; 4 FreeRTOS tasks, 3 queues, 1 semaphore.',
          pt: 'MPU6050 a 100 Hz → AHRS Madgwick → cursor por protocolo serial de 4 bytes; 4 tasks FreeRTOS, 3 filas, 1 semáforo.',
        },
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
        brief: {
          en: 'Custom ILI9341 driver and resistive touch via ADC driving a half-step unipolar stepper with an animated UI.',
          pt: 'Driver ILI9341 próprio e touch resistivo via ADC controlando um motor de passo unipolar em meio-passo com UI animada.',
        },
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
        brief: {
          en: 'Non-blocking HC-SR04 ranging with SDK alarms and edge IRQs, 50 ms watchdog, serial CLI.',
          pt: 'Medição HC-SR04 sem bloqueio com alarmes do SDK e IRQs de borda, watchdog de 50 ms, CLI serial.',
        },
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
    id: 'site',
    kind: 'project',
    start: '2026-05',
    end: 'present',
    org: 'luispazzanese.dev',
    orgHref: 'https://luispazzanese.dev',
    role: { en: 'This site', pt: 'Este site' },
    brief: [
      {
        en: 'Astro + Three.js site on Cloudflare Pages; the EN/PT content and this PDF are rendered from one data file.',
        pt: 'Site em Astro + Three.js no Cloudflare Pages; o conteúdo EN/PT e este PDF são renderizados de um único arquivo de dados.',
      },
    ],
    bullets: [
      {
        en:
          'Built this site with Astro and a Three.js PCB-trace hero, statically generated to Cloudflare Pages; ' +
          'the EN/PT content and the resume PDF are rendered from one data file, so they can never disagree.',
        pt:
          'Construiu este site com Astro e um hero de trilhas de PCB em Three.js, gerado estaticamente para o Cloudflare Pages; ' +
          'o conteúdo EN/PT e o PDF do currículo são renderizados de um único arquivo de dados, então nunca divergem.',
      },
    ],
    artifacts: [{ href: repoHref('luispazzanese.dev'), label: { en: 'Source', pt: 'Código' } }],
    tags: ['Astro', 'Three.js', 'TypeScript', 'Cloudflare Pages'],
  },

  {
    id: 'hardware',
    kind: 'project',
    start: '2026-08',
    end: 'present',
    org: 'Insper',
    orgHref: profile.degree.schoolHref,
    role: { en: 'Hardware design and cloud infrastructure — in progress', pt: 'Projeto de hardware e infraestrutura em nuvem — em andamento' },
    summary: {
      en: 'Three things being built this semester. Repositories go public as each one reaches a working state.',
      pt: 'Três coisas sendo construídas neste semestre. Os repositórios ficam públicos conforme cada uma chega a um estado funcional.',
    },
    brief: [
      {
        en:
          'CPU in VHDL on an FPGA (Computer Design); bare-metal-to-AWS cloud course (MAAS, Juju, OpenStack, Kubernetes, ' +
          'Terraform) with a final project automated through CI/CD.',
        pt:
          'CPU em VHDL em FPGA (Design de Computadores); disciplina de nuvem do bare metal à AWS (MAAS, Juju, OpenStack, ' +
          'Kubernetes, Terraform) com projeto final automatizado via CI/CD.',
      },
      {
        en: 'Independent FPGA project: a Terasic Spider robot gaining a head with facial expressions and a spider-behaviour state machine.',
        pt: 'Projeto independente de FPGA: um robô Terasic Spider ganhando uma cabeça com expressões faciais e uma máquina de estados de comportamento de aranha.',
      },
    ],
    bullets: [
      {
        en: 'Designing a CPU in VHDL on an FPGA for the Computer Design course.',
        pt: 'Projetando uma CPU em VHDL em FPGA na disciplina de Design de Computadores.',
      },
      {
        en:
          'Building a cloud from bare metal in the Cloud Computing course — MAAS and Juju provisioning, an OpenStack private ' +
          'cloud, Docker/Kubernetes, then AWS (VPC, EC2, IAM, S3, Lambda); the group final project builds a scalable ' +
          'infrastructure by hand and then automates it with Terraform and CI/CD.',
        pt:
          'Montando uma nuvem do bare metal na disciplina de Computação em Nuvem — provisionamento com MAAS e Juju, nuvem ' +
          'privada OpenStack, Docker/Kubernetes e depois AWS (VPC, EC2, IAM, S3, Lambda); o projeto final em grupo constrói ' +
          'uma infraestrutura escalável à mão e depois a automatiza com Terraform e CI/CD.',
      },
      {
        en:
          'Independent FPGA project on a Terasic Spider robot, proposed by the lab professor: adding a head with facial ' +
          'expressions and a state machine that makes it behave like a spider. Early stage.',
        pt:
          'Projeto independente de FPGA com o robô Terasic Spider, proposto pelo professor do laboratório: adicionar uma cabeça ' +
          'com expressões faciais e uma máquina de estados que a faz se comportar como uma aranha. Fase inicial.',
      },
    ],
    artifacts: [],
    tags: ['VHDL', 'FPGA', 'OpenStack', 'AWS', 'Terraform', 'Embedded Linux'],
  },

  {
    id: 'now',
    kind: 'now',
    start: '2026-10',
    end: 'present',
    dateLabel: { en: 'now', pt: 'agora' },
    role: { en: 'Looking for an internship at a big tech company', pt: 'Em busca de estágio em uma big tech' },
    summary: {
      en:
        'Embedded, hardware, software or cloud engineering. 30 h/week during the semester (the standard São Paulo internship), ' +
        'available to start immediately, open to relocation.',
      pt:
        'Engenharia embarcada, de hardware, de software ou de nuvem. 30 h/semana durante o semestre (padrão de estágio em São Paulo), ' +
        'disponível para começar imediatamente, aberto a vagas fora do Brasil.',
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
    for (const p of n.projects ?? []) {
      strings.push(p.description);
      if (p.brief) strings.push(p.brief);
    }
    strings.push(...(n.brief ?? []));
    if ((n.brief?.length ?? 0) > 2) throw new Error(`${where}: brief is for the one-page PDF — max 2`);
    for (const term of n.coursework ?? []) for (const c of term.courses) strings.push(c.name);
    for (const s of strings) {
      if (!s.en?.trim() || !s.pt?.trim()) throw new Error(`${where}: every string needs both en and pt`);
    }

    // Finished project work must be verifiable. Ongoing work (end: 'present')
    // may be unlinked until the repo goes public — the summary should say so.
    if (n.kind === 'project' && n.end !== 'present') {
      const linked = n.artifacts.length > 0 || (n.projects ?? []).some((p) => p.repo);
      if (!linked) throw new Error(`${where}: finished project nodes must link to an artifact`);
    }
  }
}

validateTimeline();
