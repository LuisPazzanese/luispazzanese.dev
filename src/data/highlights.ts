// The three things shown right under the card. Each one has a plain-language
// blurb for recruiters and a short technical list for engineers (rendered
// inside a native <details>). Swap entries here when a better project lands.

import type { L } from './localized';
import { repoHref } from './timeline';

export interface HighlightMedia {
  src: string;
  kind: 'image' | 'video';
  alt: L;
  poster?: string;
  /** Small caption under the media, e.g. to say a screenshot is simulated. */
  note?: L;
}

export interface Highlight {
  id: string;
  title: L;
  /** One or two plain sentences; no acronyms a recruiter would not know. */
  blurb: L;
  media: HighlightMedia;
  /** Technical bullets for the "details" disclosure. ≤ 3. */
  details: L[];
  link?: { href: string; label: L };
}

export const highlights: Highlight[] = [
  {
    id: 'gesture-controller',
    title: { en: 'Gesture controller with on-board AI', pt: 'Controle por gestos com IA na placa' },
    blurb: {
      en: 'A hand-held controller that plays Subway Surfers: a neural network on the microcontroller recognises the gesture and sends the move to the computer over Bluetooth.',
      pt: 'Um controle de mão que joga Subway Surfers: uma rede neural no microcontrolador reconhece o gesto e manda o movimento para o computador por Bluetooth.',
    },
    media: {
      src: '/media/gesture-controller.mp4',
      kind: 'video',
      poster: '/media/gesture-controller-poster.jpg',
      alt: {
        en: 'Gesture controller demo: hand gestures become arrow keys while playing Subway Surfers',
        pt: 'Demo do controle por gestos: gestos da mão viram setas enquanto joga Subway Surfers',
      },
    },
    details: [
      {
        en: 'Edge Impulse classifier on an RP2350 (dual Cortex-M33) reading an MPU6050; framed protocol with XOR checksum over an HC-06 to a Python driver.',
        pt: 'Classificador Edge Impulse num RP2350 (dual Cortex-M33) lendo uma MPU6050; protocolo com quadros e checksum XOR via HC-06 para um driver Python.',
      },
      {
        en: 'Eight FreeRTOS tasks, four queues and a mutex; the PC sends game events back to drive a vibration motor. Built with Felipe Suarez.',
        pt: 'Oito tasks FreeRTOS, quatro filas e um mutex; o PC manda eventos do jogo de volta para acionar um motor de vibração. Feito com Felipe Suarez.',
      },
    ],
    link: {
      href: 'https://github.com/insper-classroom/26a-emb-aps-2-aps_ninja',
      label: { en: 'Code on GitHub', pt: 'Código no GitHub' },
    },
  },
  {
    id: 'stepper-ip',
    title: { en: 'Stepper motor controller in hardware', pt: 'Controlador de motor em hardware' },
    blurb: {
      en: 'A hardware block written in VHDL that drives a stepper motor with smooth acceleration, verified by an automatic simulation suite.',
      pt: 'Um bloco de hardware escrito em VHDL que controla um motor de passo com aceleração suave, verificado por uma bateria automática de simulações.',
    },
    media: {
      src: '/media/stepper-ip.svg',
      kind: 'image',
      alt: {
        en: 'Block diagram of the stepper IP core: synchroniser, control FSM, ramp, phase accumulator, sequencer, coils',
        pt: 'Diagrama de blocos do IP core: sincronizador, FSM de controle, rampa, acumulador de fase, sequenciador, bobinas',
      },
    },
    details: [
      {
        en: 'Step rate from a DDS-style phase accumulator, so the trapezoidal ramp costs one adder and no divider; braking point found by mirroring the ramp.',
        pt: 'Taxa de passos por acumulador de fase (estilo DDS): a rampa trapezoidal custa um somador e nenhum divisor; ponto de frenagem obtido espelhando a rampa.',
      },
      {
        en: 'Single 50 MHz clock domain with clock enables and two-flop synchronisers; self-checking testbench with 7 cases; +13 ns setup slack, 168 ALMs on a Cyclone V (DE10-Standard).',
        pt: 'Domínio único de 50 MHz com clock enables e sincronizadores de dois flip-flops; testbench auto-verificável com 7 casos; +13 ns de slack, 168 ALMs num Cyclone V (DE10-Standard).',
      },
    ],
    link: { href: repoHref('vhdl-stepper-ip'), label: { en: 'Code on GitHub', pt: 'Código no GitHub' } },
  },
  {
    id: 'hacklastro',
    title: { en: 'AI sales assistant', pt: 'Assistente de vendas com IA' },
    blurb: {
      en: 'Built in one day at a hackathon: a chat powered by AI that qualifies home buyers, shows matching listings on a map and hands each lead to a broker.',
      pt: 'Feito em um dia num hackathon: um chat com IA que qualifica compradores de imóveis, mostra os imóveis compatíveis num mapa e encaminha cada cliente a um corretor.',
    },
    media: {
      src: '/media/hacklastro.jpg',
      kind: 'image',
      alt: {
        en: 'Lastro SDR app: map of São Paulo with matching listings and the AI chat panel',
        pt: 'App Lastro SDR: mapa de São Paulo com imóveis compatíveis e o painel de chat com IA',
      },
      note: {
        en: 'Real interface; the assistant’s reply in this screenshot is simulated.',
        pt: 'Interface real; a resposta do assistente neste print é simulada.',
      },
    },
    details: [
      {
        en: 'Next.js + TypeScript on Vercel; Anthropic API with tool use (search listings, register lead) driving the conversation; Leaflet map; internal lead board for brokers.',
        pt: 'Next.js + TypeScript na Vercel; API da Anthropic com tool use (buscar imóveis, registrar lead) conduzindo a conversa; mapa em Leaflet; painel interno de leads para corretores.',
      },
    ],
    link: { href: repoHref('hacklastro'), label: { en: 'Code on GitHub', pt: 'Código no GitHub' } },
  },
];

export function validateHighlights(list: Highlight[] = highlights): void {
  for (const h of list) {
    const strings: L[] = [h.title, h.blurb, h.media.alt, ...h.details];
    if (h.media.note) strings.push(h.media.note);
    if (h.link) strings.push(h.link.label);
    for (const s of strings) {
      if (!s.en?.trim() || !s.pt?.trim()) throw new Error(`highlight "${h.id}": every string needs both en and pt`);
    }
    if (h.details.length > 3) throw new Error(`highlight "${h.id}": max 3 details`);
  }
}

validateHighlights();
