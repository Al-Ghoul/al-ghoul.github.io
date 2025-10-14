// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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

    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
            style: { 'text-decoration': 'none' }
          },
        },
      ]
    ]
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
