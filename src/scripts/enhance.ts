// Progressive enhancement for the single page, loaded once by Page.astro.
// Rule: the page is complete without this file. Everything here is additive
// and reads its labels from data-* attributes the components already render.
//
//   A. lightbox for the three highlight media ([data-lightbox] figures)
//   B. muted, looped autoplay of the Air Mouse video while ≥ 50 % visible
//   C. "open all technical details" toggle at the top of the timeline
//   D. sticky name + resume bar once the card has scrolled out of view
//
// Budget: ≤ 6 KB minified, no dependencies.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

/* ---------- A. Lightbox ---------- */

function setupLightbox(): void {
  const figures = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox]'));
  const section = figures[0]?.closest('section');
  if (!section) return;
  const closeLabel = section.dataset.close ?? 'Close';
  const zoomLabel = section.dataset.zoom ?? '';

  // Built on first open so no-JS pages (and never-clicked ones) carry nothing.
  let box: HTMLDivElement | null = null;
  let stage: HTMLElement;
  let title: HTMLElement;
  let closeBtn: HTMLButtonElement;
  let current = 0;
  let opener: HTMLElement | null = null;

  function build(): HTMLDivElement {
    const dialog = el('div', 'lb');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'lb-title');

    closeBtn = el('button', 'lb__close');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', closeLabel);
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', close);

    stage = el('figure', 'lb__media');
    title = el('p', 'lb__title');
    title.id = 'lb-title';

    dialog.append(closeBtn, stage, title);
    // Backdrop click (not the media) closes.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close();
    });
    return dialog;
  }

  function show(index: number): void {
    current = (index + figures.length) % figures.length;
    const figure = figures[current]!;
    const source = figure.querySelector<HTMLImageElement | HTMLVideoElement>('img, video');
    stage.querySelector('video')?.pause();
    stage.replaceChildren();
    if (source instanceof HTMLVideoElement) {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.poster = source.poster;
      video.src = source.querySelector('source')?.src ?? '';
      video.setAttribute('aria-label', source.getAttribute('aria-label') ?? '');
      stage.append(video);
      video.play().catch(() => {});
    } else if (source) {
      const img = new Image();
      img.alt = source.alt;
      // Explicit size: fit 92vw × 90vh, never upscale rasters. The diagram SVG
      // has only a viewBox, so without this it has no intrinsic size at all.
      img.onload = () => {
        const scale = Math.min(
          (innerWidth * 0.92) / img.naturalWidth,
          (innerHeight * 0.9) / img.naturalHeight,
          img.src.endsWith('.svg') ? Infinity : 1,
        );
        img.width = Math.round(img.naturalWidth * scale);
        img.height = Math.round(img.naturalHeight * scale);
      };
      img.src = source.src;
      stage.append(img);
    }
    title.textContent = figure.dataset.title ?? '';
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab' && box) {
      // Focus trap: cycle between the close button and the media controls.
      const focusable = box.querySelectorAll<HTMLElement>('button, video');
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function open(index: number, from: HTMLElement): void {
    opener = from;
    box ??= build();
    document.body.append(box);
    document.body.style.overflow = 'hidden';
    show(index);
    // Next frame so the 120 ms opacity transition actually runs.
    requestAnimationFrame(() => box?.classList.add('lb--in'));
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }

  function close(): void {
    if (!box) return;
    stage.querySelector('video')?.pause();
    box.classList.remove('lb--in');
    box.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    opener?.focus();
  }

  figures.forEach((figure, index) => {
    const link = figure.querySelector('a');
    if (link) {
      // Without JS the link opens the file in a new tab; with JS it opens the lightbox.
      link.addEventListener('click', (e) => {
        e.preventDefault();
        open(index, link);
      });
    }
    if (figure.querySelector('video')) {
      // Transparent button over the video (CSS leaves the controls bar free).
      const button = el('button', 'media__open');
      button.type = 'button';
      button.setAttribute('aria-label', zoomLabel);
      button.addEventListener('click', () => open(index, button));
      figure.append(button);
    }
  });
}

/* ---------- B. Video autoplay in view ---------- */

function setupAutoplay(): void {
  const video = document.querySelector<HTMLVideoElement>('video[data-autoplay]');
  if (!video || reduceMotion) return;
  video.closest('figure')?.classList.add('media--live');

  // Within 200 px of the viewport: fetch metadata (poster → first frame ready).
  new IntersectionObserver(
    (entries, observer) => {
      if (entries[0]?.isIntersecting) {
        video.preload = 'metadata';
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  ).observe(video);

  // ≥ 50 % visible: play muted + looped; otherwise pause.
  new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        video.muted = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.5 },
  ).observe(video);
}

/* ---------- C. Open / close every timeline <details> ---------- */

function setupToggleAll(): void {
  const section = document.querySelector<HTMLElement>('[data-timeline]');
  const head = section?.querySelector('h2')?.parentElement;
  const all = Array.from(section?.querySelectorAll('details') ?? []);
  if (!section || !head || !all.length) return;

  const button = el('button', 'toggle-all');
  button.type = 'button';
  const relabel = () => {
    button.textContent = (all.every((d) => d.open) ? section.dataset.closeAll : section.dataset.openAll) ?? '';
  };
  button.addEventListener('click', () => {
    const open = !all.every((d) => d.open);
    for (const d of all) d.open = open;
    relabel();
  });
  // `toggle` does not bubble; capture keeps the label right after manual clicks.
  section.addEventListener('toggle', relabel, true);
  relabel();
  head.append(button);
}

/* ---------- D. Sticky bar ---------- */

function setupStickyBar(): void {
  const card = document.querySelector('[data-card]');
  const bar = document.querySelector<HTMLElement>('[data-bar]');
  if (!card || !bar) return;
  new IntersectionObserver(([entry]) => {
    // Show only once the card is above the viewport, not while it is in view
    // or below it (e.g. page restored mid-scroll then scrolled back up).
    bar.hidden = !entry || entry.isIntersecting || entry.boundingClientRect.top > 0;
  }).observe(card);
}

setupLightbox();
setupAutoplay();
setupToggleAll();
setupStickyBar();
