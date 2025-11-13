# Nest.js 微服务

## 安装

```bash
npm install @nestjs/microservices
```

## 创建微服务应用

### 主应用（API Gateway）

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

### 微服务应用

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    },
  );
  await app.listen();
}
bootstrap();
```

## 传输层

### TCP

```typescript
{
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 3001,
  },
}
```

### Redis

```bash
npm install ioredis
```

```typescript
{
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
}
```

### RabbitMQ

```bash
npm install amqplib amqp-connection-manager
```

```typescript
{
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'cats_queue',
    queueOptions: {
      durable: false,
    },
  },
}
```

### Kafka

```bash
npm install kafkajs
```

```typescript
{
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'cats',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'cats-consumer',
    },
  },
}
```

## 消息模式

### 请求-响应

```typescript
// 客户端
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('CATS_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  async getCats() {
    return this.client.send('get_cats', {}).toPromise();
  }
}
```

```typescript
// 服务端
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CatsController {
  @MessagePattern('get_cats')
  getCats() {
    return [{ id: 1, name: 'Tom' }];
  }
}
```

### 事件（发布-订阅）

```typescript
// 客户端
@Controller()
export class AppController {
  constructor(
    @Inject('CATS_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  async createCat(@Body() createCatDto: CreateCatDto) {
    this.client.emit('cat_created', createCatDto);
    return 'Cat created';
  }
}
```

```typescript
// 服务端
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class CatsController {
  @EventPattern('cat_created')
  handleCatCreated(data: CreateCatDto) {
    console.log('Cat created:', data);
  }
}
```

## 连接微服务

### 在模块中连接

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
})
export class AppModule {}
```

### 异步配置

```typescript
ClientsModule.registerAsync([
  {
    name: 'CATS_SERVICE',
    useFactory: (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get('CATS_SERVICE_HOST'),
        port: configService.get('CATS_SERVICE_PORT'),
      },
    }),
    inject: [ConfigService],
  },
])
```

## 消息序列化

```typescript
import { Serializer, Deserializer } from '@nestjs/microservices';

{
  transport: Transport.TCP,
  options: {
    serializer: new CustomSerializer(),
    deserializer: new CustomDeserializer(),
  },
}
```

## 异常处理

```typescript
import { RpcException } from '@nestjs/microservices';

@MessagePattern('get_cats')
getCats() {
  throw new RpcException('Cats not found');
}
```

## 超时

```typescript
return this.client.send('get_cats', {}).pipe(
  timeout(5000),
  catchError(err => {
    if (err instanceof TimeoutError) {
      throw new RequestTimeoutException();
    }
    throw err;
  }),
).toPromise();
```

## 示例：用户服务

### 用户微服务

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private users = [];

  @MessagePattern('get_user')
  getUser(data: { id: number }) {
    return this.users.find(user => user.id === data.id);
  }

  @MessagePattern('create_user')
  createUser(data: CreateUserDto) {
    const user = { id: Date.now(), ...data };
    this.users.push(user);
    return user;
  }

  @EventPattern('user_created')
  handleUserCreated(data: CreateUserDto) {
    console.log('User created:', data);
  }
}
```

### API Gateway

```typescript
// users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.client.send('get_user', { id }).toPromise();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.client.emit('user_created', createUserDto);
    return this.client.send('create_user', createUserDto).toPromise();
  }
}
```

