# Nest.js WebSocket

## 安装

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

## 创建 Gateway

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
```

## 在模块中注册

```typescript
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
```

## 消息处理

### 发送消息

```typescript
@SubscribeMessage('message')
handleMessage(client: Socket, payload: any) {
  // 发送给发送者
  return { event: 'message', data: 'Hello!' };

  // 或使用 client.emit
  client.emit('message', 'Hello!');
}
```

### 广播消息

```typescript
@SubscribeMessage('message')
handleMessage(client: Socket, payload: any) {
  // 广播给所有客户端（除了发送者）
  client.broadcast.emit('message', payload);

  // 广播给所有客户端（包括发送者）
  this.server.emit('message', payload);
}
```

### 发送给特定房间

```typescript
@SubscribeMessage('joinRoom')
handleJoinRoom(client: Socket, room: string) {
  client.join(room);
  client.emit('joinedRoom', room);
}

@SubscribeMessage('message')
handleMessage(client: Socket, payload: any) {
  // 发送给房间内的所有客户端
  this.server.to('room1').emit('message', payload);

  // 发送给多个房间
  this.server.to(['room1', 'room2']).emit('message', payload);
}
```

## 认证

### JWT 认证

```typescript
import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
    } catch {
      client.disconnect();
    }
  }
}
```

## 使用守卫

```typescript
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('message')
  @UseGuards(WsJwtGuard)
  handleMessage(client: Socket, payload: any) {
    // 守卫验证通过后执行
  }
}
```

## 使用拦截器

```typescript
import { UseInterceptors } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('message')
  @UseInterceptors(LoggingInterceptor)
  handleMessage(client: Socket, payload: any) {
    // 拦截器处理
  }
}
```

## 使用管道

```typescript
import { UsePipes } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('message')
  @UsePipes(ValidationPipe)
  handleMessage(client: Socket, payload: CreateMessageDto) {
    // 数据验证
  }
}
```

## 命名空间

```typescript
@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway {}
```

## 适配器

### Redis 适配器（多服务器）

```bash
npm install socket.io-redis
```

```typescript
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.server.adapter(createAdapter(pubClient, subClient));
  }
}

// main.ts
const app = await NestFactory.create(AppModule);
const redisIoAdapter = new RedisIoAdapter(app);
await redisIoAdapter.connectToRedis();
app.useWebSocketAdapter(redisIoAdapter);
```

## 客户端连接

### JavaScript/TypeScript

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token',
  },
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.emit('message', { text: 'Hello' });

socket.on('message', (data) => {
  console.log('Received:', data);
});
```

## 示例：聊天应用

```typescript
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
    client.to(room).emit('userJoined', client.id);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { room: string; message: string }) {
    this.server.to(payload.room).emit('message', {
      id: client.id,
      message: payload.message,
      timestamp: new Date(),
    });
  }
}
```

