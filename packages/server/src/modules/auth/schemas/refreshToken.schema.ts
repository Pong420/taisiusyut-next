import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRefreshToken } from '@/typings';
import { Transform } from 'class-transformer';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, { _id, ...raw }) => new RefreshToken(raw)
  }
})
export class RefreshToken implements IRefreshToken {
  id: string;

  @Prop({ type: String, required: true, trim: true })
  user: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  @Transform(({ value }) => value && Number(value))
  createdAt: number;

  @Transform(({ value }) => value && Number(value))
  updatedAt: number;

  constructor(payload: Partial<RefreshToken>) {
    Object.assign(this, payload);
  }

  toJSON(): RefreshToken {
    return new RefreshToken(this);
  }
}

export const RefreshTokenSchema = SchemaFactory.createForClass<RefreshToken>(RefreshToken);
