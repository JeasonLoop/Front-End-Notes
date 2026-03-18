# Nest.js 拦截器

## 什么是拦截器

拦截器是一个使用 `@Injectable()` 装饰器的类，实现了 `NestInterceptor` 接口。拦截器可以：
1. 在方法执行前后添加额外逻辑
2. 转换函数返回的结果
3. 转换函数抛出的异常
4. 扩展基本函数行为
5. 根据某些条件完全覆盖函数

## 创建拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

## 使用拦截器

### 控制器级别

```typescript
@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

### 方法级别

```typescript
@Get()
@UseInterceptors(LoggingInterceptor)
findAll() {
  return this.catsService.findAll();
}
```

### 全局拦截器

```typescript
// main.ts
app.useGlobalInterceptors(new LoggingInterceptor());
```

### 模块级别

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## 响应映射拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        message: 'success',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## 异常映射拦截器

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err =>
          throwError(() => new HttpException('New message', HttpStatus.BAD_GATEWAY)),
        ),
      );
  }
}
```

## 超时拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
```

## 缓存拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.url;

    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return next.handle().pipe(
      tap(response => {
        this.cache.set(key, response);
      }),
    );
  }
}
```

## 日志拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;
          this.logger.log(`${method} ${url} ${statusCode} - ${delay}ms`);
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(`${method} ${url} - ${delay}ms - ${error.message}`);
        },
      }),
    );
  }
}
```

## 性能监控拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const { method, url } = request;

        if (duration > 1000) {
          console.warn(`Slow request: ${method} ${url} took ${duration}ms`);
        }
      }),
    );
  }
}
```

## 数据转换拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map(value => value === null ? '' : value),
      );
  }
}
```

## 组合多个拦截器

```typescript
@Controller('cats')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CatsController {}
```

## 异步拦截器

```typescript
@Injectable()
export class AsyncInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // 异步操作
    await someAsyncOperation();

    return next.handle();
  }
}
```

