import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { Roles } from '../../../common/enums/role.enum';

@Schema({ versionKey: false })
export class User {
  @Prop({})
  firstName?: string;

  @Prop({})
  lastName?: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ type: Boolean, default: false })
  mobileVerified: boolean;

  @Prop({ enum: Roles, default: Roles.BUYER })
  role: Roles;

  @Prop({ type: Types.ObjectId, ref: 'Otp' })
  otpId?: Types.ObjectId;
}

export type UserDocument = HydratedDocument<User> & {
  // virtual populate
  otp?: OtpDocument | null;
};

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * --- تنظیم virtual populate ---
 * ایجاد یک فیلد مجازی به نام "otp" که از otpId مقدار می‌گیرد
 */
UserSchema.virtual('otp', {
  ref: 'Otp', // نام مدل/کلکشن مرجع (مطابق register شدن مدل Otp)
  localField: 'otpId', // فیلد داخل User که ObjectId را نگه می‌دارد
  foreignField: '_id', // فیلد مرجع در collection Otp
  justOne: true, // چون یک otp برای هر user وجود دارد
});

/**
 * --- تا virtualها در خروجی JSON/OBJ نمایش داده شوند ---
 */
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
