import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0, type: Number })
  totalItems: number;

  @Prop({ required: true, type: Number })
  totalQuantity: number;

  @Prop({ required: true, type: Number })
  finalItemsPrice: number; // مجموع totalPrice هر CartItem

  @Prop({ type: Types.ObjectId, ref: 'Coupon', default: null })
  couponId: Types.ObjectId | null;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  // ➤ مبلغ قابل پرداخت (finalUnitPrice - discountAmount)
  @Prop({ type: Number, default: 0 })
  totalPrice: number;
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ userId: 1 }, { unique: true });
CartSchema.index({ 'items.productId': 1 });
CartSchema.index({ couponId: 1 });
