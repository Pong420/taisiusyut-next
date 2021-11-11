import { IBook } from '@/typings';
import { Exclude } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Timestamp } from '@/typings';

export type BookDocument = Book & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Book(raw)
  }
})
export class Book implements IBook, Timestamp {
  id: string;

  @Prop({ type: String, required: true, trim: true })
  bookID: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  author: string;

  @Prop({ type: String, trim: true })
  cover?: string;

  @Prop({ type: String, trim: true })
  intro: string;

  @Prop({ type: String, trim: true })
  latestChapter: string;

  @Prop({ type: String, required: true, trim: true })
  provider: string;

  @Exclude()
  createdAt: number;

  @Exclude()
  updatedAt: number;

  constructor(payload: Partial<Book>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Book {
    return new Book(this);
  }
}

export const BookSchema = SchemaFactory.createForClass(Book);
