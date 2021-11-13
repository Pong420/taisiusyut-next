import { IsNumber, IsString } from 'class-validator';
import { IGetChapterContent } from '@/typings';
import { Transform } from 'class-transformer';

export class GetChapterContentDto implements IGetChapterContent {
  @IsString()
  provider: string;

  @IsString()
  bookName: string;

  @IsNumber()
  @Transform(({ value }) => value && Number(value))
  chapterNo: number;
}
