# Nest.js 核心概念

## 模块 (Module)

模块是 Nest.js 应用的基本构建块，用于组织代码。

```typescript
import { Module } from '@nestjs/common';

@Module({
  imports: [],        // 导入其他模块
  controllers: [],    // 控制器
  providers: [],      // 提供者（服务）
  exports: [],        // 导出供其他模块使用
})
export class AppModule {}
```

### 特性模块

```typescript
// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 导出服务供其他模块使用
})
export class UsersModule {}
```

## 控制器 (Controller)

控制器负责处理传入的请求并返回响应。

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query() query): string {
    return '返回所有用户';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `返回用户 ${id}`;
  }

  @Post()
  create(@Body() createUserDto: any): string {
    return '创建用户';
  }
}
```

### 路由装饰器

- `@Get()` - GET 请求
- `@Post()` - POST 请求
- `@Put()` - PUT 请求
- `@Delete()` - DELETE 请求
- `@Patch()` - PATCH 请求

### 路由参数

```typescript
@Get(':id')
findOne(@Param('id') id: string) {}

@Get()
findAll(@Query('page') page: number) {}

@Post()
create(@Body() body: CreateUserDto) {}
```

## 提供者 (Provider)

提供者是可注入的类，通常用于业务逻辑。

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }

  create(user: any) {
    this.users.push(user);
    return user;
  }
}
```

## 依赖注入

Nest.js 使用依赖注入来管理依赖关系。

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // 通过构造函数注入 UsersService
}
```

## 生命周期钩子

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('模块初始化');
  }

  onModuleDestroy() {
    console.log('模块销毁');
  }
}
```

### 可用生命周期钩子

- `OnModuleInit` - 模块初始化时
- `OnModuleDestroy` - 模块销毁时
- `OnApplicationBootstrap` - 应用启动时
- `OnApplicationShutdown` - 应用关闭时

## 全局模块

```typescript
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
```

## 动态模块

```typescript
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: ['CONFIG_OPTIONS'],
    };
  }
}
```

