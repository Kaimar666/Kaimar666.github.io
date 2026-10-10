import fs from 'node:fs';
import path from 'node:path';
import { root, readEntry, walkMarkdown } from './content-utils.mjs';

const errors = [];
const fail = (message) => errors.push(message);
const isSafeHref = (value) => typeof value === 'string' && /^(\/[^/]|https?:\/\/|mailto:|tel:|\/$)/i.test(value);
const config = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
if (!config.name || !config.description || !Array.isArray(config.roles)) fail('site.json 中需要名称、简介和身份标签。');
for (const nav of config.navigation) if (!nav.label || !isSafeHref(nav.href)) fail(`导航地址不合法：${nav.label || '(缺少名称)'}`);
for (const link of config.links) if (!link.label || !isSafeHref(link.url)) fail(`外部入口不合法：${link.label || '(缺少名称)'}`);
for (const [key, color] of Object.entries(config.theme)) if (!/^#[0-9a-f]{6}$/i.test(color)) fail(`theme.${key} 需要 #RRGGBB 颜色。`);
for (const field of ['projectLimit', 'noteLimit']) if (!Number.isInteger(config.homepage[field]) || config.homepage[field] < 1 || config.homepage[field] > 30) fail(`homepage.${field} 需要 1–30 的整数。`);

const topics = JSON.parse(fs.readFileSync(path.join(root, 'content/topics.json'), 'utf8'));
const series = JSON.parse(fs.readFileSync(path.join(root, 'content/series.json'), 'utf8'));
for (const [name, definitions] of [['topics', topics], ['series', series]]) {
  const ids = new Set();
  for (const item of definitions) {
    if (!item.id || !item.label || /[/?#%\\]/.test(item.id) || ['.', '..'].includes(item.id)) fail(`${name}.json 中的 id / label 不合法。`);
    if (ids.has(item.id)) fail(`${name}.json 中重复 id：${item.id}`);
    ids.add(item.id);
  }
}

const routes = new Set(['/', '/notes/', '/projects/', '/about/', '/404/']);
const slugs = new Set();
const includePrivate = process.env.KAIMAR_INCLUDE_PRIVATE === 'true';
const folders = ['notes', 'projects', ...(includePrivate ? ['drafts/notes', 'drafts/projects'] : [])];
let count = 0;
for (const folder of folders) for (const file of walkMarkdown(path.join(root, 'content', folder))) {
  const relative = path.relative(root, file);
  try {
    const { data, body } = readEntry(file);
    const kind = folder.endsWith('projects') ? 'projects' : 'notes';
    count++;
    if (typeof data.title !== 'string' || !data.title.trim()) fail(`${relative}：需要 title。`);
    if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) fail(`${relative}：slug 使用小写英文、数字和连字符。`);
    if (!data.date || Number.isNaN(new Date(data.date).valueOf())) fail(`${relative}：date 不合法。`);
    if (typeof data.draft !== 'boolean') fail(`${relative}：明确填写 draft: true 或 false。`);
    if (data.tags && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string' || !tag || /[/?#%\\]/.test(tag)))) fail(`${relative}：tags 需要合法主题名称数组。`);
    const key = `${kind}/${data.slug}`;
    if (slugs.has(key)) fail(`${relative}：存在重复 slug ${key}。`);
    slugs.add(key);
    const route = `/${kind}/${data.slug}/`;
    if (routes.has(route)) fail(`${relative}：重复内容地址 ${route}。`);
    routes.add(route);
    if (data.legacyPath) {
      if (!/^\/[a-zA-Z0-9/_-]+\/$/.test(data.legacyPath) || routes.has(data.legacyPath)) fail(`${relative}：旧地址不合法或冲突 ${data.legacyPath}。`);
      routes.add(data.legacyPath);
    }
    if (data.series && !series.some((definition) => definition.id === data.series)) fail(`${relative}：请在 series.json 中定义专栏 ${data.series}。`);
    if (kind === 'projects') for (const link of data.links || []) if (!link.label || !isSafeHref(link.url)) fail(`${relative}：项目链接不合法。`);
    for (const value of [data.cover, ...(body.matchAll(/!\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))\)/g)).map((match) => match[1] || match[2])].filter(Boolean)) {
      if (value.startsWith('/') && !fs.existsSync(path.join(root, 'public', decodeURI(value.replace(/^\//, ''))))) fail(`${relative}：找不到图片 ${value}。`);
    }
  } catch (error) { fail(`${relative}：${error.message}`); }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`内容校验通过：${count} 个条目，导航、主题、专栏、图片与地址有效。`);
