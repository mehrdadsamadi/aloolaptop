import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageSchema, ImageSubSchema } from '../../common/schemas/image.schema';

@Schema({ _id: false, versionKey: false })
export class Profile {
  @Prop({
    type: ImageSubSchema,
    default: null,
  })
  avatar?: ImageSchema;

  @Prop({})
  firstName?: string;

  @Prop({})
  lastName?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
