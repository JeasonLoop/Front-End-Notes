# Nest.js 项目结构

## 推荐的项目结构

```
src/
├── main.ts                    # 应用入口
├── app.module.ts              # 根模块
├── common/                    # 公共模块
│   ├── decorators/            # 自定义装饰器
│   ├── filters/               # 异常过滤器
│   ├── guards/                # 守卫
│   ├── interceptors/          # 拦截器
│   ├── middleware/            # 中间件
│   ├── pipes/                 # 管道
│   └── interfaces/            # 接口定义
├── config/                    # 配置文件
│   └── configuration.ts
├── database/                  # 数据库相关
│   ├── entities/              # 实体
│   ├── migrations/            # 迁移文件
│   └── seeds/                 # 种子数据
├── modules/                    # 功能模块
│   ├── auth/                  # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/               # 数据传输对象
│   │   ├── strategies/        # Passport 策略
│   │   └── guards/            # 认证守卫
│   ├── users/                 # 用户模块
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── users.repository.ts
│   └── cats/                  # 示例模块
│       ├── cats.controller.ts
│       ├── cats.service.ts
│       ├── cats.module.ts
│       └── dto/
├── shared/                     # 共享模块
│   └── shared.module.ts
└── tests/                      # 测试文件
    ├── unit/
    └── e2e/
```

## 模块组织原则

### 1. 功能模块化

每个功能应该是一个独立的模块：

```
modules/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
```

### 2. 共享代码提取

将公共代码提取到 `common` 目录：

```
common/
├── decorators/
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
├── filters/
│   └── http-exception.filter.ts
└── guards/
    └── roles.guard.ts
```

### 3. 配置管理

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
```

## 模块示例

### 用户模块

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

```typescript
// users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

```typescript
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
```

## 共享模块

```typescript
// shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class SharedModule {}
```

## 环境配置

```typescript
// config/configuration.ts
export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '60s',
  },
});
```

## 最佳实践

### 1. 单一职责原则

每个模块、服务、控制器都应该有单一职责。

### 2. DRY（Don't Repeat Yourself）

提取公共代码到共享模块或服务。

### 3. 依赖注入

使用依赖注入管理依赖关系，避免硬编码。

### 4. 接口定义

使用接口定义契约，提高代码的可维护性。

### 5. 错误处理

统一异常处理，使用异常过滤器。

### 6. 配置管理

使用配置模块管理环境变量和配置。

### 7. 测试

为每个模块编写单元测试和 E2E 测试。

