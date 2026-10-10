import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

const site = process.env.SITE_URL || 'https://kaimar666.github.io';
const base = process.env.SITE_BASE || '/';
function prefixLocalMarkdownUrls(options) {
  return (tree) => {
    const prefix = options?.prefix || '';
    if (!prefix) return;
    function visit(node) {
      if ((node.type === 'link' || node.type === 'image') && node.url?.startsWith('/') && !node.url.startsWith('//')) node.url = `${prefix}${node.url}`;
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

export default defineConfig({
  site,
  base,
  output: 'static',
  outDir: process.env.KAIMAR_TEST_BUILD === '1' ? './.local/test-dist' : './dist',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: {
    processor: unified({ remarkPlugins: [[prefixLocalMarkdownUrls, { prefix: base.replace(/\/$/, '') }]] }),
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
