// Projects, in two tiers:
//   figures      three proofs shown as numbered figures (media + one line with
//                numbers + stack + links). These carry the page.
//   moreProjects one line each, grouped by area. Depth lives in each repo's
//                README, one click away; nothing here is longer than a line.
//
// Writing rules: no em dashes, numbers over adjectives, every claim backed by
// a repo, a video or the vault notes (~/Documents/curriculo-vault/).

import type { L } from './localized';
import { profile } from './profile';

export const repoHref = (slug: string): string => `${profile.github}/${slug}`;

export interface Link {
  href: string;
  label: L;
}

export interface Figure {
  id: string;
  title: L;
  /** One line, with numbers. */
  spec: L;
  /** Second line, printed only on the resume PDF: how it works and with whom. */
  detail: L;
  stack: string[];
  media: { src: string; kind: 'image' | 'video'; alt: L; poster?: string };
  links: Link[];
  /** Shown instead of a link when the code is not public yet. */
  note?: L;
}

export interface ProjectLine {
  name: L;
  line: L;
  href?: string;
  /** e.g. "em andamento"; rendered as a small status tag. */
  status?: L;
}

export interface ProjectGroup {
  id: string;
  label: L;
  items: ProjectLine[];
}

const code: L = { en: 'code', pt: 'código' };

export const figures: Figure[] = [
  {
    id: 'gesture-controller',
    title: { en: 'Gesture controller with on-board AI', pt: 'Controle por gestos com IA na placa' },
    spec: {
      en: 'A neural network on the Pico 2 classifies 4 gestures and plays Subway Surfers over Bluetooth.',
      pt: 'Rede neural na própria Pico 2 classifica 4 gestos e joga Subway Surfers via Bluetooth.',
    },
    detail: {
      en: 'Framed protocol with XOR checksum to a Python driver; 8 FreeRTOS tasks, 4 queues, 1 mutex. With Felipe Suarez.',
      pt: 'Protocolo com quadros e checksum XOR para um driver Python; 8 tasks FreeRTOS, 4 filas, 1 mutex. Com Felipe Suarez.',
    },
    stack: ['C', 'FreeRTOS', 'Edge Impulse', 'HC-06'],
    media: {
      src: '/media/gesture-controller.mp4',
      kind: 'video',
      poster: '/media/gesture-controller-poster.jpg',
      alt: {
        en: 'Hand gestures become arrow keys while playing Subway Surfers',
        pt: 'Gestos da mão viram setas enquanto joga Subway Surfers',
      },
    },
    links: [{ href: 'https://github.com/insper-classroom/26a-emb-aps-2-aps_ninja', label: code }],
  },
  {
    id: 'mips-cpu',
    title: { en: 'MIPS CPU in VHDL', pt: 'CPU MIPS em VHDL' },
    spec: {
      en: '32-bit single-cycle, 48 instructions, 25 MHz on a Cyclone V, cocotb tests in CI.',
      pt: '32 bits single-cycle, 48 instruções, 25 MHz numa Cyclone V, testes cocotb no CI.',
    },
    detail: {
      en: 'ALU, register file, decoder, ROM and RAM with memory-mapped I/O, HI/LO multiplier. With Lenny Wajcberg.',
      pt: 'ULA, banco de registradores, decodificador, ROM e RAM com E/S mapeada, multiplicador HI/LO. Com Lenny Wajcberg.',
    },
    stack: ['VHDL', 'Quartus', 'cocotb', 'GHDL'],
    media: {
      src: '/media/mips-cpu.svg',
      kind: 'image',
      alt: {
        en: 'Datapath: PC, ROM, decoder, register file, ALU, multiplier, RAM with memory-mapped I/O',
        pt: 'Datapath: PC, ROM, decodificador, banco de registradores, ULA, multiplicador, RAM com E/S mapeada',
      },
    },
    links: [],
    note: { en: 'code public in Dec 2026', pt: 'código público em dez/2026' },
  },
  {
    id: 'stepper-ip',
    title: { en: 'Stepper motor IP core', pt: 'IP de motor de passo' },
    spec: {
      en: 'Trapezoidal ramp with no divider: 168 ALMs and 13 ns of slack at 50 MHz.',
      pt: 'Rampa trapezoidal sem divisor: 168 ALMs e 13 ns de folga a 50 MHz.',
    },
    detail: {
      en: 'Phase-accumulator step rate, two-flop synchronisers, self-checking testbench with 7 cases.',
      pt: 'Taxa de passos por acumulador de fase, sincronizadores de dois flip-flops, testbench auto-verificável com 7 casos.',
    },
    stack: ['VHDL', 'Cyclone V', 'ModelSim'],
    media: {
      src: '/media/stepper-ip.svg',
      kind: 'image',
      alt: {
        en: 'Block diagram: synchroniser, control FSM, ramp, phase accumulator, sequencer, coils',
        pt: 'Diagrama de blocos: sincronizador, FSM de controle, rampa, acumulador de fase, sequenciador, bobinas',
      },
    },
    links: [{ href: repoHref('vhdl-stepper-ip'), label: code }],
  },
];

