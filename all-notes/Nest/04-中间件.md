# Nest.js 中间件

## 什么是中间件

中间件是在路由处理器之前执行的函数，可以访问请求和响应对象。

## 创建中间件

### 1. 函数式中间件

```typescript
export function logger(req, res, next) {
  console.log(`Request... ${req.method} ${req.url}`);
  next();
}
```

### 2. 类中间件

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}
```

## 应用中间件

### 在模块中应用

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats'); // 应用到 cats 路由
  }
}
```

### 路由匹配

```typescript
// 应用到特定路由
consumer
  .apply(LoggerMiddleware)
  .forRoutes('cats');

// 应用到控制器
consumer
  .apply(LoggerMiddleware)
  .forRoutes(CatsController);

// 排除特定路由
consumer
  .apply(LoggerMiddleware)
  .forRoutes(CatsController)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
  );

// 使用通配符
consumer
  .apply(LoggerMiddleware)
  .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

## 多个中间件

```typescript
consumer
  .apply(cors(), helmet(), logger)
  .forRoutes(CatsController);
```

## 全局中间件

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger); // 全局中间件
  await app.listen(3000);
}
bootstrap();
```

## 功能中间件

```typescript
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}

// 在模块中使用
consumer
  .apply(logger)
  .forRoutes(CatsController);
```

## 异步中间件

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AsyncMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await someAsyncOperation();
    next();
  }
}
```

## 常见中间件示例

### 日志中间件

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      console.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
```

### CORS 中间件

```typescript
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
}
```

### 认证中间件

```typescript
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // 验证 token
    next();
  }
}
```

