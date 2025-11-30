import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CouponType } from '../enums/coupon-type.enum';
import { DiscountMethod } from '../enums/discount-method.enum';

@Schema({ timestamps: true, versionKey: false })
export class Coupon {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code: string;

  @Prop({ enum: CouponType, required: true })
  type: CouponType;

  @Prop({ enum: DiscountMethod, required: true })
  method: DiscountMethod;

  @Prop({ required: true })
  value: number; // درصد یا مبلغ

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  productIds?: Types.ObjectId[]; // فقط برای PRODUCT

  @Prop({ default: 0 })
  minOrderAmount?: number; // فقط برای CART

  @Prop({ default: 0 })
  maxUses: number;

  @Prop({ default: 0 })
  usesCount: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export type CouponDocument = HydratedDocument<Coupon>;
export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ type: 1 });
