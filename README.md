# Kaimar · 个人工作室

Agent 工程师 · 运动员。

一个在大厂工作的攻城狮，但是内心实际上是一个运动员，哈哈哈哈。

这是可通过 Markdown 和配置文件持续维护的 Astro 静态网站。首页采用深色介绍区、浅色内容区；有内容时精选项目与最近记录并列，手机端依次展示。

## 本地运行

需要 Node.js 22.12 以上；本项目使用 Node.js 24 验证。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址（通常为 `http://127.0.0.1:4321/`）。此命令预览公开内容。

```bash
npm run dev:drafts
```

这个命令还读取本地私人草稿，仅监听本机地址。生产构建不读取私人草稿。

## 写第一篇内容

```bash
npm run new -- article my-first-note 我的第一篇记录
```

文件生成在 `content/drafts/notes/my-first-note.md`，这个目录由 Git 忽略。修改正文、摘要和标签，用草稿预览查看。

准备公开后：

```bash
npm run publish -- content/drafts/notes/my-first-note.md
npm run check
npm run test:content
npm run build
npm run verify
```

`publish` 只把本地草稿移到可公开的内容目录，不自动提交或上线。随后按正常 Git 流程提交推送，生产分支的 Actions 会构建发布。

短记录使用 `npm run new -- note my-thought`；项目使用 `npm run new -- project my-project`。完整说明见 [编辑指南](docs/editing-guide.md)。

## 常改的文件

| 文件 | 用途 |
|---|---|
| `content/site.json` | 个人介绍、头像、导航、首页模块、外部入口和颜色 |
| `content/about.md` | 关于页正文 |
| `content/notes/*.md` | 可公开的文章与短记录 |
| `content/projects/*.md` | 可公开的项目介绍 |
| `content/topics.json` | 主题显示名称、说明与可见性 |
| `content/series.json` | 连续专栏、说明与可见性 |
| `public/images/` | 随站发布的图片 |
| `templates/` | 内容模板，不出现在网站中 |

## 检查与生产预览

```bash
npm run check
npm run test:content
npm run build
npm run verify -- --privacy
npm run preview
```

`verify -- --privacy` 会临时创建一份带标记的私人草稿，生产构建后检查它未出现在公开产物中，并清理该测试草稿。还会检查页面标题、图片、内部链接和旧文章兼容路径。

`test:content` 走一次真实的新增与发布流程，验证主题、专栏、项目详情、首页双栏以及部署子路径。测试内容只进入 `.local/test-dist/`，结束后自动清理，不影响正式 `dist/`。

当前没有项目内容时，Astro 构建日志可能提示 `projects` 内容集合为空；这是正常空状态，页面与构建检查仍可成功。

## GitHub Pages

目标仓库：[Kaimar666/Kaimar666.github.io](https://github.com/Kaimar666/Kaimar666.github.io)。现有默认分支为 `master`。首期本地制作使用开发分支，不直接替换旧线上页面。

正式接入时：

1. 确认本地新站和旧文章迁移效果。
2. 先确认开发分支 / PR 的构建检查通过，并保留已有 Git 历史。
3. 在仓库 **Settings → Pages → Source** 中选择 **GitHub Actions**，再将开发分支合并到 `master`。
4. 在 Actions 检查 `Check and deploy Kaimar` 工作流成功。

工作流对 PR 进行检查；只有 `master` 的推送或该分支手动运行才部署。默认站点 URL 为 `https://kaimar666.github.io/`，可以通过 `SITE_URL` 和 `SITE_BASE` 配置迁移到独立域名或项目子路径。

## 旧内容与决策记录

旧博客的 Git 历史已保留。2021 年的 Hugo 教程已迁移成 Markdown，并保留 `/post/blog/` 兼容路径。详细资产检查见 [迁移记录](docs/legacy-migration.md)。

- [设计确认记录](docs/personal-website-design-brief.md)
- [首期实施范围](docs/implementation-plan.md)
- [编辑指南](docs/editing-guide.md)

项目和其他外部入口在提供真实内容后出现；生产输出不包含设计预览中的虚构项目与示例文章。
