import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Otp, OtpSchema } from '../schemas/otp.schema';
import { AuthModule } from '../../auth/auth.module';
import { S3Service } from '../../common/services/s3/s3.service';
import { AddressModule } from './address.module';
import { ReviewModule } from './review.module';

@Module({
  imports: [
    AuthModule,
    AddressModule,
    ReviewModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, S3Service],
})
export class UserModule {}
