import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  @ApiProperty({ type: String, description: 'Title' })
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @ApiProperty({ type: String, description: 'Content' })
  public content: string;
}

export class UpdateTodoDTO extends CreateTodoDTO {}
