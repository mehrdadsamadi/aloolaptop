import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
