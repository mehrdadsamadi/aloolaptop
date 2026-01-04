import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { StatisticsModule } from '../statistic/statistics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000, // 1 ثانیه
          limit: 10, // 10 درخواست در ثانیه
        },
        {
          name: 'medium',
          ttl: 60000, // 1 دقیقه
          limit: 100, // 100 درخواست در دقیقه
        },
        {
          name: 'long',
          ttl: 3600000, // 1 ساعت
          limit: 1000, // 1000 درخواست در ساعت
        },
      ],
    }),
    ConfigsModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
    CheckoutModule,
    StatisticsModule,
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
