import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StatisticsController } from './statistic.controller';
import { StatisticsService } from './statistic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { Order, OrderSchema } from '../order/schema/order.schema';
import { Payment, PaymentSchema } from '../payment/schema/payment.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
