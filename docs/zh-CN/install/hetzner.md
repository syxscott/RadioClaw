---
read_when:
  - 你想�?RadioClaw 在云 VPS �?24/7 运行（而不是你的笔记本电脑�?  - 你想在自己的 VPS 上运行生产级、永久在线的 Gateway 网关
  - 你想完全控制持久化、二进制文件和重启行�?  - 你在 Hetzner 或类似提供商上用 Docker 运行 RadioClaw
summary: 在廉价的 Hetzner VPS（Docker）上 24/7 运行 RadioClaw Gateway 网关，带持久状态和内置二进制文�?title: Hetzner
x-i18n:
  generated_at: "2026-02-03T07:52:17Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 84d9f24f1a803aa15faa52a05f25fe557ec3e2c2f48a00c701d49764bd3bc21a
  source_path: platforms/hetzner.md
  workflow: 15
---

# �?Hetzner 上运�?RadioClaw（Docker，生�?VPS 指南�?
## 目标

使用 Docker �?Hetzner VPS 上运行持久的 RadioClaw Gateway 网关，带持久状态、内置二进制文件和安全的重启行为�?
如果你想�?�?$5 实现 RadioClaw 24/7"，这是最简单可靠的设置�?Hetzner 定价会变化；选择最小的 Debian/Ubuntu VPS，如果遇�?OOM 再扩容�?
## 我们在做什么（简单说明）�?
- 租用一台小�?Linux 服务器（Hetzner VPS�?- 安装 Docker（隔离的应用运行时）
- �?Docker 中启�?RadioClaw Gateway 网关
- 在主机上持久�?`~/.RadioClaw` + `~/.RadioClaw/workspace`（重�?重建后保留）
- 通过 SSH 隧道从你的笔记本电脑访问控制 UI

Gateway 网关可以通过以下方式访问�?
- 从你的笔记本电脑进行 SSH 端口转发
- 如果你自己管理防火墙和令牌，可以直接暴露端口

本指南假设在 Hetzner 上使�?Ubuntu �?Debian�?如果你使用其�?Linux VPS，请相应地映射软件包�?通用 Docker 流程请参�?[Docker](/install/docker)�?
---

## 快速路径（有经验的运维人员�?
1. 配置 Hetzner VPS
2. 安装 Docker
3. 克隆 RadioClaw 仓库
4. 创建持久化主机目�?5. 配置 `.env` �?`docker-compose.yml`
6. 将所需二进制文件烘焙到镜像�?7. `docker compose up -d`
8. 验证持久化和 Gateway 网关访问

---

## 你需要什�?
- 具有 root 访问权限�?Hetzner VPS
- 从你的笔记本电脑进行 SSH 访问
- 基本熟悉 SSH + 复制/粘贴
- �?20 分钟
- Docker �?Docker Compose
- 模型认证凭证
- 可选的提供商凭�?  - WhatsApp 二维�?  - Telegram 机器人令�?  - Gmail OAuth

---

## 1) 配置 VPS

�?Hetzner 中创建一�?Ubuntu �?Debian VPS�?
�?root 身份连接�?
```bash
ssh root@YOUR_VPS_IP
```

本指南假�?VPS 是有状态的�?不要将其视为一次性基础设施�?
---

## 2) 安装 Docker（在 VPS 上）

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

验证�?
```bash
docker --version
docker compose version
```

---

## 3) 克隆 RadioClaw 仓库

```bash
git clone https://github.com/RadioClaw/RadioClaw.git
cd RadioClaw
```

本指南假设你将构建自定义镜像以保证二进制文件持久化�?
---

## 4) 创建持久化主机目�?
Docker 容器是临时的�?所有长期状态必须存储在主机上�?
```bash
mkdir -p /root/.RadioClaw
mkdir -p /root/.RadioClaw/workspace

# 将所有权设置为容器用户（uid 1000）：
chown -R 1000:1000 /root/.RadioClaw
chown -R 1000:1000 /root/.RadioClaw/workspace
```

---

## 5) 配置环境变量

在仓库根目录创建 `.env`�?
```bash
RadioClaw_IMAGE=RadioClaw:latest
RadioClaw_GATEWAY_TOKEN=change-me-now
RadioClaw_GATEWAY_BIND=lan
RadioClaw_GATEWAY_PORT=18789

RadioClaw_CONFIG_DIR=/root/.RadioClaw
RadioClaw_WORKSPACE_DIR=/root/.RadioClaw/workspace

GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.RadioClaw
```

生成强密钥：

