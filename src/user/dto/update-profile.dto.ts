import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  avatar?: string;
}
