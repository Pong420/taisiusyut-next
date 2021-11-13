import { IsString } from 'class-validator';
import { IGetChapters } from '@/typings';

export class GetChaptersDto implements IGetChapters {
  @IsString()
  provider: string;

  @IsString()
  bookName: string;
}
