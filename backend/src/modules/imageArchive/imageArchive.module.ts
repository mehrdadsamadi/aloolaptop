import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ImageArchive, ImageArchiveSchema } from './schema/imageArchive.schema';
import { ImageArchiveContrroler } from './imageArchive.controller';
import { ImageArchiveService } from './imageArchive.service';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from '../common/services/s3/s3.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ImageArchive.name, schema: ImageArchiveSchema },
    ]),
  ],
  controllers: [ImageArchiveContrroler],
  providers: [ImageArchiveService, S3Service],
  exports: [ImageArchiveService, S3Service, AuthModule, MongooseModule],
})
export class ImageArchiveModule {}
