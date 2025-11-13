# Nest.js 快速开始

## 安装

### 使用 CLI 创建项目

```bash
# 安装 Nest CLI
npm i -g @nestjs/cli

# 创建新项目
nest new project-name

# 进入项目目录
cd project-name

# 启动开发服务器
npm run start:dev
```

### 手动安装

```bash
npm install @nestjs/core @nestjs/common reflect-metadata rxjs
```

## 项目结构

```
src/
├── main.ts              # 应用入口文件
├── app.module.ts        # 根模块
├── app.controller.ts    # 控制器
└── app.service.ts       # 服务
```

## 第一个应用

### 1. 创建模块 (Module)

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 2. 创建控制器 (Controller)

```typescript
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### 3. 创建服务 (Service)

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### 4. 启动应用

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## 常用命令

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run start:prod

# 构建项目
npm run build

# 生成资源
nest generate controller users
nest generate service users
nest generate module users

# 简写
nest g co users
nest g s users
nest g mo users
```

## 访问应用

启动后访问: `http://localhost:3000`

