import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { CategoryModule } from '../category/category.module';
import { Review, ReviewSchema } from '../user/schemas/review.schema';
import { Order, OrderSchema } from '../order/schema/order.schema';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
