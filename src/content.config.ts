import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const shared = {
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.coerce.date(),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(true),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
};

const notes = defineCollection({
  loader: glob({
    base: './content',
    pattern: process.env.KAIMAR_INCLUDE_PRIVATE === 'true' ? '{notes,drafts/notes}/**/*.md' : 'notes/**/*.md',
    generateId: ({ entry }) => entry.replaceAll('\\', '/').replace(/\.md$/, ''),
  }),
  schema: z.object({
    ...shared,
    type: z.enum(['article', 'note']).default('article'),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    updated: z.coerce.date().optional(),
    legacyPath: z.string().regex(/^\/[a-zA-Z0-9/_-]+\/$/).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './content', pattern: process.env.KAIMAR_INCLUDE_PRIVATE === 'true' ? '{projects,drafts/projects}/**/*.md' : 'projects/**/*.md', generateId: ({ entry }) => entry.replaceAll('\\', '/').replace(/\.md$/, '') }),
  schema: z.object({
    ...shared,
    status: z.string().default('探索中'),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

export const collections = { notes, projects };
