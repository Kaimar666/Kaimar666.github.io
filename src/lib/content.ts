import { getCollection, type CollectionEntry } from 'astro:content';
import site from '../../content/site.json';
import topics from '../../content/topics.json';
import series from '../../content/series.json';

export { site };
export type Note = CollectionEntry<'notes'>;
export type Project = CollectionEntry<'projects'>;
export type SeriesDefinition = { id: string; label: string; description?: string; visible?: boolean };
export const seriesDefinitions = series as SeriesDefinition[];

export const href = (path: string) => {
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
};
export const absolute = (path: string) => new URL(href(path), import.meta.env.SITE || 'https://kaimar666.github.io').href;
export const noteHref = (entry: Note) => href(`/notes/${entry.data.slug}/`);
export const projectHref = (entry: Project) => href(`/projects/${entry.data.slug}/`);
export const formatDate = (date: Date) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai' }).format(date).replaceAll('/', '.');
export const isLocalPreview = import.meta.env.DEV;
export const readingTime = (body = '') => Math.max(1, Math.ceil(body.replace(/```[\s\S]*?```/g, '').length / 600));

export async function getNotes() {
  const entries = (await getCollection('notes')).filter((entry) => isLocalPreview || (!entry.data.draft && entry.id.startsWith('notes/')));
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export async function getProjects() {
  const entries = (await getCollection('projects')).filter((entry) => isLocalPreview || (!entry.data.draft && entry.id.startsWith('projects/')));
  return entries.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.date.valueOf() - a.data.date.valueOf());
}
export function topicInfo(id: string) {
  return topics.find((topic) => topic.id === id) || { id, label: id, description: '', visible: true };
}
export function usedTopics(notes: Note[]) {
  const counts = new Map<string, number>();
  notes.forEach((entry) => entry.data.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  return [...counts].map(([id, count]) => ({ ...topicInfo(id), count })).filter((topic) => topic.visible);
}
