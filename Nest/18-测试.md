# Nest.js 测试

## 安装测试依赖

```bash
npm install --save-dev @nestjs/testing jest @types/jest ts-jest supertest @types/supertest
```

## 单元测试

### 测试服务

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, name: 'Test User' }];
      mockRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = { id: 1, name: 'Test User' };
      mockRepository.findOne.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
```

### 测试控制器

```typescript
// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, name: 'Test User' }];
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });
});
```

## E2E 测试

### 基本 E2E 测试

```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### 用户模块 E2E 测试

```typescript
// test/users.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users (POST)', () => {
    it('should create a user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test User');
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        });

      const userId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.name).toBe('Test User');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 测试数据库

### 使用测试数据库

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UsersService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // 测试...
});
```

## 模拟依赖

### 模拟服务

```typescript
const mockUsersService = {
  findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test' }]),
  findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
  create: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
};
```

### 模拟 Repository

```typescript
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
```

## 测试守卫

```typescript
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow valid token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
```

## 测试管道

```typescript
import { ArgumentMetadata } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should validate valid data', async () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
    };

    const result = await pipe.transform(
      { name: 'Test', email: 'test@example.com' },
      metadata,
    );

    expect(result).toEqual({ name: 'Test', email: 'test@example.com' });
  });
});
```

## Jest 配置

```json
// package.json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

## 运行测试

```bash
# 单元测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率
npm run test:cov

# E2E 测试
npm run test:e2e
```

