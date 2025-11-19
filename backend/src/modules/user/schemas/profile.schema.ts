import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class Profile {
  @Prop()
  avatar?: string; // URL عکس

  @Prop({})
  firstName?: string;

  @Prop({})
  lastName?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
