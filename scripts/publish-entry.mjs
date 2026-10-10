import fs from 'node:fs';
import path from 'node:path';
import { root, insideRoot, readEntry, writeEntry } from './content-utils.mjs';

const argument = process.argv[2];
if (!argument) { console.error('用法：npm run publish -- content/drafts/notes/文件.md'); process.exit(1); }
const file = path.resolve(root, argument);
const relative = path.relative(path.join(root, 'content/drafts'), file).replaceAll('\\', '/');
if (!insideRoot(file) || !/^(notes|projects)\/[a-z0-9-]+\.md$/.test(relative)) { console.error('只能发布 content/drafts/notes 或 projects 中的本地草稿。'); process.exit(1); }
try {
  const { data, body } = readEntry(file);
  if (typeof data.title !== 'string' || !data.title.trim() || data.title === '填写标题') throw new Error('请先填写真实标题。');
  if (!data.date || Number.isNaN(new Date(data.date).valueOf())) throw new Error('请先填写有效日期。');
  const group = relative.split('/')[0];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || '')) throw new Error('请先填写合法的 slug。');
  const destination = path.join(root, 'content', group, `${data.slug}.md`);
  if (!insideRoot(destination)) throw new Error('目标路径超出工作区。');
  writeEntry(destination, { ...data, draft: false }, body);
  fs.unlinkSync(file);
  console.log(`已移入可公开内容：${path.relative(root, destination)}\n这份文件将随公开仓库提交。请先 npm run check 与 npm run build，再提交推送。`);
} catch (error) { console.error(error.message); process.exit(1); }
