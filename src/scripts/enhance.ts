// Progressive enhancement for the single page, loaded once by Page.astro.
// Rule: the page is complete without this file. Everything here is additive
// and reads its labels from data-* attributes the components already render.
//
//   A. lightbox for the figure diagrams ([data-lightbox] frames with a link)
//   B. muted, looped autoplay of the figure video while ≥ 50 % visible
//
// Budget: ≤ 4 KB minified, no dependencies.

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

/* ---------- A. Lightbox ---------- */

function setupLightbox(): void {
  // Only frames with a link (the diagrams); the video has native fullscreen.
  const frames = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox]')).filter((f) => f.querySelector('a'));
  const section = frames[0]?.closest('section');
  if (!section) return;
  const closeLabel = section.dataset.close ?? 'Close';
  const zoomLabel = section.dataset.zoom ?? '';

  // Built on first open so never-clicked pages carry nothing.
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
    current = (index + frames.length) % frames.length;
    const frame = frames[current]!;
    const source = frame.querySelector('img');
    stage.replaceChildren();
    if (source) {
      const img = new Image();
      img.alt = source.alt;
      // Explicit size: fit 92vw × 88vh, never upscale rasters. The diagram SVGs
      // have only a viewBox, so without this they have no intrinsic size.
      img.onload = () => {
        const scale = Math.min(
          (innerWidth * 0.92) / img.naturalWidth,
          (innerHeight * 0.88) / img.naturalHeight,
          img.src.endsWith('.svg') ? Infinity : 1,
        );
        img.width = Math.round(img.naturalWidth * scale);
        img.height = Math.round(img.naturalHeight * scale);
      };
      img.src = source.src;
      stage.append(img);
    }
    title.textContent = frame.dataset.title ?? '';
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') {
      // The close button is the only focusable element: keep focus on it.
      e.preventDefault();
      closeBtn.focus();
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
    box.classList.remove('lb--in');
    box.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    opener?.focus();
  }

  frames.forEach((frame, index) => {
    const link = frame.querySelector('a')!;
    link.title = zoomLabel;
    // Without JS the link opens the file itself; with JS it opens the lightbox.
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open(index, link);
    });
  });
}

/* ---------- B. Video autoplay in view ---------- */

function setupAutoplay(): void {
  const video = document.querySelector<HTMLVideoElement>('video[data-autoplay]');
  if (!video || reduceMotion) return;

  // Within 200 px of the viewport: fetch metadata so the first frame is ready.
  new IntersectionObserver(
    (entries, observer) => {
      if (entries[0]?.isIntersecting) {
        video.preload = 'metadata';
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  ).observe(video);

  // ≥ 50 % visible: play muted and looped; otherwise pause.
  new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.5 },
  ).observe(video);
}

setupLightbox();
setupAutoplay();
