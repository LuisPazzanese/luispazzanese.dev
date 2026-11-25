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

export type NodeKind = 'origin' | 'education' | 'club' | 'work' | 'project';

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
  /** One plain-language sentence, the only thing visible before "details" is opened. `{semester}` is substituted. */
  lead: L;
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
    lead: {
      en: 'Exchange programmes in Cambridge, Canada and at MIT NuVu (2019); a year in Poliedro’s ITA-track class.',
      pt: 'Intercâmbios em Cambridge, no Canadá e no MIT NuVu (2019); um ano de turma ITA no Poliedro.',
    },
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
    media: [{ src: '/media/nuvu-2019.jpg', kind: 'image', alt: { en: 'Luis at the MIT NuVu studio, 2019', pt: 'Luis no estúdio do MIT NuVu, 2019' } }],
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
    lead: {
      en: 'Computer Engineering at Insper — {semester} semester, graduating in December 2028.',
      pt: 'Engenharia da Computação no Insper — {semester} semestre, formatura em dezembro de 2028.',
    },
    summary: {
      en: 'Currently in the {semester} semester; expected graduation Dec 2028.',
      pt: 'Atualmente no {semester} semestre; formatura prevista para dez 2028.',
    },
    bullets: [],
    // Course projects worth showing, oldest first. Classroom repos are private,
    // so most link to a video or a live deploy through `artifacts` instead.
    projects: [
      {
        name: 'Weather station',
        repo: null,
        featured: true,
        description: {
          en: 'Instrumentation & Measurement (2023), group project: an Arduino UNO reads temperature, humidity and pressure sensors and shows all three on an LCD.',
          pt: 'Instrumentação e Medição (2023), em grupo: um Arduino UNO lê sensores de temperatura, umidade e pressão e mostra os três num display LCD.',
        },
        stack: ['Arduino', 'C++', 'LCD'],
      },
      {
        name: 'Computer from logic gates up',
        repo: null,
        featured: true,
        description: {
          en:
            'Elements of Computing Systems (2024), team of six: the Z01 computer — ALU, memory and CPU in VHDL verified in simulation, ' +
            'Assembly programs, an assembler in Java and a VM translator. Own contribution: 16-bit adder, barrel shifter, 64-bit register, ' +
            'max/multiply routines in Assembly, and the Scrum board for the assembler sprint.',
          pt:
            'Elementos de Sistemas (2024), time de seis: o computador Z01 — ULA, memória e CPU em VHDL verificadas em simulação, ' +
            'programas em Assembly, um assembler em Java e um tradutor de VM. Contribuição própria: somador de 16 bits, barrel shifter, ' +
            'registrador de 64 bits, rotinas max/mult em Assembly e o Scrum da sprint do assembler.',
        },
        stack: ['VHDL', 'Assembly', 'Java', 'cocotb'],
      },
      {
        name: 'Robot vision on ROS 2',
        repo: null,
        featured: true,
        description: {
          en:
            'Computational Robotics (2024): ROS 2 nodes for a TurtleBot — line following by HSV segmentation with proportional control and ' +
            'counting cans by image segmentation, run on the real robot; the final exam node combines line following, MobileNet ' +
            'object detection and ArUco markers.',
          pt:
            'Robótica Computacional (2024): nós ROS 2 para um TurtleBot — seguidor de linha por segmentação HSV com controle proporcional ' +
            'e contagem de latinhas por segmentação de imagem, rodando no robô real; o nó da prova final combina seguidor de linha, ' +
            'detecção de objetos com MobileNet e marcadores ArUco.',
        },
        stack: ['Python', 'ROS 2', 'OpenCV', 'MobileNet'],
      },
      {
        name: 'Pokédex web app',
        repo: null,
        featured: true,
        description: {
          en: 'Web Technologies (2025), pair project with Felipe Suarez: wrote the Django REST backend over the PokeAPI (search, details, personal Pokédex); deployed on Render.',
          pt: 'Tecnologias Web (2025), em dupla com Felipe Suarez: escreveu o backend em Django REST sobre a PokeAPI (busca, detalhes, Pokédex pessoal); deploy no Render.',
        },
        stack: ['Python', 'Django REST', 'Render'],
      },
      {
        name: 'Process supervisor in C',
        repo: null,
        featured: true,
        description: {
          en:
            'Hardware-Software Systems (2026): launches hashcat with fork/exec, detects crashes by signal, kills runs that exceed a ' +
            '5-second timeout and restarts them with a new seed; no leaks under valgrind. The course also covered x86-64 assembly, ' +
            'reverse engineering with GDB, threads and semaphores.',
          pt:
            'Sistemas Hardware-Software (2026): lança o hashcat por fork/exec, detecta falhas por sinal, mata execuções que passam de ' +
            '5 segundos e as reinicia com nova semente; sem vazamentos no valgrind. A disciplina também cobriu assembly x86-64, ' +
            'engenharia reversa com GDB, threads e semáforos.',
        },
        stack: ['C', 'POSIX', 'GDB', 'valgrind'],
      },
      {
        name: 'Library REST API',
        repo: 'projeto-sql-megadados',
        featured: true,
        description: {
          en:
            'Big Data (2026): REST microservice for a library catalogue — FastAPI and SQLModel over MySQL in Docker Compose; full CRUD ' +
            'with pagination and filters, a 1:N author–book relation, and database integrity errors mapped to HTTP 409/422.',
          pt:
            'Megadados (2026): microsserviço REST para o acervo de uma biblioteca — FastAPI e SQLModel sobre MySQL em Docker Compose; ' +
            'CRUD completo com paginação e filtros, relação 1:N autor–livro e erros de integridade do banco traduzidos em HTTP 409/422.',
        },
        stack: ['Python', 'FastAPI', 'MySQL', 'Docker'],
      },
      {
        name: 'Sentiment classifier in PySpark',
        repo: null,
        featured: true,
        description: {
          en: 'Big Data (2026): Naive Bayes written in functional style on Spark RDDs over 3.6 million Amazon reviews; 85.3% accuracy with Laplace smoothing, scored in parallel with broadcast variables.',
          pt: 'Megadados (2026): Naive Bayes escrito em estilo funcional sobre RDDs do Spark com 3,6 milhões de reviews da Amazon; 85,3% de acurácia com suavização de Laplace, avaliado em paralelo com variáveis broadcast.',
        },
        stack: ['Python', 'PySpark'],
      },
      {
        name: 'Gravity Sort handout',
        repo: 'desprog-orfalius',
        featured: false,
        description: {
          en: 'Programming Challenges (2026): an interactive handout explaining Gravity Sort, published on GitHub Pages.',
          pt: 'Desafios de Programação (2026): um handout interativo explicando o Gravity Sort, publicado no GitHub Pages.',
        },
        stack: ['Markdown', 'GitHub Pages'],
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
        ],
      },
      {
        term: '2024.2',
        courses: [
          { name: { en: 'Electrical Drives', pt: 'Acionamentos Elétricos' }, highlight: true },
          { name: { en: 'Data Science', pt: 'Ciência dos Dados' } },
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
          { name: { en: 'Physical Layer of Computing', pt: 'Camada Física da Computação' } },
          { name: { en: 'Modelling & Control', pt: 'Modelagem e Controle' } },
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
          { name: { en: 'Programming Challenges', pt: 'Desafios de Programação' } },
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
          { name: { en: 'Big Data', pt: 'Megadados' }, highlight: true },
          { name: { en: 'Social Networks', pt: 'Redes Sociais' } },
        ],
      },
    ],
    artifacts: [
      { href: 'https://www.youtube.com/watch?v=-af5QyZxMVA', label: { en: 'Weather station (video)', pt: 'Estação meteorológica (vídeo)' } },
      { href: 'https://youtu.be/UtmjZjQFGzY', label: { en: 'Robot line following (video)', pt: 'Robô seguindo linha (vídeo)' } },
      { href: 'https://youtu.be/x3d8QAkNblg', label: { en: 'Can counting by vision (video)', pt: 'Contagem de latinhas por visão (vídeo)' } },
      { href: 'https://youtu.be/Oh7_zvMfh0s', label: { en: 'Line + MobileNet + ArUco (video)', pt: 'Linha + MobileNet + ArUco (vídeo)' } },
      { href: 'https://projeto-2-frontend-pokeapi-backend-1.onrender.com/', label: { en: 'Pokédex (live)', pt: 'Pokédex (no ar)' } },
      { href: 'https://youtu.be/n7eKyzl4wQg', label: { en: 'Process supervisor (video)', pt: 'Supervisor de processos (vídeo)' } },
      { href: 'https://youtu.be/6sJq4Cib0IA', label: { en: 'Library API (video)', pt: 'API da biblioteca (vídeo)' } },
    ],
    tags: ['Insper'],
  },

  {
    id: 'zagros',
    kind: 'work',
    start: '2025-03',
    end: '2025-09',
    org: 'Zagros Capital',
    orgHref: 'https://www.zagroscapital.com.br',
    role: { en: 'Technology Intern (Back Office)', pt: 'Estagiário de Tecnologia (Back Office)' },
    lead: {
      en: 'Technology intern at Zagros Capital: automated report consolidation and built the fund dashboard used by the firm’s president and vice-president.',
      pt: 'Estagiário de tecnologia na Zagros Capital: automatizou a consolidação de relatórios e construiu o painel de cotas usado pelo presidente e pelo vice da gestora.',
    },
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
    lead: {
      en: 'CTF competitor at Insper SEC, the university’s cybersecurity club.',
      pt: 'Competidor de CTF no Insper SEC, o clube de cibersegurança do Insper.',
    },
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
      en: 'Embedded Computing — firmware projects on the RP2350',
      pt: 'Computação Embarcada — projetos de firmware no RP2350',
    },
    lead: {
      en: 'Firmware in C with FreeRTOS; a gesture controller with an on-device neural network plays Subway Surfers over Bluetooth.',
      pt: 'Firmware em C com FreeRTOS; um controle por gestos com rede neural na própria placa joga Subway Surfers via Bluetooth.',
    },
    summary: {
      en: 'Course projects on the RP2350 (dual Cortex-M33), all in C with the Pico SDK. The four below are the ones worth reading.',
      pt: 'Projetos da disciplina no RP2350 (dual Cortex-M33), todos em C com o Pico SDK. Os quatro abaixo são os que valem a leitura.',
    },
    bullets: [],
    projects: [
      {
        // Final course project (APS 2); the repo lives in insper-classroom, linked from `artifacts`.
        name: 'Gesture controller for Subway Surfers',
        repo: null,
        featured: true,
        brief: {
          en: 'Edge Impulse gesture classifier on the RP2350 → arrow keys over Bluetooth (HC-06) with a checksummed protocol; 8 FreeRTOS tasks; with Felipe Suarez.',
          pt: 'Classificador de gestos Edge Impulse no RP2350 → setas via Bluetooth (HC-06) com protocolo com checksum; 8 tasks FreeRTOS; com Felipe Suarez.',
        },
        description: {
          en:
            'Final project, with Felipe Suarez: a hand-held controller whose MPU6050 readings feed an Edge Impulse neural network running ' +
            'on the board itself, classifying idle/up/down/left/right. Gestures travel over Bluetooth (HC-06) in framed packets with an ' +
            'XOR checksum to a Python driver that presses the arrow keys; the PC can send events back to drive a vibration motor. ' +
            'Eight FreeRTOS tasks, four queues and a mutex guarding the shared state.',
          pt:
            'Projeto final, com Felipe Suarez: um controle de mão cuja MPU6050 alimenta uma rede neural Edge Impulse rodando na própria ' +
            'placa, que classifica parado/cima/baixo/esquerda/direita. Os gestos vão por Bluetooth (HC-06) em pacotes com checksum XOR ' +
            'para um driver Python que aperta as setas; o PC pode mandar eventos de volta para acionar um motor de vibração. ' +
            'Oito tasks FreeRTOS, quatro filas e um mutex protegendo o estado compartilhado.',
        },
        stack: ['C', 'FreeRTOS', 'Edge Impulse', 'Bluetooth'],
      },
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
        src: '/media/gesture-controller.mp4',
        kind: 'video',
        poster: '/media/gesture-controller-poster.jpg',
        alt: {
          en: 'Gesture controller playing Subway Surfers — on-device neural network on the RP2350, keys sent over Bluetooth',
          pt: 'Controle por gestos jogando Subway Surfers — rede neural na própria placa (RP2350), teclas enviadas por Bluetooth',
        },
      },
    ],
    artifacts: [
      {
        href: 'https://github.com/insper-classroom/26a-emb-aps-2-aps_ninja',
        label: { en: 'Gesture controller code', pt: 'Código do controle por gestos' },
      },
      { href: profile.github, label: { en: 'All repositories', pt: 'Todos os repositórios' } },
    ],
    tags: ['C', 'FreeRTOS', 'RP2350', 'I2C', 'SPI', 'ADC'],
  },

  {
    id: 'hacklastro',
    kind: 'project',
    start: '2026-06',
    end: null,
    org: 'Hackathon Lastro',
    role: { en: 'AI sales assistant for a proptech — built in one day', pt: 'Assistente de vendas com IA para uma proptech — feito em um dia' },
    lead: {
      en: 'In one day, built an AI assistant that qualifies home buyers and hands them to brokers.',
      pt: 'Em um dia, construiu um assistente com IA que qualifica compradores de imóveis e os encaminha a corretores.',
    },
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
    role: { en: 'Hardware design and cloud infrastructure', pt: 'Projeto de hardware e infraestrutura em nuvem' },
    lead: {
      en: 'Built a MIPS CPU in VHDL and a cloud from bare metal to AWS; now giving a robot spider a head.',
      pt: 'Construiu uma CPU MIPS em VHDL e uma nuvem do bare metal à AWS; agora está dando uma cabeça a um robô-aranha.',
    },
    summary: {
      en: 'This semester. The stepper IP and the CPU are done; the spider is the elective’s final project and is in progress.',
      pt: 'Este semestre. O IP do motor de passo e a CPU estão prontos; a aranha é o projeto final da eletiva e está em andamento.',
    },
    brief: [
      {
        en:
          'MIPS CPU in VHDL running at 25 MHz on a DE0-CV, cocotb tests in CI (Computer Design); cloud from bare metal to AWS ' +
          '(MAAS, Juju, OpenStack) with a final project on ECS reproduced with Terraform.',
        pt:
          'CPU MIPS em VHDL a 25 MHz numa DE0-CV, testes cocotb em CI (Design de Computadores); nuvem do bare metal à AWS ' +
          '(MAAS, Juju, OpenStack) com projeto final em ECS reproduzido com Terraform.',
      },
      {
        en: 'Elective final project with Felipe Suarez: Terasic Spider hexapod with a pan/tilt head, face display and an FPGA vision block (385 µs per frame).',
        pt: 'Projeto final da eletiva com Felipe Suarez: hexápode Terasic Spider com cabeça pan/tilt, display de rosto e bloco de visão na FPGA (385 µs por quadro).',
      },
    ],
    bullets: [
      {
        en:
          'Built a single-cycle MIPS CPU in VHDL with Lenny Wajcberg for the Computer Design course, running at 25 MHz on a Terasic ' +
          'DE0-CV (Cyclone V) — ALU, register file, control unit, instruction and data memory, R/I/J-type instructions and an ' +
          'assembler, verified with cocotb tests in GitHub Actions. Repo goes public when the course ends (Dec 2026).',
        pt:
          'Construiu uma CPU MIPS single-cycle em VHDL com Lenny Wajcberg na disciplina de Design de Computadores, rodando a 25 MHz ' +
          'numa Terasic DE0-CV (Cyclone V) — ULA, banco de registradores, unidade de controle, memórias de instrução e dados, ' +
          'instruções tipo R/I/J e um montador, verificada com testes cocotb no GitHub Actions. Repo fica público ao fim da disciplina (dez 2026).',
      },
      {
        en:
          'Cloud Computing, from bare metal up: MAAS and Juju provisioning, an OpenStack private cloud and AWS (VPC, EC2, IAM, S3, Lambda). ' +
          'Final project: Grão, an online coffee shop whose AI sales agent searches the catalogue and places orders — Python services ' +
          'in Docker on ECS over EC2, DynamoDB, SQS with a dead-letter queue, a load balancer and CloudWatch alarms; built by hand in ' +
          'one AWS region, then reproduced in another with Terraform (89 resources in a single apply).',
        pt:
          'Computação em Nuvem, do bare metal para cima: provisionamento com MAAS e Juju, nuvem privada OpenStack e AWS (VPC, EC2, IAM, ' +
          'S3, Lambda). Projeto final: Grão, uma loja de cafés em que um vendedor com IA busca no catálogo e fecha pedidos — serviços ' +
          'Python em Docker no ECS sobre EC2, DynamoDB, SQS com fila de mensagens mortas, load balancer e alarmes no CloudWatch; montado ' +
          'à mão numa região da AWS e depois reproduzido em outra com Terraform (89 recursos num único apply).',
      },
      {
        en:
          'Final project of the Embedded Linux and SoC elective, with Felipe Suarez: a head for a Terasic Spider hexapod ' +
          '(DE0-Nano-SoC, Cyclone V SoC) — pan/tilt with a face display, vision from a Raspberry Pi 4 with a RealSense camera, and ' +
          'a recognition block in the FPGA that finds an object’s box, centre and depth in a 160×120 frame in a fixed 385 µs, ' +
          'tested on the board, driving gaze and a startle reflex. Next: walking on battery and the Pi–FPGA link.',
        pt:
          'Projeto final da eletiva Embedded Linux and SoC, com Felipe Suarez: uma cabeça para o hexápode Terasic Spider ' +
          '(DE0-Nano-SoC, Cyclone V SoC) — pan/tilt com display de rosto, visão por um Raspberry Pi 4 com câmera RealSense e ' +
          'um bloco de reconhecimento na FPGA que acha caixa, centro e profundidade de um objeto num quadro 160×120 em 385 µs fixos, ' +
          'testado na placa, comandando o olhar e um reflexo de susto. Próximos passos: andar com bateria e o enlace Pi–FPGA.',
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
];

/** Repos that are real but not part of the story. Rendered as a compact list after the timeline. */
export const archive: ProjectRef[] = [
  {
    name: 'Ninja Card Game',
    repo: 'pygame-ninja',
    featured: false,
    description: {
      en: 'Card-matching reflex game built for the selection test to become a teaching assistant (“Ninja”) in Software Design, 2025.',
      pt: 'Jogo de reflexo com cartas feito na prova de seleção para Ninja (auxiliar de professor) de Design de Software, 2025.',
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

    const strings: L[] = [n.role, n.lead, ...n.bullets, ...n.artifacts.map((a) => a.label), ...(n.media ?? []).map((m) => m.alt)];
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
