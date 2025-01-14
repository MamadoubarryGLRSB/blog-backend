import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ description: 'The unique identifier of the tag' })
  id: string;

  @ApiProperty({ description: 'The name of the tag' })
  name: string;

  @ApiProperty({ description: 'Number of articles using this tag' })
  _count?: {
    articles: number;
  };
}

// Si vous avez besoin de créer des tags
export class CreateTagDto {
  @ApiProperty({ description: 'The name of the tag' })
  name: string;
}
