// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeComponents from "rehype-components";
import { remarkRelatedTitles } from './src/plugins/remark-related-titles.mjs';


import { remarkExcerpt } from './src/plugins/remark-excerpt.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import remarkSectionize from 'remark-sectionize';

import remarkGfm from 'remark-gfm';
import remarkDirective from "remark-directive";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";

import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.mjs";

import sitemap from '@astrojs/sitemap';

import { transformerCopyButton } from '@selemondev/shiki-transformer-copy-button';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';


// https://astro.build/config
export default defineConfig({
  site: "https://al-ghoul.github.io",
  integrations: [
    react(), mdx({
      remarkPlugins: [
        remarkMath,
        remarkRelatedTitles,
        remarkExcerpt,
        remarkReadingTime,
        remarkSectionize,
        remarkGfm,
        remarkGithubAdmonitionsToDirectives,
        remarkDirective,
        parseDirectiveNode,
      ],
      rehypePlugins: [
        rehypeKatex,
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
        ],
        [
          rehypeComponents,
          {
            components: {
              // @ts-ignore
              note: (x, y) => AdmonitionComponent(x, y, "note"),
              // @ts-ignore
              tip: (x, y) => AdmonitionComponent(x, y, "tip"),
              // @ts-ignore
              info: (x, y) => AdmonitionComponent(x, y, "important"),
              // @ts-ignore
              danger: (x, y) => AdmonitionComponent(x, y, "caution"),
              // @ts-ignore
              warning: (x, y) => AdmonitionComponent(x, y, "warning"),
            },
          },
        ],
      ]
    }
    ),
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: {
          ar: 'ar',
          en: 'en',
        },
      },
    })
  ],

  i18n: {
    defaultLocale: 'ar',
    locales: ['en', 'ar'],
  },

  markdown: {
    shikiConfig: {
      theme: 'vitesse-black',
      transformers: [
        transformerColorizedBrackets(),
        transformerNotationHighlight(),
        transformerCopyButton({
          duration: 3000,
          display: 'ready',
          successIcon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='rgba(128,128,128,1)' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Crect width='8' height='4' x='8' y='2' rx='1' ry='1'/%3E%3Cpath d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/%3E%3Cpath d='m9 14 2 2 4-4'/%3E%3C/svg%3E`,
          copyIcon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='rgba(128,128,128,1)' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Crect width='8' height='4' x='8' y='2' rx='1' ry='1'/%3E%3Cpath d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/%3E%3C/svg%3E`,
        }),
        transformerNotationDiff({
          matchAlgorithm: 'v3',
        }),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
      ],
    },

  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
