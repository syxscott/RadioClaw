---
read_when:
  - 你使�?`RadioClaw browser` 并想要常见任务的示例
  - 你想通过 node host 控制在另一台机器上运行的浏览器
  - 你想使用 Chrome 扩展中继（通过工具栏按钮附�?分离�?summary: "`RadioClaw browser` �?CLI 参考（配置文件、标签页、操作、扩展中继）"
title: browser
x-i18n:
  generated_at: "2026-02-03T07:44:49Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: af35adfd68726fd519c704d046451effd330458c2b8305e713137fb07b2571fd
  source_path: cli/browser.md
  workflow: 15
---

# `RadioClaw browser`

管理 RadioClaw 的浏览器控制服务器并运行浏览器操作（标签页、快照、截图、导航、点击、输入）�?
相关�?
- 浏览器工�?+ API：[浏览器工具](/tools/browser)
- Chrome 扩展中继：[Chrome 扩展](/tools/chrome-extension)

## 通用标志

- `--url <gatewayWsUrl>`：Gateway 网关 WebSocket URL（默认从配置获取）�?- `--token <token>`：Gateway 网关令牌（如果需要）�?- `--timeout <ms>`：请求超时（毫秒）�?- `--browser-profile <name>`：选择浏览器配置文件（默认从配置获取）�?- `--json`：机器可读输出（在支持的地方）�?
## 快速开始（本地�?
```bash
RadioClaw browser --browser-profile chrome tabs
RadioClaw browser --browser-profile RadioClaw start
RadioClaw browser --browser-profile RadioClaw open https://example.com
RadioClaw browser --browser-profile RadioClaw snapshot
```

## 配置文件

配置文件是命名的浏览器路由配置。实际上�?
- `RadioClaw`：启�?附加到专用的 RadioClaw 管理�?Chrome 实例（隔离的用户数据目录）�?- `chrome`：通过 Chrome 扩展中继控制你现有的 Chrome 标签页�?
```bash
RadioClaw browser profiles
RadioClaw browser create-profile --name work --color "#FF5A36"
RadioClaw browser delete-profile --name work
```

使用特定配置文件�?
```bash
RadioClaw browser --browser-profile work tabs
```

## 标签�?
```bash
RadioClaw browser tabs
RadioClaw browser open https://docs.RadioClaw.ai
RadioClaw browser focus <targetId>
RadioClaw browser close <targetId>
```

## 快照 / 截图 / 操作

快照�?
```bash
RadioClaw browser snapshot
```

截图�?
```bash
RadioClaw browser screenshot
```

导航/点击/输入（基�?ref �?UI 自动化）�?
```bash
RadioClaw browser navigate https://example.com
RadioClaw browser click <ref>
RadioClaw browser type <ref> "hello"
```

## Chrome 扩展中继（通过工具栏按钮附加）

此模式让智能体控制你手动附加的现�?Chrome 标签页（不会自动附加）�?
将未打包的扩展安装到稳定路径�?
```bash
RadioClaw browser extension install
RadioClaw browser extension path
```

然后 Chrome �?`chrome://extensions` �?启用"开发者模�? �?"加载已解压的扩展程序" �?选择打印的文件夹�?
完整指南：[Chrome 扩展](/tools/chrome-extension)

## 远程浏览器控制（node host 代理�?
如果 Gateway 网关与浏览器运行在不同的机器上，在有 Chrome/Brave/Edge/Chromium 的机器上运行 **node host**。Gateway 网关会将浏览器操作代理到该节点（无需单独的浏览器控制服务器）�?
使用 `gateway.nodes.browser.mode` 控制自动路由，使�?`gateway.nodes.browser.node` 在连接多个节点时固定特定节点�?
安全 + 远程设置：[浏览器工具](/tools/browser)、[远程访问](/gateway/remote)、[Tailscale](/gateway/tailscale)、[安全](/gateway/security)
