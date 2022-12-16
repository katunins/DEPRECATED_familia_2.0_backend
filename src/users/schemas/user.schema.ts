import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  gender: string;

  @Prop({ type: Object })
  parents: {
    mother: string
    father: string
  }

  @Prop()
  userPic: string;

  @Prop()
  about: string;

  @Prop()
  birthday: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
