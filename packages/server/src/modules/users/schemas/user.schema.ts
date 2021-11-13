import { IUser } from '@/typings';
import { Exclude, Transform } from 'class-transformer';
import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Timestamp } from '@/typings';
import bcrypt from 'bcrypt';

export type UserDocument = User & Document;

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new User(raw)
  }
})
export class User implements IUser, Timestamp {
  id: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, select: false, trim: true, set: hashPassword, get: (pwd: string) => pwd })
  @Exclude()
  password: string;

  @Prop({
    type: String,
    default: function (this: PropOptions & User) {
      return this.username;
    }
  })
  nickname: string;

  @Transform(({ value }) => value && Number(value))
  createdAt: number;

  @Exclude()
  updatedAt: number;

  constructor(payload: Partial<User>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): User {
    return new User(this);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
