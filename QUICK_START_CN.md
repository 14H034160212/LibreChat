# LibreChat 快速启动指南（中文）

本指南将帮助你快速启动和运行 LibreChat。

## 环境要求

- **Node.js**: 18.x 或更高版本（推荐 20.x）
- **MongoDB**: 4.4 或更高版本
- **内存**: 至少 4GB RAM
- **操作系统**: Linux、macOS 或 Windows（支持 WSL）

## 方法一：Docker 快速启动（推荐）

这是最简单的启动方式。

### 1. 安装 Docker 和 Docker Compose

确保你已经安装了 Docker 和 Docker Compose。

### 2. 克隆仓库（如果还没有）

```bash
git clone https://github.com/danny-avila/LibreChat.git
cd LibreChat
```

### 3. 配置环境变量

```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件
nano .env
```

**最小配置（必需）：**

```bash
# MongoDB 连接（Docker 会自动创建）
MONGO_URI=mongodb://mongodb:27017/LibreChat

# OpenAI API 密钥（必需）
OPENAI_API_KEY=sk-your-api-key-here

# 其他可选配置
# ANTHROPIC_API_KEY=your-anthropic-key
# GOOGLE_KEY=your-google-key
```

### 4. 启动 LibreChat

```bash
# 启动所有服务（后台运行）
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

### 5. 访问 LibreChat

打开浏览器访问：**http://localhost:3080**

首次访问需要注册账号。

## 方法二：本地开发启动

如果你想进行开发或自定义修改，使用这个方法。

### 1. 安装 MongoDB

**macOS (使用 Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
从 [MongoDB 官网](https://www.mongodb.com/try/download/community) 下载并安装。

### 2. 安装 Node.js 依赖

```bash
cd /mnt/LibreChat

# 安装所有依赖（包括子包）
npm install

# 或使用 Bun（更快）
# npm install -g bun
# bun install
```

### 3. 配置环境变量

```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件
nano .env
```

**最小配置：**

```bash
# MongoDB 连接
MONGO_URI=mongodb://127.0.0.1:27017/LibreChat

# 服务器配置
HOST=localhost
PORT=3080
DOMAIN_CLIENT=http://localhost:3080
DOMAIN_SERVER=http://localhost:3080

# OpenAI API 密钥（必需）
OPENAI_API_KEY=sk-your-api-key-here

# 会话密钥（用于 JWT）
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# 其他 LLM 提供商（可选）
# ANTHROPIC_API_KEY=your-anthropic-key
# GOOGLE_KEY=your-google-key
# COHERE_API_KEY=your-cohere-key
```

### 4. 构建项目

```bash
# 构建所有包
npm run build:packages

# 构建前端
npm run frontend

# 或使用 Bun
# bun run frontend
```

### 5. 启动开发服务器

**启动后端（终端 1）：**
```bash
npm run backend:dev

# 或
# cd api && npm run dev
```

**启动前端（终端 2）：**
```bash
npm run frontend:dev

# 或
# cd client && npm run dev
```

### 6. 访问 LibreChat

打开浏览器访问：**http://localhost:3090**（开发模式）

生产模式访问：**http://localhost:3080**

## 方法三：使用 Bun 运行（更快）

Bun 是一个更快的 JavaScript 运行时。

### 1. 安装 Bun

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
curl -fsSL https://bun.sh/install | bash
```

### 2. 安装依赖

```bash
cd /mnt/LibreChat
bun install
```

### 3. 运行项目

```bash
# 后端
bun run b:api

# 前端
bun run b:client

# 或同时运行两者（需要两个终端）
```

## 配置 LLM 提供商

### OpenAI（GPT-4、GPT-5 等）

在 `.env` 文件中：

```bash
OPENAI_API_KEY=sk-your-key-here

# 可选：自定义端点
# OPENAI_REVERSE_PROXY=https://your-proxy.com/v1/chat/completions
```

### Anthropic（Claude）

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Google（Gemini）

```bash
GOOGLE_KEY=your-google-api-key
```

### 本地模型（Ollama、LM Studio 等）

在 `librechat.yaml` 中配置：

```yaml
version: 1.2.1
cache: true

endpoints:
  custom:
    - name: "Ollama"
      apiKey: "ollama"
      baseURL: "http://localhost:11434/v1"
      models:
        default: ["llama3", "mistral", "phi3"]
      titleConvo: true
      titleModel: "current_model"
```

## 常用配置

### 启用文件上传

在 `.env` 中：

```bash
# 文件上传限制（MB）
FILE_UPLOAD_SIZE_LIMIT=20

# 文件上传 IP 限制
FILE_UPLOAD_IP_MAX=100
FILE_UPLOAD_IP_WINDOW_MS=3600000
```

