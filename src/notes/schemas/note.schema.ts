import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document

@Schema({ timestamps: true })
export class Note {

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  date: string;

  @Prop()
  images: string[];

  @Prop()
  relatives: string[];

  @Prop({ required: true })
  creator: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
