# Nest.js RESTful API

## 基本 CRUD 操作

### Controller

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.catsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catsService.remove(id);
  }
}
```

## DTO（数据传输对象）

### 创建 DTO

```typescript
// create-cat.dto.ts
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsOptional()
  @IsString()
  breed?: string;
}
```

### 更新 DTO

```typescript
// update-cat.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
```

## 分页查询

### DTO

```typescript
// pagination.dto.ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

### Service

```typescript
async findAll(paginationDto: PaginationDto) {
  const { page = 1, limit = 10 } = paginationDto;
  const skip = (page - 1) * limit;

  const [data, total] = await this.catsRepository.findAndCount({
    skip,
    take: limit,
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

## 查询过滤

### DTO

```typescript
// query-cats.dto.ts
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCatsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAge?: number;
}
```

### Service

```typescript
async findAll(query: QueryCatsDto) {
  const { name, minAge, maxAge } = query;
  const where: any = {};

  if (name) {
    where.name = Like(`%${name}%`);
  }

  if (minAge !== undefined) {
    where.age = MoreThanOrEqual(minAge);
  }

  if (maxAge !== undefined) {
    where.age = LessThanOrEqual(maxAge);
  }

  return this.catsRepository.find({ where });
}
```

## 响应格式统一

### 拦截器

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
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

## 状态码

```typescript
import { HttpCode, HttpStatus } from '@nestjs/common';

@Post()
@HttpCode(HttpStatus.CREATED)
create() {}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
remove() {}
```

## 自定义响应头

```typescript
import { Header } from '@nestjs/common';

@Get()
@Header('Cache-Control', 'no-cache')
findAll() {
  return this.catsService.findAll();
}
```

## 重定向

```typescript
import { Redirect } from '@nestjs/common';

@Get()
@Redirect('https://nestjs.com', 301)
findAll() {}
```

## 路由参数验证

```typescript
import { Param, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}

@Get(':uuid')
findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {}
```

## 文件上传

```typescript
import { Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }),
)
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
  };
}
```

## 多文件上传

```typescript
import { FilesInterceptor } from '@nestjs/platform-express';

@Post('upload')
@UseInterceptors(FilesInterceptor('files', 10))
uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  return files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
  }));
}
```

## API 版本控制

```typescript
// main.ts
app.setGlobalPrefix('api');
app.enableVersioning({
  type: VersioningType.URI,
});

// controller
@Controller({
  path: 'cats',
  version: '1',
})
export class CatsController {}
```

## Swagger 文档

### 安装

```bash
npm install @nestjs/swagger swagger-ui-express
```

### 配置

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Cats API')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

### 使用装饰器

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Return all cats.' })
  findAll() {
    return this.catsService.findAll();
  }
}
```

