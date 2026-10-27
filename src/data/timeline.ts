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

/** A photo or clip under public/media/ (see public/media/README.md for the expected filenames). */
export interface Media {
  /** Path under /media/, e.g. '/media/nuvu-helmet.jpg'. Items whose file is missing at build time are skipped. */
  src: string;
  kind: 'image' | 'video';
  alt: L;
  /** Still frame shown before a video is played. */
  poster?: string;
}

export interface TimelineNode {
  /** Stable id; used as the i18n key prefix `timeline.<id>.*` and as the DOM anchor. */
  id: string;
  kind: NodeKind;
  start: YearMonth;
  end: YearMonth | 'present' | null;
  /** Set to false to keep a node off the one-page PDF. Defaults to true. */
  resume?: boolean;
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
  /** Photos/clips rendered under the summary. Only files that exist at build time are shown. */
  media?: Media[];
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
    media: [
      {
        src: '/media/nuvu-helmet.jpg',
        kind: 'image',
        alt: { en: 'Retractable acid-rain helmet built at MIT NuVu', pt: 'Capacete retrátil contra chuva ácida feito no MIT NuVu' },
      },
      { src: '/media/cats-cambridge.jpg', kind: 'image', alt: { en: 'CATS College Cambridge, 2019', pt: 'CATS College Cambridge, 2019' } },
      { src: '/media/els-canada.jpg', kind: 'image', alt: { en: 'ELS Language Centers, Canada', pt: 'ELS Language Centers, Canadá' } },
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
    bullets: [],
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
        'Internship alongside classes in 2025; the code is internal.',
      pt:
        'Gestora independente de ativos imobiliários (R$2B+ sob gestão; fundos listados GGRC11 e ZAGH11), São Paulo. ' +
        'Estágio em paralelo às aulas em 2025; código interno.',
    },
    bullets: [
      {
        en:
          'Replaced the manual consolidation of fund reports with Python scrapers that pull every quarterly report ' +
          'since each fund’s inception and merge the metrics into Excel sheets grouped by fund type (CRI-backed REITs, FIDCs and others).',
        pt:
          'Substituiu a consolidação manual dos informes por scrapers em Python que baixam todos os informes trimestrais ' +
          'desde a criação de cada fundo e consolidam as métricas em Excel por tipo de fundo (FIIs de CRI, FIDCs e outros).',
      },
      {
        en:
          'Built the Streamlit dashboard the firm’s president and vice-president used to follow fund values: a long-polling ' +
          'job captures the previous day’s NAV PDF every morning and updates the figures with no manual steps.',
        pt:
          'Construiu o dashboard em Streamlit usado pelo presidente e pelo vice da gestora para acompanhar as cotas: um job ' +
          'de long-polling captura o PDF da cota do dia anterior toda manhã e atualiza os números sem passo manual.',
      },
      {
        en:
          'Gave the team a single always-current view of holdings by building interactive per-asset charts and ' +
          'replicating them across the firm’s entire fund portfolio.',
        pt:
          'Deu ao time uma visão única e sempre atual das posições: gráficos interativos por ativo replicados para toda a carteira.',
      },
    ],
    artifacts: [],
    tags: ['Python', 'Streamlit', 'web scraping', 'Excel'],
  },

  {
    id: 'sec',
    kind: 'club',
    start: '2025-08',
    end: '2026-01',
    org: 'Insper SEC',
    role: { en: 'CTF competitor', pt: 'Competidor de CTF' },
    summary: {
      en: 'Insper’s cybersecurity club. Left to free up time for the hardware projects below.',
      pt: 'O clube de cibersegurança do Insper. Saiu para liberar tempo para os projetos de hardware abaixo.',
    },
    bullets: [
      {
        en:
          'Competed in the club’s internal CTFs for six months to stay at the top of the scoreboard — mostly web ' +
          'exploitation (SQL injection, XSS, SSRF), with some crypto and misc.',
        pt:
          'Competiu nos CTFs internos do clube por seis meses para se manter no topo do placar — principalmente ' +
          'exploração web (SQL injection, XSS, SSRF), com um pouco de cripto e misc.',
      },
    ],
    artifacts: [],
    tags: ['CTF', 'web exploitation'],
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
    media: [
      {
        src: '/media/air-mouse.mp4',
        kind: 'video',
        poster: '/media/air-mouse-poster.jpg',
        alt: {
          en: 'Air Mouse in action — IMU gestures mapped to keystrokes, playing Subway Surfers (MPU6050 + FreeRTOS on RP2350)',
          pt: 'Air Mouse em ação — gestos da IMU mapeados em teclas, jogando Subway Surfers (MPU6050 + FreeRTOS no RP2350)',
        },
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
    /** Visible on the site, omitted from the one-page PDF (lowest-value entry there). */
    resume: false,
    brief: [
      {
        en: 'Static Astro site on Cloudflare Pages with zero JavaScript; the EN/PT content and this PDF are rendered from one data file.',
        pt: 'Site estático em Astro no Cloudflare Pages sem JavaScript; o conteúdo EN/PT e este PDF são renderizados de um único arquivo de dados.',
      },
    ],
    bullets: [
      {
        en:
          'Built this site with Astro, statically generated to Cloudflare Pages and shipped with zero JavaScript; ' +
          'the EN/PT pages and the resume PDF are rendered from one data file, so they can never disagree.',
        pt:
          'Construiu este site com Astro, gerado estaticamente para o Cloudflare Pages e servido sem JavaScript; ' +
          'as páginas EN/PT e o PDF do currículo são renderizados de um único arquivo de dados, então nunca divergem.',
      },
    ],
    artifacts: [{ href: repoHref('luispazzanese.dev'), label: { en: 'Source', pt: 'Código' } }],
    tags: ['Astro', 'TypeScript', 'Cloudflare Pages'],
  },

  {
    id: 'hacklastro',
    kind: 'project',
    start: '2026-06',
    end: null,
    org: 'Hackathon Lastro',
    role: { en: 'AI sales assistant for a proptech — built in one day', pt: 'Assistente de vendas com IA para uma proptech — feito em um dia' },
    brief: [
      {
        en: 'Next.js app with an Anthropic-powered chat that qualifies real-estate leads, a map of listings and an internal lead board for brokers; solo, one-day hackathon.',
        pt: 'App Next.js com chat baseado na API da Anthropic que qualifica leads imobiliários, mapa de imóveis e painel interno de leads para corretores; solo, hackathon de um dia.',
      },
    ],
    bullets: [
      {
        en:
          'Shipped, solo and in one day, a Next.js app for Lastro’s hackathon: an Anthropic-powered chat that qualifies leads ' +
          'by asking the right questions, a map of matching listings, and an internal board that routes each lead to a broker. ' +
          'Did not place; the code is public.',
        pt:
          'Entregou, sozinho e em um dia, um app Next.js para o hackathon da Lastro: um chat baseado na API da Anthropic que ' +
          'qualifica leads fazendo as perguntas certas, um mapa dos imóveis compatíveis e um painel interno que encaminha cada ' +
          'lead a um corretor. Não ficou entre os premiados; o código é público.',
      },
    ],
    artifacts: [{ href: repoHref('hacklastro'), label: { en: 'Source', pt: 'Código' } }],
    tags: ['TypeScript', 'Next.js', 'Anthropic API', 'Vercel'],
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
      en: 'What this semester is producing. The stepper IP is done; the CPU and the spider are in progress.',
      pt: 'O que este semestre está produzindo. O IP do motor de passo está pronto; a CPU e a aranha estão em andamento.',
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
        en: 'Terasic Spider hexapod with Felipe Suarez — AI-generated code run with CLAUDE.md rules, ADRs and a knowledge vault; we decide, measure on the bench and review.',
        pt: 'Hexápode Terasic Spider com Felipe Suarez — código gerado por IA conduzido com regras em CLAUDE.md, ADRs e vault de conhecimento; nós decidimos, medimos na bancada e revisamos.',
      },
    ],
    bullets: [
      {
        en:
          'Building a MIPS CPU in VHDL on a Terasic DE0-CV (Cyclone V) for the Computer Design course, with Lenny Wajcberg — ALU, ' +
          'register file, control unit, instruction and data memory, R/I/J-type instructions, each block verified with its own ' +
          'testbench; then writing assembly against it (functions, stack, load/store). Repo goes public when the course ends (Dec 2026).',
        pt:
          'Construindo uma CPU MIPS em VHDL numa Terasic DE0-CV (Cyclone V) na disciplina de Design de Computadores, com Lenny ' +
          'Wajcberg — ULA, banco de registradores, unidade de controle, memórias de instrução e dados, instruções tipo R/I/J, cada ' +
          'bloco verificado com testbench próprio; depois, assembly rodando nela (funções, pilha, load/store). Repo fica público ao fim da disciplina (dez 2026).',
      },
      {
        en:
          'Cloud Computing course, built from bare metal up: MAAS and Juju provisioning, an OpenStack private cloud, ' +
          'Docker/Kubernetes, and the full AWS Academy track (VPC, EC2, IAM, S3, Lambda); the group final project builds a ' +
          'scalable infrastructure by hand and then automates it with Terraform and CI/CD.',
        pt:
          'Disciplina de Computação em Nuvem, do bare metal para cima: provisionamento com MAAS e Juju, nuvem privada OpenStack, ' +
          'Docker/Kubernetes e a trilha completa da AWS Academy (VPC, EC2, IAM, S3, Lambda); o projeto final em grupo constrói ' +
          'uma infraestrutura escalável à mão e depois a automatiza com Terraform e CI/CD.',
      },
      {
        en:
          'Independent project with Felipe Suarez on a Terasic Spider hexapod (DE0-Nano-SoC, Cyclone V SoC), proposed by the ' +
          'lab professor: a pan/tilt head with a face display, light/distance/presence sensors and a behaviour policy running on ' +
          'the ARM HPS. The code is AI-generated on purpose — we run it the way Anthropic documents for Claude Code: a CLAUDE.md ' +
          'rulebook, architecture decision records and an Obsidian knowledge vault the model reads every session; we decide, ' +
          'measure on the bench and review. Just started.',
        pt:
          'Projeto independente com Felipe Suarez num hexápode Terasic Spider (DE0-Nano-SoC, Cyclone V SoC), proposto pelo ' +
          'professor do laboratório: cabeça pan/tilt com display de rosto, sensores de luz/distância/presença e uma política de ' +
          'comportamento rodando no ARM (HPS). O código é gerado por IA de propósito — conduzido do jeito que a Anthropic documenta ' +
          'para o Claude Code: um CLAUDE.md com as regras, registros de decisão de arquitetura (ADRs) e um vault Obsidian que o ' +
          'modelo lê a cada sessão; nós decidimos, medimos na bancada e revisamos. Recém-começado.',
      },
    ],
    projects: [
      {
        name: 'Stepper motor IP core',
        repo: 'vhdl-stepper-ip',
        featured: true,
        brief: {
          en: 'VHDL IP for a unipolar stepper on a DE10-Standard: phase-accumulator step rate, trapezoidal ramp without multipliers or dividers, self-checking testbench (7 cases), +13 ns setup slack at 50 MHz.',
          pt: 'IP em VHDL para motor de passo unipolar numa DE10-Standard: taxa por acumulador de fase, rampa trapezoidal sem multiplicador nem divisor, testbench auto-verificável (7 casos), +13 ns de slack a 50 MHz.',
        },
        description: {
          en:
            'Elective deliverable (Embedded Linux and SoC): a VHDL IP core driving a unipolar stepper from a DE10-Standard ' +
            '(Cyclone V). Step rate comes from a phase accumulator (DDS-style), so a trapezoidal acceleration ramp costs one ' +
            'adder and no divider; braking distance is found by mirroring the ramp instead of computing v²/2a. Single 50 MHz ' +
            'clock domain with clock enables, two-flop synchronisers, a self-checking testbench with 7 cases, and +13 ns setup ' +
            'slack / 168 ALMs after synthesis. The README explains every decision.',
          pt:
            'Entrega da eletiva (Embedded Linux and SoC): um IP core em VHDL controlando um motor de passo unipolar a partir de ' +
            'uma DE10-Standard (Cyclone V). A taxa de passos vem de um acumulador de fase (estilo DDS), então a rampa trapezoidal ' +
            'custa um somador e nenhum divisor; a distância de frenagem é obtida espelhando a rampa em vez de calcular v²/2a. ' +
            'Domínio único de 50 MHz com clock enables, sincronizadores de dois flip-flops, testbench auto-verificável com 7 casos ' +
            'e +13 ns de slack / 168 ALMs após síntese. O README explica cada decisão.',
        },
        stack: ['VHDL', 'Cyclone V', 'Quartus', 'ModelSim'],
      },
    ],
    media: [
      { src: '/media/spider-fpga.jpg', kind: 'image', alt: { en: 'Terasic Spider hexapod on a DE0-Nano-SoC', pt: 'Hexápode Terasic Spider em uma DE0-Nano-SoC' } },
      { src: '/media/vhdl-cpu.jpg', kind: 'image', alt: { en: 'MIPS CPU in VHDL on a DE0-CV', pt: 'CPU MIPS em VHDL numa DE0-CV' } },
    ],
    artifacts: [{ href: 'https://github.com/FelipeSuarez1/aracno_jorge', label: { en: 'Spider repo', pt: 'Repo da aranha' } }],
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

    const strings: L[] = [n.role, ...n.bullets, ...n.artifacts.map((a) => a.label), ...(n.media ?? []).map((m) => m.alt)];
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
