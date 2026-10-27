import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://luispazzanese.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
      // Keep the one client script (src/scripts/enhance.ts) as a cached
      // /_astro/*.js chunk shared by / and /en/ instead of being inlined into
      // every page; `undefined` leaves the default 4 KB rule for stylesheets.
      assetsInlineLimit: (path) => (path.endsWith('.js') ? false : undefined),
    },
  },
});
