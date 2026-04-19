import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ImageSchema,
  ImageSubSchema,
} from 'src/modules/common/schemas/image.schema';
import { TimestampedDocument } from 'src/modules/statistic/types/statistic.type';

@Schema({ versionKey: false, timestamps: true })
export class ImageArchive {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    type: ImageSubSchema,
    default: null,
  })
  image: ImageSchema;
}

export type ImageArchiveDocument = HydratedDocument<ImageArchive> &
  TimestampedDocument;
export const ImageArchiveSchema = SchemaFactory.createForClass(ImageArchive);

ImageArchiveSchema.index({ title: 1 });
