# Docker 部署前端项目教程

## 1. Docker 基础

### 1.1 什么是 Docker

Docker 是一个开源的应用容器引擎，可以让开发者打包应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 操作系统上。

### 1.2 核心概念

```
┌────────────────────────────────────────────────────────┐
│                    Docker 核心概念                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📦 Image (镜像)                                        │
│  ├─ 只读模板，包含创建容器的指令                           │
│  └─ 类似于虚拟机的快照                                    │
│                                                        │
│  🐳 Container (容器)                                    │
│  ├─ 镜像的运行实例                                       │
│  └─ 独立运行的应用环境                                    │
│                                                        │
│  📝 Dockerfile                                         │
│  ├─ 构建镜像的脚本文件                                    │
│  └─ 包含一系列指令和配置                                   │
│                                                        │
│  🌐 Registry (仓库)                                     │
│  ├─ 存储和分发镜像                                       │
│  └─ Docker Hub / 阿里云镜像等                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 2. 安装 Docker

### 2.1 Windows 安装

```bash
# 1. 下载 Docker Desktop for Windows
# https://www.docker.com/products/docker-desktop

# 2. 安装并启动 Docker Desktop

# 3. 验证安装
docker --version
docker run hello-world
```

### 2.2 Mac 安装

```bash
# 1. 下载 Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop

# 2. 安装并启动 Docker Desktop

# 3. 验证安装
docker --version
docker run hello-world
```

### 2.3 Linux 安装

```bash
# Ubuntu
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# CentOS
sudo yum install docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker run hello-world
```

## 3. 创建 Dockerfile

### 3.1 基础 Dockerfile

```dockerfile
# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 3.2 多阶段构建（推荐）

```dockerfile
# 阶段1：构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 阶段2：生产阶段
FROM nginx:alpine

# 复制构建产物到 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 React 项目 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/build /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3.4 Vue 项目 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

## 4. Nginx 配置

### 4.1 基础 Nginx 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

### 4.2 带 API 代理的配置

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # API 代理
    location /api/ {
        proxy_pass http://backend-service:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 5. Docker Compose

### 5.1 docker-compose.yml 基础配置

```yaml
version: '3.8'

services:
  # 前端服务
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: always
  
  # 后端服务
  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "3000:3000"
    command: npm start
    networks:
      - app-network
    restart: always

networks:
  app-network:
    driver: bridge
```

### 5.2 完整项目配置

```yaml
version: '3.8'

services:
  # 前端
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    environment:
      - NODE_ENV=production
    restart: always
  
  # 后端 API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    networks:
      - app-network
    restart: always
  
  # 数据库
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: always
  
  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: always

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### 5.3 开发环境配置

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
  
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

## 6. 构建 and 运行

### 6.1 构建镜像

```bash
# 构建镜像
docker build -t my-frontend:latest .

# 带标签的构建
docker build -t my-frontend:v1.0.0 .

# 使用特定 Dockerfile
docker build -f Dockerfile.prod -t my-frontend:prod .

# 不使用缓存构建
docker build --no-cache -t my-frontend:latest .

# 构建时传递参数
docker build --build-arg NODE_ENV=production -t my-frontend:latest .
```

### 6.2 运行容器

```bash
# 运行容器
docker run -d -p 80:80 --name my-app my-frontend:latest

# 带环境变量运行
docker run -d -p 80:80 \
  -e NODE_ENV=production \
  --name my-app \
  my-frontend:latest

# 挂载卷运行
docker run -d -p 80:80 \
  -v $(pwd)/dist:/usr/share/nginx/html \
  --name my-app \
  my-frontend:latest

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop my-app

# 启动容器
docker start my-app

# 删除容器
docker rm my-app

# 强制删除运行中的容器
docker rm -f my-app
```

### 6.3 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 构建并启动
docker-compose up -d --build

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend

# 重启服务
docker-compose restart

# 停止并删除所有容器、网络、卷
docker-compose down -v

# 使用开发配置
docker-compose -f docker-compose.dev.yml up -d
```

## 7. 环境变量管理

### 7.1 使用 .env 文件

```bash
# .env
NODE_ENV=production
API_URL=https://api.example.com
APP_PORT=80
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      args:
        - NODE_ENV=${NODE_ENV}
    environment:
      - API_URL=${API_URL}
    ports:
      - "${APP_PORT}:80"
```

### 7.2 多环境配置

```bash
# .env.development
NODE_ENV=development
API_URL=http://localhost:3000

