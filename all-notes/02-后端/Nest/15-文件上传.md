# Nest.js 文件上传

## 安装

```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

## 单文件上传

```typescript
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
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
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
```

## 多文件上传

```typescript
import { FilesInterceptor } from '@nestjs/platform-express';

@Post('multiple')
@UseInterceptors(FilesInterceptor('files', 10))
uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  return files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
  }));
}
```

## 文件验证

```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

@Post()
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
  }),
)
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

## 内存存储

```typescript
import { memoryStorage } from 'multer';

@Post()
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
  }),
)
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // file.buffer 包含文件内容
  // 可以上传到云存储（如 AWS S3、阿里云 OSS）
  return { size: file.buffer.length };
}
```

## 上传到云存储

### AWS S3

```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `https://${this.configService.get('AWS_S3_BUCKET')}.s3.amazonaws.com/${key}`;
  }
}
```

## 文件下载

```typescript
import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('files')
export class FilesController {
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'uploads', filename));
    file.pipe(res);
  }
}
```

## 图片处理

```bash
npm install sharp
```

```typescript
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async resizeImage(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return sharp(buffer)
      .resize(width, height)
      .toBuffer();
  }

  async compressImage(buffer: Buffer, quality: number = 80): Promise<Buffer> {
    return sharp(buffer)
      .jpeg({ quality })
      .toBuffer();
  }
}
```

## 文件服务封装

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: this.configService.get('UPLOAD_DEST'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = this.configService.get('ALLOWED_MIMES').split(',');
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File type not allowed'), false);
        }
      },
      limits: {
        fileSize: this.configService.get('MAX_FILE_SIZE'),
      },
    };
  }
}
```

## 使用示例

```typescript
@Controller('upload')
export class UploadController {
  constructor(private fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', this.fileService.getMulterConfig()))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/files/${file.filename}`,
      filename: file.filename,
    };
  }
}
```

