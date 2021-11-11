import { IsString } from 'class-validator';
import { IBookPayload } from '@/typings';

export class BookPayloadDto implements IBookPayload {
  @IsString()
  bookID: string;

  @IsString()
  provider: string;
}
