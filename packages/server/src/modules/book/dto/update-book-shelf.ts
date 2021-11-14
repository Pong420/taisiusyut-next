import { IsNumber } from 'class-validator';
import { IUpdateBookShelf } from '@/typings';
import { Transform } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class UpdateBookShelfDto implements IUpdateBookShelf {
  @IsNumber()
  @Optional()
  @Transform(({ value }) => value && Number(value))
  lastVistChapter?: number;
}
