import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductCondition } from '../enums/product-condition.enum';
import { ProductGrade } from '../enums/product-grade.enum';
import { ImageSchema, ImageSubSchema } from '../../common/schemas/image.schema';

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop() description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ enum: ProductCondition, required: true })
  condition: ProductCondition;

  @Prop({ enum: ProductGrade })
  grade?: ProductGrade;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({
    type: [
      {
        key: String,
        value: String,
        label: String,
      },
    ],
    default: [],
  })
  attributes: { key: string; value: string; label?: string }[];

  @Prop({
    type: [ImageSubSchema],
    default: [],
  })
  images: ImageSchema[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 }) // درصد تخفیف
  discountPercent: number;

  @Prop({ type: Date, default: null }) // زمان انقضا تخفیف
  discountExpiresAt?: Date;
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ categoryId: 1, price: 1 });

ProductSchema.virtual('finalPrice').get(function () {
  if (
    this.discountPercent &&
    this.discountExpiresAt &&
    this.discountExpiresAt > new Date()
  ) {
    return this.price * (1 - this.discountPercent / 100);
  }
  return this.price;
});
