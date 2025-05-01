import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import mongoose from 'mongoose';

export enum Category {
  FICTION = 'Fiction',
  NON_FICTION = 'Non-Fiction',
  SCIENCE = 'Science',
  HISTORY = 'History',
  BIOGRAPHY = 'Biography',
  FANTASY = 'Fantasy',
}

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: Category })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);
