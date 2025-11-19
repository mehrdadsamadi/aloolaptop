import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Address, AddressSchema } from './schemas/address.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { AddressController } from './controllers/address.controller';
import { ReviewController } from './controllers/review.controller';
import { AddressService } from './services/address.service';
import { ReviewService } from './services/review.service';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [UserController, AddressController, ReviewController],
  providers: [UserService, AddressService, ReviewService],
})
export class UserModule {}
