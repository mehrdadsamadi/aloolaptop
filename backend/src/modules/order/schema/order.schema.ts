import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from '../../cart/schemas/cart-item.schema';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../../payment/enums/payment-status.enum';

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ required: true, type: Number })
  totalQuantity: number;

  @Prop({ required: true, type: Number })
  totalItems: number;

  @Prop({ required: true, type: Number })
  finalItemsPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'Coupon', default: null })
  couponId: Types.ObjectId | null;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  @Prop({ required: true, type: Number })
  totalPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  addressId: Types.ObjectId;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.AWAITING_PAYMENT,
  })
  status: OrderStatus; // awaiting_payment | paid | processing | shipped | delivered | canceled | refunded

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus; // pending | paid | failed | refunded

  @Prop({ required: true })
  trackingCode: string;

  @Prop({ type: Object, default: {} })
  meta: Record<string, any>;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ trackingCode: 1 }, { unique: true });
