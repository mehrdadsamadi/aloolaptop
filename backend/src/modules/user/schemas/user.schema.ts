import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Roles } from '../../../common/enums/role.enum';
import { Profile, ProfileSchema } from './profile.schema';
import { OtpDocument } from './otp.schema';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  mobile: string;

  @Prop({ type: Boolean, default: false })
  mobileVerified: boolean;

  @Prop({ enum: Roles, default: Roles.BUYER })
  role: Roles;

  @Prop({ type: Types.ObjectId, ref: 'Otp' })
  otpId?: Types.ObjectId;

  @Prop({ type: ProfileSchema, default: {} })
  profile?: Profile;
}

export type UserDocument = HydratedDocument<User> & {
  // virtual populate
  otp?: OtpDocument | null;
  // addresses?: AddressDocument[] | null;
  // reviews?: ReviewDocument[] | null;
};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ mobile: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ mobileVerified: 1 });

UserSchema.virtual('otp', {
  ref: 'Otp', // نام مدل/کلکشن مرجع (مطابق register شدن مدل Otp)
  localField: 'otpId', // فیلد داخل User که ObjectId را نگه می‌دارد
  foreignField: '_id', // فیلد مرجع در collection Otp
  justOne: true, // چون یک otp برای هر user وجود دارد
});

// UserSchema.virtual('addresses', {
//   ref: 'Address',
//   localField: '_id',
//   foreignField: 'userId',
// });
//
// UserSchema.virtual('reviews', {
//   ref: 'Review', // نام مدل Review
//   localField: '_id', // فیلد داخل User
//   foreignField: 'userId', // فیلد داخل Review که ارتباط رو نگه می‌داره
// });
//
// /**
//  * --- تا virtualها در خروجی JSON/OBJ نمایش داده شوند ---
//  */
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