```bash
openssl rand -hex 32
```

**不要提交此文件�?*

---

## 6) Docker Compose 配置

创建或更�?`docker-compose.yml`�?
```yaml
services:
  RadioClaw-gateway:
    image: ${RadioClaw_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - RadioClaw_GATEWAY_BIND=${RadioClaw_GATEWAY_BIND}
      - RadioClaw_GATEWAY_PORT=${RadioClaw_GATEWAY_PORT}
      - RadioClaw_GATEWAY_TOKEN=${RadioClaw_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${RadioClaw_CONFIG_DIR}:/home/node/.RadioClaw
      - ${RadioClaw_WORKSPACE_DIR}:/home/node/.RadioClaw/workspace
    ports:
      # 推荐：在 VPS 上保�?Gateway 网关仅限 loopback；通过 SSH 隧道访问�?      # 要公开暴露，移�?`127.0.0.1:` 前缀并相应配置防火墙�?      - "127.0.0.1:${RadioClaw_GATEWAY_PORT}:18789"

      # 可选：仅当你对�?VPS 运行 iOS/Android 节点并需�?Canvas 主机时�?      # 如果你公开暴露此端口，请阅�?/gateway/security 并相应配置防火墙�?      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${RadioClaw_GATEWAY_BIND}",
        "--port",
        "${RadioClaw_GATEWAY_PORT}",
      ]
```

---

## 7) 将所需二进制文件烘焙到镜像中（关键�?
在运行中的容器内安装二进制文件是一个陷阱�?任何在运行时安装的东西都会在重启时丢失�?
所�?skills 所需的外部二进制文件必须在镜像构建时安装�?
以下示例仅展示三个常见二进制文件�?
- `gog` 用于 Gmail 访问
- `goplaces` 用于 Google Places
- `wacli` 用于 WhatsApp

这些是示例，不是完整列表�?你可以使用相同的模式安装任意数量的二进制文件�?
如果你以后添加依赖额外二进制文件的新 skills，你必须�?
1. 更新 Dockerfile
2. 重新构建镜像
3. 重启容器

**示例 Dockerfile**

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# 示例二进制文�?1：Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog

# 示例二进制文�?2：Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces

# 示例二进制文�?3：WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

# 使用相同模式在下方添加更多二进制文件

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

---

## 8) 构建并启�?
```bash
docker compose build
docker compose up -d RadioClaw-gateway
```

验证二进制文件：

```bash
docker compose exec RadioClaw-gateway which gog
docker compose exec RadioClaw-gateway which goplaces
docker compose exec RadioClaw-gateway which wacli
```

预期输出�?
```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

---

## 9) 验证 Gateway 网关

```bash
docker compose logs -f RadioClaw-gateway
```

成功�?
```
[gateway] listening on ws://0.0.0.0:18789
```

从你的笔记本电脑�?
```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

打开�?
`http://127.0.0.1:18789/`

粘贴你的 Gateway 网关令牌�?
---

## 持久化位置（事实来源�?
RadioClaw �?Docker 中运行，�?Docker 不是事实来源�?所有长期状态必须在重启、重建和重启后保留�?
| 组件             | 位置                              | 持久化机�?   | 说明                        |
| ---------------- | --------------------------------- | ------------- | --------------------------- |
| Gateway 网关配置 | `/home/node/.RadioClaw/`           | 主机卷挂�?   | 包括 `RadioClaw.json`、令�? |
| 模型认证配置文件 | `/home/node/.RadioClaw/`           | 主机卷挂�?   | OAuth 令牌、API 密钥        |
| Skill 配置       | `/home/node/.RadioClaw/skills/`    | 主机卷挂�?   | Skill 级别状�?             |
| 智能体工作区     | `/home/node/.RadioClaw/workspace/` | 主机卷挂�?   | 代码和智能体产物            |
| WhatsApp 会话    | `/home/node/.RadioClaw/`           | 主机卷挂�?   | 保留二维码登�?             |
| Gmail 密钥�?    | `/home/node/.RadioClaw/`           | 主机�?+ 密码 | 需�?`GOG_KEYRING_PASSWORD` |
| 外部二进制文�?  | `/usr/local/bin/`                 | Docker 镜像   | 必须在构建时烘焙            |
| Node 运行�?     | 容器文件系统                      | Docker 镜像   | 每次镜像构建时重�?         |
| 操作系统�?      | 容器文件系统                      | Docker 镜像   | 不要在运行时安装            |
| Docker 容器      | 临时�?                           | 可重�?       | 可以安全销�?               |
