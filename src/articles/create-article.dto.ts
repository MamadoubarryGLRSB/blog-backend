import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The main content of the article' })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Whether the article is published',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    description: 'Array of tag IDs',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tagIds?: string[];
}
