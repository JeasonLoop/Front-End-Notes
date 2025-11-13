# Nest.js 守卫

## 什么是守卫

守卫是一个使用 `@Injectable()` 装饰器的类，实现了 `CanActivate` 接口。守卫在中间件之后、拦截器之前执行。

## 创建守卫

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // 验证逻辑
    return true;
  }
}
```

## 使用守卫

### 控制器级别

```typescript
@Controller('cats')
@UseGuards(AuthGuard)
export class CatsController {}
```

### 方法级别

```typescript
@Get()
@UseGuards(AuthGuard)
findAll() {
  return this.catsService.findAll();
}
```

### 全局守卫

```typescript
// main.ts
app.useGlobalGuards(new AuthGuard());
```

### 模块级别

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
```

## 认证守卫示例

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // 验证 token
      const payload = this.verifyToken(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private verifyToken(token: string): any {
    // JWT 验证逻辑
    return {};
  }
}
```

## 角色守卫

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

## 自定义装饰器

### 角色装饰器

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### 使用

```typescript
@Post()
@Roles('admin')
@UseGuards(AuthGuard, RolesGuard)
create(@Body() createCatDto: CreateCatDto) {
  return this.catsService.create(createCatDto);
}
```

## 组合多个守卫

```typescript
@Controller('cats')
@UseGuards(AuthGuard, RolesGuard)
export class CatsController {
  @Get()
  @Roles('user', 'admin')
  findAll() {
    return this.catsService.findAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }
}
```

## 执行上下文

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // HTTP 上下文
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // WebSocket 上下文
    // const ctx = context.switchToWs();
    // const client = ctx.getClient();
    // const data = ctx.getData();

    return true;
  }
}
```

## 用户装饰器

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// 使用
@Get('profile')
@UseGuards(AuthGuard)
getProfile(@User() user: User) {
  return user;
}
```

## 常见守卫模式

### JWT 认证守卫

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### API Key 守卫

```typescript
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
```

