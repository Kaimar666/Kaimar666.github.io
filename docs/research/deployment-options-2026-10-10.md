# 个人网站部署方案调研

调研日期：2026-10-10。访问者范围：国内与海外都有（用户已确认）。

范围：GitHub Pages、Cloudflare Pages、Cloudflare Workers Static Assets + Git Builds；静态 Astro 个人网站。仅核实官方文档与官方产品说明，没有创建仓库、授权账号、购买域名或部署网站。

下文「已核实」指一手文档明确说明；「建议／推论」指基于当前网站需求或多个来源形成的判断；「待验证」指尚无实际账号或网络测量支持。免费计划与限制可能调整，正式部署前应重新检查。

## 1. 先回答是否要租服务器

**建议：当前阶段不用购买公网服务器。** 个人介绍、项目展示、长文、随笔、照片、外部入口，可以先构建为静态网页，交给托管平台提供公网访问。Astro 默认在构建时生成页面，静态托管读取生成的文件；增加分类、专栏和文章也能通过重新构建发布，不要求先拥有数据库或服务器。[Astro 渲染方式](https://docs.astro.build/en/guides/on-demand-rendering/)、[Astro 部署概览](https://docs.astro.build/en/guides/deploy/)

这是一条与栏目设计兼容的实施建议，不代表静态站只能做固定展示。搜索、过滤、交互可以在浏览器运行；如果以后加入登录、访客提交、实时数据等，应另行设计服务端功能。Astro 的按请求渲染需要适配相应平台。[Astro 按请求渲染](https://docs.astro.build/en/guides/on-demand-rendering/)

`github.io` 是 GitHub Pages 提供的网址形式。GitHub 仓库保存源码，GitHub Pages 托管构建结果，两者是相关但不同的功能；源码放在 GitHub，也可以由 Cloudflare 构建并托管。[GitHub Pages 是什么](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Workers Git 集成](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)

## 2. 三条路线的取舍

| 项目 | GitHub Pages | Cloudflare Pages | Workers Static Assets + Git Builds |
|---|---|---|---|
| 当前适用方向 | 公开源码、简单静态个人站 | 仍可用的静态托管产品，有成熟 Git 预览流程 | Cloudflare 当前建议的新项目方向，可先只托管静态文件 |
| 免费源码条件 | GitHub Free 使用 Pages 要公开仓库；私有仓库 Pages 需 Pro／Team／相应企业计划 | 官方明确支持公开与私有仓库 | 官方明确 Git 集成与共用 GitHub App；私有仓库支持的证据强度见第 3 节 |
| 平台默认网址 | 用户站 `用户名.github.io`；项目站 `用户名.github.io/仓库名` | `项目名.pages.dev` | `Worker名.账户子域.workers.dev` |
| 自动发布 | GitHub Actions 构建并发布 | Git 推送自动构建发布 | Git Builds 在生产分支推送后构建发布 |
| 非生产预览 | 官方 Pages 部署 Action 的预览仍未提供公共可用能力；需额外方案 | 分支／PR 预览，独立预览 URL | 可启用 Preview Builds；新项目当前使用 `wrangler preview` |
| 回滚方式 | 建议恢复／revert 内容提交后重新部署 | 可立即切回成功的历史生产部署 | 仪表盘或 Wrangler 切回历史版本，最多最近 100 个已发布版本 |
| 国内／海外访问 | 都需实际网络验证 | 都需实际网络验证 | 都需实际网络验证 |

表内来源：[GitHub Pages 基本规则](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[deploy-pages 官方 Action](https://github.com/actions/deploy-pages)、[Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/)、[Pages 预览](https://developers.cloudflare.com/pages/configuration/preview-deployments/)、[Pages 回滚](https://developers.cloudflare.com/pages/configuration/rollbacks/)、[Workers 分支构建](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)、[Workers 默认域名](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)、[Workers 回滚](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)

**已核实的产品方向变化：** Cloudflare Pages 首页仍写明所有计划可用，同时明确推荐新项目使用 Workers。Astro 当前 Cloudflare 部署指南也推荐 Workers，并保留从 Pages 迁移的说明。因此，新建本站时把 Workers 纳入首选评估是有官方依据的；不能把 Pages 描述成已经停服，也不应只依据旧版 Pages 教程制定新项目流程。[Cloudflare Pages 首页](https://developers.cloudflare.com/pages/)、[Astro 当前 Cloudflare 指南](https://docs.astro.build/en/guides/deploy/cloudflare/)

**建议：** 保留 Astro 静态输出的可迁移性；如果希望 GitHub 公开源码且部署尽量集中在一个平台，GitHub Pages 很合理。如果重视分支预览、Cloudflare 后续扩展及当前官方方向，优先评估 Workers Static Assets + Git Builds。最终选择还要结合实际访问测试，不把平台选择直接等同于国内速度选择。

## 3. 免费账号、公开和私有仓库

### GitHub Pages

**已核实：** GitHub Free 可以拥有无限数量的公开和私有仓库，但免费 Pages 仅适用于公开仓库。Pro 支持个人私有仓库的 Pages；组织私有仓库取决于 Team／Enterprise 等相应计划。这里讨论的是「源码仓库是否私有」；用私有源码生成的网站也不因此自动成为仅自己可访问的网站，私有访问控制是另一项企业功能。[GitHub 计划](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)、[Pages 可用计划](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

**设计取舍：** 免费 GitHub Pages 意味着站点源码及保存在该公开仓库中的内容对外可见。若采用该方案，未发布素材与草稿应在内容维护方案中单独考虑。这不是本次新增的产品需求，也不代表用户已经决定公开仓库。

### Cloudflare Pages

**已核实：** Pages 官方 Git 集成指南明确支持公开和私有仓库。它读取已授权的仓库并构建，对外发布网页；可以保留源码仓库私有。Free 的构建数量见下节。[Pages Git 集成入门](https://developers.cloudflare.com/pages/get-started/git-integration/)、[Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)

### Workers Git Builds：私有仓库证据边界

**已核实：** Workers 可连接 GitHub／GitLab 等 Git 提供方；GitHub 文档允许选择授权仓库，并明确 Workers 与 Pages 共用 `Cloudflare Workers and Pages` GitHub App。Git Builds 的额度表包含 Free 计划，没有按源码仓库公开性另设收费项。[Workers Git 集成](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)、[Workers GitHub 集成](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)、[Git Builds 免费额度](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)

**多源推论：** 根据上述共用仓库授权体系与 Pages 对公私仓库的明确支持，Workers Git Builds 可以连接获得授权的私有仓库，是合理且强的产品判断。但本次读取的 Workers 当前集成页面没有直接写出「Free 支持 private repositories」这句完整承诺，不能把这一点伪装成单页原文结论。若将私有仓库作为正式选型条件，实施时应在自己的 Free 账号中验证目标私有仓库可选、首次构建与预览可成功。

**已有一手文档支撑的备用流程：** 源码保留在 GitHub Free 的私有仓库，在本地构建 Astro，再用官方 Wrangler 将 `dist` 静态产物上传到 Workers；这条流程不依赖 Cloudflare Git App 是否能直接连接目标私有仓库。以后可把同样的构建与上传流程放入 CI，但应另行核对 CI 免费额度与部署凭据。Astro 官方明确给出无需适配器的纯静态 `assets.directory: './dist'` 配置和 Wrangler 部署方式。[GitHub Free 私有仓库](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)、[Astro 静态 Cloudflare 部署](https://docs.astro.build/en/guides/deploy/cloudflare/)

**注意区分：** 官方的公开「Deploy to Cloudflare」按钮要求来源仓库公开，这是让其他用户克隆模板的功能限制，不能据此推断自己的 Git Builds 只能连接公开仓库。[Deploy 按钮限制](https://developers.cloudflare.com/workers/platform/deploy-buttons/)

## 4. 免费额度和静态素材限制

| 指标 | GitHub Pages | Cloudflare Pages Free | Workers Static Assets／Builds Free |
|---|---|---|---|
| 静态请求费用 | 免费托管，但有带宽软限制 | 静态资源请求免费且不限量 | 静态资源请求免费且不限量 |
| 流量边界 | 每月 100 GB 带宽软限制 | 不能把 Functions 请求算作免费静态请求 | 不能把 Worker 脚本／SSR 请求算作免费静态请求 |
| 站点／文件数量 | 发布站点最多 1 GB；源码仓库建议不超过 1 GB | 每站最多 20,000 文件 | 每 Worker 版本最多 20,000 文件 |
| 单个静态文件 | Git 正常推送会阻止大于 100 MiB 的文件；这不是 Pages 单资源承诺 | 最大 25 MiB | 最大 25 MiB |
| 构建免费额度 | Pages 标准构建软限制 10 次／小时；自定义 Actions 工作流不受此项限制 | 每月 500 次构建 | 每月 3,000 构建分钟 |
| 同时构建 | 取决于所用 Actions 工作流及账号规则 | 1 次 | 1 次 |
| 单次超时 | Pages 部署超过 10 分钟会超时 | 构建 20 分钟 | 构建 20 分钟 |
| 资产存储收费 | 发布站点受 1 GB 限制 | 本表按静态站 Free 范围比较 | Assets 存储没有额外费用，仍受数量和单文件限制 |

额度来源：[GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)、[GitHub 大文件规则](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)、[Pages 限制](https://developers.cloudflare.com/pages/platform/limits/)、[Pages Functions 与静态请求定价](https://developers.cloudflare.com/pages/functions/pricing/)、[Workers 静态资源费用](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)、[Workers 平台 Static Assets 限制](https://developers.cloudflare.com/workers/platform/limits/)、[Workers Builds 额度](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)

**读表时应避免的误解：**

- 500 次构建与 3,000 构建分钟不是同一种计费单位，不能直接按数字比较大小；文章更新和预览构建都应纳入自己的构建预算。
- Workers 的免费运行时请求额度与免费静态请求是两回事。静态资源直接返回可保持免费静态路径；若配置 `run_worker_first` 让请求先执行脚本，就会计入脚本额度，超过 Free 上限可能返回 429。[Workers 静态计费](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- GitHub 网页上传上限 25 MiB、Git 常规文件上限 100 MiB、Pages 发布站点 1 GB，是不同环节的限制；Git LFS 不能用于 GitHub Pages，不能据此安排大视频托管。[GitHub 大文件](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)、[Git LFS 与 Pages](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)

**素材建议：** 初期文章插图、头像、压缩后的生活照片随站发布；页面展示图按显示尺寸生成，避免把相机原图作为默认网页图片。大视频、原始照片下载、长音频另行评估视频服务或对象存储；Pages 官方将 R2 列为大文件方案，但对象存储／视频产品不是本次静态托管免费承诺的一部分，应单独核实费用与访问体验。[Pages 大文件建议](https://developers.cloudflare.com/pages/platform/limits/)

## 5. Astro 静态部署流程

这些是供后续实施参考的流程说明，不表示当前已经选择或执行。

### A. GitHub Pages

1. 创建相应 GitHub 仓库；免费方案使用公开仓库。
2. Astro 保持静态输出，在配置中设置 `site`。若仓库为 `用户名.github.io`，不用额外 `base`；普通项目站通常设 `base: '/仓库名'`，内部链接与素材路径需适配该前缀。
3. 仓库 Pages 发布源选择 GitHub Actions；使用 Astro 官方 Action 构建，生成并上传站点产物，由 GitHub 官方部署 Action 发布。
4. 生产分支推送触发更新；PR 预览另行配置或先本地检查。

来源：[Astro GitHub 部署指南](https://docs.astro.build/en/guides/deploy/github/)、[GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

**路径取舍：** 采用 `用户名.github.io` 的用户站地址或直接配置独立域名可以避免普通项目站的仓库名前缀。以后改用自定义域名时，需要按实际站点 URL 更新 `site`／`base` 并完整检查站内链接。[Astro GitHub 配置](https://docs.astro.build/en/guides/deploy/github/)

### B. Cloudflare Pages

1. 将源码放在 GitHub／GitLab，授权 Pages 读取目标仓库。
2. 创建 Pages 项目，构建命令 `npm run build`，输出目录 `dist`。
3. 生产分支提交自动构建发布；其他分支／PR 可以生成预览地址。
4. 使用 `项目名.pages.dev`，或在项目中关联自定义域名。

来源：[Pages Astro 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)、[Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/)

### C. Cloudflare Workers Static Assets + Git Builds

1. Astro 保持静态输出，构建得到 `dist`；纯静态站不必安装 SSR 适配器。
2. 用 Wrangler 配置声明 Worker 名称和 `assets.directory: './dist'`；选择生产分支及构建命令 `npm run build`。
3. 连接 Git 仓库并配置 Git Builds。生产提交先构建再部署；需要设计预览时启用 Preview Builds。
4. 当前新项目非生产分支采用 `npx wrangler preview`；正式部署采用 Wrangler 部署命令。实际接入时按平台当前要求核对脚本与版本，不照搬旧 `versions upload` 教程。

来源：[Astro 当前 Cloudflare 指南](https://docs.astro.build/en/guides/deploy/cloudflare/)、[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)、[Workers 构建分支](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)

**实施建议：** 把 Markdown／MDX 内容、素材与呈现组件分开维护；分类元数据独立于托管服务。站点的内容与 Astro 输出不应被某一个平台独有的后台编辑流程锁住。这是基于用户「持续灵活修改补充」目标的架构建议，不是官方托管要求。

## 6. 默认域名与自定义域名

**已核实：** 三种方案都能提供默认域名，先试站无需先买域名。GitHub 用户站与项目站地址形式见前表；Pages 为 `项目名.pages.dev`；Workers 为 `Worker名.账户子域.workers.dev`。Workers 官方建议正式、重要项目使用自定义域名或路由，默认域适合个人／兴趣项目起步。[GitHub Pages URL](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Pages Astro 默认地址](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)、[Workers 默认地址](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

**域名绑定差异：** GitHub Pages 可绑定自己的域名，需要同时配置 Pages 与 DNS。Pages 根域名接入要求该域名为 Cloudflare 活跃 zone；子域名可以使用外部 DNS CNAME 指向项目的 `pages.dev`，但必须先在 Pages 项目中关联。Workers Custom Domains 则要求 Cloudflare 中已有活跃的自有域名 zone，平台创建相应 DNS。[GitHub 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)、[Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)、[Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

**建议：** 打造长期个人 IP 时，独立域名有利于地址识别以及以后迁移托管。域名注册费与静态托管费分开考虑；目前先确定命名与设计即可，尚未授权购买。

## 7. 预览、回滚与发布维护

**GitHub Pages 已核实：** 官方 `actions/deploy-pages` 中 `preview` 功能标为 alpha 且未公共可用，不应承诺标准接入就有自动 PR 预览。**建议：** 初期用本地 Astro 预览，或日后另行配置预览托管；回滚采用还原内容／代码提交后重新部署这一版本管理流程。[官方部署 Action](https://github.com/actions/deploy-pages)

**Pages 已核实：** 每次预览有对应的 hash 地址，并可有分支别名；预览默认公开，可以通过 Cloudflare Access 限制访问。可立即回滚到先前成功的生产部署，预览部署不能直接用于生产回滚。预览网址数量没有限制，不等于构建次数没有限制。[Pages 预览](https://developers.cloudflare.com/pages/configuration/preview-deployments/)、[Pages 回滚](https://developers.cloudflare.com/pages/configuration/rollbacks/)、[Pages 额度](https://developers.cloudflare.com/pages/platform/limits/)

**Workers 已核实：** 新项目可启用非生产分支的 Preview Builds，同一分支更新同一 Preview URL，每次部署另有不可变 Deployment URL。仪表盘或 `wrangler rollback` 可以让之前版本重新成为活动部署，范围为最近 100 个已发布版本；未来若绑定数据库等，回滚代码不代表回滚数据。[Workers GitHub 预览](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)、[Workers 分支控制](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)、[Workers 回滚](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)

**维护建议：** 发布流程设计为「编辑内容 → 本地或分支预览 → 检查文章／图片／手机页面 → 合并生产分支 → 自动发布」，保留 Git 历史作为内容备份。上线前做一次真实回滚演练，而不是仅在计划里写「支持回滚」。

## 8. 国内与海外访问：尚未测量

本次没有对准备采用的域名或真实站点做国内／海外网络实测。不能根据全球 CDN 宣传、第三方印象或默认域名的某一次打开，就写成「国内访问快／稳定」「国内一定打不开」等结论。也不能把默认域名测试结果直接当作独立域名的最终结果。

**待验证计划：** 网站确认后，以同一份实际首页、长文和图片内容，在候选托管上建立可比较的试站；使用计划中的域名或明确注明默认域名。至少检查国内移动网络与固定宽带，以及一个实际海外网络；不通过代理替代目标访客网络。记录不同时间的 DNS／TLS 成功率、首页可读时间、图片加载、长文及视频入口可用性，再决定是否需要更换托管或调整素材外链。

这是用户「国内与海外都有」带来的选型验证要求，不是已经执行的测试结果，也不构成任何平台的服务保证。

## 9. 供主计划记录的建议与待确认项

- **当前建议：** 内容站从 Astro 静态输出起步；无需先租公网服务器，保留托管可迁移性。
- **可行备选：** 公开源码可用 GitHub Pages 免费起步，地址可为 `用户名.github.io`。
- **优先评估：** Cloudflare 当前新项目方向为 Workers Static Assets + Git Builds；Pages 仍可用，保留为比较选项。
- **私有源码备用流程：** GitHub Free 私有仓库 → 本地 Astro 构建 → Wrangler 上传 `dist` 到 Workers；自动 Git 集成的私有仓库条件尚需实际账号验证。
- **尚未用户确认：** 最终托管平台、源码仓库是否公开、独立域名、是否需要自动分支预览、照片／视频采用何种托管方式。
- **实施验证：** Workers Free 私有仓库连接与首个 Git Builds 成功；目标国内／海外网络表现；自定义域名实际解析；预览与回滚演练；素材数量、体积与构建用量。

以上条目记录调研时的建议与证据，不自动构成用户批准。

## 后续决策更新

2026-10-10：用户明确选择“愿意公开仓库，优先使用 GitHub Pages”。因此首期默认采用公开仓库 + GitHub Pages，Cloudflare 保留为以后可选路线；仓库可见性不再待确认。主代理已只读核实现有账号 Kaimar666 和同名 Pages 仓库，具体衔接计划以 [实施方案](../implementation-plan.md) 为准。
