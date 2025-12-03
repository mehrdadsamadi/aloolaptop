import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { ZarinpalService } from './gateways/zarinpal.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    OrderModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  providers: [PaymentService, ZarinpalService],
  exports: [PaymentService],
})
export class PaymentModule {}
