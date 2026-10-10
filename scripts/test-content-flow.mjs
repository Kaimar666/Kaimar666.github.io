import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
import { load } from 'cheerio';
import { root, readEntry } from './content-utils.mjs';

const suffix = `${process.pid}-${Date.now()}`;
const noteSlug = `verification-note-${suffix}`;
const projectSlug = `verification-project-${suffix}`;
const privateNote = path.join(root, 'content/drafts/notes', `${noteSlug}.md`);
const privateProject = path.join(root, 'content/drafts/projects', `${projectSlug}.md`);
const publicNote = path.join(root, 'content/notes', `${noteSlug}.md`);
const publicProject = path.join(root, 'content/projects', `${projectSlug}.md`);
const seriesFile = path.join(root, 'content/series.json');
const originalSeries = fs.readFileSync(seriesFile, 'utf8');
const npm = process.env.npm_execpath;
if (!npm) throw new Error('请使用 npm run test:content。');
const created = [];
function run(file, args = [], env = process.env) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd: root, env, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  return result.stdout;
}
function changeOwned(file, changes) {
  const entry = readEntry(file);
  fs.writeFileSync(file, `---\n${YAML.stringify({ ...entry.data, ...changes })}---\n\n${entry.body}`, 'utf8');
}
try {
  run(path.join(root, 'scripts/new-entry.mjs'), ['note', noteSlug, '验证用短记']); created.push(privateNote);
  run(path.join(root, 'scripts/new-entry.mjs'), ['project', projectSlug, '验证用项目']); created.push(privateProject);
  if (!readEntry(privateNote).data.draft || !readEntry(privateProject).data.draft) throw new Error('新内容没有保存在草稿状态。');
  for (const file of [privateNote, privateProject]) {
    const ignored = spawnSync('git', ['check-ignore', '--quiet', file], { cwd: root, encoding: 'utf8' });
    if (ignored.status !== 0) throw new Error(`本地草稿没有被 Git 忽略：${ignored.stderr || file}`);
  }
  const series = JSON.parse(originalSeries);
  series.push({ id: `verification-${suffix}`, label: '验证用专栏', description: '只用于本地集成验证。', visible: true });
  fs.writeFileSync(seriesFile, JSON.stringify(series, null, 2) + '\n', 'utf8');
  changeOwned(privateNote, { tags: ['验证主题'], series: `verification-${suffix}`, seriesOrder: 1 });
  changeOwned(privateProject, { featured: true });
  run(path.join(root, 'scripts/publish-entry.mjs'), [privateNote]); created.push(publicNote);
  run(path.join(root, 'scripts/publish-entry.mjs'), [privateProject]); created.push(publicProject);
  if (readEntry(publicNote).data.draft || readEntry(publicProject).data.draft) throw new Error('发布脚本没有切换发布状态。');
  const env = { ...process.env, KAIMAR_TEST_BUILD: '1', SITE_BASE: '/verification-base', KAIMAR_INCLUDE_PRIVATE: '' };
  run(npm, ['run', 'build'], env);
  run(path.join(root, 'scripts/verify-build.mjs'), [], env);
  const testDist = path.join(root, '.local/test-dist');
  const home = load(fs.readFileSync(path.join(testDist, 'index.html'), 'utf8'));
  if (!home('.home-projects').length || !home('.home-notes').length || home('.home-grid').hasClass('single-section')) throw new Error('项目和记录没有同时显示在双栏布局。');
  if (!home(`a[href="/verification-base/projects/${projectSlug}/"]`).length) throw new Error('精选项目入口没有显示或缺少部署前缀。');
  if (!fs.existsSync(path.join(testDist, 'projects', projectSlug, 'index.html'))) throw new Error('项目详情页没有生成。');
  if (!fs.existsSync(path.join(testDist, 'series', `verification-${suffix}`, 'index.html'))) throw new Error('专栏页没有生成。');
  if (!fs.existsSync(path.join(testDist, 'topics', '验证主题', 'index.html'))) throw new Error('新增主题页没有生成。');
  console.log('内容流程验证通过：新建私人草稿、Git 忽略、发布、短记、项目详情、精选双栏、主题与专栏、部署子路径。');
} finally {
  fs.writeFileSync(seriesFile, originalSeries, 'utf8');
  for (const file of created) if (fs.existsSync(file)) fs.unlinkSync(file);
}
