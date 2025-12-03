import { Module } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../order/schema/order.schema';
import { Payment, PaymentSchema } from '../payment/schema/payment.schema';
import { CheckoutController } from './checkout.controller';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { ZarinpalService } from '../payment/gateways/zarinpal.service';
import { CheckoutService } from './checkout.service';
import { CouponService } from '../coupon/coupon.service';

@Module({
  imports: [
    AuthModule,
    CartModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    OrderService,
    PaymentService,
    ZarinpalService,
    CouponService,
  ],
})
export class CheckoutModule {}
