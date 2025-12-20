import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AttributeType } from '../enums/attribute-type.enum';
import { ImageSchema, ImageSubSchema } from '../../common/schemas/image.schema';

export class CategoryAttribute {
  @Prop({ required: true }) key: string;
  @Prop({ required: true }) label: string;
  @Prop({ enum: AttributeType, required: true }) type: AttributeType;
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

export type CategoryDocument = HydratedDocument<Category> & {
  // virtual populate
  parent?: CategoryDocument | null;
};

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 'text', description: 'text' });
CategorySchema.index({ parentId: 1, order: 1 });

CategorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });
