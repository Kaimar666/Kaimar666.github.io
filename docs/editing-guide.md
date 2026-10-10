# Kaimar 网站编辑指南

## 1. 写文章、短记或项目

在项目目录运行：

```bash
npm run new -- article agent-notes Agent工程实践笔记
npm run new -- note training-day 今日运动记录
npm run new -- project my-tool 我的工具
```

每条命令创建一份本地草稿。文章和短记在 `content/drafts/notes/`，项目在 `content/drafts/projects/`。创建时填写的英文标识作为长期地址的一部分；之后可以改显示标题，不必改标识。

打开生成的 Markdown 修改正文。用 `npm run dev:drafts` 在本机预览；一般的 `npm run dev` 只读公开内容目录。

## 2. 文件头字段

```yaml
---
title: 显示标题
slug: agent-notes
date: 2026-10-10
summary: 列表和分享时显示的一句话。
type: article
tags: [技术, 想法]
draft: true
featured: false
---
```

- `slug`：小写英文、数字和连字符。文章地址为 `/notes/agent-notes/`，项目地址为 `/projects/agent-notes/`。
- `date`：填写日期，列表按日期倒序。
- `type`：文章为 `article`，短记为 `note`。项目不需要此字段。
- `tags`：可给多个主题。一个主题有公开内容后，自动产生主题页。
- `draft`：控制是否生成公开网页；私人草稿仍应放在被 Git 忽略的 `content/drafts/`。
- `featured`：项目设为 `true` 后显示在首页精选项目区；最近记录仍按发布日期显示。
- `cover`：可选，如 `/images/my-tool.png`。没有封面的内容也正常排版。
- `updated`：文章可选，用于记录最近修订日期。

项目还支持：

```yaml
status: 持续更新
links:
  - label: 体验
    url: https://example.com
  - label: 源码
    url: https://github.com/your-name/your-project
```

上面的链接是格式示例，使用时替换成真实地址。

## 3. 发布一份本地草稿

```bash
npm run publish -- content/drafts/notes/agent-notes.md
```

这个命令会复制到 `content/notes/agent-notes.md`，设置 `draft: false`，再清理原草稿。已有同名文件时会停止，避免覆盖内容。

接着检查和预览：

```bash
npm run check
npm run build
npm run verify
npm run preview
```

确认后按 Git 流程提交，再将改动合并 / 推送到生产分支。设置好 GitHub Pages 后，生产分支的工作流自动上线；`publish` 命令本身不会操作 GitHub。

## 4. 图片

图片放在 `public/images/`，正文写：

```markdown
![描述图片内容](/images/training.jpg)
```

文件名含括号或空格时，用尖括号包住地址：

```markdown
![图示](</images/example (1).png>)
```

建议压缩照片后再放入站点。这个目录的素材会公开，不存放私人原图或不准备公开的文件。

## 5. 修改主题与专栏

在 `content/topics.json` 给已有主题配置显示名和说明：

```json
{ "id": "技术", "label": "工程实践", "description": "Agent 与工具的实践记录。", "visible": true }
```

正文仍用 `tags: [技术]`。改 `label` 不改变原有主题地址；`visible: false` 将该主题从主题索引隐藏。

专栏在 `content/series.json` 定义：

```json
[
  { "id": "agent-engineering", "label": "Agent 工程手记", "description": "持续整理的实践笔记。", "visible": true }
]
```

相关文章文件头加入：

```yaml
series: agent-engineering
seriesOrder: 1
```

专栏有公开文章后自动出现。后续文章修改 `seriesOrder` 控制阅读顺序，不改正文地址。

## 6. 个人介绍、导航、外部入口和首页

编辑 `content/site.json`：

- `name`、`roles`、`description` 修改介绍。
- `avatar` 填图片路径；留空时使用 `avatarText` 字母头像。
- `navigation` 修改名称、顺序和 `visible`。目前已有页面路径为 `/`、`/notes/`、`/projects/`、`/about/`。
- `focus` 修改右侧关注方向，`enabled: false` 关闭该区块。
- `homepage` 调整模块开关和显示数量。没有公开内容的模块自动隐藏，两类都有内容时并列。
- `links` 添加真实入口；按数组顺序显示。

```json
{
  "label": "GitHub",
  "url": "https://github.com/Kaimar666",
  "description": "项目与代码。",
  "visible": true
}
```

这只是添加格式示例；当前没有自动添加尚未由你选择的站外入口。

颜色在 `theme` 中配置 `#RRGGBB` 值。关于页文字放在 `content/about.md`。

## 7. 公开仓库与备份

`content/drafts/` 和 `.local/` 已在 `.gitignore` 中。私人内容放在这些本地目录；公开仓库中的 `draft: true` 文件原文仍可被查看，字段只控制网页生成。

发布前使用 `git status --short` 查看准备提交的文件。`npm run verify -- --privacy` 检查私人草稿不会进入生产网页。

记录的显示名称、主题和专栏可以修改；尽量保持已经分享的 `slug`。必须变更地址时保留兼容路径：文章可加 `legacyPath: /post/my-old-note/`，旧页面会继续展示同一文章并指向新的规范地址。此字段使用以 `/` 开头、以 `/` 结束的英文 / 数字 / 连字符路径。

旧版本保存在 Git 历史里。需要回退时，在本地检查目标提交 / 使用 `git revert` 形成新提交，再通过生产分支发布。不要用强制推送清空历史。
