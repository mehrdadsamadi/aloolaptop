import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { ZarinpalService } from '../payment/gateways/zarinpal.service';
import { CheckoutService } from './checkout.service';
import { CouponService } from '../coupon/coupon.service';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [AuthModule, CartModule, OrderModule, PaymentModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, ZarinpalService, CouponService],
})
export class CheckoutModule {}
