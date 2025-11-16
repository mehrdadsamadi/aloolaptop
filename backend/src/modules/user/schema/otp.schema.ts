import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false })
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
