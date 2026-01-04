import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema, Types } from 'mongoose';
import { TimestampedDocument } from '../../statistic/types/statistic.type';

const GeoSchema = new MSchema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  { _id: false },
);

@Schema({ timestamps: true, versionKey: false })
export class Address {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // ارتباط با یوزر

  @Prop({ required: true })
  title: string; // خانه، محل کار، و غیره

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: GeoSchema, required: true })
  location: { type: 'Point'; coordinates: [number, number] }; // [longitude, latitude]

  @Prop({ default: true })
  isDefault: boolean;
}

export type AddressDocument = HydratedDocument<Address> & TimestampedDocument;
export const AddressSchema = SchemaFactory.createForClass(Address);

// ایندکس برای سرعت جستجو بر اساس user
AddressSchema.index({ userId: 1 });

// ایندکس مکانی (GeoJSON) برای جستجوی موقعیت‌ها در شعاع مشخص
AddressSchema.index({ location: '2dsphere' });
