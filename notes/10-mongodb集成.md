# Nest.js MongoDB 集成

## 安装

```bash
npm install @nestjs/mongoose mongoose
```

## 配置

### 在模块中配置

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
  ],
})
export class AppModule {}
```

### 使用配置文件

```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 定义 Schema

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

## 在模块中注册 Schema

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

## 在服务中使用 Model

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
```

## Schema 选项

```typescript
@Schema({
  timestamps: true, // 自动添加 createdAt 和 updatedAt
  collection: 'users', // 指定集合名称
})
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
```

## 嵌套 Schema

```typescript
@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  zipCode: string;
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ type: Address })
  address: Address;
}
```

## 数组类型

```typescript
@Schema()
export class User {
  @Prop([String])
  tags: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }])
  posts: Post[];
}
```

## 查询方法

```typescript
// 查找所有
async findAll(): Promise<User[]> {
  return this.userModel.find().exec();
}

// 条件查询
async findByEmail(email: string): Promise<User> {
  return this.userModel.findOne({ email }).exec();
}

// 分页查询
async findWithPagination(page: number, limit: number): Promise<User[]> {
  return this.userModel
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
}

// 排序
async findAllSorted(): Promise<User[]> {
  return this.userModel.find().sort({ createdAt: -1 }).exec();
}

// 聚合
async getStats(): Promise<any> {
  return this.userModel.aggregate([
    { $group: { _id: '$isActive', count: { $sum: 1 } } },
  ]);
}
```

## 索引

```typescript
@Schema()
export class User {
  @Prop({ index: true })
  email: string;

  @Prop({ unique: true })
  username: string;
}

// 或使用索引装饰器
UserSchema.index({ email: 1, name: 1 });
```

## 虚拟属性

```typescript
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', { virtuals: true });
```

## 中间件（Hooks）

```typescript
UserSchema.pre('save', function(next) {
  // 保存前执行
  this.updatedAt = new Date();
  next();
});

UserSchema.post('save', function(doc, next) {
  // 保存后执行
  console.log('User saved:', doc);
  next();
});
```

## 连接事件

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    this.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    this.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
  }
}
```