# .env.production
NODE_ENV=production
API_URL=https://api.example.com

# .env.staging
NODE_ENV=staging
API_URL=https://staging-api.example.com
```

```bash
# 使用不同环境配置
docker-compose --env-file .env.development up -d
docker-compose --env-file .env.production up -d
```

## 8. 优化最佳实践

### 8.1 镜像优化

```dockerfile
# ✅ 使用 alpine 基础镜像（更小）
FROM node:18-alpine

# ✅ 使用多阶段构建
FROM node:18-alpine AS builder
# ...构建过程

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# ✅ 合并 RUN 指令
RUN apk add --no-cache git curl && \
    npm install && \
    npm run build

# ✅ 清理缓存
RUN npm ci --only=production && \
    npm cache clean --force

# ✅ 使用 .dockerignore 排除不必要的文件
```

### 8.2 .dockerignore 文件

```
# .dockerignore
node_modules
npm-debug.log
build
dist
.git
.gitignore
.env.local
.env.development.local
.env.test.local
.env.production.local
README.md
.DS_Store
coverage
.idea
*.log
```

### 8.3 缓存优化

```dockerfile
# ✅ 利用层缓存：先复制 package.json
COPY package*.json ./
RUN npm ci

# 再复制源代码
COPY . .
RUN npm run build

# ❌ 不好：每次都重新安装依赖
COPY . .
RUN npm install
RUN npm run build
```

### 8.4 安全最佳实践

```dockerfile
# ✅ 使用非 root 用户
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

COPY --chown=nextjs:nodejs . .

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# ✅ 最小化镜像层数
RUN apk add --no-cache \
    git \
    curl \
    && rm -rf /var/cache/apk/*

# ✅ 不在镜像中存储敏感信息
# 使用环境变量或 secrets
```

## 9. CI/CD 集成

### 9.1 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: docker build -t my-frontend:${{ github.sha }} .
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Push to Docker Hub
        run: |
          docker tag my-frontend:${{ github.sha }} username/my-frontend:latest
          docker push username/my-frontend:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull username/my-frontend:latest
            docker-compose -f /app/docker-compose.yml up -d
```

### 9.2 GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t my-frontend:$CI_COMMIT_SHA .
    - docker tag my-frontend:$CI_COMMIT_SHA my-frontend:latest
  only:
    - main

deploy:
  stage: deploy
  image: docker:latest
  script:
    - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
    - docker push my-frontend:latest
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker pull my-frontend:latest && docker-compose up -d"
  only:
    - main
```

## 10. 常用命令速查

### 10.1 镜像命令

```bash
# 列出镜像
docker images

# 删除镜像
docker rmi my-frontend:latest

# 删除所有未使用的镜像
docker image prune

# 查看镜像详情
docker inspect my-frontend:latest

# 导出镜像
docker save -o my-frontend.tar my-frontend:latest

# 导入镜像
docker load -i my-frontend.tar

# 推送镜像
docker push username/my-frontend:latest

# 拉取镜像
docker pull username/my-frontend:latest
```

### 10.2 容器命令

```bash
# 查看容器日志
docker logs my-app

# 实时查看日志
docker logs -f my-app

# 进入容器
docker exec -it my-app sh

# 复制文件到容器
docker cp file.txt my-app:/app/

# 从容器复制文件
docker cp my-app:/app/file.txt ./

# 查看容器资源使用
docker stats my-app

# 查看容器进程
docker top my-app

# 导出容器
docker export my-app > my-app.tar

# 导入容器
docker import my-app.tar my-app:imported
```

### 10.3 清理命令

```bash
# 删除所有停止的容器
docker container prune

# 删除所有未使用的镜像
docker image prune -a

# 删除所有未使用的网络
docker network prune

# 删除所有未使用的卷
docker volume prune

# 一键清理
docker system prune -a --volumes
```

## 11. 故障排查

### 11.1 常见问题

```bash
# 容器无法启动
docker logs my-app

# 进入容器调试
docker exec -it my-app sh

# 检查容器状态
docker inspect my-app

# 检查网络连接
docker network ls
docker network inspect app-network

# 检查资源使用
docker stats

# 检查磁盘使用
docker system df
```

### 11.2 调试技巧

```bash
# 使用交互模式运行
docker run -it --rm my-frontend sh

# 使用调试配置
docker-compose -f docker-compose.debug.yml up

# 查看构建过程
docker build --progress=plain -t my-frontend .

# 检查层缓存
docker history my-frontend:latest
```
