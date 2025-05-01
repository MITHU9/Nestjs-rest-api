import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const BookSchema = SchemaFactory.createForClass(Book);
