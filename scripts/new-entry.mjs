import path from 'node:path';
import { root, today, writeEntry } from './content-utils.mjs';

const [kind, slug, ...titleParts] = process.argv.slice(2);
if (!['article', 'note', 'project'].includes(kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) {
  console.error('用法：npm run new -- article|note|project 小写英文标识 可选标题'); process.exit(1);
}
const group = kind === 'project' ? 'projects' : 'notes';
const data = { title: titleParts.join(' ') || '填写标题', slug, date: today(), summary: '', draft: true, featured: false, tags: [] };
if (kind === 'project') Object.assign(data, { status: '探索中', links: [] });
else Object.assign(data, { type: kind });
const file = path.join(root, 'content/drafts', group, `${slug}.md`);
const body = kind === 'project' ? '## 这是什么\n\n写下项目的用途。\n\n## 创作过程\n\n记录探索和实践。\n' : '从这里写下你的内容。\n';
try { writeEntry(file, data, body); console.log(`已创建本地草稿：${path.relative(root, file)}\n用 npm run dev:drafts 预览。准备公开后运行 npm run publish -- 文件路径。`); }
catch (error) { console.error(error.message); process.exit(1); }
