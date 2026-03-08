---
read_when:
  - 安装 RadioClaw
  - 你想�?GitHub 安装
summary: 安装 RadioClaw（推荐安装器、全局安装或从源代码安装）
title: 安装
x-i18n:
  generated_at: "2026-02-03T10:07:43Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: b26f48c116c26c163ee0090fb4c3e29622951bd427ecaeccba7641d97cfdf17a
  source_path: install/index.md
  workflow: 15
---

# 安装

除非有特殊原因，否则请使用安装器。它会设�?CLI 并运行新手引导�?
## 快速安装（推荐�?
```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash
```

Windows（PowerShell）：

```powershell
iwr -useb https://RadioClaw.ai/install.ps1 | iex
```

下一步（如果你跳过了新手引导）：

```bash
RadioClaw onboard --install-daemon
```

## 系统要求

- **Node >=22**
- macOS、Linux 或通过 WSL2 �?Windows
- `pnpm` 仅在从源代码构建时需�?
## 选择安装路径

### 1）安装器脚本（推荐）

通过 npm 全局安装 `RadioClaw` 并运行新手引导�?
```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash
```

安装器标志：

```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --help
```

详情：[安装器内部原理](/install/installer)�?
非交互式（跳过新手引导）�?
```bash
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --no-onboard
```

### 2）全局安装（手动）

如果你已经有 Node�?
```bash
npm install -g RadioClaw@latest
```

如果你全局安装�?libvips（macOS 上通过 Homebrew 安装很常见）�?`sharp` 安装失败，请强制使用预构建二进制文件�?
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g RadioClaw@latest
```

如果你看�?`sharp: Please add node-gyp to your dependencies`，要么安装构建工具（macOS：Xcode CLT + `npm install -g node-gyp`），要么使用上面�?`SHARP_IGNORE_GLOBAL_LIBVIPS=1` 变通方法来跳过原生构建�?
或使�?pnpm�?
```bash
pnpm add -g RadioClaw@latest
pnpm approve-builds -g                # 批准 RadioClaw、node-llama-cpp、sharp �?pnpm add -g RadioClaw@latest           # 重新运行以执�?postinstall 脚本
```

pnpm 需要显式批准带有构建脚本的包。在首次安装显示"Ignored build scripts"警告后，运行 `pnpm approve-builds -g` 并选择列出的包，然后重新运行安装以执行 postinstall 脚本�?
然后�?
```bash
RadioClaw onboard --install-daemon
```

### 3）从源代码（贡献�?开发）

```bash
git clone https://github.com/RadioClaw/RadioClaw.git
cd RadioClaw
pnpm install
pnpm ui:build # 首次运行时自动安�?UI 依赖
pnpm build
RadioClaw onboard --install-daemon
```

提示：如果你还没有全局安装，请通过 `pnpm RadioClaw ...` 运行仓库命令�?
### 4）其他安装选项

- Docker：[Docker](/install/docker)
- Nix：[Nix](/install/nix)
- Ansible：[Ansible](/install/ansible)
- Bun（仅 CLI）：[Bun](/install/bun)

## 安装�?
- 运行新手引导：`RadioClaw onboard --install-daemon`
- 快速检查：`RadioClaw doctor`
- 检�?Gateway 网关健康状态：`RadioClaw status` + `RadioClaw health`
- 打开仪表板：`RadioClaw dashboard`

## 安装方式：npm vs git（安装器�?
安装器支持两种方式：

- `npm`（默认）：`npm install -g RadioClaw@latest`
- `git`：从 GitHub 克隆/构建并从源代�?checkout 运行

### CLI 标志

```bash
# 显式 npm
curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --install-method npm

# �?GitHub 安装（源代码 checkout�?curl -fsSL https://RadioClaw.ai/install.sh | bash -s -- --install-method git
```

常用标志�?
- `--install-method npm|git`
- `--git-dir <path>`（默认：`~/RadioClaw`�?- `--no-git-update`（使用现�?checkout 时跳�?`git pull`�?- `--no-prompt`（禁用提示；CI/自动化中必需�?- `--dry-run`（打印将要执行的操作；不做任何更改）
- `--no-onboard`（跳过新手引导）

### 环境变量

等效的环境变量（对自动化有用）：

- `RadioClaw_INSTALL_METHOD=git|npm`
- `RadioClaw_GIT_DIR=...`
- `RadioClaw_GIT_UPDATE=0|1`
- `RadioClaw_NO_PROMPT=1`
- `RadioClaw_DRY_RUN=1`
- `RadioClaw_NO_ONBOARD=1`
- `SHARP_IGNORE_GLOBAL_LIBVIPS=0|1`（默认：`1`；避�?`sharp` 针对系统 libvips 构建�?
## 故障排除：找不到 `RadioClaw`（PATH�?
快速诊断：

```bash
node -v
npm -v
npm prefix -g
echo "$PATH"
```

如果 `$(npm prefix -g)/bin`（macOS/Linux）或 `$(npm prefix -g)`（Windows�?*�?*�?`echo "$PATH"` 的输出中，你�?shell 无法找到全局 npm 二进制文件（包括 `RadioClaw`）�?
修复：将其添加到你的 shell 启动文件（zsh：`~/.zshrc`，bash：`~/.bashrc`）：

```bash
# macOS / Linux
export PATH="$(npm prefix -g)/bin:$PATH"
```

�?Windows 上，�?`npm prefix -g` 的输出添加到你的 PATH�?
然后打开新终端（或在 zsh 中执�?`rehash` / �?bash 中执�?`hash -r`）�?
## 更新/卸载

- 更新：[更新](/install/updating)
- 迁移到新机器：[迁移](/install/migrating)
- 卸载：[卸载](/install/uninstall)
