# Nest.js 部署

## 构建应用

### 生产构建

```bash
npm run build
```

这会生成 `dist` 目录，包含编译后的 JavaScript 文件。

### 启动生产服务器

```bash
npm run start:prod
```

## Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### .dockerignore

```
node_modules
dist
.git
.env
*.md
```

### 构建和运行

```bash
# 构建镜像
docker build -t nest-app .

# 运行容器
docker run -p 3000:3000 nest-app
```

## Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=testdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 运行

```bash
docker-compose up -d
```

## PM2 部署

### 安装 PM2

```bash
npm install -g pm2
```

### 启动应用

```bash
pm2 start dist/main.js --name nest-app
```

### PM2 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'nest-app',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

### 使用配置文件启动

```bash
pm2 start ecosystem.config.js --env production
```

### 常用 PM2 命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs nest-app

# 重启应用
pm2 restart nest-app

# 停止应用
pm2 stop nest-app

# 删除应用
pm2 delete nest-app

# 保存当前进程列表
pm2 save

# 设置开机自启
pm2 startup
```

## Nginx 反向代理

### Nginx 配置

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 环境变量

### 生产环境变量

```env
NODE_ENV=production
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_NAME=production_db
JWT_SECRET=your-secret-key
```

### 使用环境变量

```bash
# 直接设置
NODE_ENV=production npm run start:prod

# 使用 .env 文件
npm install dotenv
```

## 健康检查

### 健康检查端点

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

### Docker 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

## 日志管理

### 使用 Winston

```bash
npm install nest-winston winston
```

```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

## 性能优化

### 1. 启用压缩

```bash
npm install compression
```

```typescript
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  await app.listen(3000);
}
```

### 2. 启用 Helmet

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  await app.listen(3000);
}
```

### 3. 集群模式

```typescript
import { cluster } from 'cluster';
import { cpus } from 'os';

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
  bootstrap();
}
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm run test

      - name: Deploy
        run: |
          # 部署脚本
```

## 监控

### 使用 Sentry

```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'your-dsn',
  integrations: [new ProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
```

## 最佳实践

1. **使用环境变量**：不要在代码中硬编码配置
2. **启用 HTTPS**：在生产环境使用 HTTPS
3. **设置 CORS**：正确配置跨域请求
4. **日志记录**：记录重要操作和错误
5. **监控和告警**：设置应用监控和告警
6. **备份数据库**：定期备份数据库
7. **安全更新**：及时更新依赖包
8. **资源限制**：设置适当的资源限制

