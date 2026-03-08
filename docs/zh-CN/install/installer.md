---
read_when:
  - 你想了解 `RadioClaw.ai/install.sh` 的工作机�?  - 你想自动化安装（CI / 无头环境�?  - 你想�?GitHub 检出安�?summary: 安装器脚本的工作原理（install.sh + install-cli.sh）、参数和自动�?title: 安装器内部机�?x-i18n:
  generated_at: "2026-02-01T21:07:55Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 9e0a19ecb5da0a395030e1ccf0d4bedf16b83946b3432c5399d448fe5d298391
  source_path: install/installer.md
  workflow: 14
---

# 安装器内部机�?
RadioClaw 提供两个安装器脚本（托管�?`RadioClaw.ai`）：

- `https://RadioClaw.ai/install.sh` �?"推荐"安装器（默认全局 npm 安装；也可从 GitHub 检出安装）
- `https://RadioClaw.ai/install-cli.sh` �?无需 root 权限�?CLI 安装器（安装到带有独�?Node 的前缀目录�?- `https://RadioClaw.ai/install.ps1` �?Windows PowerShell 安装器（默认 npm；可�?git 安装�?
查看当前参数/行为，运行：

```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --help
```

Windows (PowerShell) 帮助�?
```powershell
& ([scriptblock]::Create((iwr -useb https://RadioClaw.ai/install.ps1))) -?
```

如果安装器完成但在新终端中找不到 `RadioClaw`，通常�?Node/npm PATH 问题。参见：[安装](/install#nodejs--npm-path-sanity)�?
## install.sh（推荐）

功能概述�?
- 检测操作系统（macOS / Linux / WSL）�?- 确保 Node.js **22+**（macOS 通过 Homebrew；Linux 通过 NodeSource）�?- 选择安装方式�?  - `npm`（默认）：`npm install -g RadioClaw@latest`
  - `git`：克�?构建源码检出并安装包装脚本
- �?Linux 上：必要时将 npm 前缀切换�?`~/.npm-global`，以避免全局 npm 权限错误�?- 如果是升级现有安装：运行 `RadioClaw doctor --non-interactive`（尽力执行）�?- 对于 git 安装：安�?更新后运�?`RadioClaw doctor --non-interactive`（尽力执行）�?- 通过默认设置 `SHARP_IGNORE_GLOBAL_LIBVIPS=1` 来缓�?`sharp` 原生安装问题（避免使用系�?libvips 编译）�?
如果�?希望* `sharp` 链接到全局安装�?libvips（或你正在调试），请设置�?
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=0 curl -fsSL https://RadioClaw.ai/install.sh | bash
```

### 可发现�?/ "git 安装"提示

如果你在**已有�?RadioClaw 源码检出目录中**运行安装器（通过 `package.json` + `pnpm-workspace.yaml` 检测），它会提示：

- 更新并使用此检出（`git`�?- 或迁移到全局 npm 安装（`npm`�?
在非交互式上下文中（�?TTY / `--no-prompt`），你必须传�?`--install-method git|npm`（或设置 `RadioClaw_INSTALL_METHOD`），否则脚本将以退出码 `2` 退出�?
### 为什么需�?Git

`--install-method git` 路径（克�?/ 拉取）需�?Git�?
对于 `npm` 安装，Git *通常*不是必需的，但某些环境仍然需要它（例如通过 git URL 获取软件包或依赖时）。安装器目前会确�?Git 存在，以避免在全新发行版上出�?`spawn git ENOENT` 错误�?
### 为什么在全新 Linux �?npm 会报 `EACCES`

在某�?Linux 设置中（尤其是通过系统包管理器�?NodeSource 安装 Node 后），npm 的全局前缀指向 root 拥有的位置。此�?`npm install -g ...` 会报 `EACCES` / `mkdir` 权限错误�?
`install.sh` 通过将前缀切换到以下位置来缓解此问题：

- `~/.npm-global`（并在存在时将其添加�?`~/.bashrc` / `~/.zshrc` �?`PATH` 中）

## install-cli.sh（无需 root 权限�?CLI 安装器）

此脚本将 `RadioClaw` 安装到前缀目录（默认：`~/.RadioClaw`），同时在该前缀下安装专用的 Node 运行时，因此可以在不想改动系�?Node/npm 的机器上使用�?
帮助�?
```bash
curl -fsSL https://RadioClaw.ai/install-cli.sh | bash -s -- --help
```

## install.ps1（Windows PowerShell�?
功能概述�?
- 确保 Node.js **22+**（winget/Chocolatey/Scoop 或手动安装）�?- 选择安装方式�?  - `npm`（默认）：`npm install -g RadioClaw@latest`
  - `git`：克�?构建源码检出并安装包装脚本
- 在升级和 git 安装时运�?`RadioClaw doctor --non-interactive`（尽力执行）�?
示例�?
```powershell
iwr -useb https://RadioClaw.ai/install.ps1 | iex
```

```powershell
iwr -useb https://RadioClaw.ai/install.ps1 | iex -InstallMethod git
```

```powershell
iwr -useb https://RadioClaw.ai/install.ps1 | iex -InstallMethod git -GitDir "C:\\RadioClaw"
```

环境变量�?
- `RadioClaw_INSTALL_METHOD=git|npm`
- `RadioClaw_GIT_DIR=...`

Git 要求�?
如果你选择 `-InstallMethod git` 但未安装 Git，安装器会打�?Git for Windows 的链接（`https://git-scm.com/download/win`）并退出�?
常见 Windows 问题�?
- **npm error spawn git / ENOENT**：安�?Git for Windows 并重新打开 PowerShell，然后重新运行安装器�?- **"RadioClaw" 不是可识别的命令**：你�?npm 全局 bin 文件夹不�?PATH 中。大多数系统使用 `%AppData%\\npm`。你也可以运�?`npm config get prefix` 并将 `\\bin` 添加�?PATH，然后重新打开 PowerShell�?