### 配置用户注册

在 `librechat.yaml` 中：

```yaml
registration:
  socialLogins: ['google', 'github', 'discord']
  allowedDomains: ['company.com']  # 限制注册域名（可选）
```

### 启用插件和工具

在 `librechat.yaml` 中：

```yaml
interface:
  plugins: true
  agents: true
  fileSearch: true
```

## 常见问题排查

### 问题 1：MongoDB 连接失败

**错误：** `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`

**解决：**
```bash
# 检查 MongoDB 是否运行
sudo systemctl status mongod

# 启动 MongoDB
sudo systemctl start mongod

# 或使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 问题 2：端口已被占用

**错误：** `Error: listen EADDRINUSE: address already in use :::3080`

**解决：**
```bash
# 查找占用端口的进程
lsof -i :3080

# 杀死进程
kill -9 <PID>

# 或在 .env 中修改端口
PORT=3090
```

### 问题 3：npm install 失败

**解决：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用 Bun
bun install
```

### 问题 4：前端构建失败

**解决：**
```bash
# 确保安装了所有包
npm run build:packages

# 清理构建缓存
cd client
rm -rf .next node_modules
npm install
npm run build
```

## 合同分析功能使用

LibreChat 已经具备强大的文档分析能力。要使用合同分析功能：

1. **上传合同文件**
   - 点击聊天界面的"附件"图标
   - 上传 PDF 或 DOCX 文件

2. **使用专门的 Prompt**
   - 查看 `CONTRACT_ANALYSIS_GUIDE.md` 获取详细的 Prompt 模板
   - 这些模板包括：匿名化分析、图表提取、字段提取等

3. **导出结果**
   - 点击对话的"导出"按钮
   - 选择 JSON、Markdown、CSV 等格式

详细的合同分析使用指南请参考：**CONTRACT_ANALYSIS_GUIDE.md**

## 生产环境部署

### 使用 Docker Compose（推荐）

```bash
# 确保配置了正确的环境变量
# 启动所有服务
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d

# 使用 Nginx 反向代理（可选）
```

### 环境变量安全

生产环境中：

```bash
# 使用强密钥
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
CREDS_KEY=$(openssl rand -hex 32)
CREDS_IV=$(openssl rand -hex 16)

# 禁用调试
DEBUG_LOGGING=false
DEBUG_CONSOLE=false

# 配置域名
DOMAIN_CLIENT=https://your-domain.com
DOMAIN_SERVER=https://your-domain.com
```

## 更新 LibreChat

### Docker 方式

```bash
cd /mnt/LibreChat

# 拉取最新代码
git pull origin main

# 重新构建镜像
docker compose build

# 重启服务
docker compose up -d
```

### 本地开发方式

```bash
cd /mnt/LibreChat

# 拉取最新代码
git pull origin main

# 更新依赖
npm install

# 重新构建
npm run build:packages
npm run frontend

# 重启服务
```

## 性能优化

### 1. 启用 Redis 缓存（可选）

```bash
# 在 docker-compose.yml 中添加 Redis 服务
# 在 .env 中配置
REDIS_URI=redis://redis:6379
```

### 2. 配置 CDN（生产环境）

在 `librechat.yaml` 中：

```yaml
cdn:
  enabled: true
  provider: "cloudflare"
```

### 3. 数据库优化

```bash
# 为 MongoDB 创建索引（自动创建，但可以手动优化）
mongo LibreChat --eval "db.messages.createIndex({ conversationId: 1, createdAt: -1 })"
```

## 有用的命令

```bash
# 查看日志
docker compose logs -f

# 重启特定服务
docker compose restart api

# 清理所有数据（警告：会删除数据库）
docker compose down -v

# 备份数据库
mongodump --uri="mongodb://localhost:27017/LibreChat" --out=/path/to/backup

# 恢复数据库
mongorestore --uri="mongodb://localhost:27017/LibreChat" /path/to/backup/LibreChat
```

## 资源链接

- **官方文档**：https://www.librechat.ai/docs
- **GitHub 仓库**：https://github.com/danny-avila/LibreChat
- **Discord 社区**：https://discord.librechat.ai
- **问题反馈**：https://github.com/danny-avila/LibreChat/issues

## 下一步

1. 阅读 `CONTRACT_ANALYSIS_GUIDE.md` 了解如何使用合同分析功能
2. 配置你喜欢的 LLM 提供商
3. 创建自定义 Prompt 模板
4. 探索 Agents 和插件功能

---

**注意：** 本指南基于 LibreChat v0.8.1。某些功能可能在不同版本中有所不同。

祝你使用愉快！ 🎉
