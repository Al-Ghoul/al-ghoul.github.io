// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: "https://al-ghoul.github.io",
  integrations: [react(), mdx()],

  i18n: {
    defaultLocale: 'ar',
    locales: ['en', 'ar'],
  },

  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
    },
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