export const moreProjects: ProjectGroup[] = [
  {
    id: 'hardware',
    label: { en: 'Hardware and embedded', pt: 'Hardware e embarcados' },
    items: [
      {
        name: { en: 'Spider robot with FPGA vision', pt: 'Robô-aranha com visão na FPGA' },
        line: {
          en: 'Pan/tilt head and a Verilog vision block, 385 µs per frame.',
          pt: 'Cabeça pan/tilt e bloco de visão em Verilog, 385 µs por quadro.',
        },
        href: 'https://github.com/FelipeSuarez1/aracno_jorge',
        status: { en: 'in progress', pt: 'em andamento' },
      },
      {
        name: { en: 'Air Mouse', pt: 'Air Mouse' },
        line: {
          en: 'IMU and Madgwick AHRS move the cursor; 4 FreeRTOS tasks.',
          pt: 'IMU e AHRS Madgwick movem o cursor; 4 tasks FreeRTOS.',
        },
        href: repoHref('pico-mpu-rtos'),
      },
      {
        name: { en: 'Touchscreen stepper controller', pt: 'Touchscreen com motor de passo' },
        line: {
          en: 'Own ILI9341 driver and resistive touch read through the ADC.',
          pt: 'Driver ILI9341 próprio e touch resistivo lido pelo ADC.',
        },
        href: repoHref('pico-expert'),
      },
      {
        name: { en: 'Ultrasonic ranger', pt: 'Medidor ultrassônico' },
        line: {
          en: 'Non-blocking HC-SR04 with SDK alarms and edge IRQs.',
          pt: 'HC-SR04 sem bloqueio, com alarmes do SDK e IRQs de borda.',
        },
        href: repoHref('pico-timer'),
      },
      {
        name: { en: 'Z01 computer from logic gates', pt: 'Computador Z01 desde as portas lógicas' },
        line: {
          en: 'ALU, CPU and memory in VHDL plus a Java assembler, team of 6.',
          pt: 'ULA, CPU e memória em VHDL e um assembler em Java, time de 6.',
        },
      },
      {
        name: { en: 'Robot vision on ROS 2', pt: 'Visão de robô em ROS 2' },
        line: {
          en: 'Line following, MobileNet and ArUco on a TurtleBot.',
          pt: 'Seguidor de linha, MobileNet e ArUco num TurtleBot.',
        },
        href: 'https://youtu.be/Oh7_zvMfh0s',
      },
      {
        name: { en: 'Weather station', pt: 'Estação meteorológica' },
        line: {
          en: 'Arduino with temperature, humidity and pressure on an LCD.',
          pt: 'Arduino com temperatura, umidade e pressão num LCD.',
        },
        href: 'https://www.youtube.com/watch?v=-af5QyZxMVA',
      },
    ],
  },
  {
    id: 'software',
    label: { en: 'Software and cloud', pt: 'Software e nuvem' },
    items: [
      {
        name: { en: 'Store with an AI seller on AWS', pt: 'Loja com vendedor de IA na AWS' },
        line: {
          en: 'ECS, DynamoDB and SQS, rebuilt with Terraform (89 resources).',
          pt: 'ECS, DynamoDB e SQS, refeita com Terraform (89 recursos).',
        },
      },
      {
        name: { en: 'Library REST API', pt: 'API REST de biblioteca' },
        line: {
          en: 'FastAPI and MySQL in Docker; integrity errors mapped to HTTP.',
          pt: 'FastAPI e MySQL em Docker; erros de integridade viram HTTP.',
        },
        href: repoHref('projeto-sql-megadados'),
      },
      {
        name: { en: 'Naive Bayes in PySpark', pt: 'Naive Bayes em PySpark' },
        line: {
          en: '3.6 million reviews, 85.3% accuracy, functional RDDs.',
          pt: '3,6 milhões de reviews, 85,3% de acurácia, RDDs funcionais.',
        },
      },
      {
        name: { en: 'Process supervisor in C', pt: 'Supervisor de processos em C' },
        line: {
          en: 'fork/exec, signals and timeouts; clean under valgrind.',
          pt: 'fork/exec, sinais e timeout; sem vazamentos no valgrind.',
        },
        href: 'https://youtu.be/n7eKyzl4wQg',
      },
      {
        name: { en: 'AI sales assistant', pt: 'Assistente de vendas com IA' },
        line: {
          en: 'Next.js and the Anthropic API, built solo in a one-day hackathon.',
          pt: 'Next.js e API da Anthropic, feito sozinho num hackathon de um dia.',
        },
        href: repoHref('hacklastro'),
      },
    ],
  },
];

/** Build-time guard: both languages everywhere, one-liners stay one line, no em dashes. */
export function validateProjects(): void {
  const strings: [string, L][] = [];
  for (const f of figures) {
    strings.push([`${f.id}.title`, f.title], [`${f.id}.spec`, f.spec], [`${f.id}.detail`, f.detail], [`${f.id}.alt`, f.media.alt]);
    if (f.note) strings.push([`${f.id}.note`, f.note]);
    f.links.forEach((l, i) => strings.push([`${f.id}.link${i}`, l.label]));
    if (f.links.length === 0 && !f.note) throw new Error(`figure "${f.id}": needs a link or a note`);
  }
  for (const g of moreProjects) {
    strings.push([`${g.id}.label`, g.label]);
    for (const p of g.items) {
      strings.push([`${g.id}.${p.name.en}`, p.name], [`${g.id}.${p.name.en}.line`, p.line]);
      if (p.status) strings.push([`${g.id}.${p.name.en}.status`, p.status]);
      for (const lang of ['en', 'pt'] as const) {
        if (p.line[lang].length > 72) throw new Error(`"${p.name.en}" (${lang}): one-liner over 72 characters`);
      }
    }
  }
  for (const [where, s] of strings) {
    if (!s.en?.trim() || !s.pt?.trim()) throw new Error(`${where}: needs both en and pt`);
    if (s.en.includes('—') || s.pt.includes('—')) throw new Error(`${where}: no em dashes`);
  }
}

validateProjects();
