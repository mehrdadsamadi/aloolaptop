import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentGateway } from '../enums/payment-gateway.enum';
import { TimestampedDocument } from '../../statistic/types/statistic.type';

@Schema({ timestamps: true, versionKey: false })
export class Payment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({
    required: true,
    enum: PaymentGateway,
    default: PaymentGateway.ZARINPAL,
  })
  gateway: PaymentGateway;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus; // pending | paid | failed | refunded

  @Prop()
  authority: string; // كد یكتای شناسه مرجع درخواست.

  @Prop({ type: Number })
  refId: number; // در صورتی كه پرداخت موفق باشد، شماره تراكنش پرداخت انجام شده را بر می‌گرداند.

  @Prop({ type: Number })
  fee: number; // کارمزد

  @Prop({ type: Object, default: {} })
  meta: Record<string, any>;
}

export type PaymentDocument = HydratedDocument<Payment> & TimestampedDocument;
export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
