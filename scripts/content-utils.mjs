import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function readEntry(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path.relative(root, file)} 缺少 Markdown 文件头。`);
  return { data: YAML.parse(match[1]), body: text.slice(match[0].length) };
}
export function walkMarkdown(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((item) => item.isDirectory() ? walkMarkdown(path.join(directory, item.name)) : item.name.endsWith('.md') ? [path.join(directory, item.name)] : []);
}
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
export function writeEntry(file, data, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `---\n${YAML.stringify(data)}---\n\n${body}`, { encoding: 'utf8', flag: 'wx' });
}
export function insideRoot(file) {
  const relative = path.relative(root, file);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}
