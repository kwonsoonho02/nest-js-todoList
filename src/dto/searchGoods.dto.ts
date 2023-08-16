import { IsString, IsOptional } from 'class-validator';
import { PageRequest } from './pageRequest';
import { ApiProperty } from '@nestjs/swagger';

export class SearchGoodsDto extends PageRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: Number, description: 'ID' })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'Title' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'Content' })
  content?: string;
}
