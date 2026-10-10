import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
import { root, writeEntry, today } from './content-utils.mjs';

const dist = path.join(root, process.env.KAIMAR_TEST_BUILD === '1' ? '.local/test-dist' : 'dist');
const privacy = process.argv.includes('--privacy');
const marker = 'KAIMAR_PRIVATE_CANARY_7f28a1';
const canary = path.join(root, 'content/drafts/notes/privacy-canary-7f28a1.md');
if (privacy) {
  let created = false;
  try {
    writeEntry(canary, { title: marker, slug: 'privacy-canary-7f28a1', date: today(), type: 'note', draft: false, tags: [] }, marker);
    created = true;
    const npm = process.env.npm_execpath;
    if (!npm) throw new Error('请通过 npm run verify -- --privacy 执行。');
    const build = spawnSync(process.execPath, [npm, 'run', 'build'], { cwd: root, env: { ...process.env, KAIMAR_INCLUDE_PRIVATE: '' }, encoding: 'utf8' });
    if (build.status !== 0) throw new Error(build.stdout + build.stderr);
  } finally {
    if (created && fs.existsSync(canary)) fs.unlinkSync(canary);
  }
}
if (!fs.existsSync(dist)) throw new Error('先执行 npm run build。');
function walk(folder) { return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(folder, entry.name)) : [path.join(folder, entry.name)]); }
const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];
const site = new URL(process.env.SITE_URL || 'https://kaimar666.github.io');
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const $ = load(html);
  const label = path.relative(dist, file);
  if ($('h1').length !== 1) errors.push(`${label}：需要一个主标题。`);
  if (!$('html').attr('lang') || !$('title').text() || !$('meta[name="description"]').attr('content')) errors.push(`${label}：缺少语言 / 标题 / 描述。`);
  if ($('img:not([alt])').length) errors.push(`${label}：图片缺少 alt。`);
  if (html.includes(marker) || html.includes('本地预览')) errors.push(`${label}：草稿或本地信息进入公开产物。`);
  $('a[href], img[src], link[rel="stylesheet"][href], script[src]').each((_, element) => {
    const target = $(element).attr(element.name === 'img' || element.name === 'script' ? 'src' : 'href');
    if (!target || /^(#|mailto:|tel:|data:)/i.test(target)) return;
    const pagePath = path.relative(dist, file).replaceAll('\\', '/').replace(/index\.html$/, '');
    const url = new URL(target, new URL(`${base}/${pagePath}`, site));
    if (url.origin !== site.origin) return;
    let local = decodeURIComponent(url.pathname);
    if (base && local.startsWith(base + '/')) local = local.slice(base.length);
    const resolved = path.join(dist, local.replace(/^\//, ''));
    if (!fs.existsSync(resolved) && !fs.existsSync(path.join(resolved, 'index.html'))) errors.push(`${label}：无效内部资源 ${target}`);
  });
}
const old = path.join(dist, 'post/blog/index.html');
if (!fs.existsSync(old)) errors.push('旧文章 /post/blog/ 缺少兼容页面。');
else if (!fs.readFileSync(old, 'utf8').includes('/notes/hugo-windows-blog/')) errors.push('旧文章 canonical 不正确。');
for (const file of files.filter((file) => /\.(html|xml|json|txt)$/.test(file))) if (fs.readFileSync(file, 'utf8').includes(marker)) errors.push(`私人草稿进入 ${path.relative(dist, file)}`);
if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exit(1); }
console.log(`产物检查通过：${htmlFiles.length} 个页面，内部链接、图片、元信息、旧地址与草稿隔离有效${privacy ? '（含私人草稿 canary 验证）' : ''}。`);
