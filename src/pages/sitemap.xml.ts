import type { APIRoute } from 'astro';
import { absolute, getNotes, getProjects, usedTopics, seriesDefinitions } from '../lib/content';
export const GET: APIRoute = async () => {
  const notes = await getNotes();
  const projects = await getProjects();
  const paths = ['/', '/notes/', '/projects/', '/about/', ...notes.map((entry) => `/notes/${entry.data.slug}/`), ...projects.map((entry) => `/projects/${entry.data.slug}/`), ...usedTopics(notes).map((topic) => `/topics/${encodeURIComponent(topic.id)}/`), ...seriesDefinitions.filter((definition) => definition.visible !== false && notes.some((entry) => entry.data.series === definition.id)).map((definition) => `/series/${encodeURIComponent(definition.id)}/`)];
  const urls = paths.map((path) => `<url><loc>${absolute(path).replaceAll('&', '&amp;')}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
