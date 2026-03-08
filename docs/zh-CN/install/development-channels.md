---
read_when:
  - 你想�?stable/beta/dev 之间切换
  - 你正在标记或发布预发布版�?summary: stable、beta �?dev 渠道：语义、切换和标签
title: 开发渠�?x-i18n:
  generated_at: "2026-02-03T10:07:21Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 2b01219b7e705044ce39838a0da7c7fa65c719809ab2f8a51e14529064af81bf
  source_path: install/development-channels.md
  workflow: 15
---

# 开发渠�?
最后更新：2026-01-21

RadioClaw 提供三个更新渠道�?
- **stable**：npm dist-tag `latest`�?- **beta**：npm dist-tag `beta`（测试中的构建）�?- **dev**：`main` 的移动头（git）。npm dist-tag：`dev`（发布时）�?
我们将构建发布到 **beta**，进行测试，然后**将经过验证的构建提升�?`latest`**�?版本号不变——dist-tag �?npm 安装的数据源�?
## 切换渠道

Git checkout�?
```bash
RadioClaw update --channel stable
RadioClaw update --channel beta
RadioClaw update --channel dev
```

- `stable`/`beta` 检出最新匹配的标签（通常是同一个标签）�?- `dev` 切换�?`main` 并在上游基础�?rebase�?
npm/pnpm 全局安装�?
```bash
RadioClaw update --channel stable
RadioClaw update --channel beta
RadioClaw update --channel dev
```

这会通过相应�?npm dist-tag（`latest`、`beta`、`dev`）进行更新�?
当你使用 `--channel` **显式**切换渠道时，RadioClaw 还会对齐安装方式�?
- `dev` 确保有一�?git checkout（默�?`~/RadioClaw`，可通过 `RadioClaw_GIT_DIR` 覆盖），
  更新它，并从�?checkout 安装全局 CLI�?- `stable`/`beta` 使用匹配�?dist-tag �?npm 安装�?
提示：如果你想同时使�?stable + dev，保留两个克隆并�?Gateway 网关指向 stable 那个�?
## 插件和渠�?
当你使用 `RadioClaw update` 切换渠道时，RadioClaw 还会同步插件来源�?
- `dev` 优先使用 git checkout 中的内置插件�?- `stable` �?`beta` 恢复 npm 安装的插件包�?
## 标签最佳实�?
- 为你希望 git checkout 落在的发布版本打标签（`vYYYY.M.D` �?`vYYYY.M.D-<patch>`）�?- 保持标签不可变：永远不要移动或重用标签�?- npm dist-tag 仍然�?npm 安装的数据源�?  - `latest` �?stable
  - `beta` �?候选构�?  - `dev` �?main 快照（可选）

## macOS 应用可用�?
Beta �?dev 构建可能**�?*包含 macOS 应用发布。这没问题：

- git 标签�?npm dist-tag 仍然可以发布�?- 在发布说明或变更日志中注�?�?beta �?macOS 构建"�?