import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateArticleDto } from '../create-article.dto';
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

export class SearchArticleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional() //facultatif
  search?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
