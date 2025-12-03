import { Module } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigsModule } from '../configs/configs.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/modules/user.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { CouponModule } from '../coupon/coupon.module';
import { CartModule } from '../cart/cart.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    ConfigsModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
    CheckoutModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
