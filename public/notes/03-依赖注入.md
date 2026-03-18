# Nest.js 依赖注入

## 什么是依赖注入

依赖注入（DI）是一种设计模式，用于管理类之间的依赖关系。Nest.js 内置了强大的 DI 容器。

## 基本使用

### 1. 定义提供者

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

### 2. 在模块中注册

```typescript
@Module({
  providers: [UsersService],
})
export class UsersModule {}
```

### 3. 注入使用

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

## 提供者类型

### 1. 标准提供者

```typescript
providers: [UsersService]
```

### 2. 自定义提供者

```typescript
providers: [
  {
    provide: 'CONNECTION',
    useValue: connection,
  },
]
```

### 3. 工厂提供者

```typescript
providers: [
  {
    provide: 'CONNECTION',
    useFactory: (configService: ConfigService) => {
      return new Connection(configService.get('DATABASE_URL'));
    },
    inject: [ConfigService],
  },
]
```

### 4. 异步提供者

```typescript
providers: [
  {
    provide: 'ASYNC_CONNECTION',
    useFactory: async (configService: ConfigService) => {
      const connection = await createConnection(configService.get('DATABASE_URL'));
      return connection;
    },
    inject: [ConfigService],
  },
]
```

### 5. 类提供者

```typescript
providers: [
  {
    provide: UsersService,
    useClass: process.env.NODE_ENV === 'development'
      ? DevelopmentUsersService
      : ProductionUsersService,
  },
]
```

## 作用域

### 默认作用域 (SINGLETON)

```typescript
@Injectable()
export class UsersService {}
```

### 请求作用域 (REQUEST)

```typescript
@Injectable({ scope: Scope.REQUEST })
export class UsersService {}
```

### 瞬态作用域 (TRANSIENT)

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class UsersService {}
```

## 可选依赖

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService {
  constructor(
    @Optional() @Inject('HTTP_OPTIONS') private httpOptions: HttpOptions,
  ) {}
}
```

## 属性注入

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService {
  @Inject('HTTP_OPTIONS')
  private readonly httpOptions: HttpOptions;
}
```

## 循环依赖

### 使用 forwardRef

```typescript
// cats.service.ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
  ) {}
}

// common.service.ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
```

## 自定义装饰器

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
@Get()
findOne(@User() user: User) {
  return user;
}

@Get()
findOne(@User('id') userId: string) {
  return userId;
}
```

## 提供者导出

```typescript
@Module({
  providers: [UsersService],
  exports: [UsersService], // 导出供其他模块使用
})
export class UsersModule {}
```

