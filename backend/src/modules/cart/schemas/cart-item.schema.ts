import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true, type: Number })
  unitPrice: number;

  @Prop({ type: Number, default: 0 })
  discountPercent: number;

  @Prop({ required: true, type: Number })
  finalUnitPrice: number; // unitPrice - discountPercent

  @Prop({ default: 1, type: Number })
  quantity: number;

  @Prop({ type: Number, default: 1 })
  stock: number;

  @Prop({ required: true, type: Number })
  totalPrice: number; // quantity * finalUnitPrice
}

export type CartItemDocument = HydratedDocument<CartItem>;
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Indexing
CartItemSchema.index({ productId: 1 });
