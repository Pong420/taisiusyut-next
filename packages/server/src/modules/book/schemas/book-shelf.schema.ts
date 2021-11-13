import { Document, Types } from 'mongoose';
import { Exclude } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBookShelf, Timestamp } from '@/typings';

export type BookShelfDocument = BookShelf & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new BookShelf(raw)
  }
})
export class BookShelf implements Record<keyof IBookShelf, any>, Timestamp {
  id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Book' })
  book: unknown;

  @Prop({ type: Number })
  lastVistChapter: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  @Exclude()
  user: string;

  createdAt: number;

  updatedAt: number;

  constructor(payload: Partial<BookShelf>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): BookShelf {
    return new BookShelf(this);
  }
}

export const BookShelfSchema = SchemaFactory.createForClass(BookShelf);
