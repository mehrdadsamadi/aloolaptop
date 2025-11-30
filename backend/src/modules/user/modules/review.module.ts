import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { ReviewController } from '../controllers/review.controller';
import { ReviewService } from '../services/review.service';
import { Product, ProductSchema } from '../../product/schema/product.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, MongooseModule],
})
export class ReviewModule {}
