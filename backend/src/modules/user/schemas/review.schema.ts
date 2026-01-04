import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TimestampedDocument } from '../../statistic/types/statistic.type';

@Schema({ timestamps: true, versionKey: false })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // 1-5

  @Prop()
  comment?: string;

  @Prop({ default: true })
  isVisible: boolean; // تعیین اینکه کامنت قابل نمایش هست یا نه
}

export type ReviewDocument = HydratedDocument<Review> & TimestampedDocument;
export const ReviewSchema = SchemaFactory.createForClass(Review);
