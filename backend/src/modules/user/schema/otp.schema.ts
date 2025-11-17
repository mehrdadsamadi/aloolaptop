import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Otp {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: Date })
  expiresIn: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export type OtpDocument = HydratedDocument<Otp>;

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ userId: 1 }, { unique: true }); // یا non-unique اگر مایل هستی چند otp داشته باشی
OtpSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 }); // TTL
