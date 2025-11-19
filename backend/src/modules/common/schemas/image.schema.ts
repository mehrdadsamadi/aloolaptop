import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class ImageSchema {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;
}

export const ImageSubSchema = SchemaFactory.createForClass(ImageSchema);
