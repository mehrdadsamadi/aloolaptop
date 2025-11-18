import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AttributeType } from '../enums/attribute-type.enum';
import {
  ImageSchema,
  ImageSubSchema,
} from '../../../common/schemas/image.schema';

export class CategoryAttribute {
  @Prop({ required: true }) key: string;
  @Prop() label?: string;
  @Prop({ enum: AttributeType }) type?: AttributeType;
  @Prop([String]) options?: string[];
  @Prop({ default: true }) showInFilter?: boolean;
  @Prop({ default: true }) required?: boolean;
}

@Schema({ versionKey: false, timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, unique: true, lowercase: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId?: Types.ObjectId | null;

  @Prop([CategoryAttribute])
  attributes?: CategoryAttribute[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({
    type: ImageSubSchema,
    default: null,
  })
  image: ImageSchema;

  @Prop({ type: Object, default: {} })
  meta?: { title?: string; description?: string; keywords?: string[] };
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 'text', description: 'text' });
CategorySchema.index({ parentId: 1, order: 1 });
