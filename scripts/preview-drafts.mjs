import { spawn } from 'node:child_process';
import path from 'node:path';
import { root } from './content-utils.mjs';

const env = { ...process.env, KAIMAR_INCLUDE_PRIVATE: 'true' };
const check = spawn(process.execPath, [path.join(root, 'scripts/check-content.mjs')], { cwd: root, env, stdio: 'inherit' });
check.on('exit', (code) => {
  if (code !== 0) process.exit(code || 1);
  const preview = spawn(process.execPath, [path.join(root, 'node_modules/astro/astro.js'), 'dev', '--host', '127.0.0.1'], { cwd: root, env, stdio: 'inherit' });
  preview.on('exit', (result) => process.exit(result || 0));
});
