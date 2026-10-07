# Nest.js 异常处理

## 内置异常

Nest.js 提供了内置的异常类：

```typescript
throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
throw new BadRequestException('Bad Request');
throw new UnauthorizedException('Unauthorized');
throw new NotFoundException('Not Found');
throw new ForbiddenException('Forbidden');
throw new NotAcceptableException('Not Acceptable');
throw new RequestTimeoutException('Request Timeout');
throw new ConflictException('Conflict');
throw new GoneException('Gone');
throw new HttpVersionNotSupportedException('HTTP Version Not Supported');
throw new PayloadTooLargeException('Payload Too Large');
throw new UnsupportedMediaTypeException('Unsupported Media Type');
throw new UnprocessableEntityException('Unprocessable Entity');
throw new InternalServerErrorException('Internal Server Error');
throw new NotImplementedException('Not Implemented');
throw new BadGatewayException('Bad Gateway');
throw new ServiceUnavailableException('Service Unavailable');
throw new GatewayTimeoutException('Gateway Timeout');
```

## 自定义异常

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException(
  {
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  },
  HttpStatus.FORBIDDEN,
);
```

## 异常过滤器

异常过滤器可以捕获和处理异常。

### 创建异常过滤器

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getMessage()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### 捕获特定异常

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

### 应用异常过滤器

#### 方法级别

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

#### 控制器级别

```typescript
@UseFilters(new HttpExceptionFilter())
@Controller('cats')
export class CatsController {}
```

#### 全局级别

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
```

#### 模块级别

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```

## 继承异常

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

## 常见异常处理示例

### 业务异常

```typescript
export class BusinessException extends HttpException {
  constructor(message: string, code: number = 400) {
    super(
      {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
```

### 验证异常

```typescript
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Validation failed',
      errors: exception.getResponse(),
    });
  }
}
```

### 日志记录异常

```typescript
@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getMessage()
        : 'Internal server error';

    this.logger.error(
      `${request.method} ${request.url} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 继续处理异常...
  }
}
```

