# Nest.js 管道

## 什么是管道

管道有两个主要用途：
1. **转换**：将输入数据转换为所需的形式
2. **验证**：评估输入数据，如果有效则通过，否则抛出异常

## 内置管道

Nest.js 提供了以下内置管道：

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`

## 使用内置管道

### ParseIntPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return `This action returns a #${id} cat`;
}
```

### ParseUUIDPipe

```typescript
@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return `This action returns a #${id} cat`;
}
```

### ValidationPipe

```typescript
@Post()
create(@Body(ValidationPipe) createCatDto: CreateCatDto) {
  return this.catsService.create(createCatDto);
}
```

## 自定义管道

### 转换管道

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}

// 使用
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

### 验证管道

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Value is required');
    }
    return value;
  }
}
```

## 使用 class-validator

### 安装

```bash
npm install class-validator class-transformer
```

### DTO 定义

```typescript
import { IsString, IsInt, Min, Max, IsEmail, IsOptional } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  breed?: string;
}
```

### 全局启用验证

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

### ValidationPipe 选项

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // 自动删除非 DTO 属性
    forbidNonWhitelisted: true,   // 禁止非白名单属性
    transform: true,              // 自动转换类型
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## 常见验证装饰器

### 字符串验证

```typescript
@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(20)
@Matches(/^[a-zA-Z]+$/)
name: string;
```

### 数字验证

```typescript
@IsInt()
@Min(0)
@Max(100)
@IsPositive()
age: number;
```

### 邮箱验证

```typescript
@IsEmail()
email: string;
```

### 数组验证

```typescript
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
tags: string[];
```

### 对象验证

```typescript
@ValidateNested()
@Type(() => AddressDto)
address: AddressDto;
```

### 自定义验证

```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' &&
                 typeof relatedValue === 'string' &&
                 value.length > relatedValue.length;
        },
      },
    });
  };
}

// 使用
@IsLongerThan('password')
confirmPassword: string;
```

## 管道作用域

### 方法级别

```typescript
@Post()
@UsePipes(new ValidationPipe())
create(@Body() createCatDto: CreateCatDto) {}
```

### 参数级别

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {}
```

### 控制器级别

```typescript
@UsePipes(new ValidationPipe())
@Controller('cats')
export class CatsController {}
```

### 全局级别

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe());
```

## 异步验证

```typescript
import { Injectable } from '@nestjs/common';
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

